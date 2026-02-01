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

class StudentProcessManager(BaseManager[StudentProcess]):
    # Manager für den Fortschritt eines Students
    def __init__(self, db: MongoClient):
        super().__init__(db.process, StudentProcess)

class CourseManager(BaseManager[Course]):
    def __init__(self, db: MongoClient):
        super().__init__(db.course, Course)

class CurriculaManager(BaseManager[Curricula]):
    def __init__(self, db: MongoClient):
        super().__init__(db.curricula, Curricula)

    def create_curricula(self,name, version, isbachelor, ids):
        self._create(Curricula(programm_name=name,programm_version=version, is_bachelor=isbachelor,modules_ids=ids))

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
    
    

class TimeTableManager(BaseManager[TimeTable]):
    def __init__(self, db: MongoClient):
        super().__init__(db.tt, TimeTable)

class TodoManager(BaseManager[Todo]):
    def __init__(self, db: MongoClient):
        super().__init__(db.todo, Todo)