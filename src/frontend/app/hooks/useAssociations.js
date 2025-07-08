// hooks/useAssociations.js
import { useState, useEffect } from "react";

export function useAssociations(autoFetch = true) {
	const [associations, setAssociations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchAssociations = async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/associations");
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || "Erro ao obter associações");
			setAssociations(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (autoFetch) {
			fetchAssociations();
		}
	}, [autoFetch]);

	return {
		associations,
		loading,
		error,
		fetchAssociations,
	};
}
