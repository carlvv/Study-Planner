
from dataclasses import dataclass, field
from typing import List
from db.collections.base_model import MultiBaseModel


@dataclass(kw_only=True)
class TimeTable(MultiBaseModel):
    owner_id: str
    event_ids: List[str] = field(default_factory=list)  

    def add_event(self, id: str):
        self.event_ids.append(id)

    def delete_event(self, id: str):
        self.event_ids.remove(id)