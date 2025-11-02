from manager.manager import BaseManager

# TODO ER-Diagramm fehlt
class User:
   pass


class UserManager(BaseManager):
      def __init__(self):
         super().__init__("users")

      # TODO implementieren
      def createUser(self, user: User):
         pass

