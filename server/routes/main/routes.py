from flask import Blueprint, current_app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.managers import CurriculaManager, StudentManager


main_bp = Blueprint('main', __name__, url_prefix='/')

@main_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_infos():
    
    identity = get_jwt_identity()
    student = None
    data = {
        "time": f"{student.hours_last_week}h last week" if student else "0h last week",
        "tasks": f"{student.pending_tasks} Tasks" if student else "0 Tasks",
        "schedule": student.next_class_date if student else "No schedule",
        "curricula": f"{len(student.subjects)} Subjects" if student else "0 Subjects",
        "dashboard": f"{student.hours_last_month}h last month" if student else "0h",
    }

    return jsonify(data), 200


@main_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile_info():
    manager = StudentManager(current_app.mongo.db)
    c_manager = CurriculaManager(current_app.mongo.db)
    identity = get_jwt_identity()
    print(identity)
    student = manager._get_by_dict({"student_id": identity})
    if not student:
        return jsonify(), 500

    curricula = c_manager._get_by_dict({"programm_version": student.study_id})
    print(curricula, student)
    return jsonify({ "name": student.name,"id": identity,  "programm": curricula.programm_name,"isbachelor": curricula.is_bachelor , "version": student.study_id,    }), 200
