from typing import List, Optional
from datetime import datetime

from bson import ObjectId
from db.collections.learntime import Learntime
from manager.manager import BaseManager


class LearnTimeManager(BaseManager[Learntime]):
    def __init__(self):
        super().__init__("learntimes", Learntime)

    def create_learntime(self, learn_session: Learntime) -> bool:
        return self._create(learn_session)

    def get_all_for_user(self, owner_id: str) -> List[Learntime]:
        docs = self._collection.find({Learntime.FIELD_OWNER_ID: owner_id})

        todos = [Learntime.from_dict(doc) for doc in docs]
        
        return [todo for todo in todos if todo is not None]

    def delete_learntime(self, id: str) -> bool:
        return self._delete({Learntime.FIELD_ID: ObjectId(id)})
