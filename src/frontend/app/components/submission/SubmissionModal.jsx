"use client";

import { useEffect } from "react";
import ActivitySubmissionFlow from "../ActivitySubmissionFlow";
import "./submission-modal.css";

export default function SubmissionModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="submission-modal">
      <div className="submission-modal__backdrop" onClick={onClose} />
      <div className="submission-modal__content">
        <ActivitySubmissionFlow onClose={onClose} />
      </div>
    </div>
  );
}