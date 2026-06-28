from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Spacer, Paragraph, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf(playbook):
    if hasattr(playbook, "model_dump"):
        playbook = playbook.model_dump()
    elif hasattr(playbook, "dict"):
        playbook = playbook.dict()

    buffer = BytesIO()
    # Setting standard margin for a professional layout
    document = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=54, 
        leftMargin=54,
        topMargin=54, 
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom, clean styling for normal Incident Response Playbook format
    title_style = ParagraphStyle(
        'IRTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#1a252c"),
        alignment=0, # Left-aligned
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        'IRHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#2c3e50"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True # Prevents orphan headings
    )
    
    body_style = ParagraphStyle(
        'IRBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#333333"),
        spaceAfter=4
    )
    
    bold_body_style = ParagraphStyle(
        'IRBoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    content = []

    # Title & Summary Section
    attack_title = str(playbook.get("attack_title") or "Incident Response Playbook")
    content.append(Paragraph(attack_title, title_style))
    
    severity = str(playbook.get("severity") or "Unknown")
    content.append(Paragraph(f"<b>Severity Level:</b> {severity}", body_style))
    
    summary = str(playbook.get("incident_summary") or "")
    if summary:
        content.append(Spacer(1, 8))
        content.append(Paragraph("<b>Incident Summary:</b>", heading_style))
        content.append(Paragraph(summary, body_style))
        
    content.append(Spacer(1, 10))

    # Standard Incident Response Playbook Sections
    sections = [
        ("Immediate Priority Actions", "priority_actions"),
        ("Detection & Analysis", "detection"),
        ("Containment Strategy", "containment"),
        ("Eradication Steps", "eradication"),
        ("Recovery & Validation", "recovery"),
        ("Communication & Reporting", "communication"),
        ("Recommended Tools", "recommended_tools"),
        ("MITRE ATT&CK Techniques", "mitre_techniques"),
        ("Lessons Learned", "lessons_learned")
    ]

    for display_title, key in sections:
        items = playbook.get(key, [])
        if items and (isinstance(items, list) or isinstance(items, tuple)):
            section_elements = []
            section_elements.append(Paragraph(display_title, heading_style))
            
            for item in items:
                # If the AI returns dictionaries inside the list, format them safely
                if isinstance(item, dict):
                    text_repr = " ".join([f"<b>{k.replace('_', ' ').capitalize()}:</b> {v}" for k, v in item.items()])
                    section_elements.append(Paragraph(f"• {text_repr}", body_style))
                else:
                    section_elements.append(Paragraph(f"• {str(item)}", body_style))
            
            section_elements.append(Spacer(1, 6))
            # Keep each distinct playbook section together on the page if possible
            content.append(KeepTogether(section_elements))

    document.build(content)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    return pdf_bytes