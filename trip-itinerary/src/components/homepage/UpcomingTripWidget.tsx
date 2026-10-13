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
        <div className="relative w-full lg:w-[500px] h-[148px] bg-[var(--primary-colour-alt)] rounded-lg overflow py-[0.25em]">
            <table className="h-full">
                <tbody>
                <tr className="[&_h3]:!text-white [&_h1]:!text-white">
                    <td><h3>{upcomingTrip?.title ?? "No Upcoming Trips!"}</h3></td>
                    <td><h3>{startLocCode}➜{endLocCode}</h3></td>
                    <td rowSpan={2} className="text-center items-center px-[8px] border-l-2 border-dashed border-white w-[20%]">
                        <h3>{month.toUpperCase()}</h3>
                        <h1 className="mx-[-5px]">{day}</h1>
                        <h3>{year}</h3>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <p id="upcoming-trip-desc">{upcomingTrip 
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

// .upcoming-trip-date {
//     vertical-align: middle;
//     padding: 8px 2px;
//     border-left: 1px dashed white;
//     width: 20%;

//     @media (max-width: 768px) {
//         padding: 0 8px;
//     }
// }

// .upcoming-trips-widget {
//     position: relative;
//     width: 500px;
//     height: 148px;
//     background: var(--primary-colour-alt);
//     border-radius: 15px;
//     overflow: visible;
//     padding: 0 1em;

//     table {
//         height: 100%;
//     }

//     h3 {
//         font-size: 20px;
//         line-height: 1.6;
//     }

//     @media (max-width: 768px) {
//         width: 90%;

//         td {
//             vertical-align: middle;
//             width: 30%;
//         }

//         h1 {
//             font-size: 32px;
//         }
//     }
// }

// .upcoming-trips-widget::before,
// .upcoming-trips-widget::after {
//     content: "";
//     position: absolute;
//     top: 50%;
//     width: 36px;
//     height: 36px;
//     background-color: #fff;
//     border-radius: 50%;
//     transform: translateY(-50%);
//     z-index: 2;
// }

// .upcoming-trips-widget::before {
//     left: -20px;
//     border-left: none;
// }

// .upcoming-trips-widget::after {
//     right: -20px;
// }

// #upcoming-trip-title, #upcoming-trip-desc {
//     text-align: left;
//     color: var(--background-colour);
//     padding: 0 20px;
//     margin: 10px 0;
//     max-width: 400px;
//     min-width: 230px;
//     white-space: break-spaces;
//     overflow: hidden;
//     text-overflow: ellipsis;

//     @media (max-width: 768px) {
//         margin: 0;
//     }
// }

// .upcoming-trip-date {
//     vertical-align: middle;
//     padding: 8px 2px;
//     border-left: 1px dashed white;
//     width: 20%;

//     @media (max-width: 768px) {
//         padding: 0 8px;
//     }
// }