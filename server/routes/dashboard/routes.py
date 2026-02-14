from flask import Blueprint, current_app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from db.managers import LearnTimeManager

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/')
from flask import jsonify

@dashboard_bp.route("/statistics", methods=["GET"])
@jwt_required()
def get_info():
    lt_m = LearnTimeManager(current_app.mongo.db)
    identity = get_jwt_identity()
    res = lt_m.get_statistics(identity)

    return jsonify(res), 200

