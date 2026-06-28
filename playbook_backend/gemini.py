import json
import os
import re

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_playbook(data):
    prompt = f"""
You are a senior SOC analyst and incident response expert.

Generate a highly personalized cybersecurity incident response playbook.

Attack Type:
{data.attack_type}

Severity:
{data.severity}

Industry:
{data.industry or "Not specified"}

Company Size:
{data.company_size or "Not specified"}

Affected Systems:
{data.affected_systems or "Not specified"}

Detection Source:
{data.detection_source or "Not specified"}

Indicators:
{", ".join(data.indicators) if data.indicators else "Not specified"}

Business Impact:
{", ".join(data.business_impact) if data.business_impact else "Not specified"}

Compliance Requirements:
{", ".join(data.compliance_requirements) if data.compliance_requirements else "Not specified"}

Additional Incident Details:
{data.incident_details or "Not specified"}

Instructions:

1. Generate a highly personalized incident response playbook.
2. Avoid generic responses.
3. Adapt recommendations according to:
   - industry
   - company size
   - business impact
   - affected systems
   - severity
4. Include MITRE ATT&CK techniques.
5. Include recommended tools.
6. Mention regulatory requirements when applicable.

Return ONLY valid JSON.

{{
  "attack_title": "",
  "incident_summary": "",
  "severity": "",
  "priority_actions": [],
  "detection": [],
  "containment": [],
  "eradication": [],
  "recovery": [],
  "communication": [],
  "lessons_learned": [],
  "recommended_tools": [],
  "mitre_techniques": [],
  "estimated_impact": "",
  "threat_actor_likelihood": ""
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.9,
            ),
        )
        
        # Clean up any potential markdown wrapping the AI might include
        raw_text = response.text
        raw_text = re.sub(r'```json\n|\n```|```', '', raw_text).strip()
        
        return json.loads(raw_text)

    except Exception:
        return {
            "attack_title": data.attack_type,
            "incident_summary": "Unable to generate playbook due to an error.",
            "severity": data.severity,
            "priority_actions": [],
            "detection": [],
            "containment": [],
            "eradication": [],
            "recovery": [],
            "communication": [],
            "lessons_learned": [],
            "recommended_tools": [],
            "mitre_techniques": [],
            "estimated_impact": "",
            "threat_actor_likelihood": "",
        }