from dataclasses import dataclass, field
from typing import List
from db.collections.base_model import BaseModel


@dataclass(kw_only=True)
class Module(BaseModel):
    module_id: str
    module_name: str
    course_ids: List[str] = field(default_factory=list)  

    def add_course(self, id: str):
        self.course_ids.append(id)

    def delete_course(self, id: str):
        self.course_ids.remove(id)