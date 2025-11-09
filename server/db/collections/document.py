from abc import ABC, abstractmethod
from typing import TypeVar, Type, Optional

# Ein generischer Typ, der "eine beliebige Unterklasse von Document" bedeutet
T = TypeVar('T', bound='Document')

class Document(ABC):

    @abstractmethod
    def attributes(self) -> dict:
        """Serialisiert das Objekt in ein Dictionary für die DB."""
        pass

    @classmethod
    @abstractmethod
    def from_dict(cls: Type[T], doc: dict) -> Optional[T]:
        """
        Deserialisiert ein DB-Dictionary in eine Instanz der Klasse.
        (Dies ist eine "Factory-Methode")
        """
        pass
