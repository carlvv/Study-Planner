from db.collections.document import Document
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import List

@dataclass
class Task:
    title: str
    done: bool = False

    def mark_done(self):
        self.done = True

@dataclass
class ToDo(Document):
    title: str
    description: str
    owner_id: str
    id: str | None = None

    tasks: List[Task] = field(default_factory=list)

    last_time_edited: datetime = field(default_factory=datetime.now)
    created_at: datetime = field(default_factory=datetime.now, init=False)
    # ----------------------- Konstanten ----------------------------------
    FIELD_ID: str = "_id"
    FIELD_TITLE: str = "title"
    FIELD_DESCRIPTION: str = "description"
    FIELD_CREATED_AT: str = "created_at"
    FIELD_LAST_EDITED: str = "last_time_edited"
    FIELD_OWNER: str = "owner_id"
    FIELD_TASKS: str = "tasks"

    def __str__(self) -> str:
        attr = self.attributes()
        attr[self.FIELD_ID] = self.id
        return str(attr)

    def attributes(self) -> dict:
        return {
            self.FIELD_TITLE: self.title or "",
            self.FIELD_DESCRIPTION: self.description or "",
            self.FIELD_CREATED_AT: self.created_at.isoformat(),
            self.FIELD_LAST_EDITED: self.last_time_edited.isoformat(),
            self.FIELD_OWNER: self.owner_id,
            self.FIELD_TASKS: [asdict(task) for task in self.tasks],
        }

    @classmethod
    def from_dict(cls, doc: dict) :
        if not doc:
            return None

        created_at = doc.get(cls.FIELD_CREATED_AT)
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)

        last_time_edited = doc.get(cls.FIELD_LAST_EDITED)
        if isinstance(last_time_edited, str):
            last_time_edited = datetime.fromisoformat(last_time_edited)

        return cls(
            id=doc.get(cls.FIELD_ID, ""),
            title=doc.get(cls.FIELD_TITLE, ""),
            description=doc.get(cls.FIELD_DESCRIPTION, ""),
            owner_id=doc.get(cls.FIELD_OWNER, ""),
            last_time_edited=last_time_edited or datetime.now(),
            tasks=[Task(**t) for t in doc.get(cls.FIELD_TASKS, [])],
        )


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
