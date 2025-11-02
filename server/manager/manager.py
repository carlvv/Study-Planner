from db.connector import MongoDBConnector

class BaseManager:
    """
    Basis Manager, welche mit einer Kollektion initialisiert wird.
    """
    def __init__(self, collection_name):
        db = MongoDBConnector.get_db()
        if db is None:
            raise RuntimeError("Datenbank ist nicht initialisiert")
        self.collection = db[collection_name]