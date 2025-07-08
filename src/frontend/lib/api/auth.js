export async function loginUser({ email, password }) {
	const res = await fetch(`${process.env.BACKEND_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Login falhou" };
	}

	return data.access_token;
}

export async function registerUser({ email, password }) {
	const res = await fetch(`${process.env.BACKEND_URL}/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json();

	if (!res.ok) {
		throw { status: res.status, message: data.error || "Registo falhou" };
	}

	return data;
}
