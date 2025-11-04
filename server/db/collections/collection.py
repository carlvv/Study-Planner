from abc import ABC, abstractmethod

class Collection(ABC):
    def __str__(self):
        return self.json()
    
    @abstractmethod
    def json(self):
        pass