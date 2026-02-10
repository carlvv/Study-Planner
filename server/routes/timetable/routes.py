import datetime
from math import fabs
from turtle import title
from bson import ObjectId
from discord import Object
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from numpy import identity

from db.collections import student
from db.collections.timetable import TimeTable
from db.managers import (
    CurriculaManager,
    EventManager,
    LearnTimeManager,
    ModuleManager,
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
    manager = TimeTableManager(current_app.mongo.db)
    return jsonify(list(manager._collection.find({"owner_id": identity}))), 200


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
    return jsonify(manager.get_active_events(identity)), 200

# TODO
def current_semester():
    return "WS25"


@timetable_bp.route("/create_timetable", methods=["POST"])
@jwt_required()
def create_timetable():
    identity = get_jwt_identity()
    manager = TimeTableManager(current_app.mongo.db)

    active = True
    if len(list(manager._collection.find({"owner_id": identity}))) != 0:
        active = False
    obj = request.get_json()
    tt = TimeTable(
        name=obj["name"],
        semester=current_semester(),
        owner_id=identity,
        event_ids=obj["module_ids"],
        active=active,
    )
    manager._create(tt)
    return jsonify(), 200
