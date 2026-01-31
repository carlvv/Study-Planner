from dataclasses import dataclass
from datetime import datetime
from webbrowser import get

from db.collections.base_model import BaseModel


@dataclass(kw_only=True)
class Learntime(BaseModel):
    module_id: str
    duration_in_min: int
    date: datetime
    owner_id: str
    