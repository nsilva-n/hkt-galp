"use client";

import LoginLayout from "../../login/layout";
import CreateAccountForm from "../CreateAccountForm";

export default function CreateAccountPage() {
  return (
    <LoginLayout>
      <div className="container">
        <h1>{t('campaignname')} 🏃</h1>
        <CreateAccountForm />

        <style jsx>{`
          .container {
            background: white;
            padding: 3rem 2.5rem;
            border-radius: 16px;
            box-shadow: 0 15px 40px rgba(227, 29, 36, 0.3);
            width: 360px;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          h1 {
            color: #e31d24;
            margin-bottom: 2rem;
            font-weight: 700;
            font-size: 2rem;
          }
        `}</style>
      </div>
    </LoginLayout>
  );
}
