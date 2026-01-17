
from bson import ObjectId
from db.collections.student import Student
from db.managers import StudentManager

import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

user_manager =  StudentManager(myclient["db"])


user_manager.create_user("10001", "test1234", "Max1 Mustermann", "foo", "foo")
