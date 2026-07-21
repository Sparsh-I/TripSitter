import NavBar from '../components/NavBar';
import TripPreview from '../components/TripPreview.tsx';
import TripCarousel from "../components/TripCarousel.tsx";
import type {Trip} from "../types/Trip.ts";


interface MyTripsPageProps {
    trips: Trip[]
}

export default function MyTripsPage({ trips }: MyTripsPageProps) {
    return (
        <div>
            <NavBar/>
            <div className="trips-carousels">
                <h2 style={{textAlign: "left", padding: "20px 0"}}>My Trips</h2>
                <div className="upcoming-trips">
                    <div className="green-label">
                        <h3 className="black-text">Upcoming</h3>
                    </div>
                    <TripCarousel trips={trips}/>
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