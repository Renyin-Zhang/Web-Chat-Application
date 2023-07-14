import datetime

from flask import Blueprint, request, jsonify
from sqlalchemy import desc, func
from models.history import History
from models import db

history_blueprint = Blueprint('history', __name__)


# getter and setter for history
@history_blueprint.route('/history/get', methods=['POST'])
def getHistory():
    data = request.get_json()
    username = data.get('username', '')
    type = data.get('type', '')
    input = data.get('input', '').replace(' ', '')

    history = History.query.filter_by(username=username, type=type).order_by(History.time).all()
    history_dicts = [h.to_dict() for h in history]
    result = history_dicts

    # if input is not empty, highlight the input
    if input != '':
        for h_dict in history_dicts:
            h_dict['content'] = h_dict['content'].replace(input, '<span style="background:yellow">' + input + '</span>')
        result = history_dicts
    return jsonify({'code': 200, 'name': "getHistory", 'text': result})


# get the list of history count
@history_blueprint.route('/history/list', methods=['POST'])
def HistoryList():
    data = request.get_json()
    username = data.get('username', '')

    list = History.query(History.type, func.count(History.type)).filter(History.username == username).group_by(
        History.type).all()
    return jsonify({'code': 200, 'name': "HistoryList", 'text': list})


# setter for history
@history_blueprint.route('/history/set', methods=['POST'])
def setHistory():
    data = request.get_json()
    username = data.get('username', '')
    type = data.get('type', '')
    role = data.get('role', '')
    content = data.get('content', '')

    new_history = History(username=username, type=type, role=role, content=content, time=datetime.datetime.utcnow())
    db.session.add(new_history)
    db.session.commit()
    return jsonify({'code': 200, 'name': "setHistory", 'text': "success"})
