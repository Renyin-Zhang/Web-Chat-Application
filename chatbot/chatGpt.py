from flask import Blueprint, request, jsonify
import requests

chatgpt_blueprint = Blueprint('chatgpt', __name__)


# implement chatgpt function


class GptResponse:
    def __init__(self, choices):
        self.choices = choices


class GptChoice:
    def __init__(self, text):
        self.text = text


# chatgpt sending : [{role: "user/assistance/system", content: "string of messages"}},
# {...},{...}] role: user is user, system is system, assistance is gpt. The content of user and system can be defined
# by yourself, and the content of assistance is the answer of gpt
@chatgpt_blueprint.route('/chatgptturbo', methods=['POST'])
def chatgptturbo():
    data = request.get_json()
    url = "https://api.openai.com/v1/chat/completions"
    api_key = "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"

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {api_key}"
    }

    body = {
        "model": "gpt-3.5-turbo",
        "messages": data,
        "max_tokens": 1999
    }

    response = requests.post(url, headers=headers, json=body)

    # handle response
    if response.status_code == 200:
        # get chatgpt answer
        rsp_raw = response.json()
        resp = rsp_raw['choices'][0]['message']

        return jsonify({'name': resp['role'], 'text': resp['content']})

    else:
        raise RuntimeError(f"Failed to get completion: {response.status_code}")
