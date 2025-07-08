// lib/api/profile.js

export async function fetchProfile(token) {
	const res = await fetch(`${process.env.BACKEND_URL}/profile`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao obter o perfil" };
	}

	return data;
}

export async function createProfile(profileData, token) {
	const res = await fetch(`${process.env.BACKEND_URL}/profile`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(profileData),
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Erro ao criar perfil" };
	}

	return data;
}

export async function fetchAssociations() {
	const res = await fetch(`${process.env.BACKEND_URL}/associations`, {
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: "Erro ao obter associações" };
	}

	return data;
}
