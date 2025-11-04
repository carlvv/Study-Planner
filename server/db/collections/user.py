import hashlib
import secrets
from dataclasses import dataclass, field

from db.collections.collection import Collection

@dataclass
class User(Collection):
    FIELD_MATRIKELNUMMER: str = field(init=False, default="matrikelnummer")
    FIELD_NAME: str = field(init=False, default="name")
    FIELD_PASSWORD_HASH: str = field(init=False, default="pw_hash")
    FIELD_SALT: str = field(init=False, default="salt")
    FIELD_STUDY_ID: str = field(init=False, default="study_id")

    matrikelnummer: str
    name: str
    passworthash: str
    salt: str
    studiengangId: str

    def verify_password(self, password: str) -> bool:
        """Überprüft, ob das Passwort mit dem gespeicherten Hash übereinstimmt."""
        hash_bytes = hashlib.sha256(bytes.fromhex(self.salt) + password.encode()).hexdigest()
        return hash_bytes == self.passworthash

    def __repr__(self) -> str:
        return (
            f"User({self.FIELD_MATRIKELNUMMER}='{self.matrikelnummer}', "
            f"{self.FIELD_NAME}='{self.name}', {self.FIELD_PASSWORD_HASH}='<hidden>', "
            f"{self.FIELD_STUDY_ID}='{self.studiengangId}')"
        )

    def json(self):
        return {
            self.FIELD_NAME: self.name,
            self.FIELD_MATRIKELNUMMER: self.matrikelnummer,
            self.FIELD_PASSWORD_HASH: self.passworthash,
            self.FIELD_SALT: self.salt,
            self.FIELD_STUDY_ID: self.studiengangId,
        }

    @classmethod
    def from_password(cls, matrikelnummer: str, name: str, password: str, studiengangId: str) -> "User":
        """Erstellt einen User aus Klartextpasswort."""
        salt = secrets.token_bytes(16)
        hash_hex = hashlib.sha256(salt + password.encode()).hexdigest()
        return cls(
            matrikelnummer=matrikelnummer,
            name=name,
            passworthash=hash_hex,
            salt=salt.hex(),
            studiengangId=studiengangId
        )
    class Builder:
        def __init__(self):
            self._matrikelnummer: str | None = None
            self._name: str | None = None
            self._passworthash: str | None = None
            self._salt: str | None = None
            self._studiengangId: str | None = None

        def matrikelnummer(self, matrikelnummer: str):
            self._matrikelnummer = matrikelnummer
            return self

        def name(self, name: str):
            self._name = name
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

        def studiengangId(self, studiengangId: str):
            self._studiengangId = studiengangId
            return self

        def build(self) -> "User":
            if not all([self._matrikelnummer, self._name, self._passworthash, self._salt, self._studiengangId]):
                raise ValueError("Alle Felder müssen gesetzt sein, bevor ein User erstellt wird.")
            
            assert self._matrikelnummer is not None 
            assert self._name is not None
            assert self._passworthash is not None 
            assert self._salt is not None 
            assert self._studiengangId is not None

            return User(
                matrikelnummer=self._matrikelnummer,
                name=self._name,
                passworthash=self._passworthash,
                salt=self._salt,
                studiengangId=self._studiengangId
            )
