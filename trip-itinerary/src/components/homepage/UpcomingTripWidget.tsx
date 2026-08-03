import { useEffect, useState } from "react";
import { closestUpcomingTrip } from "../../utils/TripDateUtils.ts";
import { getTrips } from "../../utils/TripStorage.ts";
import { getAlpha3, getCountryCode } from "../../utils/LocationUtils.ts";
import type { Trip } from "../../types/Trip.ts";

export default function UpcomingTripWidget() {
    const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
    const [endLocCode, setEndLocCode] = useState("XXX");

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

    const startLocCode = "CAN"; // This will later be set by the user as their default starting location

    let day = "DD", month = "MMM", year = "YYYY";
    if (upcomingTrip) {
        const startDate = new Date(upcomingTrip.startDate);
        day = startDate.toLocaleDateString("en-GB", { day: "numeric" });
        month = startDate.toLocaleDateString("en-GB", { month: "short" });
        year = startDate.toLocaleDateString("en-GB", { year: "numeric" });
    }

    if (!upcomingTrip) {
        return (
            <div className="upcoming-trips-widget">
                <table>
                    <tbody>
                    <tr>
                        <td><h3 className="white-text">No Upcoming Trips!</h3></td>
                        <td><h3 className="white-text">{startLocCode}➜{endLocCode}</h3></td>
                        <td rowSpan={2} className="upcoming-trip-date">
                            <h3 className="white-text">{month.toUpperCase()}</h3>
                            <h1 className="white-text" style={{ margin: "-5px 0" }}>{day}</h1>
                            <h3 className="white-text">{year}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <p id="upcoming-trip-desc">Time to start planning! Where are you thinking of going next?</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="upcoming-trips-widget">
            <table>
                <tbody>
                <tr>
                    <td><h3 className="white-text">{upcomingTrip?.title}</h3></td>
                    <td><h3 className="white-text">{startLocCode}➜{endLocCode}</h3></td>
                    <td rowSpan={2} style={{ verticalAlign: "middle", padding: "8px 20px", borderLeft: "1px dashed white" }}>
                        <h3 className="white-text">{month.toUpperCase()}</h3>
                        <h1 className="white-text" style={{ margin: "-5px 0" }}>{day}</h1>
                        <h3 className="white-text">{year}</h3>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <p id="upcoming-trip-desc">This would be where the description of the trip would go, but not sure where this would be pulled from?</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}