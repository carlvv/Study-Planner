import os
import pymongo

class MongoDBConnector:
    """Singleton Klasse um die MongoDB Verbindung einmalig zu halten."""
    instance = None

    def __init__(self):
        raise RuntimeError("Call get_db() instead")

    
    @classmethod
    def _initDB(cls):
        """Liefert die Datenbank zurück"""
        try:
            mongo_uri = os.getenv("MONGO_URI", "mongodb://mongo:27017/")
            client = pymongo.MongoClient(mongo_uri)
            return client['db']
        except:
            raise RuntimeError("Keine Verbindung zu MongoDB")
        
    @classmethod
    def get_db(cls):
        if cls.instance is None:
            cls.instance = cls._initDB()
        return cls.instance
