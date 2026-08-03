import NavBar from '../components/global/NavBar.tsx';
import QuickTrip from "../components/homepage/QuickTrip.tsx";
import ConnectionsWidget from "../components/homepage/ConnectionsWidget.tsx";
import UpcomingTripWidget from "../components/homepage/UpcomingTripWidget.tsx";
import "../styles/Homepage.css";
import Footer from "../components/global/Footer.tsx";

export default function HomePage() {
    return (
        <div>
            <NavBar/>
            <div id="banner">
                <div className="label white">
                    <h2>Welcome back, User! Planning a trip?</h2>
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