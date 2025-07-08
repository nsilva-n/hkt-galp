// app/api/profile/route.js

import { NextResponse } from "next/server";
import { fetchProfile, createProfile } from "../../../lib/api/profile";

export async function GET(req) {
	try {
		const token = req.headers.get("authorization")?.split(" ")[1] || "";

		const data = await fetchProfile(token);
		return NextResponse.json(data);
	} catch (err) {
		console.error("Profile GET error:", err);
		return NextResponse.json({ error: err.message }, { status: err.status || 500 });
	}
}

export async function POST(req) {
	try {
		const token = req.headers.get("authorization")?.split(" ")[1] || "";
		const body = await req.json();

		const data = await createProfile(body, token);
		return NextResponse.json(data, { status: 201 });
	} catch (err) {
		console.error("Profile POST error:", err);
		return NextResponse.json({ error: err.message }, { status: err.status || 500 });
	}
}
