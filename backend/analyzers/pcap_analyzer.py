import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.gemini_analyzer import analyze_with_gemini

def analyze_pcap(filepath):
    """
    Analyzes a PCAP file for security threats using the Gemini API.

    Args:
        filepath (str): The path to the PCAP file.

    Returns:
        list: A list of dictionaries containing the analysis results.
    """
    try:
        with open(filepath, 'rb') as f:
            pcap_content = f.read().decode('utf-8', errors='ignore')
        
        return analyze_with_gemini(pcap_content)
            
    except Exception as e:
        return [{"error": f"An error occurred: {str(e)}"}]
