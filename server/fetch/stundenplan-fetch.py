import requests
from bs4 import BeautifulSoup
import re

def dl_aktuell():
    url = "https://stundenplan.fh-wedel.de/?sicht=Benutzerdefiniert&einrichtung=Fachhochschule"
    session = requests.Session() #wegen cookies
    response = session.get(url, timeout=10)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')
    form = soup.find('form')
    checkboxes_to_select = []
    all_checkboxes = form.find_all('input', {'type': 'checkbox'})
    for cb in all_checkboxes:
        name = cb.get('name', '')
        value = cb.get('value', '')
        label_text = ''
        cb_id = cb.get('id', '')
        if cb_id:
            label = soup.find('label', {'for': cb_id})
            if label:
                label_text = label.get_text(strip=True)
        if not label_text:
            parent_label = cb.find_parent('label')
            if parent_label:
                label_text = parent_label.get_text(strip=True)
        if 'plan_veranstaltung' in name.lower():
            checkboxes_to_select.append((name, value))
    form_data = {}
    for input_elem in form.find_all(['input', 'select', 'textarea']):
        input_type = input_elem.get('type', '').lower()
        name = input_elem.get('name', '')
        if not name:
            continue
        if input_type == 'checkbox':
            continue
        elif input_type == 'radio':
            if input_elem.has_attr('checked'):
                form_data[name] = input_elem.get('value', '')
        elif input_elem.name == 'select':
            selected = input_elem.find('option', selected=True)
            if selected:
                form_data[name] = selected.get('value', '')
            elif input_elem.find_all('option'):
                first_option = input_elem.find('option')
                form_data[name] = first_option.get('value', '')
        elif input_type == 'hidden':
            form_data[name] = input_elem.get('value', '')
        elif input_type not in ['submit', 'button', 'reset']:
            form_data[name] = input_elem.get('value', '')
    for name, value in checkboxes_to_select:
        if name in form_data:
            if not isinstance(form_data[name], list):
                form_data[name] = [form_data[name]]
            form_data[name].append(value)
        else:
            form_data[name] = value
    form_action = form.get('action', '')
    form_method = form.get('method', 'get').lower()
    if form_action:
        submit_url = requests.compat.urljoin(url, form_action)
    else:
        submit_url = url
    if form_method == 'post':
        result = session.post(submit_url, data=form_data, timeout=10)
    else:
        result = session.get(submit_url, params=form_data, timeout=10)

    return result.text

def parse_time_slot(time_text):
    match = re.search(r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})', time_text)
    if match:
        return match.group(1), match.group(2)
    return None, None

def parse_schedule_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table', class_='stundenplan-tabelle')
    thead = table.find('thead')
    day_headers = []
    if thead:
        header_row = thead.find('tr')
        for th in header_row.find_all('th'):
            day_text = th.get_text(strip=True)
            colspan = int(th.get('colspan', 1))
            if day_text and day_text != 'Zeit':
                for _ in range(colspan):
                    day_headers.append(day_text)
    courses = []
    tbody = table.find('tbody') 
    for row in tbody.find_all('tr'):
        time_cell = row.find('td', class_='zeit-spalten')
        if not time_cell:
            continue
        time_text = time_cell.get_text(strip=True)
        start_time, end_time = parse_time_slot(time_text)
        cells = row.find_all('td')
        col_index = 0       
        for cell in cells[1:]:
            if 'veranstaltung-zelle' not in cell.get('class', []):
                col_index += 1
                continue
            if col_index < len(day_headers):
                day = day_headers[col_index]
            else:
                day = "Unknown"
            course_name_div = cell.find('div', class_='veranstaltungs-bezeichnung')
            if not course_name_div:
                col_index += 1
                continue
            course_name = course_name_div.find('strong')
            if course_name:
                course_name = course_name.get_text(strip=True)
            else:
                course_name = course_name_div.get_text(strip=True)
            instructors = []
            instructor_div = cell.find('div', class_='dozenten-links')
            if instructor_div:
                for instructor_link in instructor_div.find_all('a'):
                    instructors.append(instructor_link.get_text(strip=True))
            instructor_str = ', '.join(instructors) if instructors else ''
            course = {
                'name': course_name,
                'day': day,
                'start_time': start_time,
                'end_time': end_time,
                'instructor': instructor_str
            }
            courses.append(course)
            colspan = int(cell.get('colspan', 1))
            col_index += colspan
    return courses


def schedule_to_db(courses):
    done = False
    return done

def course_to_string(course):
    return (
        f"Course: {course['name']}\n"
        f"Day: {course['day']}\n"
        f"Time: {course['start_time']} - {course['end_time']}\n"
        f"Instructor: {course['instructor']}"
    )

def create_schedule():
    stundenplan = dl_aktuell()
    courses = parse_schedule_html(stundenplan)
    result = schedule_to_db(courses)
    for kurs in courses:
        print(course_to_string(kurs) + "\n")
    return result

if __name__ == "__main__":
    create_schedule()
