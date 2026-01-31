from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required


main_bp = Blueprint('main', __name__, url_prefix='/')

@main_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def protected():
    
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
