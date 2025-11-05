from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://projektrankdev.gordlby.at"}})
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
