import datetime
from turtle import title
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.collections.todo import Todo
from db.managers import TodoManager

todo_bp = Blueprint('todo', __name__, url_prefix='/')
from flask import jsonify


@todo_bp.route("/todos", methods=["GET"])
@jwt_required()
def get_todos():
    manager = TodoManager(current_app.mongo.db)

    identity = get_jwt_identity()

    res = []

    for todo in manager.all_todos(identity):
        res.append({ "id": str(todo.id) ,"titel": todo.title, "text": todo.description, "aufgaben": todo.tasks})

    return jsonify(res), 200


@todo_bp.route("/todo/<id>", methods=["GET"])
@jwt_required()
def get_todo(id):
    manager = TodoManager(current_app.mongo.db)
    identity = get_jwt_identity()
    task = manager.get_todo(identity, id)

    if task == None:
        return jsonify({"error": "Fehler"}), 404

    res = {"id": id,"titel": task.title, "text": task.description, "aufgaben": task.tasks}
    

    return jsonify(res), 200

@todo_bp.route("/todo_update/<id>", methods=["POST"])
@jwt_required()
def update_todo(id):
    try:
        manager = TodoManager(current_app.mongo.db)
        identity = get_jwt_identity()
        task = manager.get_todo(identity, id)

        if task == None:
            return jsonify({"error": "Todo nicht gefunden"}), 404

        data = request.get_json()
        title = data.get("title")
        description = data.get("desc")
        tasks = data.get("aufgaben")
        print(data)
        print(manager.update_todo(identity, id, title, description, tasks))

        return jsonify(), 200
    except:
        return jsonify({"error": "Fehler beim Aktualisieren des Todos"}), 500



@todo_bp.route("/todo_add", methods=["POST"])
@jwt_required()
def add_todo():
    try:
        manager = TodoManager(current_app.mongo.db)

        identity = get_jwt_identity()

        data = request.get_json()
        title = data.get("title")
        description = data.get("desc")
        todo = Todo(title=title, description=description, tasks=[], owner_id=identity)
        manager.create_todo(todo)
    
        return jsonify(), 200
    except:
        return jsonify({"error": "Fehler beim Erstellen des neuen Todos"}), 500
    
@todo_bp.route("/todo_delete/<id>", methods=["DELETE"])
@jwt_required()
def delete_todo(id):
    try:
        identity = get_jwt_identity()

        manager = TodoManager(current_app.mongo.db)
        manager.delete_todo(identity, id)

        return jsonify(), 200
    except:
        return jsonify({"error": "Fehler beim Löschen des Todos"}), 500
