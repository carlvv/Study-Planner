from db.collections.course import Course
from db.collections.curricula import Curricula
from db.collections.learntime import Learntime
from db.collections.module import Module
from db.collections.student import Student
from db.collections.todo import ToDo
from manager.manager import BaseManager

class StudentManager(BaseManager):
    def __init__(self):
        super().__init__("users", Student)

class ToDoManager(BaseManager):
    def __init__(self):
        super().__init__("todos", ToDo)

class LearnTimeManager(BaseManager):
    def __init__(self):
        super().__init__("learntimes", Learntime)

class CourseManager(BaseManager):
    def __init__(self):
        super().__init__("courses", Course)

class ModuleManager(BaseManager):
    def __init__(self):
        super().__init__("modules", Module)

class CurriculaManager(BaseManager):
    def __init__(self):
        super().__init__("curricula", Curricula)