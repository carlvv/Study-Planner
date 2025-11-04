from typing import Optional
from db.collections.user import User
from manager.manager import BaseManager

class UserManager(BaseManager[User]):
    def __init__(self):
        super().__init__("users", User)

    def createUser(self, user: User) -> bool:
        return self._create(user)

    def getUser(self, matrikelnummer: str) -> Optional[User]:
        query = {User.FIELD_MATRIKELNUMMER: matrikelnummer}
        doc = self._get(query)
        if not doc:
            return None

        return (
			User.Builder()
			.matrikelnummer(doc[User.FIELD_MATRIKELNUMMER])
			.name(doc[User.FIELD_NAME])
			.password_from_hash(doc[User.FIELD_PASSWORD_HASH], doc[User.FIELD_SALT])
			.studiengangId(doc[User.FIELD_STUDY_ID])
			.build()
		)


    def deleteUser(self, matrikelnummer: str) -> bool:
        query = {User.FIELD_MATRIKELNUMMER: matrikelnummer}
        return self._delete(query)

    def updateUser(self, matrikelnummer: str, user: User) -> bool:
        query = {User.FIELD_MATRIKELNUMMER: matrikelnummer}
        return self._update(query, user)
