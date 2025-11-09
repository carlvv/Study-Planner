from dataclasses import dataclass, field
from typing import List
from db.collections.base_model import BaseModel


@dataclass(kw_only=True)
class Course(BaseModel):
    course_id: str
    course_name: str
    module_number: str
    ects: int
    course_type: str             
    lecturer: str
    prerequisite_ids: List[str] = field(default_factory=list)  
    

    def add_prerequisite(self, id: str):
        self.prerequisite_ids.append(id)

    def delete_prerequisite(self, id: str):
        self.prerequisite_ids.remove(id)