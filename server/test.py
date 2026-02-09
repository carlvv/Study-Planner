
# from calendar import c
# import json
# from db.managers import CourseManager, CurriculaManager, ModuleManager

# from ast import mod
# import pymongo

# from fetch.Reader import CurriculaReader
# from fetch.fetch import fetch_and_save, get_curriculae
# from db.collections.curricula import Curricula
# from fetch import fetch


# # user_manager =  StudentManager(myclient["db"])
# # user_manager.create_user("10001", "test1234", "Max1 Mustermann", "foo", "foo")

# '''

# import json

# import pymongo
# from db.collections.curricula import Curricula
# from db.managers import CourseManager, CurriculaManager, ModuleManager
# from fetch.Reader import CurriculaReader
# from fetch.fetch import get_curriculae


# result = get_curriculae()

# print(json.dumps(result, indent=2, ensure_ascii=False))
    
# myclient = pymongo.MongoClient("mongodb://localhost:27017/")

# curricula_manager =  CurriculaManager(myclient["db"])
# module_manager =  ModuleManager(myclient["db"])
# course_manager =  CourseManager(myclient["db"])

# # Durch alle Bachelor-Studienrichtungen iterieren
# for _, info in result.get("bachelor", {}).items():
#     for entry in info.get("available", []):
#         for _, url in entry.items():
#             cur = CurriculaReader("https://fh-wedel.de"+ url)
#             print(f"\nProcessing: {cur.studiengang} ({cur.code})")
#             print(f"Found {len(cur.modules)} modules and {len(cur.courses)} courses")
            
#             # Create all courses first
#             for course in cur.courses:
#                 course_db_id = course_manager.create_or_get_course(course)
#                 print(f"  Course '{course.course_id}' ({course.course_name}) -> db_id '{course_db_id}'")
            
#             # Create all modules
#             for module in cur.modules:
#                 module_db_id = module_manager.create_or_get_module(module)
#                 print(f"  Module '{module.module_id}' ({module.module_name}) -> db_id '{module_db_id}'")
            
#             # Create curricula
#             curricula = Curricula(
#                 programm_name=cur.studiengang,
#                 programm_version=cur.code,
#                 is_bachelor=True,
#                 modules_ids=sorted([x.module_id for x in cur.modules])
#             )
#             curricula_db_id = curricula_manager.create_or_get_curricula(curricula)
#             print(f"  Curricula '{cur.studiengang}' -> db_id '{curricula_db_id}'")
#             print(f"FINISHED: {cur.studiengang}\n")

# '''
# # Start mongo:
# # mongod --fork --logpath /var/log/mongodb/mongod.log --bind_ip 127.0.0.1

# myclient = pymongo.MongoClient("mongodb://localhost:27017/")

# fetch.fetch_and_save(myclient, delete_existing=True)
# curricula_manager =  CurriculaManager(myclient["db"])

# all_programms = curricula_manager.get_all_programms()
# all_programms.sort(key=lambda x: (x.programm_name, x.programm_version))
# print("# of programms:", len(all_programms))
# for prog in all_programms:
#     print(prog.programm_name, prog.programm_version)


# '''
# from db.managers import CurriculaManager, ModuleManager, CourseManager
# from db.collections.curricula import Curricula
# from db.collections.module import Module
# from db.collections.course import Course

# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# curricula_manager =  CurriculaManager(myclient["db"])
# module_manager = ModuleManager(myclient["db"])
# course_manager = CourseManager(myclient["db"])

# modules: list[Module] = []
# courses: list[Course] = []

# course1: Course = Course(
#     course_id = "TEST101",
#     course_name = "Test Course",
#     module_number = "01",
#     ects = 5,
#     course_type = "Lecture",
#     lecturer = "Dr. Test",
#     prerequisite_ids = []
# )

# course2: Course = Course(
#     course_id = "TEST102",
#     course_name = "Test Course 2",
#     module_number = "02",
#     ects = 5,
#     course_type = "Lecture",
#     lecturer = "Dr. Test",
#     prerequisite_ids = []
# )

# course1_id = course_manager.create_or_get_course(course1)
# course2_id = course_manager.create_or_get_course(course2)

# courses.append(course1)
# courses.append(course2)

# module: Module = Module(
#     module_id = "MOD101",
#     module_name = "Test Module",
#     course_ids = [course.course_id for course in courses]
# )

# module_id = module_manager.create_or_get_module(module)

# modules.append(module)

# curricula: Curricula = Curricula(
#     programm_name="Test Programm",
#     programm_version="1.0",
#     is_bachelor=True,
#     modules_ids=[module.module_id for module in modules]
# )

# curricula_id = curricula_manager.create_or_get_curricula(curricula)

# print("Created Course IDs:", course1_id, course2_id)
# print("Created Module ID:", module_id)
# print("Created Curricula ID:", curricula_id)


# curricula_fetched = curricula_manager.get_by_name_version("Test Programm", "1.0")
# print("Fetched Curricula:", curricula_fetched)

# module_fetched = module_manager.get_by_module_id("MOD101")
# print("Fetched Module:", module_fetched)

# course_fetched = course_manager.get_by_course_id("TEST101")
# print("Fetched Course:", course_fetched)
# '''

from fetch.stundenplan_fetch import create_schedule


create_schedule()