import NavBar from '../components/NavBar';
import NewTrip from "../components/NewTrip";

export default function HomePage() {

    return (
        <div>
            <NavBar/>
            <div id="banner">
                <div className="white-label">
                    <h1 className="h1-text">Welcome back, User! Planning a trip?</h1>
                </div>
                <NewTrip/>
            </div>
        </div>
    );
}