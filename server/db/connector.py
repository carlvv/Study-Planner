import os
import pymongo

class MongoDBConnector:
    """Singleton Klasse um die MongoDB Verbindung einmalig zu halten."""
    instance = None

    def __init__(self):
        raise RuntimeError("Call get_db() instead")

    @classmethod
    def _initDB(cls, dbname: str):
        """Liefert die Datenbank zurück"""
        try:
            mongo_uri = os.getenv("MONGO_URI")
            client = pymongo.MongoClient(mongo_uri)
            return client[dbname]
        except:
            raise RuntimeError("Keine Verbindung zu MongoDB")
        
    @classmethod
    def get_db(cls, dbname: str):
        if cls.instance is None:
            cls.instance = cls._initDB(dbname)
        return cls.instance
    
