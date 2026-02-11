from genericpath import exists
from datetime import datetime, date, timedelta, time, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from numpy import identity
from pymongo import MongoClient
from db.collections.course import Course
from db.collections.curricula import Curricula
from db.collections.module import Module
from db.collections.process import StudentProcess
from db.collections.student import Student
from db.collections.learntime import Learntime

from pymongo import MongoClient
from bson import ObjectId
from typing import Optional
from db.collections.student import Student
from db.collections.events import Event
from db.collections.timetable import TimeTable
from db.collections.todo import Todo
from db.manger import BaseManager


class StudentManager(BaseManager[Student]):
    def __init__(self, db: MongoClient):
        super().__init__(db.users, Student)

    def verify_user(self, student_id: str, password: str) -> Optional[Student]:
        user = self._get_by_dict({"student_id": student_id})
        if user and user.verify_password(password):
            return user
        return None

    def user_exists(self, student_id: str) -> bool:
        return self.exists({"student_id": student_id})

    def create_user(
        self,
        student_id: str,
        password: str,
        name: str,
        study_id: str,
        start_semester: str,
    ) -> Optional[ObjectId]:

        if self.user_exists(student_id):
            return None

        user = (
            Student.Builder()
            .name(name)
            .password(password)
            .start_semester(start_semester)
            .student_id(student_id)
            .study_id(study_id)
            .build()
        )

        return self._create(user)

    def update_curricula(self, student_id, version_id):
        return self.update_one({"student_id": student_id}, {"study_id": version_id})


class StudentProcessManager(BaseManager[StudentProcess]):
    # Manager für den Fortschritt eines Students
    def __init__(self, db: MongoClient):
        super().__init__(db.process, StudentProcess)

    def get_process(self, student_id):
        return list(self._collection.find({"student_id": student_id}))

    def add_process(self, student_id, course_id, grade, module_id):
        exists = self.exists(
            {"student_id": student_id, "module_id": module_id, "course_id": course_id}
        )
        if exists:
            self.delete_process(student_id, course_id, module_id)

        return self._create(
            StudentProcess(
                student_id=student_id,
                course_id=course_id,
                grade=grade,
                module_id=module_id,
            )
        )

    def delete_process(self, student_id, course_id, module_id):
        return self._collection.find_one_and_delete(
            {"student_id": student_id, "module_id": module_id, "course_id": course_id}
        )


class CourseManager(BaseManager[Course]):
    def __init__(self, db: MongoClient):
        super().__init__(db.course, Course)

    def course_exists(self, course: Course) -> bool:
        return self.exists({"course_id": course.course_id})

    def get_by_course_id(self, course_id: str) -> Optional[Course]:
        return self._get_by_dict({"course_id": course_id})

    def create_course(self, course: Course) -> Optional[ObjectId]:
        if self.course_exists(course):
            return None
        return self._create(course)

    def create_or_get_course(self, course: Course) -> Optional[ObjectId]:
        existing = self.get_by_course_id(course.course_id)
        if existing:
            return existing.id
        return self.create_course(course)

    def get_all_courses(self) -> list[Course]:
        out: list[Course] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out

    def delete_all(self):
        self._collection.delete_many({})


class CurriculaManager(BaseManager[Curricula]):
    def __init__(self, db: MongoClient):
        super().__init__(db.curricula, Curricula)

    def curricula_exists(self, curricula: Curricula) -> bool:
        return self.exists(
            {
                "programm_name": curricula.programm_name,
                "programm_version": curricula.programm_version,
            }
        )

    def get_by_version(self, version: str) -> Optional[Curricula]:
        return self._get_by_dict({"programm_version": version})

    def get_by_name_version(self, name: str, version: str) -> Optional[Curricula]:
        return self._get_by_dict({"programm_name": name, "programm_version": version})

    def create_curricula(self, curricula: Curricula) -> Optional[ObjectId]:
        if self.curricula_exists(curricula):
            return None
        return self._create(curricula)

    def create_or_get_curricula(self, curricula: Curricula) -> Optional[ObjectId]:
        existing = self.get_by_name_version(
            curricula.programm_name, curricula.programm_version
        )
        if existing:
            return existing.id
        return self.create_curricula(curricula)

    def get_all_programms(self) -> list[Curricula]:
        out: list[Curricula] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out

    def delete_all(self):
        self._collection.delete_many({})

    def get_curricula_with_progress(
        self, student_id: str, version: str
    ) -> Optional[dict]:
        pipeline = [
            {"$match": {"programm_version": version}},
            # 1. Alle Module des Programms laden
            {
                "$lookup": {
                    "from": "module",
                    "localField": "modules_ids",
                    "foreignField": "module_id",
                    "as": "modules_data",
                }
            },
            # 2. ALLE Kurse laden, die in diesen Modulen vorkommen
            {
                "$lookup": {
                    "from": "course",
                    "localField": "modules_data.course_ids",
                    "foreignField": "course_id",
                    "as": "all_courses",
                }
            },
            # 3. Fortschritt des Studenten laden
            {
                "$lookup": {
                    "from": "process",
                    "let": {"student_id": student_id},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$student_id", "$$student_id"]}}}
                    ],
                    "as": "all_progress",
                }
            },
            # 4. Daten zusammenführen & Berechnungen (ECTS, Status)
            {
                "$addFields": {
                    "modules": {
                        "$map": {
                            "input": "$modules_data",
                            "as": "m",
                            "in": {
                                "$let": {
                                    "vars": {
                                        "module_courses": {
                                            "$map": {
                                                "input": "$$m.course_ids",
                                                "as": "c_id",
                                                "in": {
                                                    "$let": {
                                                        "vars": {
                                                            "c_info": {
                                                                "$arrayElemAt": [
                                                                    {
                                                                        "$filter": {
                                                                            "input": "$all_courses",
                                                                            "cond": {
                                                                                "$eq": [
                                                                                    "$$this.course_id",
                                                                                    "$$c_id",
                                                                                ]
                                                                            },
                                                                        }
                                                                    },
                                                                    0,
                                                                ]
                                                            },
                                                            "p_info": {
                                                                "$arrayElemAt": [
                                                                    {
                                                                        "$filter": {
                                                                            "input": "$all_progress",
                                                                            "cond": {
                                                                                "$eq": [
                                                                                    "$$this.course_id",
                                                                                    "$$c_id",
                                                                                ]
                                                                            },
                                                                        }
                                                                    },
                                                                    0,
                                                                ]
                                                            },
                                                        },
                                                        "in": {
                                                            "course_id": "$$c_id",
                                                            "course_name": "$$c_info.course_name",
                                                            "ects": {
                                                                "$ifNull": [
                                                                    "$$c_info.ects",
                                                                    0,
                                                                ]
                                                            },
                                                            "finished": {
                                                                "$cond": [
                                                                    {
                                                                        "$gt": [
                                                                            "$$p_info",
                                                                            None,
                                                                        ]
                                                                    },
                                                                    True,
                                                                    False,
                                                                ]
                                                            },
                                                            "grade": {
                                                                "$ifNull": [
                                                                    "$$p_info.grade",
                                                                    0,
                                                                ]
                                                            },
                                                        },
                                                    }
                                                },
                                            }
                                        }
                                    },
                                    "in": {
                                        "module_id": "$$m.module_id",
                                        "module_name": "$$m.module_name",
                                        "courses": "$$module_courses",
                                        "ects": {"$sum": "$$module_courses.ects"},
                                        "finished": {
                                            "$and": [
                                                {
                                                    "$gt": [
                                                        {"$size": "$$module_courses"},
                                                        0,
                                                    ]
                                                },
                                                {
                                                    "$allElementsTrue": [
                                                        "$$module_courses.finished"
                                                    ]
                                                },
                                            ]
                                        },
                                    },
                                }
                            },
                        }
                    }
                }
            },
            # 5. NEU: Sortierung des Modul-Arrays nach module_id
            {
                "$addFields": {
                    "modules": {
                        "$sortArray": {"input": "$modules", "sortBy": {"module_id": 1}}
                    }
                }
            },
            # 6. Aufräumen
            {"$project": {"modules_data": 0, "all_courses": 0, "all_progress": 0}},
        ]
        result = list(self._collection.aggregate(pipeline))
        return result[0] if result else None

class EventManager(BaseManager[Event]):
    def __init__(self, db: MongoClient):
        super().__init__(db.event, Event)

    def event_exists(self, event: Event) -> bool:
        return self.exists({"course_id": event.course_id})

    def get_by_event_id(self, course_id: str) -> Optional[Event]:
        return self._get_by_dict({"course_id": course_id})

    def create_event(self, event: Event) -> Optional[ObjectId]:
        if self.event_exists(event):
            return None
        return self._create(event)

    def create_or_get_event(self, event: Event) -> Optional[ObjectId]:
        existing = self.get_by_event_id(event.course_id)
        if existing:
            return existing.id
        return self._create(event)

    def clear_table(self):
        self._collection.drop()

    def get_all_events(self) -> list[Event]:
        out: list[Event] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out


    def get_events_curricula(self, curr: Curricula) -> List[Dict[str, Any]]:
        pipeline = [
            {
                "$lookup": {
                    "from": "course",
                    "localField": "course_id",
                    "foreignField": "course_id",
                    "as": "course",
                }
            },
            {"$unwind": "$course"},
            {"$match": {"course.module_number": {"$in": curr.modules_ids}}},
        ]

        res = list(self._collection.aggregate(pipeline))
        return res
    
    def get_open_events(self, curr: Curricula, student_id) -> List[Dict[str, Any]]:
        pipeline = [
            {
                "$lookup": {
                    "from": "course",
                    "localField": "course_id",
                    "foreignField": "course_id",
                    "as": "course",
                }
            },
            {"$unwind": "$course"},
            {
                "$match": {
                    "course.module_number": {"$in": curr.modules_ids}
                }
            },
            {
                "$lookup": {
                    "from": "process",
                    "let": {
                        "module_id": "$course.module_number",
                        "course_id": "$course_id",
                    },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$and": [
                                        {"$eq": ["$module_id", "$$module_id"]},
                                        {"$eq": ["$course_id", "$$course_id"]},
                                        {"$eq": ["$student_id", student_id]},
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "process_match",
                }
            },
            {
                "$match": {
                    "process_match": {"$eq": []}
                }
            },
            {
                "$project": {
                    "process_match": 0  # entfernt das Hilfsfeld
                }
            }
        ]

        return list(self._collection.aggregate(pipeline))





class LearnTimeManager(BaseManager[Learntime]):
    def __init__(self, db: MongoClient):
        super().__init__(db.lt, Learntime)

    def create_learn_time(self, learnTime: Learntime):
        return self._create(learnTime)

    def get_all(self, student_id):
        out: list[Learntime] = []
        for data in self._collection.find({"owner_id": student_id}):
            out.append(self._model.from_dict(data))
        return out

    from datetime import datetime, date, timedelta, time, timezone

    def get_statistics(self, student_id: str):
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())

        today_start = datetime.combine(today, time.min, tzinfo=timezone.utc)
        today_end = datetime.combine(today, time.max, tzinfo=timezone.utc)
        week_start = datetime.combine(start_of_week, time.min, tzinfo=timezone.utc)

        pipeline = [
            {"$match": {"owner_id": student_id}},
            {
                "$facet": {
                    # ---------- DAILY ----------
                    "statsData": [
                        {
                            "$match": {
                                "$expr": {
                                    "$and": [
                                        {"$gte": [{"$toDate": "$date"}, today_start]},
                                        {"$lte": [{"$toDate": "$date"}, today_end]},
                                    ]
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": None,
                                "daily": {"$sum": "$duration_in_min"},
                            }
                        },
                    ],
                    # ---------- WEEKLY ----------
                    "weeklyData": [
                        {
                            "$match": {
                                "$expr": {"$gte": [{"$toDate": "$date"}, week_start]}
                            }
                        },
                        {
                            "$group": {
                                "_id": None,
                                "weekly": {"$sum": "$duration_in_min"},
                            }
                        },
                    ],
                    # ---------- AVG ----------
                    "avgData": [
                        {
                            "$group": {
                                "_id": {
                                    "$dateTrunc": {
                                        "date": {"$toDate": "$date"},
                                        "unit": "day",
                                    }
                                },
                                "total": {"$sum": "$duration_in_min"},
                            }
                        },
                        {"$group": {"_id": None, "avg": {"$avg": "$total"}}},
                    ],
                    # ---------- TOTAL ----------
                    "totalData": [
                        {"$group": {"_id": None, "total": {"$sum": "$duration_in_min"}}}
                    ],
                    # ---------- WEEKDAY ----------
                    "weeklyDistributionData": [
                        {
                            "$group": {
                                "_id": {"$dayOfWeek": {"$toDate": "$date"}},
                                "total": {"$sum": "$duration_in_min"},
                            }
                        }
                    ],
                    # ---------- MODULES ----------
                    "modulesData": [
                        {
                            "$group": {
                                "_id": "$module_id",
                                "totalTime": {"$sum": "$duration_in_min"},
                                "sessionCount": {"$sum": 1},
                                "last_session": {"$max": {"$toDate": "$date"}},
                            }
                        },
                        {
                            "$lookup": {
                                "from": "module",
                                "localField": "_id",
                                "foreignField": "module_id",
                                "as": "module_info",
                            }
                        },
                        {
                            "$addFields": {
                                "name": {
                                    "$arrayElemAt": ["$module_info.module_name", 0]
                                }
                            }
                        },
                        {
                            "$project": {
                                "module_id": "$_id",
                                "name": 1,
                                "totalTime": 1,
                                "sessionCount": 1,
                                "last_session": {
                                    "$dateToString": {
                                        "date": "$last_session",
                                        "format": "%Y-%m-%dT%H:%M:%S",
                                    }
                                },
                                "_id": 0,
                            }
                        },
                    ],
                }
            },
            {
                "$project": {
                    "stats": {
                        "daily": {
                            "$ifNull": [{"$arrayElemAt": ["$statsData.daily", 0]}, 0]
                        },
                        "weekly": {
                            "$ifNull": [{"$arrayElemAt": ["$weeklyData.weekly", 0]}, 0]
                        },
                        "avg": {"$ifNull": [{"$arrayElemAt": ["$avgData.avg", 0]}, 0]},
                        "total": {
                            "$ifNull": [{"$arrayElemAt": ["$totalData.total", 0]}, 0]
                        },
                    },
                    "weeklyDistribution": "$weeklyDistributionData",
                    "modules": "$modulesData",
                }
            },
        ]

        result = list(self._collection.aggregate(pipeline))[0]

        # Wochentage korrekt mappen
        weekday_map = {
            1: "Sonntag",
            2: "Montag",
            3: "Dienstag",
            4: "Mittwoch",
            5: "Donnerstag",
            6: "Freitag",
            7: "Samstag",
        }

        weekly_dist = {day: 0 for day in weekday_map.values()}
        for d in result["weeklyDistribution"]:
            weekly_dist[weekday_map[d["_id"]]] = d["total"]

        return {
            "stats": result["stats"],
            "weeklyDistribution": weekly_dist,
            "modules": result["modules"],
        }


class ModuleManager(BaseManager[Module]):
    def __init__(self, db: MongoClient):
        super().__init__(db.module, Module)

    def module_exists(self, module: Module) -> bool:
        return self.exists({"module_id": module.module_id})

    def get_by_module_id(self, module_id: str) -> Optional[Module]:
        return self._get_by_dict({"module_id": module_id})

    def create_module(self, module: Module) -> Optional[ObjectId]:
        if self.module_exists(module):
            return None
        return self._create(module)

    def create_or_get_module(self, module: Module) -> Optional[ObjectId]:
        existing = self.get_by_module_id(module.module_id)
        if existing:
            return existing.id
        return self.create_module(module)

    def get_all_modules(self) -> list[Module]:
        out: list[Module] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out

    def delete_all(self):
        self._collection.delete_many({})


class TimeTableManager(BaseManager[TimeTable]):
    def __init__(self, db: MongoClient):
        super().__init__(db.tt, TimeTable)
        self._event_collection = db.event

    def get_all_timetable(self, owner: str):
        exists = self._get_by_dict({"owner_id": owner})
        if exists == None:
            return None

        pipeline = [
            # 1. Filter: active=True und owner_id==owner
            {"$match": {"owner_id": owner}},
            # 2. Lookup: Join mit event-Collection über event_ids
            {
                "$lookup": {
                    "from": "event",
                    "localField": "event_ids",
                    "foreignField": "event_id",
                    "as": "events",
                }
            },
        ]
        res = list(self._collection.aggregate(pipeline))
        if len(res) == 0:
            return None
        return res

    def get_active_events(self, owner: str):
        exists = self._get_by_dict({"owner_id": owner})
        if exists == None:
            return None

        pipeline = [
            # 1. Filter: active=True und owner_id==owner
            {"$match": {"active": True, "owner_id": owner}},
            # 2. Lookup: Join mit event-Collection über event_ids
            {
                "$lookup": {
                    "from": "event",
                    "localField": "event_ids",
                    "foreignField": "event_id",
                    "as": "events",
                }
            },
            # Optional: Nur bestimmte Felder zurückgeben
            {"$project": {"events": 1, "_id": 0, "semester": 1, "name": 1}},
        ]
        res = list(self._collection.aggregate(pipeline))
        if len(res) == 0:
            return None
        return res[0]

    def get_active_modules(self, student_id: str):
        # Zuerst prüfen, ob für den Studenten überhaupt ein Eintrag existiert
        exists = self._get_by_dict({"owner_id": student_id})
        if exists is None:
            return None

        pipeline = [
            # 1. Filter: nur aktive TimeTables des Studenten
            {"$match": {"active": True, "owner_id": student_id}},
            
            # 2. Lookup: Join mit event-Collection über event_ids
            {
                "$lookup": {
                    "from": "event",
                    "localField": "event_ids",
                    "foreignField": "event_id",
                    "as": "events",
                }
            },
            {"$unwind": "$events"},  # Entpacken der events-Liste für weitere Joins
            
            # 3. Join event.course_id mit course.course_id
            {
                "$lookup": {
                    "from": "course",
                    "localField": "events.course_id",
                    "foreignField": "course_id",
                    "as": "courses",
                }
            },
            {"$unwind": "$courses"},
            
            # 4. Join course.module_id mit module.module_id
            {
                "$lookup": {
                    "from": "module",
                    "localField": "courses.module_number",
                    "foreignField": "module_id",
                    "as": "modules",
                }
            },
            
            # 5. Optional: Nur die Module zurückgeben
            {
                "$project": {
                    "_id": 0,
                    "modules": 1,
                }
            }
        ]

        res = list(self._collection.aggregate(pipeline))
        if not res:
            return None

        # Die Module sammeln (falls mehrere TimeTables vorhanden)
        all_modules = []
        for r in res:
            all_modules.extend(r.get("modules", []))
        
        return all_modules




class TodoManager(BaseManager[Todo]):
    def __init__(self, db: MongoClient):
        super().__init__(db.todo, Todo)

    def create_todo(self, todo: Todo):
        self._create(todo)

    def all_todos(self, student_id):
        out: list[Todo] = []
        for data in self._collection.find({"owner_id": student_id}):
            out.append(self._model.from_dict(data))
        return out

    def get_todo(self, student_id, id):
        return self._get_by_dict({"owner_id": student_id, "_id": ObjectId(id)})

    def delete_todo(self, student_id: str, todo_id: str):
        todo = self._get_by_dict({"_id": ObjectId(todo_id), "owner_id": student_id})
        if not todo:
            return False
        return self.delete_by_id(todo.id)

    # TODO Time
    def update_todo(self, student_id, id, title, description, tasks):
        return self.update_by_id(
            ObjectId(id),
            {
                "owner_id": student_id,
                "title": title,
                "description": description,
                "tasks": tasks,
            },
        )
