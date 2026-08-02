import React, {useState} from "react";
import {supabase} from "../utils/SupabaseClient.ts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);
        setErrorMsg(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/home` },
        });

        if (error) {
            console.error("Couldn't send email link: ", error);
            setErrorMsg("Couldn't send email link");
        }
        else setSent(true);
    }

    return (
        <div className="login-page">
            <h2>Your Plan, Your Adventure</h2>
            <p>Plan, manage, and log trips and follow your friends' journeys too. Join TripSitter today completely for free.</p>
            <h4>Log in or sign up to continue</h4>
            {!sent ? (
                <form onSubmit={handleMagicLink}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <button type="submit" disabled={sending}>
                        {sending ? "Sending..." : "Send Login Link"}
                    </button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </form>
                ) : (
                <p>Check your email for a login link!</p>
            )}
        </div>
    );
}