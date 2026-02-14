import datetime
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.managers import CurriculaManager, StudentManager, StudentProcessManager

curricula_bp = Blueprint('curricula', __name__, url_prefix='/')
from flask import jsonify

@curricula_bp.route("/get_all_programs", methods=["GET"])
def get_all_programs():
    manager = CurriculaManager(current_app.mongo.db)

    grouped = {
        True: [],
        False: []
    }

    for cur in manager.get_all_programms():
        key = cur.is_bachelor
        name = cur.programm_name
        version = cur.programm_version

        if key is not None and name and version:
            grouped[key].append({
                "name": name,
                "version": version
            })

    return jsonify(grouped)


def count_semester(start):
    if start == "":
        return 1

    now = datetime.datetime.now()
    month = now.month
    year = now.year

    # Semester bestimmen
    if 4 <= month <= 9:
        is_summer = True
    else:
        is_summer = False

    start_year = int(start[2:])
    start_year += (year // 100) * 100

    start_summer = start.startswith("SS")

    semester_diff = (year - start_year) * 2

    if start_summer != is_summer:
        semester_diff -= 1

    return max(1, semester_diff + 1)

@curricula_bp.route("/curricula", methods=["GET"])
@jwt_required()
def curricula_progress():
    db = current_app.mongo.db
    identity = get_jwt_identity()

    student = StudentManager(db)._get_by_dict({"student_id": identity})
    if not student:
        return jsonify({"error": "Student nicht gefunden"}), 404

    curricula_manager = CurriculaManager(db)
    curriculum = curricula_manager.get_curricula_with_progress(
        student_id=identity,
        version=student.study_id         
    )
    if not curriculum:
        return jsonify({"error": "Curriculum nicht gefunden"}), 404

    # 3. Berechnung der Statistiken
    total_ects_finished = 0
    ects_relevant_for_grade = 0
    weighted_grade_points = 0

    for module in curriculum["modules"]:
        for course in module["courses"]:
            if course["finished"]:
                total_ects_finished += course["ects"]
                if course["grade"] > 0:
                    ects_relevant_for_grade += course["ects"]
                    weighted_grade_points += course["grade"] * course["ects"]

    avg_grade = (weighted_grade_points / ects_relevant_for_grade) if ects_relevant_for_grade > 0 else 0
    ects_target = 210 if curriculum["is_bachelor"] else 90
    program_name = f"{'Bachelor' if curriculum['is_bachelor'] else 'Master'} {curriculum['programm_name']}"

    return jsonify({
        "name": program_name,
        "modules": curriculum["modules"],
        "stats": [
            total_ects_finished,
            round(avg_grade, 2),
            max(0, ects_target - total_ects_finished),
            count_semester(student.start_semester)
        ]
    })



@curricula_bp.route("/curricula_update", methods=["POST"])
@jwt_required()
def curricula_update():
    manager = StudentProcessManager(current_app.mongo.db)
    identity = get_jwt_identity()

    data = request.get_json()
    module_id = data.get("module_id")
    course_id = data.get("course_id")
    grade = data.get("grade")
    manager.add_process(identity,course_id, grade,module_id)

    return jsonify(), 200

@curricula_bp.route("/curricula_delete", methods=["POST"])
@jwt_required()
def curricula_delete():
    manager = StudentProcessManager(current_app.mongo.db)
    identity = get_jwt_identity()

    data = request.get_json()
    module_id = data.get("module_id")
    course_id = data.get("course_id")
    manager.delete_process(identity, course_id, module_id)

    return jsonify(), 200