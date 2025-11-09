from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import List

from db.collections.base_model import BaseModel

class Task:
    title: str
    done: bool = False

    def mark_done(self):
        self.done = True

@dataclass(kw_only=True)
class ToDo(BaseModel):
    title: str
    description: str
    owner_id: str
    
    tasks: List[Task] = field(default_factory=list)
    last_time_edited: datetime = field(default_factory=datetime.now)
    created_at: datetime = field(default_factory=datetime.now, init=False)
  
    def set_title(self, title: str):
        self.title = title
        self.last_time_edited = datetime.now()

    def set_description(self, description: str):
        self.description = description
        self.last_time_edited = datetime.now()

    def add_task(self, task: Task):
        self.tasks.append(task)
        self.last_time_edited = datetime.now()

    def remove_task(self, task_index: int):
        if 0 <= task_index < len(self.tasks):
            self.tasks.pop(task_index)
            self.last_time_edited = datetime.now()

    def mark_task_done(self, task_index: int):
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index].mark_done()
            self.last_time_edited = datetime.now()
