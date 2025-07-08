"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os Termos e Condições.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setError("");
    setSuccessMessage(`Conta criada! Por favor, verifique o seu email: ${formData.email}`);

    setFormData({
      username: "",
      email: "",
      password: "",
      acceptTerms: false,
    });

    setTimeout(() => {
    router.push("/dashboard");
    }, 1000);

  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <button
        type="button"
        aria-label="Voltar para a página anterior"
        onClick={() => router.push("/welcome")}
        className="back-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <input
        type="text"
        name="username"
        placeholder="Nome de usuário"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="toggle-button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.93 10.93 0 0112 20c-7 0-11-8-11-8a18.33 18.33 0 014.19-5.38" />
              <path d="M1 1l22 22" />
              <path d="M9.53 9.53a3 3 0 014.24 4.24" />
            </svg>
          )}
        </button>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />
        Aceito os{" "}
        <a
        href="https://www.fundacaogalp.com/Portals/1/Documentos/Politica_Privacidade_Fundacao_Galp.pdf"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#e31d24", textDecoration: "underline" }}
        onClick={(e) => {
          e.preventDefault(); // impedir o comportamento padrão do link
          alert("Boa leitura :)");
          window.open(
            "https://www.fundacaogalp.com/Portals/1/Documentos/Politica_Privacidade_Fundacao_Galp.pdf",
            "_blank",
            "noopener,noreferrer"
          );
        }}
        >
          Termos e Condições
        </a>
      </label>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <button type="submit" className="action-button">
        Começar
      </button>

      <style jsx>{`
        .form {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 3rem;
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"] {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
          color: #555;
          opacity: 1;
        }

        input:focus {
          outline: none;
          border-color: #e31d24;
          box-shadow: 0 0 0 2px rgba(227, 29, 36, 0.3);
        }

        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .toggle-button {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          transition: color 0.2s;
        }

        .toggle-button:hover {
          color: #e31d24;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: #555;
        }

        .error {
          color: #b9181c;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .success {
          color: green;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 1rem;
        }

        .action-button {
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.85rem;
          border: none;
          background-color: #e31d24;
          color: white;
          box-shadow: 0 6px 15px rgba(227, 29, 36, 0.5);
          transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.2s ease;
        }

        .action-button:hover,
        .action-button:focus {
          background-color: #b9181c;
          box-shadow: 0 8px 20px rgba(185, 24, 28, 0.7);
          transform: scale(1.03);
          outline: none;
        }

        .back-button {
          position: absolute;
          top: -12rem;
          left: -2.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #e31d24;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          z-index: 10;
        }

        .back-button:hover {
          color: #b9181c;
        }
      `}</style>
    </form>
  );
}
