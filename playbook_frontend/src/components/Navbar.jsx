import "../styles/navbar.css";

function Navbar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">Incident Response Generator</div>

      <div className="navbar__user">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span>Guest User</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
