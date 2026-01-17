from typing import Optional
from bson import ObjectId
from pymongo import MongoClient
from db.collections.course import Course
from db.collections.curricula import Curricula
from db.collections.module import Module
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

class CourseManager(BaseManager[Course]):
    def __init__(self, db: MongoClient):
        super().__init__(db.course, Course)

class CurriculaManager(BaseManager[Curricula]):
    def __init__(self, db: MongoClient):
        super().__init__(db.curricula, Curricula)

class EventManager(BaseManager[Event]):
    def __init__(self, db: MongoClient):
        super().__init__(db.event, Event)

class LearnTimeManager(BaseManager[Learntime]):
    def __init__(self, db: MongoClient):
        super().__init__(db.lt, Learntime)

class ModuleManager(BaseManager[Module]):
    def __init__(self, db: MongoClient):
        super().__init__(db.module, Module)

class TimeTableManager(BaseManager[TimeTable]):
    def __init__(self, db: MongoClient):
        super().__init__(db.tt, TimeTable)

class TodoManager(BaseManager[Todo]):
    def __init__(self, db: MongoClient):
        super().__init__(db.todo, Todo)