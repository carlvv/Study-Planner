import pymongo
from fetch.fetch import fetch_and_save
from fetch.stundenplan_fetch import create_schedule



myclient = pymongo.MongoClient("mongodb://localhost:27017/")

create_schedule()
fetch_and_save()