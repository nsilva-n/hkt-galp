import { NextResponse } from "next/server";
import { submitParticipation } from "../../../lib/api/participation";

export async function POST(req) {
    try {
        const token = req.headers.get("authorization")?.split(" ")[1] || "";
        const body = await req.json();

        const data = await submitParticipation(body, token);
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error("Profile POST error:", err);
        return NextResponse.json({ error: err.message }, { status: err.status || 500 });
    }
}