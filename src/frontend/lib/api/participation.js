// lib/participation.js

export async function submitParticipation(participationData, token) {
	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	const res = await fetch(`${process.env.BACKEND_URL}/participation`, {
		method: "POST",
		headers,
		body: JSON.stringify(participationData),
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao submeter participação" };
	}

	return data;
}


export async function getMyParticipations(token) {
	const res = await fetch(`${process.env.BACKEND_URL}/participation/my`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao buscar participações" };
	}

	return data;
}

export async function getTotalKm(token) {
	const res = await fetch(`${process.env.BACKEND_URL}/participation/my/total_km`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao buscar total de km" };
	}

	return data.total_km;
}

export async function getLastParticipations(n) {
	const res = await fetch(`${process.env.BACKEND_URL}/participation/last/${n}`, {
		method: "GET",
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao buscar participações recentes" };
	}

	return data;
}

export async function getTotalKmByDistrict(district) {
	const res = await fetch(`${process.env.BACKEND_URL}/participation/total_km/district/${district}`, {
		method: "GET",
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao buscar km por distrito" };
	}

	return data.total_km;
}

export async function getTotalKmByMunicipality(municipality) {
	const res = await fetch(`${process.env.BACKEND_URL}/participation/total_km/municipality/${municipality}`, {
		method: "GET",
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao buscar km por município" };
	}

	return data.total_km;
}
