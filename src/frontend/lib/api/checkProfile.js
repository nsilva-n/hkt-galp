// lib/auth/checkProfile.js

export async function checkIfProfileExists(token) {
	const res = await fetch("/api/profile", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 404) return false;
	if (!res.ok) throw new Error("Erro ao verificar o perfil");

	return true;
}
