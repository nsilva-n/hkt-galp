// hooks/useProfile.js
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useProfile() {
	const router = useRouter(); 
	const [profile, setProfile] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);

	const fetchProfile = async () => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const res = await fetch("/api/profile", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || "Erro ao obter perfil");
			setProfile(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const createProfile = async (profileData) => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const token = localStorage.getItem("token");

			const res = await fetch("/api/profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(profileData),
			});

			console.log(JSON.stringify(profileData));

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erro ao criar perfil");
			setProfile(data);
			console.log(data);

			setSuccess("Perfil criado com sucesso!");
			router.push("/dashboard");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		profile,
		error,
		success,
		loading,
		fetchProfile,
		createProfile,
	};
}
