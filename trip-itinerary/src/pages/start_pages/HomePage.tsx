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

    useEffect(() => {
        let cancelled = false;

        async function getProfileDetails() {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user || cancelled) return;
            const profile = await getProfile(user.id);
            if (!profile) return;
            setName(profile.firstName);
        }

        void getProfileDetails();

        return () => {
            cancelled = true;
        };
    });

    return (
        <div>
            <NavBar/>
            <div id="banner">
                <div className="label white">
                    <h2>Welcome back, {name}! Planning a trip?</h2>
                </div>
                <QuickTrip/>
            </div>
            <div className="notifications" id="notifications">
                <ConnectionsWidget/>
                <UpcomingTripWidget/>
            </div>
            <Footer/>
        </div>
    );
}