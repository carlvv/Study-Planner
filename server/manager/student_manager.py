from typing import Optional
from db.collections.student import Student
from manager.manager import BaseManager

class StudentManager(BaseManager[Student]):
    def __init__(self):
        super().__init__("users", Student)

    def create_student(self, user: Student) -> bool:
        return self._create(user)

    def get_student(self, matrikelnummer: str) -> Optional[Student]:
        query = {Student.FIELD_STUDENT_ID: matrikelnummer}
        doc = self._get(query)
        if not doc:
            return None

        return (
			Student.Builder()
			.student_id(doc[Student.FIELD_STUDENT_ID])
			.name(doc[Student.FIELD_NAME])
			.password_from_hash(doc[Student.FIELD_PASSWORD_HASH], doc[Student.FIELD_SALT])
			.study_id(doc[Student.FIELD_STUDY_ID])
            .start_semester(doc[Student.FIELD_START_SEMESTER])
			.build()
		)


    def delete_student(self, student_id: str) -> bool:
        query = {Student.FIELD_STUDENT_ID: student_id}
        return self._delete(query)

    def update_student(self, student_id: str, user: Student) -> bool:
        query = {Student.FIELD_STUDENT_ID: student_id}
        return self._update(query, user)
