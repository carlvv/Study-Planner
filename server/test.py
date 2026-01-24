
import json
from db.managers import CurriculaManager

import pymongo

from fetch.Reader import CurriculaReader
from fetch.fetch import get_curriculae


# user_manager =  StudentManager(myclient["db"])
# user_manager.create_user("10001", "test1234", "Max1 Mustermann", "foo", "foo")

result = get_curriculae()

print(json.dumps(result, indent=2, ensure_ascii=False))
    
# myclient = pymongo.MongoClient("mongodb://localhost:27017/")

# manager =  CurriculaManager(myclient["db"])

# # Durch alle Bachelor-Studienrichtungen iterieren
# for program, info in result.get("bachelor", {}).items():
#     for entry in info.get("available", []):
#         for key, url in entry.items():
#             print(url)
#             cur = CurriculaReader("https://fh-wedel.de"+ url)
#             manager.create_curricula(cur.studiengang, cur.code, True, sorted([x.id for x in cur.module]))    
#             print("FINISHED", cur.studiengang)
