
import math
import re
import requests
import pdfplumber
import pandas as pd
from io import BytesIO
from db.collections.course import Course
from db.collections.module import Module
class ModulReader:
    def __init__(self, df, i):
        self.df = df
        self.cursor = i
    
    def readCourses(self, module_id: str) -> list: 
        if self.eof():
            return []
        a = self.next()  
        courses = []
        reading = True
        prev_id = None
        same_course = False
        while reading:
            j = 0
            # Skip Indent
            while j < len(self.df.columns) and (pd.isna(a.iloc[j]) or a.iloc[j] == ''):
                j += 1
            
            if j < len(self.df.columns):
                sub_id = str(a.iloc[j])[:2]
                if courses and (sub_id != "TB" and sub_id != "TM"):
                    course_id = prev_id
                    same_course = True
                else:
                    # ID
                    course_id = a.iloc[j]
                    prev_id = course_id
                    j += 1
                
                # BEZ
                course_name = str(a.iloc[j]) if pd.notna(a.iloc[j]) else ""
                j += 1
                semester = j
                while semester < len(self.df.columns) and a.iloc[semester] == '': 
                    semester += 1   
                recommended_semeseter = semester-j + 1
                ects_raw = a.iloc[semester]
                try:
                    ects = float(str(ects_raw).replace(',', '.'))
                except ValueError:
                    ects = 0.0
                
                which_semester = a.iloc[-8]
                course_type = a.iloc[-7]
                lecturer = a.iloc[-4]
                lang = a.iloc[-3]

                if same_course:
                    course = courses[-1]
                    course.course_name += ", " + course_name
                    course.ects += ects
                    same_course = False
                else:
                    course = Course(
                        course_id=course_id[1:],
                        course_name=course_name,
                        module_number=module_id,
                        ects=ects,
                        course_type=course_type if course_type else "",
                        lecturer=lecturer if lecturer else "",
                        prerequisite_ids=[]
                    )
                    courses.append(course)
            
            if self.eof():
                return courses 
            a = self.next()  

            value = a['Spalte_1']
            if value == '' or (isinstance(value, float) and math.isnan(value)):    
                pass
            else:
                reading = False
                self.prev_line()

        return courses

    def readModule(self) -> tuple[Module, list[Course]]: 
        module_data = self.next()
        module_id = module_data['id']
        if module_data['bez'] != '':
            module_name = module_data['bez']
        else:
            module_name = module_data['Spalte_2']

        courses = self.readCourses(module_id)
        course_ids = [course.course_id for course in courses]
        
        module = Module(
            module_id=module_id,
            module_name=module_name,
            course_ids=course_ids
        )
        
        return module, courses
    
    def eof(self):
        return self.cursor >= len(self.df)

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
        self.modules = []
        self.courses = []
        self.code = ""
        self.studiengang = ""
        self.abschluss = ""

        dfs = []

        with pdfplumber.open(BytesIO(response.content)) as pdf:
            # Metadata Check (Text based)
            if len(pdf.pages) > 0:
                text = pdf.pages[0].extract_text()
                if text:
                    pattern = r"(B_[A-Za-z0-9.]+) Studienverlaufs- und Prüfungsplan ([ A-Za-zäÄöÖüÜß&\,-]+)\s*(\([^)]+\))"
                    match = re.search(pattern, text)
                    if match:
                        self.code = match.group(1)
                        self.studiengang = match.group(2).strip()
                        self.abschluss = match.group(3)

            for page_num, page in enumerate(pdf.pages):
                table = page.extract_table()
                if table is None:
                    continue

                # Use all rows, raw
                df_page = pd.DataFrame(table)
                # Standardize columns
                df_page.columns = [f"Spalte_{i+1}" for i in range(len(df_page.columns))]

                rows_to_drop = []
                for idx, row in df_page.iterrows():
                    first_col = str(row['Spalte_1']) if pd.notna(row['Spalte_1']) else ""
                    
                    # Metadata Check (Row based fallback/cleanup)
                    pattern = r"(B_[A-Za-z0-9.]+) Studienverlaufs- und Prüfungsplan ([ A-Za-zäÄöÖüÜß&\,-]+)\s*(\([^)]+\))"
                    match = re.search(pattern, first_col)
                    if match:
                        if not self.code:
                            self.code = match.group(1)
                            self.studiengang = match.group(2).strip()
                            self.abschluss = match.group(3)
                        rows_to_drop.append(idx)
                        continue

                    # Header Check
                    # Check first column or second column for header keywords
                    second_col = str(row['Spalte_2']) if len(df_page.columns) > 1 and pd.notna(row['Spalte_2']) else ""
                    
                    if "Modul" in first_col or "SWS" in first_col or "Bezeichnung" in second_col:
                         rows_to_drop.append(idx)
                         continue
                
                df_page.drop(rows_to_drop, inplace=True)
                dfs.append(df_page)

        # Alle Seiten zusammenfügen
        if not dfs:
            df = pd.DataFrame()
        else:
            df = pd.concat(dfs, ignore_index=True)
            print(f"DEBUG: DF len: {len(df)}")
            # print(df.head())
        
        # Vorraussetzungen formatieren
        if 'Spalte_18' in df.columns:
            df['Spalte_18'] = df['Spalte_18'].apply(lambda x: "_".join(str(x).split("\n")))
        # Spalten löschen
        df.drop(df.columns[11:15], axis=1, inplace=True) 
        df.drop(df.columns[15:18], axis=1, inplace=True) 
        df.drop(df.columns[11:14], axis=1, inplace=True) 

        # Neue Spalten IDs und Bezeichnungen
        split_data = df['Spalte_1'].astype(str).str.extract(r'^(\S+)\s*(.*)')
        df['id'] = split_data[0].str.strip()
        df['bez'] = split_data[1].fillna('').str.strip()

        if not self.code:
            return

        reader = ModulReader(df, 0)
        while not reader.eof():
            module, courses = reader.readModule()
            if module.module_id and str(module.module_id).strip() != "" and str(module.module_id).lower() != "nan":
                self.modules.append(module)
                self.courses.extend(courses)



