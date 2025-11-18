import re
import json
from bs4 import BeautifulSoup
from typing import Dict


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
    soup = BeautifulSoup(BeautifulSoup(html_content, 'html.parser').get_text(), 'html.parser')
    result = {"bachelor": {}}

    bachelor_div = soup.find('div', {'id': 'c12343'})
    table = bachelor_div.find('table', class_='contenttable') if bachelor_div else None
    if table:
        # Extract curricula data from the table
        extract_curricula_from_table(table, result["bachelor"])
    
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
            curriculum_cell_index = 2
        else:
            # Current table format: each row has program name in first cell
            program_name = first_cell.get_text(strip=True)
            
            # Skip if it's a header row or empty
            if not program_name or program_name in ['Studiengang', '']:
                continue
            
            current_program_name = normalize_program_name(program_name)
            
            # The curriculum link is in the 7th cell (index 6) for current tables
            curriculum_cell_index = 6
        
        # Skip if no current program
        if not current_program_name or current_program_name in ['Studiengang', '']:
            continue
        
        # Find curriculum files from Studienverlaufsplan column
        # Note: Some cells have multiple curriculum links (e.g., E-Commerce with (W) and (I) variants)
        curriculum_links = []
        if len(cells) > curriculum_cell_index:
            curriculum_cell = cells[curriculum_cell_index]
            links = curriculum_cell.find_all('a', class_='download')
            for link in links:
                if link.get('href'):
                    curriculum_links.append(link.get('href'))
        
        # Extract versions from all curriculum links
        for curriculum_link in curriculum_links:
            if 'Curriculum_B_' not in curriculum_link:
                continue
                
            # Extract version from filename pattern:
            # - Curriculum_B_XXX25.1.pdf
            # - Curriculum_B_EComW25.1.pdf (with variant like W or I between lowercase letter and digit)
            # - Curriculum_B_WInf23.0a.pdf (with suffix)
            # Pattern 1: lowercase letter + W/I + digit (captures variant)
            # Pattern 2: any word chars + digit (no variant)
            version_match = re.search(r'Curriculum_B_\w*[a-z]([WI])(\d+)\.(\d+)([a-z]?)\.pdf|Curriculum_B_\w+?(\d+)\.(\d+)([a-z]?)\.pdf', curriculum_link)
            if version_match:
                # Check which pattern matched
                if version_match.group(1):  # First pattern with W/I variant
                    variant = version_match.group(1)  # 'W' or 'I'
                    major = version_match.group(2)
                    minor = version_match.group(3)
                    suffix = version_match.group(4)  # e.g., 'a' in 23.0a
                else:  # Second pattern without variant
                    variant = None
                    major = version_match.group(5)
                    minor = version_match.group(6)
                    suffix = version_match.group(7)  # e.g., 'a' in 23.0a
                
                # Build version label
                version_label = f"{major}.{minor}"
                if suffix:
                    version_label += suffix
                if variant:
                    version_label += f" ({variant})"
                
                # Initialize program in result if not exists
                if current_program_name not in result_dict:
                    result_dict[current_program_name] = {"available": []}
                
                # Add version if not already present
                if version_label not in result_dict[current_program_name]["available"]:
                    result_dict[current_program_name]["available"].append(version_label)


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


def main():
    """
    Example usage - extracts bachelor curricula from website.html and prints as JSON.
    """
    result = extract_curricula_from_file('website.html')
    
    # Process versions for each program
    for program in result["bachelor"]:
        versions = result["bachelor"][program]["available"]
        
        # Parse versions into tuples for comparison
        parsed_versions = []
        for v in versions:
            # Handle versions with suffix like "23.0a"
            match = re.match(r'(\d+)\.(\d+)([a-z]?)', v)
            if match:
                major = int(match.group(1))
                minor = int(match.group(2))
                suffix = match.group(3) or ''
                parsed_versions.append((major, minor, suffix, v))
        
        # Sort by version number descending (major, minor, then by suffix alphabetically)
        parsed_versions.sort(key=lambda x: (x[0], x[1], x[2]), reverse=True)
        
        # Mark the latest version as "current"
        if parsed_versions:
            sorted_versions = ["current"]
            
            # Add all versions (including the latest with its version number)
            for major, minor, suffix, version_str in parsed_versions:
                sorted_versions.append(version_str)
            
            result["bachelor"][program]["available"] = sorted_versions
    
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
