from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__, static_folder='.', template_folder='.')

# Fallback basic logic mapping dictionary
INTENT_RESPONSES = {
    "hello": "Hello! I am NexusAI. How can I help you optimize your web layouts today?",
    "hi": "Hi there! Looking to build or refactor something clean today?",
    "help": "I can help you review CSS rules, build component architectures, or debug Javascript loops.",
    "status": "All systems operational. Latency: 12ms. Core Engine v2.4.1 online."
}

@app.route('/')
def home():
    # Serves our index.html file from the exact same directory
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def handle_chat_message():
    try:
        # Strict validation of incoming content type headers
        if not request.is_json:
            return jsonify({"error": "Unsupported Media Type. Request body must be JSON."}), 415
            
        data = request.get_json()
        user_prompt = data.get('message', '').strip()
        
        if not user_prompt:
            return jsonify({"error": "Message parameter field cannot be empty."}), 400
            
        # Parse intent keys or assign fallback string text 
        lookup_key = user_prompt.lower().strip("?!.,")
        bot_reply = INTENT_RESPONSES.get(
            lookup_key, 
            f"Received: '{user_prompt}'. Backend link is operational! Connect an OpenAI or Anthropic API key here to generate dynamic intelligent responses."
        )
        
        return jsonify({
            "status": "success",
            "reply": bot_reply
        }), 200

    except Exception as error_context:
        return jsonify({
            "status": "error",
            "message": f"Internal server exception encountered: {str(error_context)}"
        }), 500

if __name__ == '__main__':
    # Runs a local loop accessible at http://127.0.0.1:5000
    app.run(debug=True, port=5000)
