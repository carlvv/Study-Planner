from flask import Flask
from flask_jwt_extended import JWTManager
import secrets
from routes.auth.routes import auth_bp
from routes.main.routes import main_bp
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(32) 
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)

CORS(app, origins=["http://localhost:5173"])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
