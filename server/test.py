# import json
# from sqlite3 import Time
# import time
# import pymongo
# from fetch.stundenplan_fetch import create_schedule
# from db.managers import CourseManager, CurriculaManager, EventManager, ModuleManager
# from db.collections.events import Event
# from db.collections.course import Course
# from db.collections.module import Module
# from db.collections.curricula import Curricula
# from db.collections.timetable import Timetable

# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# eventManager = EventManager(myclient["db"])
# courseManager = CourseManager(myclient["db"])
# curriculaManager = CurriculaManager(myclient["db"])
# moduleManager = ModuleManager(myclient["db"])

# # create_schedule()

# curricula: Curricula | None = curriculaManager.get_by_name_version("Informatik", "B_Inf25.0")

# if not curricula:
#     print("Curricula not found")
#     exit(1)

# found: list[Event] = []
# not_found: list[str] = []

# for module_id in curricula.modules_ids:
#     module: Module | None = moduleManager.get_by_module_id(module_id)
#     if not module:
#         print(f"Module with ID '{module_id}' not found")
#         continue
#     for course_id in module.course_ids:
#         course: Course | None = courseManager.get_by_course_id(course_id)
#         if not course:
#             print(f"Course with ID '{course_id}' not found")
#             continue
#         print(f"Course ID: {course_id}, Name: {course.course_name}")
#         event = eventManager.get_by_event_id(course_id)
#         if event:
#             found.append(event)
#             print(f"  Event found for Course ID '{course_id}': {event.name}")
#         else:
#             not_found.append(course.course_name)
#             print(f"  No event found for Course ID '{course_id}'")


# possible_events: list[Timetable] = Timetable.get_max_conflict_free_timetables(found)

# for timetable in possible_events:
#     print(timetable.print_timetable())


# # for course_name in not_found:
# #     print(f"No event found for course: {course_name}")


from fetch.fetch import get_curriculae

get_curriculae()