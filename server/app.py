from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import secrets
from routes.auth.routes import auth_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(32) 
jwt = JWTManager(app)

app.register_blueprint(auth_bp)

CORS(app)
CORS(app, origins=["http://localhost:5173"])

# test für eine Session
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
