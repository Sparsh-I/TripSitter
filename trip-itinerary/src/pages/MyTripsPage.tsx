import NavBar from '../components/NavBar';
import TripPreview from "../components/TripPreview.tsx";

export default function MyTripsPage() {
    return (
        <div>
            <NavBar/>
            <div className="trips-carousels">
                <h2 style={{ textAlign: "left", padding: "20px 0"}}>My Trips</h2>
                <div className="upcoming-trips">
                    <div className="green-label">
                        <h3 className="black-text">Upcoming</h3>
                    </div>
                    <TripPreview/>
                </div>
                <div className="past-trips">
                    <div className="black-label">
                        <h3>Past</h3>
                    </div>
                    <TripPreview/>
                </div>
            </div>
        </div>
    );
}