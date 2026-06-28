
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PlaybookCard from "../components/PlaybookCard";
import { generatePlaybook, savePlaybook, downloadPDF } from "../services/api";
import "../styles/generator.css";

const attackTypes = ["Phishing", "Ransomware", "Malware", "Insider Threat", "DDoS", "Data Breach", "Privilege Escalation"];
const severities = ["Low", "Medium", "High", "Critical"];
const industries = ["Healthcare", "Finance", "Education", "Government", "Retail", "Technology"];
const companySizes = ["Small", "Medium", "Enterprise"];
const detectionSources = ["EDR Alert", "SIEM", "Antivirus", "Email Report", "User Report"];
const indicatorOptions = ["Encrypted Files", "Suspicious PowerShell", "Lateral Movement", "Unknown Executable", "Credential Theft", "Ransom Note", "Abnormal Login"];
const impactOptions = ["Email Outage", "Production Downtime", "Data Exposure", "Database Unavailable", "Customer Impact"];
const complianceOptions = ["HIPAA", "GDPR", "PCI-DSS", "ISO 27001"];

function Generator({ onSharePlaybook, playbook, setPlaybook }) {
  const [attackType, setAttackType] = useState("Phishing");
  const [severity, setSeverity] = useState("Low");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [affectedSystems, setAffectedSystems] = useState("");
  const [detectionSource, setDetectionSource] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [businessImpact, setBusinessImpact] = useState([]);
  const [complianceRequirements, setComplianceRequirements] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const toggleCheckbox = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const extractErrorMessage = (err, defaultMessage) => {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return "API Validation Error. Check console.";
    if (typeof detail === "object") return JSON.stringify(detail);
    return defaultMessage;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPlaybook(null);
    setIsGenerating(true);

    try {
      const response = await generatePlaybook({
        attack_type: attackType,
        severity,
        industry,
        company_size: companySize,
        affected_systems: affectedSystems,
        detection_source: detectionSource,
        indicators,
        business_impact: businessImpact,
        compliance_requirements: complianceRequirements,
        incident_details: incidentDetails,
      });
      setPlaybook(response.data);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to generate playbook."));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlaybook = async () => {
    const user = getCurrentUser();
    if (!user) {
      setError("Please login from the sidebar to save playbooks.");
      return;
    }
    setIsSaving(true);
    try {
      await savePlaybook({ username: user.username, playbook });
      setSuccess("Playbook saved successfully.");
      setError("");
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save playbook."));
      setSuccess("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      setError("");

      const response = await downloadPDF(playbook);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "incident_playbook.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      setError("Unable to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="generator">
      <div className="generator__hero">
        <h1>Generate Playbook.</h1>
        <p>Generate personalized, MITRE-aligned incident response playbooks tailored to your environment and attack scenario.</p>
      </div>

      <form className="generator__form" onSubmit={handleGenerate}>
        
        {/* CARD 1: Incident Parameters */}
        <div className="form-card">
          <h3 className="form-card__title">1. Incident Classification</h3>
          <div className="form-grid">
            <label>
              Attack Type
              <select value={attackType} onChange={(e) => setAttackType(e.target.value)}>
                {attackTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
            </label>

            <label>
              Severity
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {severities.map((level) => (<option key={level} value={level}>{level}</option>))}
              </select>
            </label>

            <label>
              Industry
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="">Select Industry</option>
                {industries.map((item) => (<option key={item} value={item}>{item}</option>))}
              </select>
            </label>

            <label>
              Company Size
              <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                <option value="">Select Size</option>
                {companySizes.map((item) => (<option key={item} value={item}>{item}</option>))}
              </select>
            </label>

            <label>
              Affected Systems
              <input type="text" placeholder="Windows servers, email servers..." value={affectedSystems} onChange={(e) => setAffectedSystems(e.target.value)} />
            </label>

            <label>
              Detection Source
              <select value={detectionSource} onChange={(e) => setDetectionSource(e.target.value)}>
                <option value="">Select Source</option>
                {detectionSources.map((item) => (<option key={item} value={item}>{item}</option>))}
              </select>
            </label>
          </div>
        </div>

        {/* CARD 2: Observed Indicators */}
        <div className="form-card">
          <h3 className="form-card__title">2. Observed Indicators</h3>
          <div className="checkbox-grid">
            {indicatorOptions.map((item) => (
              <label key={item} className="clickable-row">
                <input 
                  type="checkbox" 
                  checked={indicators.includes(item)} 
                  onChange={() => toggleCheckbox(item, indicators, setIndicators)} 
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* CARD 3: Business Impact */}
        <div className="form-card">
          <h3 className="form-card__title">3. Business Impact</h3>
          <div className="checkbox-grid">
            {impactOptions.map((item) => (
              <label key={item} className="clickable-row">
                <input 
                  type="checkbox" 
                  checked={businessImpact.includes(item)} 
                  onChange={() => toggleCheckbox(item, businessImpact, setBusinessImpact)} 
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* CARD 4: Compliance Requirements */}
        <div className="form-card">
          <h3 className="form-card__title">4. Compliance Requirements</h3>
          <div className="checkbox-grid">
            {complianceOptions.map((item) => (
              <label key={item} className="clickable-row">
                <input 
                  type="checkbox" 
                  checked={complianceRequirements.includes(item)} 
                  onChange={() => toggleCheckbox(item, complianceRequirements, setComplianceRequirements)} 
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* CARD 5: Additional Context */}
        <div className="form-card">
          <h3 className="form-card__title">5. Additional Context</h3>
          <label>
            Describe the incident in detail...
            <textarea 
              rows={5} 
              value={incidentDetails} 
              onChange={(e) => setIncidentDetails(e.target.value)} 
              placeholder="E.g., timeline, initial access point..." 
            />
          </label>
        </div>

        {/* SUBMIT PILL BUTTON */}
        <button type="submit" className="btn-primary-pill" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Personalized Playbook"}
        </button>
      </form>

      {isGenerating && <LoadingSpinner />}
      
      {error && <p className="generator__error">{error}</p>}
      {success && <p className="generator__success">{success}</p>}

      {playbook && (
        <div className="generator__result">
          <div className="generator__actions">
            <button onClick={handleSavePlaybook} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Playbook"}
            </button>
            <button onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
            <button onClick={() => onSharePlaybook(playbook)}>
              Share to Community
            </button>
          </div>
          <PlaybookCard playbook={playbook} />
        </div>
      )}
    </section>
  );
}

export default Generator;