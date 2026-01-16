from typing import Optional
from bson import ObjectId
from pymongo import MongoClient
from pymongo.collection import Collection

from db.collections.student import Student

class StudentManager():
    def __init__(self, db: MongoClient):
        self.__collection: Collection = db.users

    def _get_by_dict(self, query: dict) -> Optional[Student]:
        data = self.__collection.find_one(query)
        if data:
            return Student.from_dict(data)
        return None

    def _create(self, user: Student) -> ObjectId:
        result = self.__collection.insert_one(user.to_dict())
        return result.inserted_id

    def verify_user(self, student_id: str, password: str) -> Optional[Student]:
        user = self._get_by_dict({"student_id": student_id})
        if user and user.verify_password(password):
            return user
        return None

    def user_exists(self, student_id: str) -> bool:
        return self._get_by_dict({"student_id": student_id}) is not None

    def create_user(self, student_id: str, password: str, name: str, study_id: str, start_semester: str) -> Optional[ObjectId]:
        if self.user_exists(student_id):
            return None

        user = Student(
            student_id=student_id,
            name=name,
            password=password,
            study_id=study_id,
            start_semester=start_semester
        )

        return self._create(user)