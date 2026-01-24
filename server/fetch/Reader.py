
from collections import namedtuple
import math
import re
import requests
import pdfplumber
import pandas as pd
from io import BytesIO

Module = namedtuple('Module', ['id', 'bez', 'teil', 'vt'])
Course = namedtuple('Course', ['id', 'bez', 'recommended_semeseter', 'ects', 'which_semester', 'art', 'doz', 'lang'])
class ModulReader:
    def __init__(self, df, i):
        self.df = df
        self.cursor = i
    
    def readCourses(self) -> list: 
        a = self.next()  
        list = []
        reading = True
        while reading:
            res: Course 
            j = 0
            # Skip Indent
            while j < len(self.df.columns) and (a.iloc[j] == '' or isinstance(a.iloc[j], float)):
                j += 1
            # ID
            id = a.iloc[j]
            j += 1
            # BEZ
            bez = a.iloc[j]
            j += 1
            semester = j
            while semester < len(self.df.columns) and a.iloc[semester] == '': 
                semester += 1   
            recommended_semeseter = semester-j + 1
            ects = a.iloc[semester]  
            j += 7
            which_semester = a.iloc[j]
            j += 1
            art = a.iloc[j]
            j += 3
            doz = a.iloc[j]
            j += 1
            lang = a.iloc[j]

            list.append(Course(id, bez, recommended_semeseter, ects, which_semester, art, doz, lang))
            if self.eof():
                return list 
            a = self.next()  

            value = a['Spalte_1']
            if value == '' or (isinstance(value, float) and math.isnan(value)):    
                pass
            else:
                reading = False
                self.prev_line()

        return list

    def readModule(self) -> Module: 
        module = self.next()
        teil = self.readCourses()
        
        return Module(id=module['id'],bez=module['bez'], teil=teil, vt=module['Spalte_23'])
    
    def eof(self):
        if self.cursor < len(self.df): 
            return False
        else: 
            return True

    def next(self):
        self.next_line()
        return self.df.iloc[self.cursor-1]

    def next_line(self):
        self.cursor += 1

    def prev_line(self):
        self.cursor -= 1


class CurriculaReader:

    def __init__(self, url):
        response = requests.get(url)
        response.raise_for_status()  
        self.module = []

        dfs = []

        with pdfplumber.open(BytesIO(response.content)) as pdf:
            for page_num, page in enumerate(pdf.pages):
                table = page.extract_table()
                if table is None:
                    continue

                df_page = pd.DataFrame(table[1:], columns=table[0])

                # Erste Seite: Metadaten extrahieren
                if page_num == 0:
                    pattern = r"(B_[A-Za-z0-9.]+) Studienverlaufs- und Prüfungsplan ([ A-Za-zäÄöÖüÜß&\-]+)\s*(\([^)]+\))"
                    match = re.search(pattern, df_page.columns[0])
                    if match:
                        self.code = match.group(1)
                        self.studiengang = match.group(2)
                        self.abschluss = match.group(3)
                    df_page = df_page.iloc[3:].copy()  # Erste 3 Zeilen überspringen
                else:
                    df_page = df_page.iloc[2:].copy()  # Andere Seiten: 2 Zeilen überspringen

                # **Spalten sofort vereinheitlichen**
                df_page.columns = [f"Spalte_{i+1}" for i in range(len(df_page.columns))]
                

                dfs.append(df_page)

        # Alle Seiten zusammenfügen
        df = pd.concat(dfs, ignore_index=True)
        
        # Neue Spalten IDs und Bezeichnungen
        df['id'] = df['Spalte_1'].str[:5]
        df['bez'] = df['Spalte_1'].str[5:]
        # Vorraussetzungen formatieren
        df['Spalte_18'] = df['Spalte_18'].apply(lambda x: "_".join(str(x).split("\n")))
        # Spalten löschen
        df.drop(df.columns[11:15], axis=1, inplace=True) 
        df.drop(df.columns[15:18], axis=1, inplace=True) 
        df.drop(df.columns[11:14], axis=1, inplace=True) 
 
        reader = ModulReader(df, 0)
        while not reader.eof():
            self.module.append(reader.readModule())



