import datetime
from random import randint
from bson import ObjectId

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.collections.events import Event
from db.collections.timetable import TimeTable, Timetable
from db.managers import (
    CurriculaManager,
    EventManager,
    StudentManager,
    TimeTableManager,
)

timetable_bp = Blueprint("timetable", __name__, url_prefix="/timetable")
from flask import jsonify


@timetable_bp.route("/get_by_curricula", methods=["GET"])
@jwt_required()
def get_all_modules():
    identity = get_jwt_identity()
    student = StudentManager(current_app.mongo.db)._get_by_dict(
        {"student_id": identity}
    )
    if not student:
        return jsonify(), 500

    curricula = CurriculaManager(current_app.mongo.db).get_by_version(student.study_id)

    res = [
        {"name": m["course"]["course_name"], "id": m["event_id"]}
        for m in EventManager(current_app.mongo.db).get_events_curricula(curricula)
    ]
    print(res)
    return jsonify(res), 200


@timetable_bp.route("/get_all", methods=["GET"])
@jwt_required()
def get():
    identity = get_jwt_identity()
    res = TimeTableManager(current_app.mongo.db).get_all_timetable(identity)
    return jsonify(res), 200


@timetable_bp.route("/set_active", methods=["POST"])
@jwt_required()
def set_active():
    identity = get_jwt_identity()
    manager = TimeTableManager(current_app.mongo.db)
    manager.update_one({"active": True, "owner_id": identity}, {"active": False})
    manager.update_by_id(ObjectId(request.get_json()), {"active": True})

    return jsonify(), 200


@timetable_bp.route("/get_active", methods=["GET"])
@jwt_required()
def get_active():
    identity = get_jwt_identity()
    manager = TimeTableManager(current_app.mongo.db)
    res = manager.get_active_events(identity)
    if not res:
        return jsonify("empty"), 200

    return jsonify(res), 200


def current_semester():
    now = datetime.datetime.now()
    year = now.year
    month = now.month

    if 4 <= month <= 9:
        # Sommersemester
        return f"SS{year % 100:02d}"
    else:
        # Wintersemester
        if month >= 10:
            ws_year = year
        else:
            ws_year = year - 1
        return f"WS{ws_year % 100:02d}"


@timetable_bp.route("/create_timetable", methods=["POST"])
@jwt_required()
def create_timetable():
    identity = get_jwt_identity()
    manager = TimeTableManager(current_app.mongo.db)

    active = True
    if len(list(manager._collection.find({"owner_id": identity}))) != 0:
        active = False

    obj = request.get_json()
    if "module_ids" in obj:
        tt = TimeTable(
            name=obj["name"],
            semester=current_semester(),
            owner_id=identity,
            event_ids=obj["module_ids"],
            active=active,
        )
        manager._create(tt)

    elif "name" in obj:
        student = StudentManager(current_app.mongo.db)._get_by_dict(
            {"student_id": identity}
        )
        curricula = CurriculaManager(current_app.mongo.db)._get_by_dict(
            {"programm_version": student.study_id}
        )
        events = EventManager(current_app.mongo.db).get_open_events(curricula, identity)
        name = obj["name"]

        for event in events:
            event.pop("course")

        res = Timetable.get_max_conflict_free_timetables(
            [Event.from_dict(e) for e in events]
        )
        tt = TimeTable(
            name=name,
            semester=current_semester(),
            owner_id=identity,
            event_ids=[e.event_id for e in res[randint(0, len(res) - 1)].get_events()],
            active=active,
        )
        manager._create(tt)

    return jsonify(), 200
