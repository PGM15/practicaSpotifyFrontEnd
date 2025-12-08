"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTokens } from "../../../lib/auth";

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) return;

        async function exchangeCode() {
            console.log("CALLBACK CODE:", code);

            const res = await fetch("/api/spotify-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            const data = await res.json();

            if (data.access_token) {
                saveTokens(data.access_token, data.refresh_token);
                router.push("/dashboard");
            } else {
                console.error("❌ Token error:", data);
            }
        }

        exchangeCode();
    }, []);

    return <p>Procesando login...</p>;
}
