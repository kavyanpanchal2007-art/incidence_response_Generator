import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Community from "./pages/Community";
import Generator from "./pages/Generator";
import Auth from "./pages/Auth";
import Saved from "./pages/Saved";
import "./styles/theme.css";
import "./App.css";

const pages = {
  generator: "Generator",
  community: "Community",
  saved: "Saved",
  auth: "Login / Register",
};

function App() {
  const [currentPage, setCurrentPage] =
    useState("generator");

  const [sharedPlaybook, setSharedPlaybook] =
    useState(null);

  const [currentPlaybook, setCurrentPlaybook] =
    useState(null);

  const handleSharePlaybook = (playbook) => {
    setSharedPlaybook(playbook);
    setCurrentPage("community");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "generator":
        return (
          <Generator
            onSharePlaybook={
              handleSharePlaybook
            }
            playbook={currentPlaybook}
            setPlaybook={
              setCurrentPlaybook
            }
          />
        );

      case "community":
        return (
          <Community
            sharedPlaybook={
              sharedPlaybook
            }
          />
        );

      case "saved":
        return (
          <Saved
            onSharePlaybook={
              handleSharePlaybook
            }
          />
        );

      case "auth":
        return (
          <Auth
            onNavigate={
              setCurrentPage
            }
          />
        );

      default:
        return <h1>Page Not Found</h1>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        currentPage={currentPage}
        pages={pages}
        onNavigate={setCurrentPage}
      />

      <div className="dashboard__main">
        <Navbar />

        <main className="dashboard__content">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;