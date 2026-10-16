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
        <div className="flex flex-col">
            <div className="flex flex-col gap-5 m-auto px-10 max-md:py-50 max-md:px-15
                            max-md:bg-[url('../assets/images/starry-night.jpg')]
                            max-md:bg-center max-md:bg-cover"
            >
                <h2 className="max-md:!text-(--background-colour)">Your Plan, Your Adventure</h2>
                {!isMobile && (
                    <p className="text-(--background-colour)">
                        Plan, manage, and log trips and follow your friends' journeys too.
                        Join TripSitter today completely for free.
                    </p>
                )}
                <h4 className="my-2.5 max-md:!text-(--background-colour)">
                    Log in or sign up to continue
                </h4>
                {!sent ? (
                    <form 
                        className="flex flex-col gap-5 items-center"
                        onSubmit={handleMagicLink}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-75"
                        />
                        <button type="submit" disabled={sending}>
                            {sending ? "Sending..." : "Send Login Link"}
                        </button>
                        {errorMsg && <p className="text-red">{errorMsg}</p>}
                    </form>
                    ) : (
                    <p className="max-md:text-(--background-colour)">Check your email for a login link!</p>
                )}
            </div>
            {isMobile && (
                <p className="text-(--background-colour) font-lg py-5 px-7.5">
                    Plan, manage, and log trips and follow your friends' journeys too. 
                    Join TripSitter today completely for free.
                </p>
            )}
        </div>
    );
}