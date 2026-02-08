import re
import pymongo
import requests
from bs4 import BeautifulSoup

from db.collections.events import Event
from db.managers import EventManager


def dl_aktuell():
    url = "https://stundenplan.fh-wedel.de/?sicht=Benutzerdefiniert&einrichtung=Fachhochschule"
    session = requests.Session()
    response = session.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    form = soup.find('form')
    form_action = form.get('action', '')
    form_method = form.get('method', 'get').lower()
    submit_url = requests.compat.urljoin(url, form_action) if form_action else url
    checkboxes = form.find_all('input', {'name': 'plan_veranstaltung', 'type': 'checkbox'})
    form_data = {}
    for checkbox in checkboxes:
        if 'plan_veranstaltung' in form_data:
            form_data['plan_veranstaltung'].append(checkbox['value'])
        else:
            form_data['plan_veranstaltung'] = [checkbox['value']]
    submit_button = form.find('input', {'type': 'submit', 'value': 'Plan Erstellen'})
    if submit_button:
        button_name = submit_button.get('name', 'submit')
        form_data[button_name] = submit_button['value']
    for hidden_input in form.find_all('input', {'type': 'hidden'}):
        form_data[hidden_input.get('name')] = hidden_input.get('value')
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
    events = []
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
            events.append(course)
            colspan = int(cell.get('colspan', 1))
            col_index += colspan
    return events

def schedule_to_db(events):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    events_manager = EventManager(myclient["db"])
    for event in events:
        events_manager.create_event(
            Event(
                course_id = event["name"],
                name = "", #TODO
                day = event["day"],
                start_time = event["start_time"],
                end_time = event["end_time"],
                weekly_event = False, #TODO
                room = "", #TODO
                semester = "" #TODO
            )
        )


def create_schedule():
    stundenplan = dl_aktuell()
    events = parse_schedule_html(stundenplan)
    schedule_to_db(events)
    print(len(events))


if __name__ == "__main__":
    create_schedule()
