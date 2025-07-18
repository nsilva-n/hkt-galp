'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CookingPot } from "lucide-react";
import Button from "./components/ui/Button";
import "./styles/index.css";
import AuthModal from "./components/auth/AuthModal";
import SubmissionModal from "./components/submission/SubmissionModal";
import "./homepage.css"
import ReCAPTCHA from "react-google-recaptcha";
import { CAMPAIGN_CONFIG } from "./config/campaign";
import i18n from './i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [totalMeals, setTotalMeals] = useState(12345);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const eventStart = CAMPAIGN_CONFIG.startDate;
  const eventEnd = CAMPAIGN_CONFIG.endDate;
  const [timeLeft, setTimeLeft] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    const timeInterval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  function getTimeLeft() {
    const now = new Date();
    const startDiff = eventStart.getTime() - now.getTime();
    const endDiff = eventEnd.getTime() - now.getTime();

    // Before campaign starts
    if (startDiff > 0) {
      const days = Math.floor(startDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((startDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((startDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((startDiff / 1000) % 60);
      return { days, hours, minutes, seconds, status: 'before' };
    }

    // Campaign is running
    if (endDiff > 0) {
      const days = Math.floor(endDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((endDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((endDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((endDiff / 1000) % 60);
      return { days, hours, minutes, seconds, status: 'running' };
    }

    // Campaign has ended
    return { status: 'ended' };
  }

  const goalMeals = 1000000;
  const progress = (totalMeals / goalMeals) * 100;

  function handleParticipateClick() {
    setShowCaptcha(true);
  }

  function handleCaptchaChange(value) {
    if (value) {
      setCaptchaVerified(true);
      setShowCaptcha(false);
      setShowAuth(true); // Open your Auth modal
    }
  }

  return (
    <div className="w-full min-h-screen ">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform "></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-2xl transform "></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div className="absolute top-0 right-0 flex gap-2 m-4">
				{/* Implementado para suportar várias linguagens, apenas descomentar e repetir o padrão (ATENÇÃO ao mr-2 comentado) */}
				<button onClick={() => i18n.changeLanguage('en')} className="bg-white text-black px-3 py-1 rounded mr-2">EN</button>
				<button onClick={() => i18n.changeLanguage('pt')} className="bg-white text-black px-3 py-1 rounded mr-2">PT</button>
				<button onClick={() => i18n.changeLanguage('es')} className="bg-white text-black px-3 py-1 rounded mr-2">ES</button>
				<button onClick={() => i18n.changeLanguage('lv')} className="bg-white text-black px-3 py-1 rounded">LV</button></div>
            	<div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Hero Content */}
              <div className="text-white space-y-8">
                <div className="flex items-center mb-6">
                  <div className="bg-white/90 rounded-xl p-3 mr-4 shadow-lg">
                    <img
                      src="/fundacao-galp-logo.png"
                      alt="Fundação Galp"
                      className="h-10 w-10"
                    />
                  </div>
                  <span className="text-xl font-semibold text-white drop-shadow-lg">{t('hero.brand')}</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                    {t('hero.line1')}<br />
                    <span className="text-orange-200">{t('hero.line2')}</span><br />
                    {t('hero.line3')}
                  </h1>
                  <p className="text-xl sm:text-2xl text-orange-100 font-medium">
                    {t('hero.subtitle1')}
                  </p>
                </div>

                <p className="text-lg text-orange-50 leading-relaxed max-w-lg">
                  {t('hero.subtitle2')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    variant="secondary"
                    className="hero-button"
                    onClick={handleParticipateClick}
                  >
                    {t('hero.button1')}
                  </Button>
                  <div className="flex items-center gap-2 text-orange-100 hero-meta">
                    <span className="text-sm">{t('hero.target')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="space-y-6">
                {/* Meals Counter */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="relative">
                    <Button
                      onClick={() => router.push("/public_dashboard")}
                      variant="link"
                      arrow="right"
                      className="absolute -top-8 -right-12 text-xs font-normal scale-75 [&>svg]:w-5 [&>svg]:h-5"
                    >
                      {t('hero.stats')}
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <CookingPot className="w-16 h-16 mx-auto text-orange-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                      {t('hero.donmeals1')}
                    </h2>
                    <div className="text-5xl font-bold text-orange-600 mb-4">
                      {totalMeals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-600">
                      {progress.toFixed(1)}{t('hero.donmeals2')}
                    </p>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="text-center">
                    <div className="mb-4">
                      <svg className="w-16 h-16 text-orange-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                      {mounted && timeLeft ?
                        (timeLeft.status === 'before' ? "Data de início:" :
                          timeLeft.status === 'running' ? t('hero.time1') : t('hero.time2'))
                        : t('hero.time2')}
                    </h2>

                    {mounted ? (
                      timeLeft && (timeLeft.status === 'before' || timeLeft.status === 'running') ? (
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-orange-50 rounded-xl p-3">
                            <div className="text-3xl font-bold text-orange-600">
                              {timeLeft.days.toString().padStart(2, "0")}
                            </div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">{t('hero.days')}</div>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-3">
                            <div className="text-3xl font-bold text-orange-600">
                              {timeLeft.hours.toString().padStart(2, "0")}
                            </div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">hrs</div>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-3">
                            <div className="text-3xl font-bold text-orange-600">
                              {timeLeft.minutes.toString().padStart(2, "0")}
                            </div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">min</div>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-3">
                            <div className="text-3xl font-bold text-orange-600">
                              {timeLeft.seconds.toString().padStart(2, "0")}
                            </div>
                            <div className="text-sm text-gray-600 uppercase tracking-wide">seg</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-red-600">
                          {timeLeft?.status === 'ended' ? t('hero.over') : t('hero.loading')}
                        </div>
                      )
                    ) : (
                      <div className="text-gray-500">{t('hero.loading')}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t('impact.title')}
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('impact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">{t('impact.simple1')}</h4>
              <p className="text-gray-600 leading-relaxed">
                {t('impact.simple2')}
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">{t('impact.solidarity1')}</h4>
              <p className="text-gray-600 leading-relaxed">
                {t('impact.solidarity2')}
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">{t('impact.transp1')}</h4>
              <p className="text-gray-600 leading-relaxed">
                {t('impact.transp2')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onOpenSubmission={() => setShowSubmissionModal(true)}
      />
      <SubmissionModal 
        isOpen={showSubmissionModal} 
        onClose={() => setShowSubmissionModal(false)} 
      />
      {/* CAPTCHA Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold text-gray-700">{t('impact.human')}</p>
            <ReCAPTCHA
              sitekey="6LeS7HkrAAAAAMxzyanGEaMPKhPqgUzx2VuRhBPG"
              onChange={handleCaptchaChange}
            />
            <button
              className="mt-4 text-sm text-gray-500 underline"
              onClick={() => setShowCaptcha(false)}
            >
              {t('submission.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
