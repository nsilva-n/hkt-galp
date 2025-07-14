// public_dashboard
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HandHeart } from "lucide-react";

import { Portugal } from "../dashboard/maps/Portugal";
import { Leaderboard } from "../dashboard/charts/leaderboard/Table"; // Assuming this is the correct path for this version
import Button from "../components/ui/Button";
import SubmissionModal from "../components/submission/SubmissionModal";
import AuthModal from "../components/auth/AuthModal";
import React from 'react';
import { useTranslation } from "react-i18next";
import '../../../i18n';

// Removed CustomTooltip since LineChart is removed
// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length && payload[0].payload) {
//     const kmValue = payload[0].payload.value;
//     return (
//       <div className="bg-[#ff7900] text-white border border-border p-4 rounded-lg shadow-medium">
//         <p className="font-semibold">Km: {kmValue}</p>
//       </div>
//     );
//   }
//   return null;
// };

export default function ModernDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  // Removed userSubmissions state as LineChart is removed
  // const [userSubmissions, setUserSubmissions] = useState([]);
  const [nationalTotal, setNationalTotal] = useState(0);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Removed setUserSubmissions as LineChart is removed
    // setUserSubmissions([
    //   { date: "1", value: 2 },
    //   { date: "3", value: 5 },
    //   { date: "4", value: 3 },
    //   { date: "5", value: 0 },
    //   { date: "6", value: 6 },
    // ]);
    setNationalTotal(1532);
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmeterClick = () => {
    // Public dashboard means user is not logged in, so show auth modal
    setShowAuth(true);
  };

  const handleVerEstatisticasClick = () => {
    if (isLoggedIn) {
      // Redirect to user dashboard if logged in
      router.push("/dashboard");
    } else {
      // Show auth modal for guests to view statistics
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setIsLoggedIn(true);
    setShowSubmissionModal(true);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/hiking1.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-900/80"></div>
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('pubdash.title1')}
            <br />
            <span className="text-[#ff7900]">{t('pubdash.title2')}</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('pubdash.altsubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={handleSubmeterClick}
              variant="secondary"
              className="text-xl px-8 py-4"
            >
              <HandHeart className="button__icon" />
              <span>{t('pubdash.submit')}</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* The Personal Progress Section (Line Chart) has been removed from here */}

      <div className="relative -mt-12">
        {/* National Participation Section (Map) - NOW WITH STRAIGHT EDGES */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20 bg-white shadow-lg" // Removed rounded-xl
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-6">
              {t('pubdash.country1')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pubdash.country2')}
            </p>
          </div>
          <div className="relative">
            <div className="relative h-[220px] sm:h-[400px] md:h-[500px] lg:h-[650px] bg-card rounded-2xl shadow-medium p-2 md:p-6 overflow-hidden">
              <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-[#ff7900] text-white p-2 md:p-4 rounded-xl shadow-strong z-20 flex flex-col items-center">
                <p className="text-lg md:text-2xl font-bold">{nationalTotal}</p>
                <p className="text-xs md:text-sm opacity-90">
                  {t('pubdash.country3')}
                </p>
              </div>
              <Portugal />
            </div>
          </div>
        </motion.section>
      </div>

      {/* National Ranking Section (Leaderboard) - NOW WITH STRAIGHT EDGES */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20 bg-white shadow-lg" // Removed rounded-xl
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-6 lg:order-2">
            <h2 className="text-4xl font-bold text-black">{t('pubdash.leader1')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('pubdash.leader2')}
            </p>
            <Button variant="primary" className="w-full lg:w-auto px-6 py-3">
              {t('pubdash.leader3')}
            </Button>
          </div>
          <div className="lg:col-span-8 lg:order-1">
            <div className="bg-card rounded-2xl p-8 shadow-soft transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
              <Leaderboard />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Meals Donated Section - FULL WIDTH & STRAIGHT EDGES */}
      <motion.section
        className="bg-gradient-primary py-24 shadow-strong relative overflow-hidden" // Removed mx-6 and rounded-2xl
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-10" // Added w-full and h-full
          style={{ backgroundImage: "url('/placeholder.jpg')" }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl md:text-7xl font-bold text-primary-foreground mb-6">
            {nationalTotal.toLocaleString()}
          </h2>
          <p className="text-3xl text-primary-foreground font-semibold mb-8">
            {t('pubdash.meals1')}
          </p>
          <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto leading-relaxed">
            {t('pubdash.meals2')}
          </p>
        </div>
      </motion.section>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onOpenSubmission={() => setShowSubmissionModal(true)}
      />
      
      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
      />
    </div>
  );
}