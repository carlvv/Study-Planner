import datetime
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from numpy import identity
from trio import Process
from db.managers import CourseManager, CurriculaManager, ModuleManager, StudentManager, StudentProcessManager

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
    now = datetime.datetime.now()
    month = now.month
    year = now.year
    is_summer = False

    if month > 3: 
        is_summer = True

    start_year = (int(start[2:]) + year // 100 * 100)
    start_summer = start[0:2] == "SS"
    return (year - start_year) * 2 - (0 if start_summer == is_summer else 1) + 1

@curricula_bp.route("/curricula", methods=["GET"])
@jwt_required()
def curricula_progress():
    db = current_app.mongo.db
    identity = get_jwt_identity()
    
    # 1. Daten-Initialisierung & Student Check
    student = StudentManager(db)._get_by_dict({"student_id": identity})
    if not student:
        return jsonify({"error": "Student nicht gefunden"}), 404

    curriculum = CurriculaManager(db)._get_by_dict({"programm_version": student.study_id})
    if not curriculum:
        return jsonify({"error": "Curriculum nicht gefunden"}), 404

    # Wir holen alle Leistungen des Studenten auf einmal
    processes = [p for p in StudentProcessManager(db).get_process(identity)]
    all_processes = {}
    for p in processes:
        print(p)
        all_processes[p["course_id"]] = p

    module_manager = ModuleManager(db)
    course_manager = CourseManager(db)

    # 3. Berechnungs-Variablen
    modules_output = []
    total_ects_finished = 0
    ects_relevant_for_grade = 0
    weighted_grade_points = 0
    
    # 4. Hauptschleife
    for module_id in curriculum.modules_ids:
        module = module_manager.get_by_module_id(module_id)
        if not module: continue

        module_courses = []
        module_ects_total = 0
        all_courses_in_module_finished = True

        for course_id in module.course_ids:
            course = course_manager.get_by_course_id(course_id)
            if not course: continue
            
            process = all_processes.get(course_id)
            is_finished = process is not None
            grade = process["grade"] if is_finished else 0
            
            module_ects_total += course.ects
            
            if is_finished:
                total_ects_finished += course.ects
                # Logik für Durchschnittsnote: Nur Kurse mit Note > 0 berücksichtigen
                if grade > 0:
                    ects_relevant_for_grade += course.ects
                    weighted_grade_points += (grade * course.ects)
            else:
                all_courses_in_module_finished = False

            module_courses.append({
                "name": course.course_name,
                "code": course.course_id,
                "ects": course.ects,
                "grade": grade,
                "finished": is_finished
            })

        modules_output.append({
            "name": module.module_name,
            "code": module.module_id,
            "ects": module_ects_total,
            "courses": module_courses,
            "finished": all_courses_in_module_finished
        })

    # 5. Finale Statistiken
    avg_grade = (weighted_grade_points / ects_relevant_for_grade) if ects_relevant_for_grade > 0 else 0
    ects_target = 210 if curriculum.is_bachelor else 90
    program_name = f"{'Bachelor' if curriculum.is_bachelor else 'Master'} {curriculum.programm_name}"

    return jsonify({
        "name": program_name,
        "modules": modules_output,
        "stats": [
            total_ects_finished,
            round(avg_grade, 2),
            max(0, ects_target - total_ects_finished),
            count_semester(student.start_semester),
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