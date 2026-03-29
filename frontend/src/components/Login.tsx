import { useState } from "react";
import { apiLoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = await apiLoginRequest(username, password);

    if (data) {
      navigate("/admin");
    } else {
      setError("Hibás felhasználónév vagy jelszó");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={formSubmitted}>
        <h2 className="login-title">Admin Login</h2>

        {error && <div className="login-error">{error}</div>}

        <label className="login-label">Felhasználónév</label>
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="login-label">Jelszó</label>
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" type="submit">
          Belépés
        </button>
      </form>
    </div>
  );
}