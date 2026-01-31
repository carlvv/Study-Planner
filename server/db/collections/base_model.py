from dataclasses import dataclass, asdict, field
from typing import Optional, Type, TypeVar, Dict, Any
from bson import ObjectId
from datetime import date, datetime

T = TypeVar("T", bound="BaseModel")

@dataclass
class BaseModel:
    id: Optional[ObjectId] = field(default_factory=ObjectId)

    def to_dict(self) -> Dict[str, Any]:
        """Konvertiert das Dataclass-Objekt in ein MongoDB-kompatibles Dictionary."""
        data = asdict(self)
        data["_id"] = data.pop("id")
        for k, v in data.items():
            if isinstance(v, (date, datetime)):
                data[k] = v.isoformat()
        return data

    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        """Erstellt eine Instanz des Models aus einem MongoDB-Dokument."""
        for k, v in data.items():
            if isinstance(v, str):
                try:
                    data[k] = datetime.fromisoformat(v).date()
                except ValueError:
                    pass
        data["id"] = data.pop("_id", None)
        return cls(**data)
    