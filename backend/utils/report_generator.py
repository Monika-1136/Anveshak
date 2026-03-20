from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_report(analysis_data, format_type='txt'):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    if format_type == 'pdf':
        return generate_pdf_report(analysis_data, timestamp)
    else:
        return generate_txt_report(analysis_data, timestamp)

def generate_txt_report(analysis_data, timestamp):
    filename = f'forensic_report_{timestamp}.txt'
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("COMPREHENSIVE FORENSIC EVIDENCE ANALYSIS REPORT\n")
        f.write("=" * 80 + "\n\n")

        # Executive Summary
        f.write("EXECUTIVE SUMMARY\n")
        f.write("-" * 80 + "\n")
        f.write(analysis_data.get('executive_summary', 'No summary available'))
        f.write("\n\n")

        # Detailed Findings from AI
        f.write("AI-POWERED DETAILED FINDINGS\n")
        f.write("-" * 80 + "\n")
        for finding in analysis_data.get('detailed_findings', []):
            f.write(f"  Anomaly: {finding.get('anomaly', 'N/A')}\n")
            f.write(f"  Risk: {finding.get('risk', 'N/A')}\n")
            f.write(f"  Recommendation: {finding.get('recommendation', 'N/A')}\n\n")

        # Threat Intelligence Insights from AI
        f.write("AI-POWERED THREAT INTELLIGENCE INSIGHTS\n")
        f.write("-" * 80 + "\n")
        f.write(analysis_data.get('threat_intelligence_insights', 'No insights available'))
        f.write("\n\n")

        # Incident Response Recommendations from AI
        f.write("AI-POWERED INCIDENT RESPONSE RECOMMENDATIONS\n")
        f.write("-" * 80 + "\n")
        for rec in analysis_data.get('incident_response_recommendations', []):
            f.write(f"  - {rec}\n")
        f.write("\n\n")

        f.write("=" * 80 + "\n")
        f.write("END OF REPORT\n")
        f.write("=" * 80 + "\n")
    
    return filename

def generate_pdf_report(analysis_data, timestamp):
    filename = f'forensic_report_{timestamp}.pdf'
    doc = SimpleDocTemplate(filename, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()

    # Custom Styles
    title_style = ParagraphStyle('CustomTitle', parent=styles['h1'], fontSize=22, textColor=colors.HexColor('#2c3e50'), alignment=1, spaceAfter=20)
    h2_style = ParagraphStyle('CustomH2', parent=styles['h2'], fontSize=16, textColor=colors.HexColor('#34495e'), spaceBefore=20, spaceAfter=10)
    body_style = styles['BodyText']

    # Title
    story.append(Paragraph("Comprehensive Forensic Evidence Analysis Report", title_style))

    # Executive Summary
    story.append(Paragraph("Executive Summary", h2_style))
    story.append(Paragraph(analysis_data.get('executive_summary', 'No summary available').replace('\n', '<br/>'), body_style))
    story.append(Spacer(1, 0.2 * inch))

    # Detailed Findings
    story.append(Paragraph("AI-Powered Detailed Findings", h2_style))
    for finding in analysis_data.get('detailed_findings', []):
        finding_text = f"<b>Anomaly:</b> {finding.get('anomaly', 'N/A')}<br/><b>Risk:</b> {finding.get('risk', 'N/A')}<br/><b>Recommendation:</b> {finding.get('recommendation', 'N/A')}"
        story.append(Paragraph(finding_text, body_style))
        story.append(Spacer(1, 0.1 * inch))
    story.append(Spacer(1, 0.2 * inch))

    # Threat Intelligence Insights
    story.append(Paragraph("AI-Powered Threat Intelligence Insights", h2_style))
    story.append(Paragraph(analysis_data.get('threat_intelligence_insights', 'No insights available').replace('\n', '<br/>'), body_style))
    story.append(Spacer(1, 0.2 * inch))

    # Incident Response Recommendations
    story.append(Paragraph("AI-Powered Incident Response Recommendations", h2_style))
    for rec in analysis_data.get('incident_response_recommendations', []):
        story.append(Paragraph(f"- {rec}", body_style))
    story.append(Spacer(1, 0.2 * inch))

    doc.build(story)
    return filename