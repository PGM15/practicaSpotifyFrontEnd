"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem("access_token");
        setToken(t);
    }, []);

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Token: {token ?? "No token"}</p>
        </main>
    );
}
