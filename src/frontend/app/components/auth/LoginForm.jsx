"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import "./login-form.css";
import Image from "next/image";
import { useLogin } from "../../hooks/useLogin";


export default function LoginForm({ onClose }) {
	const { login, loading, error } = useLogin();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => setMounted(true), []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login({ email, password });
	};

	return (
		<form
			onSubmit={handleSubmit}
			aria-label="Login form"
			className={`login-form`}
		>
			{/* Back button inside modal — return to previous screen */}
			<Button
				className="login-form__back-button"
				variant="ghost"
				arrow="left"
				aria-label="Voltar para a página anterior"
				onClick={onClose}
			>
				{t('submission.goback')}
			</Button>

			<h1 className="login-form__title">{t('campaignname')} 🏃</h1>

			<label htmlFor="email" className="sr-only">
				Email
			</label>
			<input
				id="email"
				type="email"
				placeholder="Introduza seu email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="login-form__input"
			/>

			<label htmlFor="password" className="sr-only">
				{t('login.pass')}
			</label>
			<input
				id="password"
				type="password"
				placeholder={t('login.pass')}
				required
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="login-form__input"
			/>

			<div className="login-form__options">
				<button
					type="button"
					className="login-form__forgot"
					onClick={() => alert("Redirecting to password recovery...")}
				>
					{t('login.dumb')}
				</button>
			</div>
			<div className="flex flex-col">

				<Button type="submit" variant="primary">
					{t('login.start')}
				</Button>

				<span>{t('login.or')}</span>

				{/* OAuth buttons using your custom Button component */}
				<Button
					type="button"
					variant="secondary"
				//onClick={() => handleOAuthLogin("google")}
				>
					<div className="flex">
						<Image
							src="/icons/google-logo-oauth.png"
							alt="Google logo"
							width={24}
							height={24}
							className="login-form__oauth-logo"
							priority
						/>
						<span className="login-form__oauth-label">{t('login.google')}</span>
					</div>
				</Button>
			</div>
		</form>
	);
}
