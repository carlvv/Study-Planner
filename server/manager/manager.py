from db.connector import MongoDBConnector

from typing import TypeVar, Generic, Optional, Type
from db.connector import MongoDBConnector
from db.collections.document import Document

T = TypeVar("T", bound=Document)

class BaseManager(Generic[T]):
    def __init__(self, collection_name: str, model_cls: Type[T]):
        db = MongoDBConnector.get_db()
        if db is None:
            raise RuntimeError("Datenbank ist nicht initialisiert")
        self._collection = db[collection_name]
        self.model_cls = model_cls

    def _create(self, obj: T) -> bool:
        result = self._collection.insert_one(obj.attributes())
        return result.acknowledged

    def _get(self, query: dict) -> Optional[dict]:
        doc = self._collection.find_one(query)
        if not doc:
            return None
        return doc

    def _update(self, query: dict, obj: T) -> bool:
        result = self._collection.update_one(query, {"$set": obj.attributes()})
        return result.acknowledged

    def _delete(self, query: dict) -> bool:
        result = self._collection.delete_one(query)
        return result.acknowledged
