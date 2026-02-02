from flask import Blueprint, current_app, jsonify
from flask_jwt_extended import jwt_required
from db.managers import CurriculaManager

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
        key = cur.get("is_bachelor")
        name = cur.get("programm_name")
        version = cur.get("programm_version")

        if key is not None and name and version:
            grouped[key].append({
                "name": name,
                "version": version
            })

    return jsonify(grouped)
