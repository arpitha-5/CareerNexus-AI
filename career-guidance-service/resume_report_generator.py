"""
Resume Report PDF Generator Module
===================================
Generates professional PDF reports for resume analysis.
Uses reportlab library for PDF creation.

Author: CareerNexus AI
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime
from typing import Dict

def generate_resume_analysis_report(analysis_data: Dict) -> bytes:
    """
    Generate a comprehensive PDF report for resume analysis.
    
    Args:
        analysis_data: Dictionary containing all analysis results
        
    Returns:
        PDF file as bytes
    """
    # Create PDF buffer
    buffer = BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Container for PDF elements
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a56db'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = styles['BodyText']
    normal_style.fontSize = 11
    normal_style.spaceAfter = 6
    
    # ============================================
    # TITLE PAGE
    # ============================================
    
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph("Resume Analysis Report", title_style))
    elements.append(Paragraph("CareerNexus AI", styles['Heading3']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # Report info
    report_date = datetime.now().strftime("%B %d, %Y")
    elements.append(Paragraph(f"<b>Generated:</b> {report_date}", normal_style))
    elements.append(Paragraph(f"<b>Analysis ID:</b> {analysis_data.get('analysis_id', 'N/A')}", normal_style))
    
    elements.append(Spacer(1, 0.5 * inch))
    
    # ============================================
    # EXECUTIVE SUMMARY
    # ============================================
    
    elements.append(Paragraph("Executive Summary", heading_style))
    
    overall_score = analysis_data.get('overall_score', 0)
    ats_status = analysis_data.get('ats_status', 'Unknown')
    
    summary_text = f"""
    Your resume has been analyzed using our AI-powered ATS (Applicant Tracking System) compatibility checker.
    <br/><br/>
    <b>Overall Resume Score: {overall_score}/100</b><br/>
    <b>ATS Status: {ats_status}</b><br/>
    <br/>
    This report provides detailed feedback on your resume's strengths, areas for improvement, and career role compatibility.
    """
    elements.append(Paragraph(summary_text, normal_style))
    elements.append(Spacer(1, 0.3 * inch))
    
    # ============================================
    # RESUME SCORE BREAKDOWN
    # ============================================
    
    elements.append(Paragraph("Score Breakdown", heading_style))
    
    breakdown = analysis_data.get('breakdown', {})
    
    # Create breakdown table
    breakdown_data = [
        ['Category', 'Score', 'Weight', 'Contribution'],
        ['Skill Relevance', f"{breakdown.get('skill_relevance', {}).get('score', 0)}/100", 
         f"{breakdown.get('skill_relevance', {}).get('weight', 40)}%",
         f"{breakdown.get('skill_relevance', {}).get('contribution', 0)}"],
        ['Keywords & ATS', f"{breakdown.get('keywords_ats', {}).get('score', 0)}/100",
         f"{breakdown.get('keywords_ats', {}).get('weight', 30)}%",
         f"{breakdown.get('keywords_ats', {}).get('contribution', 0)}"],
        ['Projects & Experience', f"{breakdown.get('projects_experience', {}).get('score', 0)}/100",
         f"{breakdown.get('projects_experience', {}).get('weight', 20)}%",
         f"{breakdown.get('projects_experience', {}).get('contribution', 0)}"],
        ['Structure & Format', f"{breakdown.get('structure', {}).get('score', 0)}/100",
         f"{breakdown.get('structure', {}).get('weight', 10)}%",
         f"{breakdown.get('structure', {}).get('contribution', 0)}"],
    ]
    
    breakdown_table = Table(breakdown_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1.2*inch])
    breakdown_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f3f4f6')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(breakdown_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # ============================================
    # CAREER ROLE MATCHING
    # ============================================
    
    elements.append(Paragraph("Career Role Matching", heading_style))
    
    primary_role = analysis_data.get('primary_career', {})
    role_name = primary_role.get('role', 'Unknown')
    match_percentage = primary_role.get('match_percentage', 0)
    confidence = primary_role.get('confidence', 'Unknown')
    
    career_text = f"""
    <b>Primary Career Role: {role_name}</b><br/>
    Match Percentage: {match_percentage}%<br/>
    Confidence Level: {confidence}<br/>
    <br/>
    {primary_role.get('confidence_message', '')}
    """
    elements.append(Paragraph(career_text, normal_style))
    
    # Alternate roles
    alternate_roles = analysis_data.get('alternate_roles', [])
    if alternate_roles:
        alt_text = "<b>Alternate Career Paths:</b><br/>" + "<br/>".join([f"• {role}" for role in alternate_roles])
        elements.append(Paragraph(alt_text, normal_style))
    
    elements.append(Spacer(1, 0.3 * inch))
    
    # ============================================
    # SKILLS ANALYSIS
    # ============================================
    
    elements.append(Paragraph("Skills Analysis", heading_style))
    
    skills_found = analysis_data.get('skills', [])
    skills_count = len(skills_found)
    
    elements.append(Paragraph(f"<b>Total Skills Found: {skills_count}</b>", normal_style))
    
    if skills_found:
        # Display skills in a nice format (3 columns)
        skills_text = ", ".join(skills_found[:20])  # Limit to first 20 skills
        if len(skills_found) > 20:
            skills_text += f" ... and {len(skills_found) - 20} more"
        elements.append(Paragraph(f"<i>{skills_text}</i>", normal_style))
    
    elements.append(Spacer(1, 0.2 * inch))
    
    # ============================================
    # SKILL GAP ANALYSIS
    # ============================================
    
    skill_gap = analysis_data.get('skill_gap', {})
    
    if skill_gap:
        elements.append(Paragraph("Skill Gap Analysis", heading_style))
        
        matched_skills = skill_gap.get('matched_skills', [])
        missing_critical = skill_gap.get('missing_critical', [])
        missing_nice_to_have = skill_gap.get('missing_nice_to_have', [])
        strength_areas = skill_gap.get('strength_areas', [])
        
        # Strengths
        if strength_areas:
            elements.append(Paragraph("<b>Your Strengths:</b>", normal_style))
            for strength in strength_areas:
                elements.append(Paragraph(f"✓ {strength}", normal_style))
            elements.append(Spacer(1, 0.1 * inch))
        
        # Critical missing skills
        if missing_critical:
            elements.append(Paragraph("<b>Critical Skills to Learn:</b>", normal_style))
            for skill in missing_critical[:10]:  # Top 10
                elements.append(Paragraph(f"• {skill}", normal_style))
            elements.append(Spacer(1, 0.1 * inch))
        
        # Nice-to-have skills
        if missing_nice_to_have:
            elements.append(Paragraph("<b>Nice-to-Have Skills:</b>", normal_style))
            for skill in missing_nice_to_have[:5]:  # Top 5
                elements.append(Paragraph(f"• {skill}", normal_style))
    
    elements.append(Spacer(1, 0.3 * inch))
    
    # ============================================
    # IMPROVEMENT SUGGESTIONS
    # ============================================
    
    elements.append(Paragraph("Improvement Suggestions", heading_style))
    
    suggestions = analysis_data.get('improvement_suggestions', [])
    
    if suggestions:
        for i, suggestion in enumerate(suggestions, 1):
            elements.append(Paragraph(f"<b>{i}.</b> {suggestion}", normal_style))
    else:
        elements.append(Paragraph("Your resume is excellent! Keep it updated with new skills and experiences.", normal_style))
    
    elements.append(Spacer(1, 0.3 * inch))
    
    # ============================================
    # RECOMMENDATIONS
    # ============================================
    
    elements.append(Paragraph("Next Steps", heading_style))
    
    next_steps = [
        "Focus on the critical missing skills identified in this report",
        "Build projects to demonstrate your existing and new skills",
        "Update your resume with action-oriented language and quantifiable achievements",
        "Tailor your resume for specific job descriptions",
        "Get feedback from industry professionals in your target role"
    ]
    
    for step in next_steps:
        elements.append(Paragraph(f"• {step}", normal_style))
    
    elements.append(Spacer(1, 0.5 * inch))
    
    # ============================================
    # FOOTER
    # ============================================
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph("─────────────────────────────────", footer_style))
    elements.append(Paragraph("Generated by CareerNexus AI - Your Career Guidance Platform", footer_style))
    elements.append(Paragraph("For more career guidance, visit our platform", footer_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
