from db.connector import MongoDBConnector

from typing import TypeVar, Generic, Optional, Type
from db.connector import MongoDBConnector
from db.collections.collection import Collection

T = TypeVar("T", bound=Collection)

class BaseManager(Generic[T]):
    def __init__(self, collection_name: str, model_cls: Type[T]):
        db = MongoDBConnector.get_db()
        if db is None:
            raise RuntimeError("Datenbank ist nicht initialisiert")
        self.collection = db[collection_name]
        self.model_cls = model_cls

    def _create(self, obj: T) -> bool:
        result = self.collection.insert_one(obj.json())
        return result.acknowledged

    def _get(self, query: dict) -> Optional[dict]:
        doc = self.collection.find_one(query)
        if not doc:
            return None
        return doc

    def _update(self, query: dict, obj: T) -> bool:
        result = self.collection.update_one(query, {"$set": obj.json()})
        return result.acknowledged

    def _delete(self, query: dict) -> bool:
        result = self.collection.delete_one(query)
        return result.acknowledged
