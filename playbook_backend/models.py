from typing import List, Optional
from pydantic import BaseModel, Field


class User(BaseModel):
    username: str
    password: str


class Post(BaseModel):
    attack_name: str
    title: str
    content: str
    rating: int = 0


class Playbook(BaseModel):
    attack_title: str
    severity: str

    incident_summary: Optional[str] = None
    estimated_impact: Optional[str] = None
    threat_actor_likelihood: Optional[str] = None

    priority_actions: List[str] = Field(default_factory=list)

    detection: List[str] = Field(default_factory=list)
    containment: List[str] = Field(default_factory=list)
    eradication: List[str] = Field(default_factory=list)
    recovery: List[str] = Field(default_factory=list)
    communication: List[str] = Field(default_factory=list)
    lessons_learned: List[str] = Field(default_factory=list)

    recommended_tools: List[str] = Field(default_factory=list)
    mitre_techniques: List[str] = Field(default_factory=list)


class PlaybookRequest(BaseModel):
    attack_type: str
    severity: str

    industry: Optional[str] = ""
    company_size: Optional[str] = ""
    affected_systems: Optional[str] = ""
    detection_source: Optional[str] = ""
    incident_details: Optional[str] = ""

    indicators: List[str] = Field(default_factory=list)
    business_impact: List[str] = Field(default_factory=list)
    compliance_requirements: List[str] = Field(default_factory=list)