import NavBar from '../../components/global/NavBar.tsx';
import QuickTrip from "../../components/homepage/QuickTrip.tsx";
import ConnectionsWidget from "../../components/homepage/ConnectionsWidget.tsx";
import UpcomingTripWidget from "../../components/homepage/UpcomingTripWidget.tsx";
import "../../styles/Homepage.css";
import Footer from "../../components/global/Footer.tsx";
import {useEffect, useState} from "react";
import {supabase} from "../../utils/SupabaseClient.ts";
import {getProfile} from "../../utils/ProfileUtils.ts";

export default function HomePage() {
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false;

        async function getProfileDetails() {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user || cancelled) return;
            const profile = await getProfile(user.id);
            if (!profile) return;
            setName(profile.firstName);

            if (!cancelled) setLoading(false);
        }

        void getProfileDetails();

        return () => {
            cancelled = true;
        };
    });

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1">
                <div className="w-full h-[29em] max-md:h-[33em] bg-[url('../assets/images/lake.jpg')] bg-cover bg-top p-[2em] box-border">
                    <div className="label white">
                        <h2>Welcome back{!loading && `, ${name}`}! Planning a trip?</h2>
                    </div>
                    <QuickTrip/>
                </div>
                <div className="flex max-md:flex-col max-md:gap-[40px] justify-around px-[2.5em] py-[0.5em] mt-[40px] max-md:mt-[20px]">
                    <ConnectionsWidget/>
                    <UpcomingTripWidget/>
                </div>
            </main>
            <Footer/>
        </div>
    );
}