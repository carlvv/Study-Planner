import datetime
from turtle import title
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from numpy import identity

from db.collections.todo import Todo
from db.managers import LearnTimeManager, ModuleManager, TodoManager

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/')
from flask import jsonify

@dashboard_bp.route("/statistics", methods=["GET"])
@jwt_required()
def get_info():
    lt_m = LearnTimeManager(current_app.mongo.db)
    identity = get_jwt_identity()
    res = lt_m.get_statistics(identity)

    return jsonify(res), 200

