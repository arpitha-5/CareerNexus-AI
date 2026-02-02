"""
PDF Report Generator for Career Analysis
Generates comprehensive career reports with analysis and recommendations
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import io
from io import BytesIO

def generate_career_pdf(data):
    """
    Generate a comprehensive career report PDF
    
    Args:
        data: Dictionary containing:
            - name, email, cgpa
            - primary_career, confidence
            - readiness_score
            - skills, interests
    
    Returns:
        PDF bytes
    """
    
    # Create PDF buffer
    pdf_buffer = BytesIO()
    
    # Create document
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    # Container for PDF elements
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#4F46E5'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=10,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=8
    )
    
    # ==========================================
    # HEADER SECTION
    # ==========================================
    elements.append(Paragraph("CareerNexus AI", title_style))
    elements.append(Paragraph("Professional Career Guidance Report", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Report info
    report_date = datetime.now().strftime("%B %d, %Y")
    info_data = [
        ['Student Name:', data.get('name', 'N/A')],
        ['Email:', data.get('email', 'N/A')],
        ['Report Date:', report_date],
        ['CGPA:', f"{data.get('cgpa', 0)}/10"]
    ]
    
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F3F4F6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB'))
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ==========================================
    # CAREER PREDICTION SECTION
    # ==========================================
    elements.append(Paragraph("🎯 Career Prediction", heading_style))
    
    primary_career = data.get('primary_career', 'N/A')
    confidence = data.get('confidence', 0)
    
    prediction_text = f"""
    Based on comprehensive analysis of your skills, interests, and academic performance,
    <b>{primary_career}</b> is identified as your most suitable career path with 
    <b>{confidence}%</b> confidence.
    <br/><br/>
    This prediction is based on:
    <br/>• Your technical skill proficiency levels
    <br/>• Your career interest alignment
    <br/>• Your academic performance (CGPA)
    <br/>• Correlation with industry requirements
    """
    elements.append(Paragraph(prediction_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # READINESS SCORE SECTION
    # ==========================================
    elements.append(Paragraph("📊 Career Readiness Score", heading_style))
    
    readiness_score = data.get('readiness_score', 0)
    readiness_text = f"""
    Your Career Readiness Score is <b>{readiness_score}/100</b>
    <br/><br/>
    <b>Score Interpretation:</b>
    <br/>• 0-40: Needs Improvement - Focus on skill development
    <br/>• 40-70: On Track - Good foundation, refine your expertise
    <br/>• 70-100: Career Ready - You're well-prepared for the job market
    <br/><br/>
    Your current status: <b>{"Career Ready ✓" if readiness_score >= 70 else ("On Track" if readiness_score >= 40 else "Needs Improvement")}</b>
    <br/><br/>
    The readiness score is calculated using:
    <br/>• Skills Match (40%) - How well your skills align with career
    <br/>• Academic Performance (30%) - Your CGPA and academic foundation
    <br/>• Interest Alignment (30%) - Your interest in career-specific areas
    """
    elements.append(Paragraph(readiness_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # SKILLS ANALYSIS SECTION
    # ==========================================
    elements.append(Paragraph("💻 Skills Analysis", heading_style))
    
    skills = data.get('skills', {})
    if skills:
        skills_data = [['Skill', 'Proficiency Level', 'Status']]
        
        skill_mappings = {
            'Python': 'Core Programming',
            'Java': 'Core Programming',
            'SQL': 'Database',
            'ML': 'AI/ML',
            'Communication': 'Soft Skills',
            'ProblemSolving': 'Soft Skills'
        }
        
        for skill, level in skills.items():
            status = "Strong" if level >= 4 else ("Good" if level >= 3 else "Developing")
            skills_data.append([skill, f"{level}/5", status])
        
        skills_table = Table(skills_data, colWidths=[2.5*inch, 2*inch, 2*inch])
        skills_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9F5FF')])
        ]))
        elements.append(skills_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # CAREER INTERESTS SECTION
    # ==========================================
    elements.append(Paragraph("🎯 Career Interests Profile", heading_style))
    
    interests = data.get('interests', {})
    if interests:
        interests_text = "<b>Your career interest distribution:</b><br/><br/>"
        
        interest_labels = {
            'Data_Interest': 'Data & Analytics',
            'Development_Interest': 'Software Development',
            'Management_Interest': 'Management & Leadership',
            'Research_Interest': 'Research & Innovation',
            'Design_Interest': 'Design & UX'
        }
        
        for key, label in interest_labels.items():
            value = interests.get(key, 0)
            interests_text += f"• {label}: {value}/100<br/>"
        
        elements.append(Paragraph(interests_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # PAGE BREAK
    # ==========================================
    elements.append(PageBreak())
    
    # ==========================================
    # 6-MONTH ACTION PLAN
    # ==========================================
    elements.append(Paragraph("📅 6-Month Career Action Plan", heading_style))
    
    roadmap_text = f"""
    <b>Phase 1 (Month 1-2): Foundation Building</b><br/>
    • Identify skill gaps specific to {primary_career}<br/>
    • Complete foundational online courses<br/>
    • Join relevant professional communities<br/>
    • Build first practice project<br/>
    <br/>
    
    <b>Phase 2 (Month 2-4): Skill Development</b><br/>
    • Deepen expertise in key technical skills<br/>
    • Build 2-3 portfolio projects<br/>
    • Gain practical experience through internships<br/>
    • Network with professionals in the field<br/>
    <br/>
    
    <b>Phase 3 (Month 4-6): Market Preparation</b><br/>
    • Polish your portfolio and GitHub profile<br/>
    • Prepare for technical interviews<br/>
    • Apply to relevant job positions<br/>
    • Continue networking and skill refinement<br/>
    <br/>
    
    <b>Success Metrics:</b><br/>
    • Complete 3+ portfolio projects<br/>
    • Contribute to open-source projects<br/>
    • Achieve 2+ internship/freelance experiences<br/>
    • Improve readiness score to 75+<br/>
    • Get interviews with target companies<br/>
    """
    
    elements.append(Paragraph(roadmap_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # KEY RECOMMENDATIONS
    # ==========================================
    elements.append(Paragraph("💡 Key Recommendations", heading_style))
    
    recommendations = f"""
    <b>1. Skill Development Priority:</b><br/>
    Focus on strengthening skills most relevant to {primary_career}. 
    Allocate 50% of learning time to technical skills and 50% to practical projects.<br/>
    <br/>
    
    <b>2. Project Portfolio:</b><br/>
    Build 2-3 significant projects that directly demonstrate expertise in your target career. 
    Showcase them on GitHub and your portfolio website.<br/>
    <br/>
    
    <b>3. Practical Experience:</b><br/>
    Pursue internships or freelance projects in {primary_career}. 
    Real-world experience is crucial for career transition.<br/>
    <br/>
    
    <b>4. Continuous Learning:</b><br/>
    Stay updated with industry trends through blogs, podcasts, and conferences. 
    Allocate 5-10 hours weekly for learning.<br/>
    <br/>
    
    <b>5. Networking:</b><br/>
    Connect with professionals in {primary_career} through LinkedIn, meetups, and online communities. 
    Mentorship can accelerate your growth.<br/>
    """
    
    elements.append(Paragraph(recommendations, body_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # ==========================================
    # FOOTER
    # ==========================================
    footer_text = f"""
    <i>Report generated by CareerNexus AI | {report_date}<br/>
    This report is based on machine learning analysis and should be considered as guidance, 
    not career advice. Consult with a career counselor for personalized guidance.</i>
    """
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_CENTER,
        textColor=colors.grey
    )
    elements.append(Paragraph(footer_text, footer_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get PDF bytes
    pdf_buffer.seek(0)
    return pdf_buffer.getvalue()
