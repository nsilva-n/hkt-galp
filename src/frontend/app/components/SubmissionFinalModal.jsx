import React, { useState, useEffect } from "react";
import "./submission/submission-modal.css";

export default function SubmissionFinalModal({ mealsDonated = 5, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function shareActivity() {
    if (navigator.share) {
      navigator
        .share({
          title: "Eu acabei de doar refeições!",
          text: `Eu acabei de doar ${mealsDonated} refeições ao ser ativo! Junte-se a mim!`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("O compartilhamento não é suportado no seu navegador.");
    }
  }

  function handleClose() {
    if (onClose) onClose();
  }

  return (
    <div
      className="submission-modal submission-final-modal"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className="submission-modal__backdrop" />
      <main
        className={`submission-modal__content ${mounted ? "mounted" : ""}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Mensagem de parabéns"
      >
        <h1 className="submission-modal__title">Obrigado pelo seu contributo!</h1>

        <p className="submission-modal__text">
          Você acaba de doar <strong>{mealsDonated.toLocaleString()}</strong>{" "}
          refeições!
        </p>

        <p className="submission-modal__text">
          No total, você já doou{" "}
          <strong>{(20 + mealsDonated).toLocaleString()}</strong> refeições.
        </p>

        <p className="submission-modal__text">
          A Fundação Galp agradece o seu apoio e solidariedade.
        </p>

        <div className="submission-modal__buttons">
          <button
            onClick={shareActivity}
            variant="primary"
            className="space-x-2"
            aria-label="Compartilhar atividade"
          >
            <span>📢 Partilhar</span>
          </button>

          <button
            onClick={handleClose}
            variant="red"
            className="space-x-2"
            aria-label="Fechar modal"
          >

            <span>Fechar</span>
          </button>
        </div>
      </main>
    </div>
  );
}
