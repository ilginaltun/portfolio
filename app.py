import os
import sys

# macOS OpenMP duplicate library fix
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Add parent directories to sys.path so we can import the refactored modules
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

# Import the ML functions
from urban_sound_project.crnn_prediction import predict_sound
from whisper_project.transkript import run_transcription

app = Flask(__name__, static_folder='.')
CORS(app) # Allow cross-origin requests if needed

UPLOAD_FOLDER = os.path.join(ROOT_DIR, 'temp_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/predict', methods=['POST'])
def api_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    result = predict_sound(filepath)
    
    # Optionally clean up the file
    try:
        os.remove(filepath)
    except:
        pass
        
    return jsonify(result)

@app.route('/api/transcribe', methods=['POST'])
def api_transcribe():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    result = run_transcription(filepath)
    
    # Optionally clean up the file
    try:
        os.remove(filepath)
    except:
        pass
        
    return jsonify(result)

if __name__ == '__main__':
    print("="*50)
    print("🚀 Başlatılıyor... Uygulamanız http://127.0.0.1:5000 adresinde yayında!")
    print("="*50)
    app.run(debug=True, port=5000)
