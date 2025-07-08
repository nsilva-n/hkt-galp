// hooks/useParticipation.js
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useParticipation() {
	const router = useRouter();
	const [participation, setParticipation] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);

	const submitParticipation = async (participationData, { redirect = false } = {}) => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const token = localStorage.getItem("token");

			const res = await fetch("/api/participation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(participationData),
			});

			const data = await res.json();

			if (!res.ok) throw new Error(data.error || "Erro ao submeter participação");

			setParticipation(data);
			setSuccess("Participação submetida com sucesso!");

			if (redirect) {
				router.push("/dashboard");
			}

			return data;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		participation,
		error,
		success,
		loading,
		submitParticipation,
	};
}
