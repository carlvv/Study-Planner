from ast import List
from genericpath import exists
from typing import Optional
from bson import ObjectId
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
        start_semester: str
    ) -> Optional[ObjectId]:

        if self.user_exists(student_id):
            return None

        user = Student.Builder().name(name).password(password).start_semester(start_semester).student_id(student_id).study_id(study_id).build()

        return self._create(user)
    
    def update_curricula(self, student_id, version_id):
        return self.update_one({"student_id": student_id}, { "study_id": version_id })

class StudentProcessManager(BaseManager[StudentProcess]):
    # Manager für den Fortschritt eines Students
    def __init__(self, db: MongoClient):
        super().__init__(db.process, StudentProcess)

    def get_process(self, student_id):
        return list(self._collection.find({"student_id": student_id}))
    
    def add_process(self, student_id,course_id, grade, module_id ):
        exists = self.exists({"student_id": student_id, "module_id": module_id, "course_id":course_id })
        if exists:
            self.delete_process(student_id, course_id, module_id)
        
        return self._create(StudentProcess(student_id=student_id, course_id=course_id, grade=grade, module_id=module_id))
    

    def delete_process(self, student_id,course_id, module_id ):
        return self._collection.find_one_and_delete({"student_id": student_id, "module_id": module_id, "course_id":course_id })

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
        out : list[Course] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out
    
    def delete_all(self):
        self._collection.delete_many({})
    

class CurriculaManager(BaseManager[Curricula]):
    def __init__(self, db: MongoClient):
        super().__init__(db.curricula, Curricula)

    def curricula_exists(self, curricula: Curricula) -> bool:
        return self.exists({"programm_name": curricula.programm_name, "programm_version": curricula.programm_version})
    
    def get_by_name_version(self, name: str, version: str) -> Optional[Curricula]:
        return self._get_by_dict({"programm_name": name, "programm_version": version})
    
    def create_curricula(self, curricula: Curricula) -> Optional[ObjectId]:
        if self.curricula_exists(curricula):
            return None
        return self._create(curricula)
    
    def create_or_get_curricula(self, curricula: Curricula) -> Optional[ObjectId]:
        existing = self.get_by_name_version(curricula.programm_name, curricula.programm_version)
        if existing:
            return existing.id
        return self.create_curricula(curricula)

    def get_all_programms(self) -> list[Curricula]:
        out : list[Curricula] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out

    def delete_all(self):
        self._collection.delete_many({})

class EventManager(BaseManager[Event]):
    def __init__(self, db: MongoClient):
        super().__init__(db.event, Event)

class LearnTimeManager(BaseManager[Learntime]):
    def __init__(self, db: MongoClient):
        super().__init__(db.lt, Learntime)

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
        out : list[Module] = []
        for data in self._collection.find({}):
            out.append(self._model.from_dict(data))
        return out
    
    def delete_all(self):
        self._collection.delete_many({})
    


class TimeTableManager(BaseManager[TimeTable]):
    def __init__(self, db: MongoClient):
        super().__init__(db.tt, TimeTable)

class TodoManager(BaseManager[Todo]):
    def __init__(self, db: MongoClient):
        super().__init__(db.todo, Todo)

    def create_todo(self, todo: Todo):
        self._create(todo)
    
    def all_todos(self, student_id):
        out : list[Todo] = []
        for data in self._collection.find({ "owner_id": student_id}):
            out.append(self._model.from_dict(data))
        return out
    
    def get_todo(self, student_id, id):
        return self._get_by_dict({"owner_id": student_id, "_id": ObjectId(id)})
    
    # TODO Time
    def update_todo(self, student_id, id, title, description, tasks):
        return self.update_by_id(
                ObjectId(id),
                {
                    "owner_id": student_id,
                    "title": title,
                    "description": description,
                    "tasks": tasks
                }
            )