import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.gemini_analyzer import analyze_with_gemini

def analyze_cloud_logs(filepath):
    """
    Analyzes a cloud log file for security threats using the Gemini API.

    Args:
        filepath (str): The path to the cloud log file.

    Returns:
        list: A list of dictionaries containing the analysis results.
    """
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            log_content = f.read()
        
        return analyze_with_gemini(log_content)
            
    except Exception as e:
        return [{"error": f"An error occurred: {str(e)}"}]
