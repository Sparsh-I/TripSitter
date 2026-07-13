import '../styles/Homepage.css';
import { NavLink } from "react-router-dom";

export default function ConnectionsWidget() {
    return (
        <div className="connections-widget">
            <div className="recently-label">RECENTLY</div>
            <div className="recently-description">
                This is some sample text that would instead be
                replaced with a description of a connections's trip
            </div>

            <div className="connections-side">
                <div className="connections-link"><NavLink to="/connections">GO TO CONNECTIONS</NavLink></div>
                <img className="placeholder-img" alt="placeholder" src="/src/assets/trip_preview/placeholder.jpg"/>
            </div>
        </div>
    );
}