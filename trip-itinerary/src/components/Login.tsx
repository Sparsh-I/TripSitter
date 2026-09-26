import React, {useState} from "react";
import {supabase} from "../utils/SupabaseClient.ts";
import {useIsMobile} from "../hooks/useIsMobile.ts";

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
            options: { emailRedirectTo: `${window.location.origin}/` },
        });

        if (error) {
            console.error("Couldn't send email link: ", error);
            setErrorMsg("Couldn't send email link");
        }
        else setSent(true);
    }


    const isMobile = useIsMobile();

    return (
        <div style={{ display: "inline-flex", flexDirection: "column" }}>
            <div className="login-page">
                <h2>Your Plan, Your Adventure</h2>
                {!isMobile && (
                    <p>Plan, manage, and log trips and follow your friends' journeys too. Join TripSitter today completely for free.</p>
                )}
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
            {isMobile && (
                <p style={{fontSize: "larger", padding: "10px 30px"}}>Plan, manage, and log trips and follow your friends' journeys too. Join TripSitter today completely for free.</p>
            )}
        </div>
    );
}