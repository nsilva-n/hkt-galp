// hooks/useSignup.js
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSignup() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const signup = async ({ email, password }) => {
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// Step 1: Register user
			const registerRes = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const registerData = await registerRes.json();

			if (!registerRes.ok) {
				setError(registerData.error || "Erro ao criar conta.");
				return;
			}

			console.log("✅ Usuário registrado:", email);
			setSuccess(`Conta criada com sucesso: ${email}`);

			// Step 2: Login user
			const loginRes = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const loginData = await loginRes.json();

			console.log("🔐 Resposta do login:", loginData);

			if (!loginRes.ok || !loginData.access_token) {
				throw new Error(loginData.error || "Erro ao fazer login.");
			}

			// Step 3: Store token and redirect
			const token = loginData.access_token;
			localStorage.setItem("token", token);
			console.log("🪪 Token armazenado com sucesso:", token);

			router.push("/profile");
		} catch (err) {
			console.error("❌ Erro no signup:", err);
			setError("Erro inesperado. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	return { signup, error, success, loading };
}
