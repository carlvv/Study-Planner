


import json

import pymongo
from fetch import fetch
from fetch.fetch import get_curriculae
from fetch.stundenplan_fetch import create_schedule


from db.collections.curricula import Curricula
from db.managers import CourseManager, CurriculaManager, EventManager, ModuleManager
from fetch.Reader import CurriculaReader


myclient = pymongo.MongoClient("mongodb://localhost:27017/")

result = get_curriculae()

print(json.dumps(result, indent=2, ensure_ascii=False))
fetch.fetch_and_save(myclient, delete_existing=True)

curricula_manager =  CurriculaManager(myclient["db"])
event_manager =  EventManager(myclient["db"])

all_programms = curricula_manager.get_all_programms()
all_programms.sort(key=lambda x: (x.programm_name, x.programm_version))
print("# of programms:", len(all_programms))
for prog in all_programms:
    print(prog.programm_name, prog.programm_version)

create_schedule()
