from typing import Any, Dict, List, Optional, Type, TypeVar, Generic
from bson import ObjectId
from db.collections.base_model import BaseModel, MultiBaseModel
from db.connector import MongoDBConnector

TModel = TypeVar("TModel", bound=BaseModel)
TMultiModel = TypeVar("TMultiModel", bound=MultiBaseModel)

class BaseManager(Generic[TModel]):
    def __init__(self, collection_name: str, model_cls: Type[TModel], dbname: str = 'db'):
        self.__model_cls = model_cls
        db = MongoDBConnector.get_db(dbname)
        if db is None:
            raise RuntimeError("Datenbank ist nicht initialisiert")
        self.__collection = db[collection_name]

    def _create(self, obj: TModel) -> ObjectId:
        result = self.__collection.insert_one(obj.to_dict())
        return result.inserted_id

    def _get_by_object_id(self, obj_id: Any) -> Optional[TModel]:
        data = self.__collection.find_one({"_id": obj_id})
        return self.__model_cls.from_dict(data) if data else None

    def _get_by_dict(self, dict: Dict[str, Any]) -> Optional[TModel]:
        data = self.__collection.find_one(dict)
        return self.__model_cls.from_dict(data) if data else None

    def _get_all(self) -> List[TModel]:
        cursor = self.__collection.find()
        return [self.__model_cls.from_dict(doc) for doc in cursor]

    def _get_all_by_dictt(self, dict: Dict[str, Any]) -> List[TModel]:
        cursor = self.__collection.find(dict)
        return [self.__model_cls.from_dict(doc) for doc in cursor]

    def _update(self, obj: TModel) -> bool:
        result = self.__collection.update_one({"_id": obj.id}, {'$set': obj.to_dict()})
        return result.modified_count > 0

    def _delete(self, obj_id: ObjectId) -> bool:
        result = self.__collection.delete_one({"_id": obj_id})
        return result.deleted_count > 0


class MultiBaseManager(Generic[TMultiModel]): 
    def __init__(self, model_cls: Type[TMultiModel], dbname: str = 'db'):
        self.model_cls = model_cls 
        self.db = MongoDBConnector.get_db(dbname) 
    
    def _create(self, obj: TMultiModel) -> ObjectId:
        result = self.db[obj.collection_name].insert_one(obj.to_dict()) 
        return result.inserted_id 
    
    def _get_by_object(self, obj: TMultiModel) -> Optional[TMultiModel]:
        data = self.db[obj.collection_name].find_one({"_id": obj.id}) 
        return self.model_cls.from_dict(data) if data else None 
    
    def _get_by_dict(self,obj: TMultiModel, dict: Dict[str, Any]) -> Optional[TMultiModel]: 
        data = self.db[obj.collection_name].find_one(dict) 
        return self.model_cls.from_dict(data) if data else None 
    
    def _get_all(self, obj: TMultiModel) -> List[TMultiModel]: 
        cursor = self.db[obj.collection_name].find() 
        return [self.model_cls.from_dict(doc) for doc in cursor] 
    
    def _get_all_by_dict(self, obj: TMultiModel, dict: Dict[str, Any]) -> List[TMultiModel]: 
        cursor = self.db[obj.collection_name].find(dict) 
        return [self.model_cls.from_dict(doc) for doc in cursor] 
    
    def _update(self, obj: TMultiModel, **updates) -> bool: 
        result = self.db[obj.collection_name].update_one({"_id": obj.id}, {"$set": updates}) 
        return result.modified_count > 0 
    
    def _delete(self, obj: TMultiModel) -> bool: 
        result = self.db[obj.collection_name].delete_one({"_id": obj.id}) 
        return result.deleted_count > 0 
