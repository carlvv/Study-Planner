from typing import List, Optional
from datetime import datetime

from bson import ObjectId
from db.collections.todo import ToDo
from manager.manager import BaseManager


class ToDoManager(BaseManager[ToDo]):
    def __init__(self):
        super().__init__("todos", ToDo)

    def create_todo(self, todo: ToDo) -> bool:
        return self._create(todo)

    def get_todo(self, id: str) -> Optional[ToDo]:
        query = {ToDo.FIELD_ID: ObjectId(id)}
        doc = self._get(query)

        if doc is None:
            return None

        return ToDo.from_dict(doc)

    def get_all_for_user(self, owner_id: str) -> List[ToDo]:
        docs = self._collection.find({ToDo.FIELD_OWNER: owner_id})

        todos = [ToDo.from_dict(doc) for doc in docs]
        
        return [todo for todo in todos if todo is not None]

    def update_todo(self, id: str, todo: ToDo) -> bool:
        return self._update({ToDo.FIELD_ID: ObjectId(id)}, todo)

    def delete_todo(self, id: str) -> bool:
        return self._delete({ToDo.FIELD_ID: ObjectId(id)})
