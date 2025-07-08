// app/api/auth/register/route.js

import { NextResponse } from "next/server";
import { registerUser } from "../../../../lib/api/auth";

export async function POST(req) {
	try {
		const body = await req.json();

		// Optional: validate body fields here
		const { email, password } = body;
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email e senha são obrigatórios." },
				{ status: 400 }
			);
		}

		// Call backend via service layer
		const result = await registerUser({ email, password });

		return NextResponse.json(result, { status: 201 });
	} catch (err) {
		console.error("Register error:", err);
		return NextResponse.json(
			{ error: err.message || "Erro interno ao registrar." },
			{ status: err.status || 500 }
		);
	}
}
