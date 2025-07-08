import React, { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import './step5finalpage.css';
import Button from '../ui/Button';

export default function Step5FinalPage({ mealsDonated = 5, onClose }) {
  const [mounted, setMounted] = useState(false);
  const previousMealsDonated = 20;
  const totalMealsDonated = previousMealsDonated + mealsDonated;

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
    if (onClose) onClose(); // Just close the module/modal
  }

  return (
    <div
      className={`submission-final-page${mounted ? " mounted" : ""}`}
      role="dialog"
      aria-modal="true"
      style={{ userSelect: "none" }}
    >
      <h1>Parabéns! 🎉</h1>

     <p className="meals">
        Você acaba de doar <strong style={{ color: "#e31d24" }}>{mealsDonated.toLocaleString()}</strong> refeições!
     </p>


      <p
        className="total-meals"
        style={{ color: "#222", fontSize: "1.1rem", marginTop: "0.25rem" }}
      >
        No total, você já doou <strong style={{ color: "#e31d24", fontWeight: "700" }}>{totalMealsDonated.toLocaleString()}</strong> refeições.
      </p>

      <p>
        A Fundação Galp agradece o seu apoio e solidariedade.
      </p>

      <div className="buttons">
        <Button 
          onClick={shareActivity} 
          variant="primary" 
          aria-label="Compartilhar atividade"
        >
          <Share2 className="button__icon" />
          <span>Partilhar</span>
        </Button>

        <Button 
          onClick={handleClose} 
          variant="secondary" 
          aria-label="Fechar modal"
        >
          <X className="button__icon" />
          <span>Fechar</span>
        </Button>
      </div>

      <style jsx>{`
        .submission-final-page {
          background: white;
          padding: 3rem 3rem 3rem 3rem;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(227, 29, 36, 0.3);
          width: 360px;
          max-width: 90vw;
          margin: 4rem auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          color: #111; /* darker text */
          font-size: 1.1rem; /* slightly bigger text */
        }
        .submission-final-page.mounted {
          opacity: 1;
          transform: translateY(0);
        }
        h1 {
          color: #a50e0e; /* darker red */
          font-weight: 700;
          font-size: 2.7rem; /* slightly bigger */
          margin: 0;
        }
        .meals {
          font-size: 1.6rem; /* bigger */
          color: #111; /* darker */
        }
        .total-meals {
          font-size: 1rem; /* bigger */
          color: #333; /* darker */
          margin-top: -0.3rem;
        }
        .meals strong,
        .total-meals strong {
          color: #a50e0e; /* darker red */
          font-weight: 800;
        }
        p:last-of-type {
          font-size: 1.1rem; /* slightly bigger */
          color: #222; /* darker */
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
