import datetime
from turtle import title
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.managers import LearnTimeManager

timer_bp = Blueprint('timer', __name__, url_prefix='/')
from flask import jsonify


@timer_bp.route("/timer_recent", methods=["GET"])
@jwt_required()
def get_recent_times():
    manager = LearnTimeManager(current_app.mongo.db)

    identity = get_jwt_identity()

    # TODO: die letzten Lernzeiten vom User holen

    return jsonify(), 200

@timer_bp.route("/timer_add", methods=["POST"])
@jwt_required()
def create_time():
    # TODO: Zeit speichern

    return jsonify(), 200