from db.collections.course import Course
from db.collections.events import Event
from db.collections.curricula import Curricula
from db.collections.learntime import Learntime
from db.collections.module import Module
from db.collections.student import Student
from db.collections.timetable import TimeTable
from db.collections.todo import Todo
from db.manager import BaseManager, MultiBaseManager

class StudentManager(BaseManager[Student]):
    def __init__(self):
        super().__init__("users", Student)

    def verify_user(self, student_id: str, password: str) -> bool:
        user = self.get_by_dict({"student_id": student_id})
        if user:
            return user.verify_password(password)
        return False

    def user_exists(self, student_id: str) -> bool:
        return self.get_by_dict({"student_id": student_id}) is not None
    def create_user(self, student_id: str, password: str, name: str, study_id: str, start_semester: str) -> None:
        user = ( Student.Builder()
        .student_id(student_id)
        .name(name)
        .password(password)
        .study_id(study_id)
        .start_semester(start_semester)
        .build())
        self.create(user)

class TodoManager(BaseManager[Todo]):
    def __init__(self):
        super().__init__("todos", Todo)

class LearnTimeManager(BaseManager[Learntime]):
    def __init__(self):
        super().__init__("learntimes", Learntime)

class CourseManager(BaseManager[Course]):
    def __init__(self):
        super().__init__("courses", Course)

class ModuleManager(BaseManager[Module]):
    def __init__(self):
        super().__init__("modules", Module)

class CurriculaManager(BaseManager[Curricula]):
    def __init__(self):
        super().__init__("curricula", Curricula)

class TimeTableManager(MultiBaseManager[TimeTable]):
    def __init__(self):
        super().__init__(TimeTable, "tt")

class EventManager(MultiBaseManager[Event]):
    def __init__(self):
        super().__init__(Event, "events")