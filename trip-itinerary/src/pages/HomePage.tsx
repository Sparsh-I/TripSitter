import NavBar from '../components/global/NavBar.tsx';
import NewTrip from "../components/homepage/NewTrip.tsx";
import ConnectionsWidget from "../components/homepage/ConnectionsWidget.tsx";
import UpcomingTripWidget from "../components/homepage/UpcomingTripWidget.tsx";
import "../styles/Homepage.css";

export default function HomePage() {
    return (
        <div>
            <NavBar/>
            <div id="banner">
                <div className="white-label">
                    <h2>Welcome back, User! Planning a trip?</h2>
                </div>
                <NewTrip/>
            </div>
            <div className="notifications" id="notifications">
                <ConnectionsWidget/>
                <UpcomingTripWidget/>
            </div>
        </div>
    );
}