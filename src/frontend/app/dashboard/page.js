
// public_dashboard
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HandHeart } from "lucide-react";
import { Portugal } from "./maps/Portugal";
import { Leaderboard } from "./charts/leaderboard/Table";
import SubmissionModal from "../components/submission/SubmissionModal";
import Button from "../components/ui/Button";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const kmValue = payload[0].payload.value;
    return (
      <div className="bg-[#ff7900] text-white border border-border p-4 rounded-lg shadow-medium">
        <p className="font-semibold">Km: {kmValue}</p>
      </div>
    );
  }
  return null;
};

export default function ModernDashboard() {
  const router = useRouter();
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [nationalTotal, setNationalTotal] = useState(0);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    setUserSubmissions([
      { date: "1", value: 2 },
      { date: "2", value: 5 },
      { date: "3", value: 3 },
      { date: "4", value: 0 },
      { date: "5", value: 6 },
    ]);
    setNationalTotal(1532);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - NOW WITH STRAIGHT EDGES */}
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
            Movimento hoje,
            <br />
            <span className="text-[#ff7900]">impacto amanhã</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ajude-nos a alcançar nossa meta
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => setShowSubmissionModal(true)}
              variant="secondary"
              className="text-xl px-8 py-4"
            >
              <HandHeart className="button__icon" />
              <span>Submeter Quilómetros</span>
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="relative">
        {/* Personal Progress Section (Line Chart) - NOW WITH STRAIGHT EDGES */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Text box - orange background - NOW WITH STRAIGHT EDGES */}
            <div className="lg:col-span-5 space-y-6 bg-[#ff7900] text-white p-6"> {/* Removed rounded-lg */}
              <h2 className="text-4xl font-bold">O seu progresso</h2>
              <p className="text-lg leading-relaxed">
                Acompanhe a evolução dos seus quilómetros caminhados.
              </p>
            </div>

            {/* Line chart - NOW WITH STRAIGHT EDGES */}
            <div className="lg:col-span-7">
              <div className="relative bg-white p-8 shadow-soft transform lg:rotate-1 hover:rotate-0 transition-transform duration-500"> {/* Removed rounded-2xl */}
                <div className="absolute inset-0 bg-white opacity-10 pointer-events-none" /> {/* Removed rounded-2xl */}
                <div className="relative z-10 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userSubmissions}
                      margin={{ top: 40, right: 30, bottom: 50, left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                      <XAxis
                        dataKey="date"
                        stroke="black"
                        tick={{ fontSize: 20, fill: "#333" }}
                        label={{
                          value: "Semana",
                          position: "insideBottom",
                          dy: 30,
                          fill: "#333",
                          fontSize: 20,
                        }}
                      />
                      <YAxis
                        stroke="black"
                        tick={{ fontSize: 20, fill: "#333" }}
                        label={{
                          value: "Km",
                          position: "insideLeft",
                          dx: -30,
                          dy: -10,
                          angle: 0,
                          fill: "#333",
                          fontSize: 20,
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="natural"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{
                          r: 6,
                          stroke: "black",
                          strokeWidth: 2,
                          fill: "#ff7900",
                        }}
                        activeDot={{
                          r: 8,
                          stroke: "black",
                          strokeWidth: 2,
                          fill: "#ff7900",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

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
              Participação nacional
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize o impacto da iniciativa em todo o território nacional.
            </p>
          </div>
          <div className="relative">
            <div className="relative h-[220px] sm:h-[400px] md:h-[500px] lg:h-[650px] bg-card shadow-medium p-2 md:p-6 overflow-hidden"> {/* Removed rounded-2xl */}
              {/* Total participants badge - NOW WITH STRAIGHT EDGES */}
              <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-[#ff7900] text-white p-2 md:p-4 shadow-strong z-20 flex flex-col items-center"> {/* Removed rounded-xl */}
                <p className="text-lg md:text-2xl font-bold">{nationalTotal}</p>
                <p className="text-xs md:text-sm opacity-90">
                  Total Participantes
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
            <h2 className="text-4xl font-bold text-black">Ranking nacional</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Veja os líderes da iniciativa e inspire-se a subir no ranking.
            </p>
            <Button variant="primary" className="w-full lg:w-auto px-6 py-3">
              Ver ranking completo
            </Button>
          </div>
          <div className="lg:col-span-8 lg:order-1">
            <div className="bg-card p-8 shadow-soft transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500"> {/* Removed rounded-2xl */}
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
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-10" // Added w-full h-full
          style={{ backgroundImage: "url('/placeholder.jpg')" }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl md:text-7xl font-bold text-primary-foreground mb-6">
            {nationalTotal.toLocaleString()}
          </h2>
          <p className="text-3xl text-primary-foreground font-semibold mb-8">
            Refeições doadas
          </p>
          <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Cada quilómetro activo equivale a uma refeição doada. Juntos
            criamos impacto.
          </p>
        </div>
      </motion.section>

      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
      />
    </div>
  );
}