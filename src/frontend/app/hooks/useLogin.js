// hooks/useLogin.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkIfProfileExists } from "../../lib/api/checkProfile";

export function useLogin() {
	const router = useRouter();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const login = async ({ email, password }) => {
		setError(null);
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Erro ao fazer login.");
			}

			const token = data.access_token;
			localStorage.setItem("token", token);

			// 👤 Check profile existence
			const hasProfile = await checkIfProfileExists(token);

			router.push(hasProfile ? "/dashboard" : "/profile");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
}
