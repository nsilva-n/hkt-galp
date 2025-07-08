// app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { loginUser } from "../../../../lib/api/auth";

export async function POST(req) {
	try {
		const body = await req.json();

		const token = await loginUser(body);

		return NextResponse.json({ access_token: token });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: error.message || "Erro ao fazer login" },
			{ status: error.status || 500 }
		);
	}
}
