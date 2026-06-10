from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

team_members = [
    {
        "name": "Turkan",
        "contribution": "Designed and structured the Hero Section.",
        "initial": "T"
    },
    {
        "name": "Ferid",
        "contribution": "Implemented project cards and project section.",
        "initial": "F"
    },
    {
        "name": "Celal",
        "contribution": "Built the navbar and managed Git workflow.",
        "initial": "C"
    },
    {
        "name": "Nasiba",
        "contribution": "Enhanced styling and visual consistency.",
        "initial": "N"
    },
    {
        "name": "Ziya",
        "contribution": "Handled footer integration and testing.",
        "initial": "Z"
    }
]

@app.route("/api/team", methods=["GET"])
def get_team():
    return jsonify(team_members)

if __name__ == "__main__":
    app.run(debug=True)