import '../../styles/Homepage.css';
import {closestUpcomingTrip} from "../../utils/TripDateUtils.ts";
import {getTrips} from "../../utils/TripStorage.ts";
import {getAlpha3, getCountryCode} from "../../utils/LocationUtils.ts";

export default async function UpcomingTripWidget() {
    const upcomingTrip = closestUpcomingTrip(getTrips());
    let day: string;
    let month: string;
    let year: string;

    const startLocCode = "CAN";
    let code2: string | null;

    if (upcomingTrip) {
        const startDate = new Date(upcomingTrip.startDate);
        day = startDate.toLocaleDateString("en-GB", { day: "numeric" });
        month = startDate.toLocaleDateString("en-GB", { month: "short" });
        year = startDate.toLocaleDateString("en-GB", { year: "numeric" });
        code2 = await getCountryCode(upcomingTrip.lat, upcomingTrip.lng);
    } else {
        day = "DD";
        month = "MMM";
        year = "YYYY";
        code2 = null;
    }

    const endLocCode = code2 ? getAlpha3(code2) : "XXX";

    return (
        <div className="upcoming-trips-widget">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <h3 className="white-text">{upcomingTrip?.title}</h3>
                        </td>
                        <td>
                            <h3 className="white-text">{startLocCode}➜{endLocCode}</h3>
                        </td>
                        <td rowSpan={2} style={{ verticalAlign: "middle",  padding: "8px 20px", borderLeft: "1px dashed white" }}>
                            <h3 className="white-text">{month.toUpperCase()}</h3>
                            <h1 className="white-text" style={{margin: "-5px 0"}}>{day}</h1>
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