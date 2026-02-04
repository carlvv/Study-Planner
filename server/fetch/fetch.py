
import re

from bs4 import BeautifulSoup
from typing import Dict

import pymongo
import requests

from db.collections.curricula import Curricula
from db.managers import CourseManager, CurriculaManager, ModuleManager
from fetch.Reader import CurriculaReader
from fetch.Reader import CurriculaReader



def normalize_program_name(name: str) -> str:
    """
    Normalizes a program name by cleaning up formatting issues.
    
    Args:
        name: The raw program name
        
    Returns:
        Normalized program name
    """
    # Remove soft hyphens and line breaks
    name = name.replace('­', '').replace('\u00ad', '').replace('\n', ' ')
    
    # Normalize whitespace
    name = re.sub(r'\s+', ' ', name)
    
    # Handle HTML entities
    name = name.replace('&amp;', '&')
    
    # Fix spacing around ampersands
    name = re.sub(r'\s*&\s*', ' & ', name)
    
    # Remove hyphens at word boundaries followed by whitespace (line break artifacts)
    name = re.sub(r'-\s+', '', name)
    
    # Remove hyphens in compound words (lowercase letter + hyphen + lowercase letter)
    name = re.sub(r'([a-zäöüß])-([a-zäöüß])', r'\1\2', name)
    
    return name.strip()


def extract_curricula_from_html(html_content: str) -> Dict:
    """
    Extracts bachelor curricula from FH Wedel website HTML.
    Only extracts from the "Vorherige Bachelor-Curricula" (historical) section.
    
    Args:
        html_content: The HTML content as a string
        
    Returns:
        A dictionary with bachelor programs and their available curricula versions
    """
    
    # Now parse the actual HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    result = {"bachelor": {}}

    bachelor_div = soup.find('div', {'id': 'c12343'})
    if not bachelor_div:
        print("ERROR: No historical bachelor curricula section found.")
    table = bachelor_div.find('table', class_='contenttable') if bachelor_div else None
    if table:
        # Extract curricula data from the table
        extract_curricula_from_table(table, result["bachelor"])
    else:
        print("ERROR: No bachelor curricula table found in the historical section.")

    bachelor_current_div = soup.find('div', {'id': 'c12328'})
    table_current = bachelor_current_div.find('table', class_='contenttable') if bachelor_current_div else None
    if table_current:
        rows = table_current.find_all('tr')[1:]  # Skip header row
        for row in rows:
            cells = row.find_all('td')
            if not cells:
                continue
            current_program_name = normalize_program_name(cells[0].get_text(strip=True))
            if current_program_name not in result["bachelor"]:
                result["bachelor"][current_program_name] = {"available": []}
            curriculum_link = cells[5].find('a', class_='download').get('href') if cells[5].find('a', class_='download') else None
            if curriculum_link:
                result["bachelor"][current_program_name]["available"].insert(0, {"current": curriculum_link})
    



    
    return result


def extract_curricula_from_table(table, result_dict: Dict):
    """
    Extracts curricula information from a bachelor table.
    Only extracts files from the "Studienverlaufsplan" column.
    
    Args:
        table: BeautifulSoup table element
        result_dict: Dictionary to store the results
    """
    rows = table.find_all('tr')
    current_program_name = None
    curriculum_cell_index = 0
    
    for row in rows:
        cells = row.find_all('td')
        if not cells:
            continue
        
        # Check if the first cell has a rowspan attribute (historical table format)
        first_cell = cells[0]
        has_rowspan = first_cell.get('rowspan')
        
        if has_rowspan:
            # Historical table format: program name with rowspan
            program_name = first_cell.get_text(strip=True)
            current_program_name = normalize_program_name(program_name)
            
            # In rows with rowspan, the curriculum link is in the 4th cell (index 3)
            # Row structure: [Program Name (rowspan), Date, Modulübersicht, Curriculum, SPO, Modulhandbuch]
            curriculum_cell_index = 3
        elif current_program_name:
            # Continuation row in historical table (no program name in first cell)
            # Row structure: [Date, Modulübersicht, Curriculum, SPO, Modulhandbuch]
            curriculum_cell_index = 4
        
        # Skip if no current program
        if not current_program_name or current_program_name in ['Studiengang', '']:
            continue
        
        curriculums = [] 

        if len(cells) > curriculum_cell_index:
            curriculum_cell = cells[curriculum_cell_index]
            names = curriculum_cell.find_all('a', class_='download')
            for name in names:
                curriculums.append(name)
            

        for curriculum in curriculums:
            if curriculum is None:
                continue
            text = curriculum.get_text(strip=True)
            m = re.search(r'\d', text)
            name = text[m.start():].strip() if m else text

            link = curriculum.get('href')
            if link and 'Curriculum_B_' in link:
                if current_program_name not in result_dict:
                     result_dict[current_program_name] = {"available": []}
                result_dict[current_program_name]["available"].append({name: link})



def extract_curricula_from_file(filepath: str) -> Dict:
    """
    Reads an HTML file and extracts curricula information.
    
    Args:
        filepath: Path to the HTML file
        
    Returns:
        A dictionary with bachelor programs and their available curricula versions
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        html_content = f.read()
    return extract_curricula_from_html(html_content)


def get_curriculae(url: str = "https://www.fh-wedel.de/studieren/pruefungscenter/pruefungsordnungen/") -> Dict:
    """
    Fetches and extracts bachelor curricula from a predefined HTML source.
    
    Returns:
        A dictionary with bachelor programs and their available curricula versions
    """

    response = requests.get(url)
    response.raise_for_status()
    return extract_curricula_from_html(response.text)

def fetch_and_save(mongoClient: pymongo.MongoClient | None = None) -> None:
    """
    Fetches curricula data and saves it to MongoDB.
    
    Args:
        mongoClient: An optional pymongo.MongoClient instance. If None, a new client will be created.
    """
    if mongoClient is None:
        mongoClient = pymongo.MongoClient("mongodb://localhost:27017/")
    
    db = mongoClient["db"]
    
    curricula_data = get_curriculae()
    
    curricula_manager =  CurriculaManager(db)
    module_manager =  ModuleManager(db)
    course_manager =  CourseManager(db)

    for _, info in curricula_data.get("bachelor", {}).items():
        for entry in info.get("available", []):
            for _, url in entry.items():
                cur = CurriculaReader("https://fh-wedel.de"+ url)
                print(f"\nProcessing: {cur.studiengang} ({cur.code})")
                print(f"Found {len(cur.modules)} modules and {len(cur.courses)} courses")
                
                # Create all courses first
                for course in cur.courses:
                    course_db_id = course_manager.create_or_get_course(course)
                    print(f"  Course '{course.course_id}' ({course.course_name}) -> db_id '{course_db_id}'")
                
                # Create all modules
                for module in cur.modules:
                    module_db_id = module_manager.create_or_get_module(module)
                    print(f"  Module '{module.module_id}' ({module.module_name}) -> db_id '{module_db_id}'")
                
                # Create curricula
                curricula = Curricula(
                    programm_name=cur.studiengang,
                    programm_version=cur.code,
                    is_bachelor=True,
                    modules_ids=sorted([x.module_id for x in cur.modules])
                )
                curricula_db_id = curricula_manager.create_or_get_curricula(curricula)
                print(f"  Curricula '{cur.studiengang}' -> db_id '{curricula_db_id}'")
                print(f"FINISHED: {cur.studiengang}\n")