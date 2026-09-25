import React, {useState} from "react";
import {supabase} from "../utils/SupabaseClient.ts";
import {useIsMobile} from "../hooks/useIsMobile.ts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function sendOtp(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);
        setErrorMsg(null);

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            console.error("Error sending OTP:", error.message);
            setErrorMsg("Couldn't send OTP");
        } else {
            setSent(true);
        }
        setSending(false);
    }

    async function verifyWithOtp(e: React.FormEvent) {
        e.preventDefault();
        setVerifying(true);
        setErrorMsg(null);

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: "email",
        });

        if (error) {
            console.error("Error verifying OTP:", error.message);
            setErrorMsg("Invalid code, please try again");
        } else {
            console.log("User logged in:", data.user);
            // e.g. redirect or update auth context here
        }
        setVerifying(false);
    }

    // async function handleMagicLink(e: React.FormEvent) {
    //     e.preventDefault();
    //     setSending(true);
    //     setErrorMsg(null);

    //     const { error } = await supabase.auth.signInWithOtp({ email });

    //     if (error) {
    //         console.error("Couldn't send OTP: ", error);
    //         setErrorMsg("Couldn't send OTP");
    //     }
    //     else setSent(true);
    // }

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
                    <form onSubmit={sendOtp}>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <button type="submit" disabled={sending}>
                            {sending ? "Sending..." : "Send OTP"}
                        </button>
                        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                    </form>
                    ) : (
                    <form onSubmit={verifyWithOtp}>
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                        />
                        <button type="submit" disabled={sending}>
                            {verifying ? "Verifying..." : "Verify"}
                        </button>
                        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                    </form>
                )}
            </div>
            {isMobile && (
                <p style={{fontSize: "larger", padding: "10px 30px"}}>Plan, manage, and log trips and follow your friends' journeys too. Join TripSitter today completely for free.</p>
            )}
        </div>
    );
}