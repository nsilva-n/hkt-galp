"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../ui/Button";
import "../ui/styles/Button.css";
import "./auth-modal.css";
import design from "../../config/design";
import React from 'react';
import { useTranslation } from "react-i18next";
import '../../../../i18n';

const lusophoneCountries = [
	{ name: "Portugal", flag: "🇵🇹" },
	{ name: "Angola", flag: "🇦🇴" },
	{ name: "Brasil", flag: "🇧🇷" },
	{ name: "Cabo Verde", flag: "🇨🇻" },
	{ name: "Espanha", flag: "🇪🇸" },
	{ name: "Eswatini", flag: "🇸🇿" },
	{ name: "Moçambique", flag: "🇲🇿" },
];

export default function AuthModal({ isOpen, onClose, onOpenSubmission }) {
	const [view, setView] = useState("choice"); // 'choice' | 'login' | 'signup' | 'guest-profile'
  	const { t } = useTranslation();

	// Guest profile state
	const [guestStep, setGuestStep] = useState(1);
	const [country, setCountry] = useState("");
	const [distritos, setDistritos] = useState([]);
	const [distrito, setDistrito] = useState("");
	const [distritoMap, setDistritoMap] = useState({});
	const [concelhos, setConcelhos] = useState([]);
	const [concelho, setConcelho] = useState("");

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			setView("choice");
			// Reset guest profile state when modal opens
			setGuestStep(1);
			setCountry("");
			setDistrito("");
			setConcelho("");
		} else {
			document.body.style.overflow = "";
		}
	}, [isOpen]);

	// Load Portugal districts and councils
	useEffect(() => {
		if (country === "Portugal" && view === "guest-profile") {
			fetch("/data/localidades.json")
				.then(res => {
					if (!res.ok) throw new Error("Erro ao carregar localidades");
					return res.json();
				})
				.then(data => {
					const map = {};
					let currentDistrito = "";

					for (const item of data) {
						if (item.level === 1) {
							currentDistrito = item.name;
							if (!map[currentDistrito]) map[currentDistrito] = [];
						} else if (item.level === 2) {
							map[currentDistrito].push(item.name);
						}
					}

					setDistritoMap(map);
					setDistritos(Object.keys(map));
				})
				.catch(err => {
					console.error("Erro ao carregar localidades:", err);
				});
		}
	}, [country, view]);

	useEffect(() => {
		if (distrito && distritoMap[distrito]) {
			setConcelhos(distritoMap[distrito]);
		} else {
			setConcelhos([]);
		}
		setConcelho("");
	}, [distrito, distritoMap]);

	if (!isOpen) return null;

	const handleGuest = () => {
		setView("guest-profile");
	};

	const handleGuestProfileComplete = () => {
		// Store guest profile data (you might want to save this somewhere)
		console.log("Guest profile:", { country, distrito, concelho });
		
		onClose(); // Close auth modal first
		if (onOpenSubmission) {
			onOpenSubmission(); // Open submission modal
		}
	};

	const handleCountrySelect = (selectedCountry) => {
		setCountry(selectedCountry);
		// Always advance after country selection
		setTimeout(() => {
			if (selectedCountry === "Portugal") {
				setGuestStep(2);
			} else {
				setGuestStep(3);
			}
		}, 100);
	};

	const handleConcelhoSelect = (selectedConcelho) => {
		setConcelho(selectedConcelho);
		// Always advance when a council is selected (not empty)
		if (selectedConcelho && selectedConcelho !== "") {
			setTimeout(() => {
				setGuestStep(3);
			}, 100);
		}
	};

	const goToNextGuestStep = () => {
		if (guestStep === 3) {
			handleGuestProfileComplete();
		}
	};

	const goBackGuestStep = () => {
		if (guestStep === 3) {
			setGuestStep(country === "Portugal" ? 2 : 1);
		} else if (guestStep === 2) {
			setGuestStep(1);
		} else if (guestStep === 1) {
			setView("choice");
		}
	};

	return (
		<div className="auth-modal">
			<div className="auth-modal__backdrop" onClick={onClose} />

			<div className="auth-modal__content">
				{view === "choice" && (
					<div className="auth-modal__options">

						<Button variant="primary" onClick={() => setView("login")}>
							{t('auth.login1')}
						</Button>
						<p className="auth-modal__description">
							{t('auth.login2')}
						</p>

						<Button variant="secondary" onClick={() => setView("signup")}>
							{t('auth.signup1')}
						</Button>
						<p className="auth-modal__description">
							{t('auth.signup2')}
						</p>

						<Button variant="secondary" onClick={handleGuest}>
							{t('auth.guest1')}
						</Button>
						<p className="auth-modal__description">
							{t('auth.guest2')}
						</p>

					</div>
				)}

				{view === "login" && <LoginForm onClose={onClose} />}
				{view === "signup" && <SignupForm onClose={onClose} />}
				
				{view === "guest-profile" && (
					<div className="auth-modal__guest-profile">
						{/* Step 1: Country */}
						{guestStep === 1 && (
							<>
								<h2 className="auth-modal__title">Qual é o seu país?</h2>
								<div className="auth-modal__country-grid">
									{lusophoneCountries.map(c => (
										<Button
											key={c.name}
											variant="secondary"
											onClick={() => handleCountrySelect(c.name)}
											className="auth-modal__country-button"
											style={{
												backgroundColor: country === c.name ? "#ffd6bc" : undefined,
												borderColor: country === c.name ? design.colors.primary : undefined,
											}}
										>
											<div className="auth-modal__country-option">
												<span className="auth-modal__country-flag">{c.flag}</span>
												<span className="auth-modal__country-name">{c.name}</span>
											</div>
										</Button>
									))}
								</div>
							</>
						)}

						{/* Step 2: District and Council (Portugal only) */}
						{guestStep === 2 && country === "Portugal" && (
							<>
								<h2 className="auth-modal__title">Região em Portugal</h2>
								<div className="auth-modal__form-group">
									<label htmlFor="distrito" className="auth-modal__label">Distrito</label>
									<select
										id="distrito"
										className="auth-modal__select"
										value={distrito}
										onChange={e => setDistrito(e.target.value)}
									>
										<option value="">Selecione...</option>
										{distritos.map(d => (
											<option key={d} value={d}>{d}</option>
										))}
									</select>
								</div>

								<div className="auth-modal__form-group">
									<label htmlFor="concelho" className="auth-modal__label">Concelho</label>
									<select
										id="concelho"
										className="auth-modal__select"
										value={concelho}
										onChange={e => handleConcelhoSelect(e.target.value)}
										disabled={!distrito}
									>
										<option value="">Selecione...</option>
										{concelhos.map(c => (
											<option key={c} value={c}>{c}</option>
										))}
									</select>
								</div>
							</>
						)}

						{/* Step 3: Confirmation */}
						{guestStep === 3 && (
							<>
								<h2 className="auth-modal__title">Localização</h2>
								<div className="auth-modal__summary">
									<p><strong>País:</strong> {country}</p>
									{country === "Portugal" && distrito && (
										<p><strong>Distrito:</strong> {distrito}</p>
									)}
									{country === "Portugal" && concelho && (
										<p><strong>Concelho:</strong> {concelho}</p>
									)}
								</div>
							</>
						)}

						{/* Navigation - only show for step 3 (confirmation) */}
						{guestStep === 3 && (
							<div className="auth-modal__guest-navigation">
								<Button variant="secondary" onClick={goBackGuestStep}>
									<ChevronLeft className="button__icon" />
									<span>Voltar</span>
								</Button>
								<Button variant="primary" onClick={goToNextGuestStep}>
									<span>Próximo</span>
									<ChevronRight className="button__icon" />
								</Button>
							</div>
						)}

						{/* Back button only for step 2 */}
						{guestStep === 2 && (
							<div className="auth-modal__guest-navigation">
								<Button variant="secondary" onClick={goBackGuestStep}>
									<ChevronLeft className="button__icon" />
									<span>Voltar</span>
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
