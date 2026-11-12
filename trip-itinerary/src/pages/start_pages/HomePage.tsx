import NavBar from '../../components/global/NavBar.tsx';
import QuickTrip from "../../components/homepage/QuickTrip.tsx";
import ConnectionsWidget from "../../components/homepage/ConnectionsWidget.tsx";
import UpcomingTripWidget from "../../components/homepage/UpcomingTripWidget.tsx";
import Footer from "../../components/global/Footer.tsx";
import {useEffect, useState} from "react";
// import {supabase} from "../../utils/SupabaseClient.ts";
import {getProfile} from "../../utils/ProfileUtils.ts";
import { useAuthContext } from '../../context/AuthContext.tsx';

export default function HomePage() {
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const { session } = useAuthContext();
    const userId = session?.user.id;

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        getProfile(userId)
            .then(p => { if (!cancelled && p) setName(p.firstName); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [userId]);

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1">
                <div className="w-full h-116 max-md:h-132 bg-[url('/assets/images/lake.jpg')] bg-cover bg-top p-8 box-border">
                    <h2 className="px-[18px] w-fit bg-(--background-colour) rounded-xl !mx-0 max-md:!mb-4 max-md:!leading-[1.6]">
                        Welcome back{!loading && `, ${name}`}! Planning a trip?
                    </h2>
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