from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from db.managers import StudentManager

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# Login-Route
@auth_bp.route("/login", methods=["POST"])
def login():
    user_manager =  StudentManager(current_app.mongo.db)

    data = request.get_json()
    student_id = data.get("student_id")
    password = data.get("password")

    user = user_manager.verify_user(student_id, password)
    if not user:
         return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(
        identity=student_id, 
        additional_claims={
        "name": user.name,
        "study_id": user.study_id,
        "start_semester": user.start_semester }
    )
    return jsonify(access_token=access_token), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    user_manager =  StudentManager(current_app.mongo.db)

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

@auth_bp.route("/user", methods=["GET"])
@jwt_required()
def protected():

    identity = get_jwt_identity()
    claims = get_jwt()

    return jsonify({
        "identity": identity,
        "name": claims["name"],
        "study_id": claims["study_id"],
        "start_semester": claims["start_semester"]
    }), 200