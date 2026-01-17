
from dataclasses import dataclass

from db.collections.base_model import BaseModel

@dataclass(kw_only=True)
class Event(BaseModel):
    course_id: str
    name: str
    day: str
    semester: str
    start_time: int | None = None
    """Startzeit, Beispiel: 9:30 -> 930"""
    end_time: int | None = None
    """Endzeit, Beispiel: 10:45 -> 1045"""
    weekly_event: bool
    room: str
    