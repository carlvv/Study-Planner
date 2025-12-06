
from db.collections.student import Student
from db.managers import StudentManager


user_manager =  StudentManager()


user_manager.create(
    (
        Student.Builder()
        .student_id("10000")
        .name("Max Mustermann")
        .password("password123")
        .study_id("foo")
        .start_semester("WS2025")
        .build()
    )
)
print("Test user created. You can now log in with username '10000' and password 'password123'.")