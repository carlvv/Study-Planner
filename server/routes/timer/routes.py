import datetime
from turtle import title
from bson import Decimal128
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.managers import CourseManager, CurriculaManager, LearnTimeManager, ModuleManager, StudentManager, TimeTableManager
from db.collections.learntime import Learntime

timer_bp = Blueprint('timer', __name__, url_prefix='/')
from flask import jsonify

from dateutil import parser

# Liefert ein sortiertes Array von den neuesten Lernzeiten
# limit -> limietiert die Größe des Arrays
@timer_bp.route("/timer_recent", methods=["GET"])
@jwt_required()
def get_recent_times():
    try:
        manager = LearnTimeManager(current_app.mongo.db)

        identity = get_jwt_identity()

        allLearnTime = manager.get_all(identity)

        allLearnTime = sorted(
            allLearnTime,
            key=lambda x: x.date,
            reverse=True
        )

        res = []

        for learnTime in allLearnTime:
            res.append({
                "module_id": learnTime.module_id,
                "duration_in_min": learnTime.duration_in_min,
                "date": learnTime.date.isoformat(),
                "owner_id": identity
            })

        return jsonify(res), 200
    except:
        return jsonify({"error": "Fehler beim Abrufen der Lernzeiten"}), 500

# Erstellt eine neue LearnTime und speichert diese ab
# erwartet im Body ein JSON-Objekt mit den Werten "duration_in_min", "date", "module_id"
@timer_bp.route("/timer_add", methods=["POST"])
@jwt_required()
def create_time():
    try:
        manager = LearnTimeManager(current_app.mongo.db)

        identity = get_jwt_identity()

        data = request.get_json()

        module_id = data.get("module_id")
        duration_in_min = data.get("duration_in_min")
        date = datetime.datetime.now()

        learnTime = Learntime(module_id=module_id, duration_in_min=duration_in_min, date=date, owner_id=identity)
        manager.create_learn_time(learnTime=learnTime)

        return jsonify(), 200
    except:
        return jsonify({"error": "Fehler beim Erstellen der Lernzeit"}), 500
    
# Liefert alle Module, die der User hat
@timer_bp.route("/timer_get_modules", methods=["GET"])
@jwt_required()
def get_modules():
    try:
        identity = get_jwt_identity()

        student = StudentManager(current_app.mongo.db)._get_by_dict({"student_id": identity})
        if not student:
            return jsonify({"error": "Student nicht gefunden"}), 404

        curricula_manager = CurriculaManager(current_app.mongo.db)
        curriculum = curricula_manager.get_by_version(student.study_id)

        if not curriculum:
                    return jsonify({"error": "Curriculum nicht gefunden"}), 404
        
        modules = list(
            ModuleManager(current_app.mongo.db)
            ._collection
            .find({"module_id": {"$in": curriculum.modules_ids}})
        )

        for module in modules:
            # TODO: Kurse iterieren und ects summieren
            module["ects"] = 5
            print(module)

        for module in modules:
            # TODO: Kurse iterieren und ects summieren
            module["ects"] = 5
            print(module)

        
        timeTableManager = TimeTableManager(current_app.mongo.db)
    
        activeModules = timeTableManager.get_active_modules(identity)

        for module in activeModules:
            # TODO: Kurse iterieren und ects summieren
            module["ects"] = 5
            print(module)

        print({"active_modules": activeModules, "all_modules": modules})

        return jsonify({"active_modules": activeModules, "all_modules": modules}), 200
    except:
        return jsonify({"error": "Fehler beim Erstellen der Lernzeit"}), 500 