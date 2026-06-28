import { useState } from "react";
import { login, register } from "../services/api";
import "../styles/theme.css";

function Auth({ onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Attempt to login first
      const res = await login({ username, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      onNavigate("generator");
    } catch (err) {
      // 2. If user is not found (404), register them automatically
      if (err.response?.status === 404) {
        try {
          await register({ username, password });
          // Now that they are registered, log them in
          const loginRes = await login({ username, password });
          localStorage.setItem("user", JSON.stringify(loginRes.data));
          onNavigate("generator");
        } catch (regErr) {
          setError(regErr.response?.data?.detail || "Registration failed.");
        }
      } else {
        // 3. Otherwise, it's a wrong password (401) or another error
        setError(err.response?.data?.detail || "Authentication failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Welcome</h2>
      <p style={{ marginBottom: "1.5rem" }}>
        Enter your details. If you don't have an account, we will create one for you automatically!
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          maxLength={50}
          onChange={(e) =>
          setPassword(e.target.value)
          }
          required
        />
        <button type="submit" disabled={isLoading} style={{ padding: "10px" }}>
          {isLoading ? "Please wait..." : "Continue"}
        </button>
      </form>
      
      {error && <p style={{ color: "var(--danger-color, red)", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default Auth;