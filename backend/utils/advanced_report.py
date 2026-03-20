import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
from datetime import datetime
import json

def create_risk_distribution_chart(analysis_data, filepath):
    """
    Create visualization of risk distribution
    """
    all_anomalies = []
    
    for file_info in analysis_data.get('files_analyzed', []):
        all_anomalies.extend(file_info.get('anomalies', []))
    
    risk_scores = [
        a.get("risk_score", 0) for a in all_anomalies if isinstance(a, dict)
    ]
    
    if not risk_scores:
        return None
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Forensic Analysis Dashboard', fontsize=16, fontweight='bold')
    
    # Risk Score Distribution
    axes[0, 0].hist(risk_scores, bins=20, color='#d9534f', alpha=0.7)
    axes[0, 0].set_title('Risk Score Distribution')
    axes[0, 0].set_xlabel('Risk Score (%)')
    axes[0, 0].set_ylabel('Frequency')
    
    # Severity Breakdown
    severities = {}
    for anom in all_anomalies:
        sev = anom.get('severity', 'UNKNOWN')
        severities[sev] = severities.get(sev, 0) + 1
    
    axes[0, 1].pie(
        severities.values(),
        labels=severities.keys(),
        autopct='%1.1f%%',
        colors=['#d9534f', '#f0ad4e', '#5cb85c']
    )
    axes[0, 1].set_title('Severity Breakdown')
    
    # High Risk Items
    high_risk = [a for a in all_anomalies if a.get('risk_score', 0) > 70]
    axes[1, 0].barh(
        range(min(5, len(high_risk))),
        [a.get('risk_score', 0) for a in high_risk[:5]],
        color='#d9534f'
    )
    axes[1, 0].set_title('Top 5 High Risk Items')
    axes[1, 0].set_xlabel('Risk Score (%)')
    
    # Timeline of anomalies
    axes[1, 1].text(
        0.5, 0.5,
        f'Total Anomalies: {len(all_anomalies)}\n'
        f'Files Analyzed: {len(analysis_data.get("files_analyzed", []))}\n'
        f'Average Risk: {sum(risk_scores)/len(risk_scores):.1f}%\n'
        f'Max Risk: {max(risk_scores):.1f}%',
        ha='center', va='center',
        fontsize=12,
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5)
    )
    axes[1, 1].axis('off')
    
    plt.tight_layout()
    plt.savefig(filepath, dpi=150, bbox_inches='tight')
    plt.close()
    
    return filepath

def generate_executive_summary(analysis_data):
    """
    Create a non-technical summary for executives
    """
    all_anomalies = []
    for file_info in analysis_data.get('files_analyzed', []):
        all_anomalies.extend(file_info.get('anomalies', []))
    
    critical = len([a for a in all_anomalies if a.get('severity') == 'CRITICAL'])
    high = len([a for a in all_anomalies if a.get('severity') == 'HIGH'])
    medium = len([a for a in all_anomalies if a.get('severity') == 'MEDIUM'])
    
    avg_risk = sum([a.get('risk_score', 0) for a in all_anomalies]) / len(all_anomalies) if all_anomalies else 0
    
    if critical > 0:
        overall_status = '🚨 CRITICAL - Immediate action required'
    elif high > 3:
        overall_status = '⚠️ HIGH - Urgent investigation needed'
    elif high > 0:
        overall_status = '⚠️ MEDIUM - Investigation recommended'
    else:
        overall_status = '✅ LOW - No immediate threats detected'
    
    summary = f"""
EXECUTIVE SUMMARY
{'='*60}

Overall Status: {overall_status}

KEY FINDINGS:
  • Critical Issues: {critical}
  • High Severity: {high}
  • Medium Severity: {medium}
  • Average Risk Level: {avg_risk:.1f}%

RECOMMENDATION:
{get_recommendation(critical, high, medium)}

{'='*60}
    """
    
    return summary

def get_recommendation(critical, high, medium):
    if critical > 0:
        return """
  1. IMMEDIATE: Isolate affected systems from network
  2. Begin incident response procedures
  3. Engage cybersecurity team or external consultants
  4. Preserve all evidence for forensic analysis
  5. Document all findings for legal/compliance purposes
        """
    elif high > 3:
        return """
  1. Conduct thorough forensic investigation
  2. Review system logs and access controls
  3. Consider partial system isolation if needed
  4. Plan security improvements
        """
    else:
        return """
  1. Continue regular security monitoring
  2. Review findings with security team
  3. Update security policies as needed
  4. Schedule follow-up analysis in 30 days
        """
