
from manager.manager import BaseManager

import hashlib
import secrets


class User:
    def __init__(self, matrikelnummer: str, name: str, passworthash: str, salt: str, studiengangId: str):
        self._matrikelnummer = matrikelnummer
        self._name = name
        self._passworthash = passworthash
        self._salt = salt
        self._studiengangId = studiengangId

    @property
    def matrikelnummer(self) -> str:
        return self._matrikelnummer

    @property
    def name(self) -> str:
        return self._name

    @property
    def passworthash(self) -> str:
        return self._passworthash

    @property
    def salt(self) -> str:
        return self._salt

    @property
    def studiengangId(self) -> str:
        return self._studiengangId

    def verify_password(self, password: str) -> bool:
        """Überprüft, ob das Passwort mit dem gespeicherten Hash übereinstimmt."""
        hash_bytes = hashlib.sha512(bytes.fromhex(self._salt) + password.encode()).hexdigest()
        return hash_bytes == self._passworthash

    def __repr__(self) -> str:
        return (f"User(matrikelnummer='{self.matrikelnummer}', "
                f"name='{self.name}', passworthash='<hidden>', "
                f"studiengangId='{self.studiengangId}')")

    @classmethod
    def _create(cls, matrikelnummer: str, name: str, passworthash: str, salt: str, studiengangId: str) -> "User":
        return cls(matrikelnummer, name, passworthash, salt, studiengangId)

    class Builder:
        def __init__(self):
            self._matrikelnummer: str | None = None
            self._name: str | None = None
            self._passworthash: str | None = None
            self._salt: str | None = None
            self._studiengangId: str | None = None

        def matrikelnummer(self, matrikelnummer: str) -> "User.Builder":
            self._matrikelnummer = matrikelnummer
            return self

        def name(self, name: str) -> "User.Builder":
            self._name = name
            return self

        def password(self, password: str) -> "User.Builder":
            """Klartextpasswort -> Salt und Hash mit SHA-512 erzeugen."""
            salt = secrets.token_bytes(16)
            hash_hex = hashlib.sha512(salt + password.encode()).hexdigest()
            self._salt = salt.hex()
            self._passworthash = hash_hex
            return self

        def studiengangId(self, studiengangId: str) -> "User.Builder":
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

            return User._create(
                matrikelnummer=self._matrikelnummer,
                name=self._name,
                passworthash=self._passworthash,
                salt=self._salt,
                studiengangId=self._studiengangId
            )


class UserManager(BaseManager):
      def __init__(self):
         super().__init__("users")

      # TODO implementieren
      def createUser(self, user: User):
        pass


