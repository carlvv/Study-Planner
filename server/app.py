from flask import Flask
from flask_jwt_extended import JWTManager
import os

from flask_cors import CORS
from flask_pymongo import PyMongo


def create_app():
    app = Flask(__name__)
    # app.config['JWT_SECRET_KEY'] = secrets.token_hex(32) 
    app.config['JWT_SECRET_KEY'] = "dev-secret-key-change-me"
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/db") 

    jwt = JWTManager(app)
    app.mongo = PyMongo(app)

        
    from routes.auth.routes import auth_bp
    from routes.main.routes import main_bp
    from routes.curricula.routes import curricula_bp
    from routes.todo.routes import todo_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(curricula_bp)
    app.register_blueprint(todo_bp)

    CORS(app, origins=["http://localhost:5173","http://192.168.0.153:5173" ])

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0" , port=5000, debug=True)
