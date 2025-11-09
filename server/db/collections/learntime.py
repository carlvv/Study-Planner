from dataclasses import dataclass
from datetime import datetime
from webbrowser import get

from db.collections.document import Document


@dataclass
class Learntime(Document):
    module_id: str
    duration_in_min: int
    date: datetime
    owner_id: str
    id: str = ""
    # ----------------------- Konstanten ----------------------------------
    FIELD_ID: str = "_id"
    FIELD_MODULE_ID: str = "module_id"
    FIELD_DURATION: str = "duration_in_min"
    FIELD_DATE: str = "date"
    FIELD_OWNER_ID: str = "owner_id"
    

    def attributes(self) -> dict:
        return {
            self.FIELD_MODULE_ID: self.module_id or "",
            self.FIELD_DURATION: self.duration_in_min or 0,
            self.FIELD_DATE: self.date,
            self.FIELD_OWNER_ID: self.owner_id,
        }

    def __str__(self) -> str:
        attr = self.attributes()
        attr[self.FIELD_ID] = self.id
        return str(attr)

    @classmethod
    def from_dict(cls, doc: dict) :
        if not doc:
            return None
        
        date = doc.get(cls.FIELD_DATE) or datetime.now()
        if isinstance(date, str):
            date = datetime.fromisoformat(date)

        return cls(
            id=doc.get(cls.FIELD_ID, ""),
            module_id=doc.get(cls.FIELD_MODULE_ID, ""),
            duration_in_min=doc.get(cls.FIELD_DURATION, 0),
            date=date,
            owner_id=doc.get(cls.FIELD_OWNER_ID, "")
        ) 