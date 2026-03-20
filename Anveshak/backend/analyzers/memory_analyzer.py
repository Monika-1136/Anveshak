import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.gemini_analyzer import analyze_with_gemini

def analyze_memory_dump(filepath):
    """
    Analyzes a memory dump file for security threats using the Gemini API.

    Args:
        filepath (str): The path to the memory dump file.

    Returns:
        list: A list of dictionaries containing the analysis results.
    """
    try:
        with open(filepath, 'rb') as f:
            memory_content = f.read().decode('utf-8', errors='ignore')
        
        return analyze_with_gemini(memory_content)
            
    except Exception as e:
        return [{"error": f"An error occurred: {str(e)}"}]
