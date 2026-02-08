import requests as re
import xml.etree.ElementTree as et
import pymongo as mongo

from db.collections.events import *
from db.managers import EventManager


def dl_api():
    url = "https://intern.fh-wedel.de/~tho/api/splan.php"
    session = re.Session()
    response = session.get(url)
    return response.text


def parse_schedule(stundenplan):
    tage: list[Day] = []
    zeiten: list[Timeslot] = []
    raume: list[Room] = []
    mitarbeiter: list[Lecturer] = []
    fachrichtungen: list[Specialisation] = []
    veranstaltungen: list[Event] = []

    tree = et.parse(stundenplan)
    root = tree.getroot()

    for splanRootNode in root:
        if (splanRootNode.tag == "erstellung"):
            continue

        if (splanRootNode.tag == "tage"):  # bisschen unnötig weil woche bleibt konstant
            for tagXML in splanRootNode:
                tage.append(Day(
                    day_id=int(tagXML[0].text),
                    desc=tagXML[1][1].text
                ))

        if (splanRootNode.tag == "zeiten"):
            for zeitXML in splanRootNode:
                zeiten.append(Timeslot(
                    timeslot_id=int(zeitXML[0].text),
                    desc=zeitXML[1].text
                ))

        if (splanRootNode.tag == "raeume"):
            for raumXML in splanRootNode:
                raume.append(Room(
                    room_id=int(raumXML[0].text),
                    desc_kurz=raumXML[1][0].text,
                    desc_lang=raumXML[1][1].text
                ))

        if (splanRootNode.tag == "mitarbeiter"):
            for mitarbeiterXML in splanRootNode:
                mitarbeiter.append(Lecturer(
                    lecturer_id=int(mitarbeiterXML[0].text),
                    type=mitarbeiterXML[1].text,
                    short=mitarbeiterXML[2][1][0].text,
                    name=mitarbeiterXML[2][1][1].text + " " + mitarbeiterXML[2][1][2].text
                ))

        if (splanRootNode.tag == "fachrichtungen"):
            # skip maxsem
            for fachrichtungXML in splanRootNode[1]:  # FH
                fachrichtungen.append(Specialisation(
                    specialisation_id=int(fachrichtungXML[0].text),
                    is_FH=True,
                    is_Master=fachrichtungXML[1][0].text[0] == 'B',
                    desc_short=fachrichtungXML[1][0].text,
                    desc_long=fachrichtungXML[1][1].text,
                ))

            for fachrichtungXML in splanRootNode[2]:  # PTL
                fachrichtungen.append(Specialisation(
                    specialisation_id=int(fachrichtungXML[0].text),
                    is_FH=True,
                    is_Master=False,
                    desc_short=fachrichtungXML[1][0].text,
                    desc_long=fachrichtungXML[1][1].text,
                ))

        if (splanRootNode.tag == "veranstaltungen"):
            for veranstaltung in splanRootNode:
                veransttage: list[DayEvent] = []
                zuhoerer: list[Listener] = []
                stunden =  int(veranstaltung[6].text)

                nameAAAAAAAA = veranstaltung[2].text

                for termin in veranstaltung[10]:
                    veranstaltungs_raume: list[Room] = []
                    for r in raume:
                        for vertR in termin[2]:
                            if (r.room_id == int(vertR.text)):
                                veranstaltungs_raume.append(r)
                    veransttage.append(DayEvent(
                        day=tage[int(termin[0].text) - 1],
                        start_time=zeiten[int(termin[1].text) - 1],
                        end_time=zeiten[int(termin[1].text) - 2 + stunden],  # -2 wegen 0 offset
                        rooms=veranstaltungs_raume
                    ))

                for teilnehmer in veranstaltung[12]:
                    if (veranstaltung[12].tag == "fachrichtungen"):
                        recommSem: list[int] = []
                        for r in teilnehmer[0]:
                            if (r.tag == "id"):
                                continue
                            recommSem.append(int(r.text))
                        zuhoerer.append(Listener(
                            specialisation_id=int(teilnehmer[0][0].text),
                            recommSemester=recommSem
                        ))

                veranstaltungen.append(Event(
                    event_id=int(veranstaltung[0].text),
                    name=veranstaltung[2].text,
                    name_add=veranstaltung[3].text,
                    course_id=veranstaltung[4].text,
                    optional=bool(veranstaltung[9].text),
                    days=veransttage,
                    listeners=zuhoerer,
                ))
    return veranstaltungen


def schedule_to_db(events):
    return 0


def create_schedule():
    # schedule = dl_api()
    # events = parse_schedule(schedule)
    events = parse_schedule("splan.xml")
    print(events)
    amount = schedule_to_db(events)
    print(amount)


if __name__ == "__main__":
    create_schedule()
