from flask import Flask
import os
from dotenv import load_dotenv

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)


    load_dotenv()  
    secret_key = os.getenv("JWT_SECRET")
    print(f"JWT Secret Key: {secret_key}")