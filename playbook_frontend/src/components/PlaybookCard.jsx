import { useState } from "react";

const sections = [
  ["detection", "Detection"],
  ["containment", "Containment"],
  ["eradication", "Eradication"],
  ["recovery", "Recovery"],
  ["communication", "Communication"],
  ["lessons_learned", "Lessons Learned"],
  ["mitre_techniques", "MITRE Techniques"],
];

function PlaybookCard({ playbook }) {
  const [openSections, setOpenSections] = useState({
    detection: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionKey]: !currentSections[sectionKey],
    }));
  };

  if (!playbook) {
    return null;
  }

  const renderItem = (item) => {
    // Simple string
    if (typeof item === "string") {
      return item;
    }

    // Object returned by Gemini
    if (typeof item === "object" && item !== null) {
      return (
        <div>
          {item.step && (
            <p>
              <strong>Step:</strong> {item.step}
            </p>
          )}

          {item.details && (
            <p>
              <strong>Details:</strong> {item.details}
            </p>
          )}

          {item.tools?.length > 0 && (
            <p>
              <strong>Tools:</strong>{" "}
              {item.tools.join(", ")}
            </p>
          )}

          {item.mitre_techniques?.length > 0 && (
            <p>
              <strong>MITRE:</strong>{" "}
              {item.mitre_techniques.join(", ")}
            </p>
          )}
        </div>
      );
    }

    return String(item);
  };

  return (
    <article className="playbook-card">
      <header className="playbook-card__header">
        <div>
          <p className="playbook-card__eyebrow">
            Incident Playbook
          </p>
          <h2>{playbook.attack_title}</h2>
        </div>

        <span className="playbook-card__severity">
          {playbook.severity}
        </span>
      </header>

      <div className="playbook-card__sections">
        {sections.map(([sectionKey, sectionLabel]) => (
          <section
            className="playbook-card__section"
            key={sectionKey}
          >
            <button
              className="playbook-card__section-header"
              type="button"
              onClick={() =>
                toggleSection(sectionKey)
              }
            >
              <span>{sectionLabel}</span>
              <span>
                {openSections[sectionKey]
                  ? "-"
                  : "+"}
              </span>
            </button>

            {openSections[sectionKey] && (
              <div className="playbook-card__section-body">
                {Array.isArray(
                  playbook[sectionKey]
                ) ? (
                  <ul>
                    {playbook[sectionKey].map(
                      (item, index) => (
                        <li
                          key={`${sectionKey}-${index}`}
                        >
                          {renderItem(item)}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    {playbook[sectionKey] ||
                      "No data available"}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

export default PlaybookCard;