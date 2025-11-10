from typing import Any, Dict, List, Optional, Type
from bson import ObjectId
from db.collections.base_model import BaseModel, MultiBaseModel
from db.connector import MongoDBConnector


class BaseManager:
    def __init__(self, collection_name: str, model_cls: Type[BaseModel], dbname: str = 'db'):
        self.model_cls = model_cls
        db = MongoDBConnector.get_db(dbname)
        if db is None:
            raise RuntimeError("Datenbank ist nicht initialisiert")
        self.collection = db[collection_name]

    def create(self, obj: BaseModel) -> ObjectId:
        result = self.collection.insert_one(obj.to_dict())
        return result.inserted_id

    def get_by_object_id(self, obj_id: Any) -> Optional[BaseModel]:
        data = self.collection.find_one({"_id": obj_id})
        return self.model_cls.from_dict(data) if data else None

    def get_by_dict(self, dict: Dict[str, Any]) -> Optional[BaseModel]:
        data = self.collection.find_one(dict)
        return self.model_cls.from_dict(data) if data else None

    def get_all(self) -> List[BaseModel]:
        cursor = self.collection.find()
        return [self.model_cls.from_dict(doc) for doc in cursor]
    
    def get_all_by_dict(self, dict: Dict[str, Any]) -> List[BaseModel]:
        cursor = self.collection.find(dict)
        return [self.model_cls.from_dict(doc) for doc in cursor]

    def update(self, obj_id: ObjectId, **updates) -> bool:
        result = self.collection.update_one({"_id": obj_id}, {"$set": updates})
        return result.modified_count > 0

    def delete(self, obj_id: ObjectId) -> bool:
        result = self.collection.delete_one({"_id": obj_id})
        return result.deleted_count > 0


class MultiBaseManager:
    def __init__(self, model_cls: Type[MultiBaseModel], dbname: str = 'db'):
        self.model_cls = model_cls
        self.db = MongoDBConnector.get_db(dbname)
   
    def create(self, obj: MultiBaseModel) -> ObjectId:
        result = self.db[obj.collection_name].insert_one(obj.to_dict())
        return result.inserted_id

    def get_by_object(self, obj: MultiBaseModel) -> Optional[MultiBaseModel]:
        data = self.db[obj.collection_name].find_one({"_id": obj.id})
        return self.model_cls.from_dict(data) if data else None

    def get_by_dict(self,obj: MultiBaseModel, dict: Dict[str, Any]) -> Optional[MultiBaseModel]:
        data = self.db[obj.collection_name].find_one(dict)
        return self.model_cls.from_dict(data) if data else None

    def get_all(self, obj: MultiBaseModel) -> List[MultiBaseModel]:
        cursor = self.db[obj.collection_name].find()
        return [self.model_cls.from_dict(doc) for doc in cursor]
    
    def get_all_by_dict(self, obj: MultiBaseModel, dict: Dict[str, Any]) -> List[MultiBaseModel]:
        cursor = self.db[obj.collection_name].find(dict)
        return [self.model_cls.from_dict(doc) for doc in cursor]

    def update(self, obj: MultiBaseModel, **updates) -> bool:
        result = self.db[obj.collection_name].update_one({"_id": obj.id}, {"$set": updates})
        return result.modified_count > 0

    def delete(self, obj: MultiBaseModel) -> bool:
        result = self.db[obj.collection_name].delete_one({"_id": obj.id})
        return result.deleted_count > 0
