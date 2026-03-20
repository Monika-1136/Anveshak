import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json

def ml_anomaly_detection(analysis_data):
    """
    Uses Isolation Forest to detect unusual patterns
    """
    all_anomalies = []
    
    for file_info in analysis_data.get('files_analyzed', []):
        anomalies = file_info.get('anomalies', [])
        
        if len(anomalies) < 3:
            continue
        
        # Extract features from anomalies
        features = []
        for anom in anomalies:
            feature_vector = [
                anom.get('risk_score', 0),
                len(anom.get('flags', [])),
                1 if anom.get('severity') == 'HIGH' else 0,
            ]
            features.append(feature_vector)
        
        if len(features) > 2:
            X = np.array(features)
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Train Isolation Forest
            iso_forest = IsolationForest(contamination=0.1, random_state=42)
            predictions = iso_forest.fit_predict(X_scaled)
            
            # Flag anomalies detected by ML model
            for idx, pred in enumerate(predictions):
                if pred == -1:  # Outlier
                    anomalies[idx]['ml_flagged'] = True
                    anomalies[idx]['risk_score'] = min(
                        anomalies[idx]['risk_score'] + 20, 100
                    )
    
    return analysis_data

def pattern_correlation(all_files_data):
    """
    Find correlations between anomalies across files
    Detects coordinated attacks
    """
    correlations = []
    
    # Extract IPs and domains from all files
    ips = []
    timestamps = []
    
    for file_data in all_files_data:
        if isinstance(file_data, list):
            for entry in file_data:
                if isinstance(entry, dict):
                    if 'source' in entry:
                        ips.append(entry['source'])
                    if 'timestamp' in entry:
                        timestamps.append(entry['timestamp'])
    
    # Find temporal clustering
    if len(timestamps) > 5:
        timestamps_sorted = sorted(timestamps)
        for i in range(len(timestamps_sorted) - 2):
            time_gap = timestamps_sorted[i+1] - timestamps_sorted[i]
            if time_gap < 60:  # Within 1 minute
                correlations.append({
                    'type': 'temporal_clustering',
                    'description': 'Multiple anomalies detected within 1 minute - possible coordinated attack',
                    'severity': 'CRITICAL',
                    'risk_score': 90
                })
                break
    
    return correlations