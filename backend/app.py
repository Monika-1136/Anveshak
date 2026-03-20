from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import base64
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from analyzers.log_analyzer import analyze_logs
from analyzers.pcap_analyzer import analyze_pcap
from analyzers.email_analyzer import analyze_emails
from analyzers.cloud_analyzer import analyze_cloud_logs
from analyzers.memory_analyzer import analyze_memory_dump
from analyzers.bat_analyzer import analyze_bat_file
from utils.anomaly_detector import detect_anomalies
from utils.report_generator import generate_report
from utils.ml_anomaly_detector import ml_anomaly_detection, pattern_correlation
from utils.threat_intel import check_ip_reputation
from utils.advanced_report import create_risk_distribution_chart
from utils.ollama_analyzer import get_ollama_analysis, get_forensai_reply
import hashlib

# ------------------------------------------------------------
# Flask App Configuration
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ANALYSIS_RESULTS_FOLDER'] = 'analysis_results'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max

ALLOWED_EXTENSIONS = {'log', 'pcap', 'eml', 'txt', 'json', 'csv', 'mem', 'bin', 'img', 'bat', 'dd', 'E01', 'xml', 'gz', 'zip', 'tar'}

# Create necessary folders
for folder in [app.config['UPLOAD_FOLDER'], app.config['ANALYSIS_RESULTS_FOLDER']]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# ------------------------------------------------------------
# Utility Functions
# ------------------------------------------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_file_hash(filepath):
    """Calculate SHA256 hash of file"""
    sha256_hash = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def route_analysis(filepath, file_ext, filename):
    """Route to appropriate analyzer based on file extension"""
    try:
        anomalies = []
        
        # Route to specific analyzers
        if file_ext == 'log' or file_ext == 'txt':
            anomalies = analyze_logs(filepath)
        elif file_ext == 'pcap':
            anomalies = analyze_pcap(filepath)
        elif file_ext == 'eml':
            anomalies = analyze_emails(filepath)
        elif file_ext == 'json' and 'cloud' in filename.lower():
            anomalies = analyze_cloud_logs(filepath)
        elif file_ext in ['json', 'csv']:
            anomalies = analyze_cloud_logs(filepath)
        elif file_ext in ['mem', 'bin', 'dd', 'img']:
            anomalies = analyze_memory_dump(filepath)
        elif file_ext == 'bat':
            anomalies = analyze_bat_file(filepath)
        else:
            # Generic analysis for other file types
            anomalies = [{
                'severity': 'INFO',
                'description': f'File {filename} uploaded successfully. Awaiting specific analyzer.',
                'timestamp': datetime.now().isoformat()
            }]
        
        # Calculate risk score based on anomalies
        high_severity = sum(1 for a in anomalies if isinstance(a, dict) and a.get('severity') == 'HIGH')
        medium_severity = sum(1 for a in anomalies if isinstance(a, dict) and a.get('severity') == 'MEDIUM')
        
        score = min(100, 20 + (high_severity * 25) + (medium_severity * 10))
        details = f"Analysis complete for {filename}. Found {len(anomalies)} potential issues."
        
        return {
            'filename': filename,
            'score': score,
            'details': details,
            'type': file_ext,
            'anomalies': anomalies,
            'total_anomalies': len(anomalies),
            'high_severity_count': high_severity,
            'medium_severity_count': medium_severity
        }
    except Exception as e:
        print(f"Error analyzing {filename}: {str(e)}")
        return {
            'filename': filename,
            'score': 0,
            'details': f'Error during analysis: {str(e)}',
            'type': file_ext,
            'anomalies': [],
            'error': str(e)
        }

def check_threat_intel(analysis_results):
    """Check IPs and domains against threat intelligence"""
    threat_intel_results = []
    checked_ips = set()

    for file_info in analysis_results.get('files_analyzed', []):
        for anom in file_info.get('anomalies', []):
            if 'source' in anom and anom['source'] not in checked_ips:
                ip_result = check_ip_reputation(anom['source'])
                if ip_result.get('is_malicious'):
                    threat_intel_results.append({
                        'type': 'malicious_ip',
                        'details': ip_result,
                        'severity': 'CRITICAL'
                    })
                checked_ips.add(anom['source'])

    return threat_intel_results

# ------------------------------------------------------------
# Core Evidence Intake Routes
# ------------------------------------------------------------
@app.route('/upload', methods=['POST'])
def upload_evidence_files():
    """Main upload endpoint with advanced AI analysis"""
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files part in the request'}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No selected files'}), 400

        analysis_files = []
        results_summary = []
        files_analyzed = []
        
        # Process each file
        for file in files:
            if file and allowed_file(file.filename):
                original_filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
                file.save(filepath)

                # Perform analysis
                file_hash = calculate_file_hash(filepath)
                file_ext = original_filename.rsplit('.', 1)[1].lower()
                analysis_content = route_analysis(filepath, file_ext, original_filename)
                
                # Add metadata
                analysis_content.update({
                    'hash': file_hash,
                    'size': os.path.getsize(filepath),
                    'upload_timestamp': datetime.now().isoformat(),
                    'chain_of_custody_status': 'Intake Complete'
                })

                files_analyzed.append(analysis_content)
                
                # Save individual analysis result
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                base_filename, _ = os.path.splitext(original_filename)
                result_filename = f"{base_filename}_{timestamp}.json"
                result_filepath = os.path.join(app.config['ANALYSIS_RESULTS_FOLDER'], result_filename)
                
                with open(result_filepath, 'w') as f:
                    json.dump(analysis_content, f, indent=4)
                
                analysis_files.append(result_filename)
                results_summary.append({
                    'filename': original_filename,
                    'analysis_file': result_filename,
                    'score': analysis_content.get('score', 0),
                    'anomalies_found': len(analysis_content.get('anomalies', []))
                })

        # Build comprehensive analysis object
        comprehensive_analysis = {
            'timestamp': datetime.now().isoformat(),
            'files_analyzed': files_analyzed,
            'anomalies': [],
            'suspicious_entries': [],
            'infection_indicators': [],
            'ml_insights': [],
            'threat_intel': []
        }

        # Apply ML-based anomaly detection
        try:
            comprehensive_analysis = ml_anomaly_detection(comprehensive_analysis)
        except Exception as e:
            print(f"ML anomaly detection error: {str(e)}")

        # Cross-file pattern correlation
        try:
            all_data = [f['anomalies'] for f in comprehensive_analysis['files_analyzed']]
            correlations = pattern_correlation(all_data)
            comprehensive_analysis['ml_insights'] = correlations
        except Exception as e:
            print(f"Pattern correlation error: {str(e)}")

        # Threat intelligence
        try:
            comprehensive_analysis['threat_intel'] = check_threat_intel(comprehensive_analysis)
        except Exception as e:
            print(f"Threat intel error: {str(e)}")

        # Generate risk chart
        try:
            charts_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'charts')
            if not os.path.exists(charts_dir):
                os.makedirs(charts_dir)

            chart_filename = f"chart_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            chart_fullpath = os.path.join(charts_dir, chart_filename)
            chart_path = create_risk_distribution_chart(comprehensive_analysis, chart_fullpath)
            
            if chart_path and os.path.exists(chart_path):
                with open(chart_path, 'rb') as cf:
                    encoded = base64.b64encode(cf.read()).decode('utf-8')
                comprehensive_analysis['chart_base64'] = f"data:image/png;base64,{encoded}"
                comprehensive_analysis['chart_filename'] = chart_filename
        except Exception as e:
            print(f"Chart generation error: {str(e)}")
            comprehensive_analysis['chart_base64'] = None
            comprehensive_analysis['chart_filename'] = None

        # Get AI-powered analysis from Ollama
        try:
            ollama_insights = get_ollama_analysis(comprehensive_analysis)
            if isinstance(ollama_insights, dict):
                comprehensive_analysis.update(ollama_insights)
        except Exception as e:
            print(f"Ollama analysis error: {str(e)}")
            comprehensive_analysis['ai_analysis_error'] = f'Ollama analysis failed: {e}'

        # Return combined response with both formats
        return jsonify({
            'status': 'success',
            'message': f'Successfully analyzed {len(analysis_files)} file(s)',
            'analysis_files': analysis_files,
            'results_summary': results_summary,
            'comprehensive_analysis': comprehensive_analysis
        }), 200
    
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analysis/list', methods=['GET'])
def list_analysis_files():
    """List all analysis result files"""
    results_dir = app.config['ANALYSIS_RESULTS_FOLDER']
    try:
        files = [f for f in os.listdir(results_dir) if f.endswith('.json')]
        files.sort(key=lambda x: os.path.getmtime(os.path.join(results_dir, x)), reverse=True)
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analysis/<filename>', methods=['GET'])
def get_analysis_file(filename):
    """Get specific analysis file"""
    results_dir = app.config['ANALYSIS_RESULTS_FOLDER']
    safe_filename = secure_filename(filename)
    filepath = os.path.join(results_dir, safe_filename)

    if os.path.exists(filepath):
        return send_file(filepath, mimetype='application/json')
    else:
        return jsonify({'error': 'File not found'}), 404

# ------------------------------------------------------------
# Report and Chat Routes
# ------------------------------------------------------------
@app.route('/generate-report', methods=['POST'])
def generate_report_endpoint():
    """Generate forensic report (TXT or PDF)"""
    data = request.json
    report_format = data.get('format', 'txt')
    filename = generate_report(data, report_format)
    return send_file(filename, as_attachment=True)

@app.route('/forensai/chat', methods=['POST'])
def forensai_chat():
    """AI chat endpoint for forensic analysis queries"""
    data = request.json or {}
    message = data.get('message')
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    reply = get_forensai_reply(message)
    return jsonify(reply)

# ------------------------------------------------------------
# Health Check
# ------------------------------------------------------------
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'ISDF20 Forensics Backend is running'}), 200

# ------------------------------------------------------------
# Run App
# ------------------------------------------------------------
if __name__ == '__main__':
    print("Starting ISDF20 Forensics Backend with AI Analysis on http://127.0.0.1:5000")
    app.run(debug=True, port=5000, host='127.0.0.1')