import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { language, version, files, stdin } = await req.json();

        const apiKey = process.env.PISTON_API_KEY;
        const apiUrl = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (apiKey) {
            headers["Authorization"] = apiKey;
            // Some providers might use x-api-key
            headers["x-api-key"] = apiKey;
        }

        const response = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language,
                version,
                files,
                stdin,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to execute code" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Compilation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
