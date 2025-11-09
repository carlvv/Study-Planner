from db.collections.learntime import Learntime
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
