import requests
import time

VIRUSTOTAL_API_KEY = 'YOUR_API_KEY_HERE'  # Get free from virustotal.com
ABUSEIPDB_API_KEY = 'YOUR_API_KEY_HERE'   # Get free from abuseipdb.com

def check_ip_reputation(ip_address):
    """
    Check IP against threat databases
    """
    threat_score = 0
    sources = []
    
    # Check AbuseIPDB (free tier available)
    try:
        url = 'https://api.abuseipdb.com/api/v2/check'
        headers = {
            'Key': ABUSEIPDB_API_KEY,
            'Accept': 'application/json'
        }
        params = {
            'ipAddress': ip_address,
            'maxAgeInDays': 90
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['data']['abuseConfidenceScore'] > 50:
                threat_score += 30
                sources.append('AbuseIPDB')
    except:
        pass
    
    # Local reputation database (can be updated)
    known_malicious_ips = [
        '192.168.1.100',
        '10.0.0.50',
        '172.16.0.1'
    ]
    
    if ip_address in known_malicious_ips:
        threat_score += 50
        sources.append('Local_DB')
    
    return {
        'ip': ip_address,
        'threat_score': threat_score,
        'is_malicious': threat_score >= 50,
        'sources': sources
    }

def check_domain_reputation(domain):
    """
    Check domain against threat databases
    """
    threat_score = 0
    
    # Known malicious domains
    malicious_domains = [
        'malware.com',
        'phishing-site.net',
        'c2-server.ru'
    ]
    
    if domain.lower() in malicious_domains:
        threat_score += 70
    
    return {
        'domain': domain,
        'threat_score': threat_score,
        'is_malicious': threat_score >= 50
    }

def check_file_hash(file_hash):
    """
    Check file hash against VirusTotal
    """
    # Placeholder - requires API key
    return {
        'hash': file_hash,
        'threat_score': 0,
        'is_malicious': False
    }