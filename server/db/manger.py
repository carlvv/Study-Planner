from typing import Optional, Type, TypeVar, Generic
from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.collection import Collection

from db.collections.base_model import BaseModel


T = TypeVar("T", bound=BaseModel)

class BaseManager(Generic[T]):
    def __init__(self, collection: Collection, model: Type[T]):
        self._collection = collection
        self._model = model

    def _get_by_dict(self, query: dict) -> Optional[T]:
        data = self._collection.find_one(query)
        if data:
            return self._model.from_dict(data)
        return None

    def _create(self, obj: T) -> ObjectId:
        result = self._collection.insert_one(obj.to_dict())
        return result.inserted_id

    def exists(self, query: dict) -> bool:
        return self._collection.find_one(query) is not None

    def get_by_id(self, object_id: ObjectId) -> Optional[T]:
        return self._get_by_dict({"_id": object_id})

    def delete_by_id(self, object_id: ObjectId) -> bool:
        result = self._collection.delete_one({"_id": object_id})
        return result.deleted_count == 1
    
    def update_by_id(
        self,
        object_id: ObjectId,
        updates: dict,
        return_updated: bool = True
    ) -> Optional[T]:
        result = self._collection.find_one_and_update(
            {"_id": object_id},
            {"$set": updates},
            return_document=ReturnDocument.AFTER if return_updated else ReturnDocument.BEFORE
        )

        if result and return_updated:
            return self._model.from_dict(result)
        return None

    def update_one(
        self,
        query: dict,
        updates: dict,
        return_updated: bool = True
    ) -> Optional[T]:
        result = self._collection.find_one_and_update(
            query,
            {"$set": updates},
            return_document=ReturnDocument.AFTER if return_updated else ReturnDocument.BEFORE
        )

        if result and return_updated:
            return self._model.from_dict(result)
        return None