from flask import Blueprint, current_app, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from db.managers import CurriculaManager, LearnTimeManager, ModuleManager, StudentManager, TimeTableManager, TodoManager


main_bp = Blueprint('main', __name__, url_prefix='/')

@main_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_infos():
    todos_m = TodoManager(current_app.mongo.db)
    curricula_m = CurriculaManager(current_app.mongo.db)
    lt_manager = LearnTimeManager(current_app.mongo.db)

    identity = get_jwt_identity()

    student = StudentManager(current_app.mongo.db)._get_by_dict({"student_id": identity})
    count_tt = len(list(TimeTableManager(current_app.mongo.db)._collection.find({"owner_id": identity})))
    todo_count = sum([ len(todo.tasks) for todo in todos_m.all_todos(identity) ]) 
    curricula = curricula_m._get_by_dict({ "programm_version": student.study_id})

    module_count = 0 if not curricula else len(curricula.modules_ids)

    lt_stats = lt_manager.get_statistics(identity)["stats"]
    total = lt_stats["total"]
    daily = lt_stats["daily"]
    data = {
        "time": f"Heute {daily // 60}h gelernt",
        "tasks": f"{todo_count} Todos",
        "schedule": f"{count_tt} Stundenpläne",
        "curricula": f"{module_count} Module",
        "dashboard": f"Gesamt {total // 60}h gelernt",
    }

    return jsonify(data), 200


@main_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile_info():
    manager = StudentManager(current_app.mongo.db)
    c_manager = CurriculaManager(current_app.mongo.db)
    identity = get_jwt_identity()
    student = manager._get_by_dict({"student_id": identity})
    if not student:
        return jsonify(), 500

    curricula = c_manager._get_by_dict({"programm_version": student.study_id})
    return jsonify({ "name": student.name,"id": identity,  "programm": curricula.programm_name,"isbachelor": curricula.is_bachelor , "version": student.study_id,    }), 200
