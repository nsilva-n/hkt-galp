// app/api/associations/route.js

import { NextResponse } from "next/server";
import { fetchAssociations } from "../../../lib/api/profile";

export async function GET() {
	try {
		const data = await fetchAssociations();
		return NextResponse.json(data);
	} catch (err) {
		console.error("Associations error:", err);
		return NextResponse.json({ error: err.message }, { status: err.status || 500 });
	}
}
