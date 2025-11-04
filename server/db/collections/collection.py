from abc import ABC, abstractmethod

class Collection(ABC):
    @abstractmethod
    def json(self):
        pass