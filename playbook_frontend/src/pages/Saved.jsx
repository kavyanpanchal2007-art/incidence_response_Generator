import { useEffect, useState } from "react";
import PlaybookCard from "../components/PlaybookCard";
import { downloadPDF, getSavedPlaybooks } from "../services/api";
import "../styles/saved.css";

function Saved({ onSharePlaybook }) {
  const [savedPlaybooks, setSavedPlaybooks] = useState([]);
  const [openPlaybookId, setOpenPlaybookId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedPlaybooks = async () => {
      const user = getCurrentUser();

      if (!user) {
        setError("Please log in to view saved playbooks.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await getSavedPlaybooks(user.username);
        setSavedPlaybooks(response.data.playbooks || []);
      } catch (apiError) {
        setError(
          apiError.response?.data?.detail ||
            "Unable to load saved playbooks. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPlaybooks();
  }, []);

  const handleOpen = (playbookId) => {
    setOpenPlaybookId((currentId) => (currentId === playbookId ? "" : playbookId));
  };

 const handleDownloadPDF = async (playbook) => {
  try {
    setError("");

    const response =
      await downloadPDF(playbook);

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "playbook.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);

    setError(
      err.response?.data?.detail ||
        "Unable to download PDF. Please try again."
    );
  }
  };

  return (
    <section className="saved">
      <div className="saved__header">
        <p className="saved__eyebrow">Saved Response Assets</p>
        <h1>Saved Playbooks</h1>
      </div>

      {error && <p className="saved__error">{error}</p>}
      {isLoading && <p className="saved__status">Loading saved playbooks...</p>}

      <div className="saved__grid">
        {savedPlaybooks.map((savedItem) => (
          <article className="saved__card" key={savedItem._id}>
            <header>
              <div>
                <h2>{savedItem.playbook.attack_title}</h2>
                <p>{savedItem.playbook.severity}</p>
              </div>
            </header>

            <div className="saved__actions">
              <button type="button" onClick={() => handleOpen(savedItem._id)}>
                {openPlaybookId === savedItem._id ? "Close" : "Open"}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPDF(savedItem.playbook)}
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => onSharePlaybook(savedItem.playbook)}
              >
                Share to Community
              </button>
            </div>

            {openPlaybookId === savedItem._id && (
              <PlaybookCard playbook={savedItem.playbook} />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function getCurrentUser() {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export default Saved;
