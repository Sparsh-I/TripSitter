import {useState} from "react";
import {supabase} from "../utils/SupabaseClient.ts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });

        if (error) console.error("Couldn't send email link: ", error);
        else setSent(true);
    }

    if (sent) {
        return (
            <div className="login-background">
                <div className="login-page">
                    <p>Check your email for a login link!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-background">
            <div className="login-page">
                <h1>Sign in to continue</h1>
                <form onSubmit={handleMagicLink}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <button type="submit">Send OTP</button>
                </form>
            </div>
        </div>
    );
}