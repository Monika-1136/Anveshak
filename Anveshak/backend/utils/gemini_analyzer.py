import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def analyze_with_gemini(file_content):
    """
    Analyzes the given file content using the Google Gemini API.

    Args:
        file_content (str): The content of the file to analyze.

    Returns:
        list: A list of dictionaries representing the analysis results.
    """
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
Analyze the following file content for security threats, anomalies, and potential IOCs.
Return the results as a JSON array of objects, where each object has the following keys:
'risk_score' (0-100), 'severity' ('LOW', 'MEDIUM', 'HIGH'), and 'description'.

Example:
[
  {{
    "risk_score": 85,
    "severity": "HIGH",
    "description": "Detected a suspicious PowerShell command."
  }}
]

Content:
{file_content}
"""
        
        response = model.generate_content(prompt)
        
        # Clean the response to ensure it's valid JSON
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        
        return json.loads(cleaned_response)
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Error decoding Gemini response: {e}")
        return [{"error": "Invalid JSON response from Gemini API"}]
    except Exception as e:
        print(f"An error occurred during Gemini analysis: {e}")
        return [{"error": str(e)}]

def get_gemini_analysis(analysis_results):
    """
    Generates a comprehensive analysis summary using the Gemini API.

    Args:
        analysis_results (dict): The collected analysis results.

    Returns:
        dict: A dictionary containing the Gemini analysis summary.
    """
    try:
        prompt = f"Based on the following analysis results, provide a comprehensive summary of the security incident, including potential attack vectors, MITRE ATT&CK tactics, and recommended remediation steps:\n\n{json.dumps(analysis_results, indent=2)}"
        
        summary = analyze_with_gemini(prompt)
        
        if summary:
            return {"gemini_summary": summary}
        else:
            return {"gemini_summary": "Failed to generate summary with Gemini API."}
            
    except Exception as e:
        return {"gemini_summary": f"An error occurred during Gemini summary generation: {str(e)}"}
