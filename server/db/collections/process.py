from dataclasses import dataclass

from db.collections.base_model import BaseModel


@dataclass(kw_only=True)
class StudentProcess(BaseModel): 
    # Tabelle für den Fortschritt
    # Nur ein Eintrag erstellen, wenn der Benutzer es bestanden hat 
    student_id: str
    module_id: str
    course_id: str
    grade: float

