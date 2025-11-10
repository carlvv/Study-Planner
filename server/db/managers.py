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