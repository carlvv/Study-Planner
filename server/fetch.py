from flask import Flask, render_template_string

app = Flask(__name__)

# HTML template for the welcome page
WELCOME_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .welcome-container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p {
            color: #666;
            font-size: 1.2rem;
            line-height: 1.6;
        }
        .emoji {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="welcome-container">
        <div class="emoji">👋</div>
        <h1>Welcome!</h1>
        <p>This is a simple Flask server with a basic welcome page.</p>
        <p>Your Flask application is running successfully!</p>
    </div>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(WELCOME_TEMPLATE)

@app.route('/api/status')
def status():
    return {'status': 'ok', 'message': 'Server is running'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
