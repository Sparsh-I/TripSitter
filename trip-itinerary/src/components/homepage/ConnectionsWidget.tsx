import '../../styles/Homepage.css';
import { NavLink } from "react-router-dom";
import placeholder from '../../assets/trip_preview/placeholder.jpg'

export default function ConnectionsWidget() {
    return (
        <div className="connections-widget">
            <div className="recently-label">RECENTLY</div>
            <div className="recently-description">
                No recent activity to show!
            </div>

            <div className="connections-side">
                <div className="connections-link"><NavLink className="connections-text" to="/connections">GO TO CONNECTIONS</NavLink></div>
                <img className="placeholder-img" alt="placeholder" src={placeholder}/>
            </div>
        </div>
    );
}