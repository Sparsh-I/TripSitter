import { useEffect, useState } from "react";
import { closestUpcomingTrip } from "../../utils/TripDateUtils.ts";
import { getTrips } from "../../utils/TripStorage.ts";
import {getAlpha3, getCountryCode, getCountryCodeFromName} from "../../utils/LocationUtils.ts";
import type { Trip } from "../../types/Trip.ts";
import {supabase} from "../../utils/SupabaseClient.ts";
import {getProfile} from "../../utils/ProfileUtils.ts";

export default function UpcomingTripWidget() {
    const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
    const [startLocCode, setStartLocCode] = useState<string>("XXX");
    const [endLocCode, setEndLocCode] = useState("XXX");

    useEffect(() => {
        let cancelled = false;

        async function getProfileDetails() {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user || cancelled) return;

            const profile = await getProfile(user.id);
            if (!profile) return;

            const alpha2Code = getCountryCodeFromName(profile.residenceCountry);
            if (!alpha2Code) return;
            const code = getAlpha3(alpha2Code);
            if (!code) setStartLocCode("N/A");
            else setStartLocCode(code);
        }

        void getProfileDetails();

        return () => {
            cancelled = true;
        };
    });

    useEffect(() => {
        async function loadUpcomingTrip() {
            try {
                const trips = await getTrips();
                const trip = closestUpcomingTrip(trips);
                setUpcomingTrip(trip);

                if (trip) {
                    getCountryCode(trip.lat, trip.lng).then(code2 => {
                        setEndLocCode(code2 ? (getAlpha3(code2) ?? "XXX") : "XXX");
                    });
                }
            } catch (e) {
                console.error("Failed to load upcoming trip: ", e);
            }
        }

        loadUpcomingTrip();
    }, []);

    let day = "DD", month = "MMM", year = "YYYY";
    if (upcomingTrip) {
        const startDate = new Date(upcomingTrip.startDate);
        day = startDate.toLocaleDateString("en-GB", { day: "numeric" });
        month = startDate.toLocaleDateString("en-GB", { month: "short" });
        year = startDate.toLocaleDateString("en-GB", { year: "numeric" });
    }

    return (
        <div className="relative flex justify-center w-135 max-md:w-full h-37 bg-(--primary-colour-alt) rounded-2xl overflow py-1 max-md:w-[90%]
                    before:absolute before:top-1/2 before:-left-5 before:-translate-y-1/2 before:size-9 before:rounded-full before:bg-white before:z-2
                    after:absolute after:top-1/2 after:-right-5 after:-translate-y-1/2 after:size-9 after:rounded-full after:bg-white after:z-2">
            <table className="h-full max-md:[&_td]:items-center max-md:[&_td]:w-[30%]">
                <tbody>
                <tr className="[&_h3]:text-white [&_h1]:text-white">
                    <td><h3>{upcomingTrip?.title ?? "No Upcoming Trips!"}</h3></td>
                    <td><h3>{startLocCode}➜{endLocCode}</h3></td>
                    <td rowSpan={2} className="text-center items-center px-2 border-l-2 border-dashed border-white w-[20%] max-md:py-2">
                        <h3>{month.toUpperCase()}</h3>
                        <h1>{day}</h1>
                        <h3>{year}</h3>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <p className="text-left text-(--background-colour) mx-2.5 max-w-100 min-w-67.5 line-clamp-3">{upcomingTrip 
                            ? "This would be where the description of the trip would go, but not sure where this would be pulled from?"
                            : "Time to start planning! Where are you thinking of going next?"}
                        </p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}