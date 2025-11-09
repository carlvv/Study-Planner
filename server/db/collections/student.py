import hashlib
import secrets
from dataclasses import dataclass, field

from db.collections.collection import Collection

@dataclass
class Student(Collection):

    FIELD_STUDENT_ID: str = field(init=False, default="_id")
    """Matrikelnummer Feld"""

    FIELD_NAME: str = field(init=False, default="name")

    FIELD_PASSWORD_HASH: str = field(init=False, default="pw_hash")
    FIELD_SALT: str = field(init=False, default="salt")

    FIELD_STUDY_ID: str = field(init=False, default="study_id")
    """[B/M]_[Studiengang]_[NUMMER], Beispiel: B_INF_25, M_BWL_23"""

    FIELD_START_SEMESTER: str = field(init=False, default="start_semester")
    """FORMAT: [SEMESTER][JAHR], Beispiel: SS25, WS23"""


    student_id: str
    """Matrikelnummer Feld"""

    name: str
    
    passworthash: str
    salt: str

    study_id: str
    """[B/M]_[Studiengang]_[NUMMER], Beispiel: B_INF_25, M_BWL_23"""

    start_semester: str
    """FORMAT: [SEMESTER][JAHR], Beispiel: SS25, WS23"""
    def verify_password(self, password: str) -> bool:
        """Überprüft, ob das Passwort mit dem gespeicherten Hash übereinstimmt."""
        hash_bytes = hashlib.sha256(bytes.fromhex(self.salt) + password.encode()).hexdigest()
        return hash_bytes == self.passworthash


    def json(self):
        return {
            self.FIELD_NAME: self.name,
            self.FIELD_STUDENT_ID: self.student_id,
            self.FIELD_PASSWORD_HASH: self.passworthash,
            self.FIELD_SALT: self.salt,
            self.FIELD_STUDY_ID: self.study_id,
            self.FIELD_START_SEMESTER: self.start_semester,
        }

    class Builder:
        def __init__(self):
            self._student_id: str | None = None
            self._name: str | None = None
            self._passworthash: str | None = None
            self._salt: str | None = None
            self._study_id: str | None = None
            self._start_semester: str | None = None

        def student_id(self, _student_id: str):
            self._student_id = _student_id
            return self

        def name(self, name: str):
            self._name = name
            return self

        def start_semester(self, semester: str):
            self._start_semester = semester 
            return self

        def password(self, password: str):
            salt = secrets.token_bytes(16)
            hash_hex = hashlib.sha256(salt + password.encode()).hexdigest()
            self._salt = salt.hex()
            self._passworthash = hash_hex
            return self

        def password_from_hash(self, hash_hex: str, salt_hex: str):
            self._passworthash = hash_hex
            self._salt = salt_hex
            return self

        def study_id(self, study_id: str):
            self._study_id = study_id
            return self

        def build(self) -> "Student":
            if not all([self._student_id, self._name, self._passworthash, self._salt, self._study_id]):
                raise ValueError("Alle Felder müssen gesetzt sein, bevor ein User erstellt wird.")
            
            assert self._student_id is not None 
            assert self._name is not None
            assert self._passworthash is not None 
            assert self._salt is not None 
            assert self._study_id is not None

            return Student(
                student_id=self._student_id,
                name=self._name,
                passworthash=self._passworthash,
                salt=self._salt,
                study_id=self._study_id,
                start_semester=self._start_semester or ""
            )
