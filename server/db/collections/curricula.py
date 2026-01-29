

from dataclasses import dataclass, field
from typing import List
from db.collections.base_model import BaseModel

@dataclass(kw_only=True)
class Curricula(BaseModel):
    programm_name: str
    programm_version: str
    is_bachelor: bool

    modules_ids: List[str] = field(default_factory=list)  

    def add_modules(self, id: str):
        self.modules_ids.append(id)

    def delete_modules(self, id: str):
        self.modules_ids.remove(id)