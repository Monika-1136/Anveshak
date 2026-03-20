import statistics

def detect_anomalies(data_list):
    anomalies = []
    
    if not data_list:
        return anomalies
    
    # Cross-file pattern analysis
    all_ips = []
    all_ports = []
    all_timestamps = []
    
    for data in data_list:
        if isinstance(data, list):
            for entry in data:
                if isinstance(entry, dict):
                    if 'source' in entry:
                        all_ips.append(entry['source'])
                    if 'port' in entry:
                        all_ports.append(entry['port'])
    
    # Find IPs that appear in multiple files (potential propagation)
    ip_frequency = {}
    for ip in all_ips:
        ip_frequency[ip] = ip_frequency.get(ip, 0) + 1
    
    for ip, count in ip_frequency.items():
        if count > 3:
            anomalies.append({
                'type': 'cross_file_anomaly',
                'description': f'IP {ip} appears {count} times across files - possible malware propagation',
                'severity': 'CRITICAL',
                'risk_score': 85
            })
    
    return anomalies