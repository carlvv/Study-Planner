from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from db.managers import StudentManager

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Initialisiere den Mangers
user_manager =  StudentManager()

# Login-Route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    student_id = data.get("student_id")
    password = data.get("password")

    is_authenticated = user_manager.verify_user(student_id, password)

    if not is_authenticated:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=student_id)
    return jsonify(access_token=access_token), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    student_id = data.get("student_id")
    password = data.get("password")
    name = data.get("name")
    study_id = data.get("study_id")
    start_semester = data.get("start_semester")

    if user_manager.user_exists(student_id):
        return jsonify({"msg": "User already exists"}), 409

    user_manager.create_user(
        student_id=student_id,
        password=password,
        name=name,
        study_id=study_id,
        start_semester=start_semester
    )

    return jsonify({"msg": "User created successfully"}), 201