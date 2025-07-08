"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Image from "next/image";
import "./signup-form.css";
import { useSignup } from "../../hooks/useSignup";

export default function SignupForm({ onClose }) {
	const router = useRouter();
	const {
		signup,
		error: signupError,
		success: signupSuccess,
		loading,
	} = useSignup();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		acceptTerms: false,
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		setError("");
		setSuccess("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.acceptTerms) return setError("Por favor aceite os termos e condições");
		signup({ email: formData.email, password: formData.password });
	};

	return (
		<form onSubmit={handleSubmit} className="signup-form" aria-label="Signup form">
			<Button
				className="signup-form__back-button"
				variant="ghost"
				arrow="left"
				aria-label="Voltar"
				onClick={onClose}
			>
				Voltar
			</Button>

			<h1 className="signup-form__title">Criar Conta ✨</h1>

			<input
				type="email"
				name="email"
				placeholder="Email"
				required
				value={formData.email}
				onChange={handleChange}
				className="signup-form__input"
			/>

			<input
				type="password"
				name="password"
				placeholder="Senha"
				required
				value={formData.password}
				onChange={handleChange}
				className="signup-form__input"
			/>

			<div className="signup-form__checkbox-wrapper">
				<label className="signup-form__checkbox">
					<input
						type="checkbox"
						name="acceptTerms"
						checked={formData.acceptTerms}
						onChange={handleChange}
					/>
					Aceito os{" "}
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
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
			</div>

			{error && <p className="signup-form__error">{error}</p>}
			{success && <p className="signup-form__success">{success}</p>}

			<div className="signup-form__actions">
				<Button type="submit" variant="primary">
					Começar
				</Button>
				<span>ou</span>
				<Button type="button" variant="secondary">
					<div className="signup-form__oauth-content">
						<Image
							src="/icons/google-logo-oauth.png"
							alt="Google logo"
							width={24}
							height={24}
							className="signup-form__oauth-logo"
							priority
						/>
						<span className="signup-form__oauth-label">Entrar com Google</span>
					</div>
				</Button>
			</div>
		</form>
	);
}
