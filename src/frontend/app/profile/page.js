"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import design from "../config/design";
import { useProfile } from "../hooks/useProfile";
import { checkIfProfileExists } from "../../lib/api/checkProfile";
import "./profile.css"

const groupOptions = [
	"Grupo Aventura", "Caminhantes Unidos", "Equipa Veloz",
	"Exploradores Urbanos", "Pé na Trilha", "Andarilhos do Sul"
];

const lusophoneCountries = [
	{ name: "Portugal", flag: "🇵🇹" },
	{ name: "Angola", flag: "🇦🇴" },
	{ name: "Brasil", flag: "🇧🇷" },
	{ name: "Cabo Verde", flag: "🇨🇻" },
	{ name: "Espanha", flag: "🇪🇸" },
	{ name: "Eswatini", flag: "🇸🇿" },
	{ name: "Moçambique", flag: "🇲🇿" },
];

export default function ProfileCreationPage() {
	const [step, setStep] = useState(1);
	const [stepHistory, setStepHistory] = useState([]);
	const [country, setCountry] = useState("");
	const [distritos, setDistritos] = useState([]);
	const [distrito, setDistrito] = useState("");
	const [distritoMap, setDistritoMap] = useState({});
	const [concelhos, setConcelhos] = useState([]);
	const [concelho, setConcelho] = useState("");
	const [participationMode, setParticipationMode] = useState("");
	const [groupName, setGroupName] = useState("");
	const router = useRouter();
	const {
		createProfile,
		loading,
		error,
		success
	} = useProfile();

	useEffect(() => {
		const checkProfile = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				console.warn("Usuário não autenticado.");
				return;
			}

			const exists = await checkIfProfileExists(token);
			if (exists) {
				router.push("/dashboard");
			}
		};

		checkProfile();
	}, [router]);


	useEffect(() => {
		if (country === "Portugal") {
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
	}, [country]);

	useEffect(() => {
		if (distrito && distritoMap[distrito]) {
			setConcelhos(distritoMap[distrito]);
		} else {
			setConcelhos([]);
		}
		setConcelho("");
	}, [distrito, distritoMap]);

	const goToStep = (nextStep) => {
		setStepHistory(prev => [...prev, step]);
		setStep(nextStep);
	};

	const goBack = () => {
		setStepHistory(prev => {
			const history = [...prev];
			const lastStep = history.pop();
			if (lastStep !== undefined) setStep(lastStep);
			return history;
		});
	};

	const handleCountrySelect = (selectedCountry) => {
		setCountry(selectedCountry);
		// Always advance after country selection
		setTimeout(() => {
			if (selectedCountry === "Portugal") {
				goToStep(2);
			} else {
				goToStep(3);
			}
		}, 100);
	};

	const handleConcelhoSelect = (selectedConcelho) => {
		setConcelho(selectedConcelho);
		// Always advance when a council is selected (not empty)
		if (selectedConcelho && selectedConcelho !== "") {
			setTimeout(() => {
				goToStep(3);
			}, 100);
		}
	};

	return (
		<Card className="card--full-width">

			<div>
				{/* Step 1: Country */}
				{step === 1 && (
					<>
						<h2 className="profile__title">Qual é o seu país?</h2>

						<div className="profile__country-grid">
							{lusophoneCountries.map(c => (
								<Button
									key={c.name}
									variant="secondary"
									size="lg"
									onClick={() => handleCountrySelect(c.name)}
									className="profile__country-button"
									style={{
										backgroundColor: country === c.name ? "#ffd6bc" : undefined,
										borderColor: country === c.name ? design.colors.primary : undefined,
									}}
									aria-pressed={country === c.name}
								>
									<div className="profile__country-option">
										<span className="profile__country-flag">{c.flag}</span>
										<span className="profile__country-name">{c.name}</span>
									</div>
								</Button>
							))}
						</div>

					</>
				)}


				{/* Step 2: Region in Portugal */}
				{step === 2 && country === "Portugal" && (
					<>
						<h2 className="profile__title">Região em Portugal</h2>

						<div className="profile__form-group">
							<label htmlFor="distrito" className="profile__label">Distrito</label>
							<select
								id="distrito"
								className="profile__select"
								value={distrito}
								onChange={e => setDistrito(e.target.value)}
							>
								<option value="">Selecione...</option>
								{distritos.map(d => (
									<option key={d} value={d}>{d}</option>
								))}
							</select>
						</div>

						<div className="profile__form-group">
							<label htmlFor="concelho" className="profile__label">Concelho</label>
							<select
								id="concelho"
								className="profile__select"
								value={concelho}
								onChange={e => handleConcelhoSelect(e.target.value)}
								disabled={!distrito}
								aria-disabled={!distrito}
							>
								<option value="">Selecione...</option>
								{concelhos.map(c => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						</div>
					</>
				)}


				{step === 3 && (
					<>
						<h2 className="profile__title">Como está a participar?</h2>

						<div className="profile__participation-type-container">
							<Button
								variant="secondary"
								onClick={() => {
									setParticipationMode("individual");
								}}
								className={`profile__participation-type-button ${participationMode === "individual" ? 'active' : ''}`}
								aria-pressed={participationMode === "individual"}
							>
								<User className="button__icon mb-2" />
								Individual
							</Button>

							<Button
								variant="secondary"
								onClick={() => {
									setParticipationMode("grupo");
									goToStep(4);
								}}
								className={`profile__participation-type-button ${participationMode === "grupo" ? 'active' : ''}`}
								aria-pressed={participationMode === "grupo"}
							>
								<span>
									<Users className="button__icon mb-2" />
									<span>
										Como Uma Associação
									</span>
								</span>
							</Button>
						</div>
					</>
				)}

				{/* Step 4: Group name */}
				{step === 4 && (
					<>
						<h2 className="text-2xl font-bold text-primary text-center">Nome do grupo</h2>
						<label htmlFor="groupName" className="sr-only">Nome do grupo</label>
						<input
							id="groupName"
							type="text"
							className="w-full p-3 border border-gray-300 mt-4"
							style={{ borderRadius: design.borderRadius.input }}
							placeholder="Escreva ou selecione"
							list="group-list"
							value={groupName}
							onChange={e => setGroupName(e.target.value)}
						/>
						<datalist id="group-list">
							{groupOptions.map(g => (
								<option key={g} value={g} />
							))}
						</datalist>
					</>
				)}

			</div>
			{/* --- navigation footer --- */}
			{/* Only show navigation for steps 3 and 4 (auto-advance for steps 1 and 2) */}
			{step >= 3 && (
				<div className="profile__footer">
					{step >= 3 && (
						<Button
							variant="secondary"
							onClick={goBack}
							aria-label="Voltar para o passo anterior"
						>
							<ChevronLeft className="button__icon" />
							<span>Voltar</span>
						</Button>
					)}

					{(step === 3 && participationMode === "individual") && (
						<Button
							onClick={() => {
								// Submit profile for individual participation
								createProfile({
									country,
									distrito,
									concelho,
									participation_mode: "individual"
								});
							}}
							variant="primary"
							aria-label="Finalizar criação do perfil"
						>
							<span>Terminar</span>
						</Button>
					)}

					{step === 4 && (
						<Button
							onClick={() => {
								// Submit profile for group participation
								createProfile({
									country,
									distrito,
									concelho,
									participation_mode: "grupo",
									groupName
								});
							}}
							variant="primary"
							disabled={!groupName}
							aria-disabled={!groupName}
							aria-label="Finalizar criação do perfil"
						>
							<span>Terminar</span>
						</Button>
					)}
				</div>
			)}
			
			{/* Back button only for step 2 (distrito/concelho selection) */}
			{step === 2 && (
				<div className="profile__footer profile__footer--single">
					<Button
						variant="secondary"
						onClick={goBack}
						aria-label="Voltar para o passo anterior"
					>
						<ChevronLeft className="button__icon" />
						<span>Voltar</span>
					</Button>
				</div>
			)}
		</Card>
	);
}
