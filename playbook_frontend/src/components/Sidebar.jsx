import "../styles/sidebar.css";

function Sidebar({ currentPage, pages, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__title">Dashboard</div>

      <nav className="sidebar__nav">
        {Object.entries(pages).map(([key, label]) => (
          <button
            className={currentPage === key ? "sidebar__link active" : "sidebar__link"}
            key={key}
            type="button"
            onClick={() => onNavigate(key)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
