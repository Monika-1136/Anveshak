
import os
import requests
import json

# Allow overriding Ollama URL via environment variable for flexibility
OLLAMA_API_URL = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/generate')


def get_ollama_analysis(analysis_data, model: str = 'mistral'):
    """Get AI-powered analysis from Ollama.

    This function is defensive: it reads the endpoint from the OLLAMA_API_URL env var,
    uses a short timeout, and tries to handle different response shapes returned by
    various Ollama versions. When an error occurs the returned dict contains an
    "error" key with helpful diagnostic text.
    """

    prompt = (
        "As a senior digital forensics investigator, analyze the following JSON data, "
        "which contains the results of a forensic analysis of uploaded files. Provide "
        "a comprehensive report in JSON format that includes:\n"
        "1. Executive Summary: A non-technical overview of the findings, including the overall threat level and key recommendations for stakeholders.\n"
        "2. Detailed Findings: A technical breakdown of the most critical anomalies, explaining the potential risks and attack vectors.\n"
        "3. Threat Intelligence Insights: An analysis of the threat intelligence data, correlating it with the observed anomalies.\n"
        "4. Incident Response Recommendations: A prioritized list of actions for the incident response team.\n\n"
        f"Analysis Data:\n{json.dumps(analysis_data, indent=2)}\n\n"
        "Output must be valid JSON with keys: executive_summary, detailed_findings, threat_intelligence_insights, incident_response_recommendations"
    )

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, headers={"Content-Type": "application/json"}, timeout=100)
    except requests.exceptions.RequestException as e:
        return {
            "error": f"Failed to connect to Ollama at {OLLAMA_API_URL}: {e}",
            "executive_summary": "AI analysis could not be performed.",
            "detailed_findings": [],
            "threat_intelligence_insights": "",
            "incident_response_recommendations": []
        }

    # If non-2xx, include response body in error to help debugging
    if not (200 <= response.status_code < 300):
        body = None
        try:
            body = response.text
        except Exception:
            body = '<unable to read response body>'

        return {
            "error": f"Ollama returned status {response.status_code} for {OLLAMA_API_URL}: {body}",
            "executive_summary": "AI analysis could not be performed.",
            "detailed_findings": [],
            "threat_intelligence_insights": "",
            "incident_response_recommendations": []
        }

    # Try parsing JSON body. If the server streams NDJSON (many JSON objects separated by newlines),
    # assemble the pieces by iterating response.iter_lines(). This supports Ollama variants that stream
    # token/chunk responses (each line is a JSON object like {"response": "...", "done": false}).
    resp_json = None
    try:
        resp_json = response.json()
    except ValueError:
        # Try to handle NDJSON / streamed JSON lines
        collected_chunks = []
        try:
            for raw_line in response.iter_lines(decode_unicode=True):
                if not raw_line:
                    continue
                # Each line may itself be a JSON object
                try:
                    line_obj = json.loads(raw_line)
                except Exception:
                    # Not JSON on this line; skip
                    continue

                # Extract candidate text from known keys
                for k in ('response', 'output', 'text', 'result'):
                    if k in line_obj and isinstance(line_obj[k], str):
                        collected_chunks.append(line_obj[k])
                        break

            if collected_chunks:
                # Combine the pieces into one string. Many Ollama streams emit raw text chunks
                # that together form either plain text or a JSON string. Attempt to parse as JSON.
                candidate_text = ''.join(collected_chunks)
                try:
                    parsed_candidate = json.loads(candidate_text)
                    resp_json = parsed_candidate
                except Exception:
                    # Candidate wasn't valid JSON; return it in a helpful error structure
                    return {
                        "error": "Ollama returned streamed text that could not be parsed as JSON.",
                        "response_text": candidate_text,
                        "executive_summary": "AI analysis could not be performed.",
                        "detailed_findings": [],
                        "threat_intelligence_insights": "",
                        "incident_response_recommendations": []
                    }
            else:
                # No usable chunks found
                return {
                    "error": "Ollama returned non-JSON response and no streamable chunks were found.",
                    "response_text": response.text,
                    "executive_summary": "AI analysis could not be performed.",
                    "detailed_findings": [],
                    "threat_intelligence_insights": "",
                    "incident_response_recommendations": []
                }

        except Exception as e:
            return {
                "error": f"Failed to process streamed Ollama response: {e}",
                "response_text": response.text,
                "executive_summary": "AI analysis could not be performed.",
                "detailed_findings": [],
                "threat_intelligence_insights": "",
                "incident_response_recommendations": []
            }

    # Different Ollama versions may wrap model output differently.
    # Common patterns:
    #  - {'response': '<json-string>'}
    #  - {'output': '<json-string>'}
    #  - already a dict with fields we want

    # If the response is already the expected dict (has executive_summary), return it
    if isinstance(resp_json, dict) and 'executive_summary' in resp_json:
        return resp_json

    # If response contains a single field with the model output, extract it
    candidate = None
    for key in ('response', 'output', 'text', 'result'):
        if key in resp_json:
            candidate = resp_json[key]
            break

    if candidate is None:
        # Nothing recognized: return entire response to help debugging
        return {
            "error": "Ollama returned an unexpected JSON shape.",
            "response_json": resp_json,
            "executive_summary": "AI analysis could not be performed.",
            "detailed_findings": [],
            "threat_intelligence_insights": "",
            "incident_response_recommendations": []
        }

    # Candidate might be a JSON string or already a dict
    if isinstance(candidate, dict):
        return candidate

    try:
        parsed = json.loads(candidate)
        return parsed
    except Exception:
        # Not JSON inside candidate; return as text field
        return {
            "error": "Ollama returned text that could not be parsed as JSON.",
            "response_text": candidate,
            "executive_summary": "AI analysis could not be performed.",
            "detailed_findings": [],
            "threat_intelligence_insights": "",
            "incident_response_recommendations": []
        }


def get_forensai_reply(user_message: str, model: str = 'mistral') -> dict:
    """
    Query local Ollama (mistral) to produce a ForensAI chat reply focused on describing the platform.
    Returns a dict with either {'reply': '<text>'} or {'error': '<message>'}.
    """
    system_description = (
        "ForensAI is a web-based digital forensics dashboard that ingests evidence files (pcap, logs, "
        "emails, memory dumps) via an upload interface, analyzes them using built-in analyzers, applies "
        "ML-based anomaly detection, correlates cross-file patterns, and enriches findings with threat "
        "intelligence. It generates interactive visualizations, risk distribution charts, and produces "
        "forensic reports (TXT/PDF). The backend exposes endpoints for file upload (/upload) and report "
        "generation. The frontend includes modules for Evidence Intake, AI Analysis Dashboard, Chain of Custody, "
        "Timeline Reconstruction, and Threat Intelligence. ForensAI answers questions about how the platform "
        "works, recommended incident response steps, and details about analysis pipelines. Provide full, accurate, "
        "and actionable information about the platform when asked."
    )

    prompt = (
        "You are ForensAI, an assistant that only answers questions about the ForensAI web platform.\n"
        "Use the following system description when replying. Be detailed and include architecture, features, data flow, and common usage.\n\n"
        f"System description:\n{system_description}\n\n"
        f"User question:\n{user_message}\n\n"
        "Provide a detailed, helpful, and accurate response focused solely on the platform and how it works."
    )

    payload = {"model": model, "prompt": prompt, "stream": False}
    try:
        resp = requests.post(OLLAMA_API_URL, json=payload, headers={"Content-Type": "application/json"}, timeout=60)
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to connect to Ollama at {OLLAMA_API_URL}: {e}"}

    if not (200 <= resp.status_code < 300):
        return {"error": f"Ollama returned status {resp.status_code}: {resp.text}"}

    # Attempt to parse JSON; if not JSON return raw text
    try:
        data = resp.json()
    except Exception:
        return {"reply": resp.text}

    # Extract reply text from common keys
    if isinstance(data, dict):
        for k in ("response", "output", "text", "result"):
            if k in data and isinstance(data[k], str):
                return {"reply": data[k]}
        # fallback: concatenate string values
        text = "\n".join([str(v) for v in data.values() if isinstance(v, str)])
        if text:
            return {"reply": text}

    if isinstance(data, str):
        return {"reply": data}

    return {"error": "Unexpected response shape from Ollama"}
