import NavBar from '../components/NavBar';
import NewTrip from "../components/NewTrip";
import ConnectionsWidget from "../components/ConnectionsWidget.tsx";
import "../styles/Homepage.css";

export default function HomePage() {

    return (
        <div>
            <NavBar/>
            <div id="banner">
                <div className="white-label">
                    <h1>Welcome back, User! Planning a trip?</h1>
                </div>
                <NewTrip/>
            </div>
            <div id="notifications">
                <ConnectionsWidget/>
            </div>
        </div>
    );
}