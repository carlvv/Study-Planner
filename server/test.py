
from db.collections.student import Student
from db.managers import StudentManager


user_manager =  StudentManager()


user_manager.create_user(
        "10000",
        "Max Mustermann",
        "password123",
        "foo",
        "WS2025"
)