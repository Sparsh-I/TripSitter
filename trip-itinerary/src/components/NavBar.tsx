import { NavLink } from "react-router-dom";
import '../styles/NavBar.css';

export default function NavBar() {
    return (
        <div>
            <div className="navbar">
                <h1 className="logo">TripSitter</h1>
                <ul>
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}><h3 className="h3-text">Home</h3></NavLink></li>
                    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><h3 className="h3-text">My Trips</h3></NavLink></li>
                    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><h3 className="h3-text">Connections</h3></NavLink></li>
                    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><h3 className="h3-text">My Map</h3></NavLink></li>
                </ul>
                <span className="navbar-profile"></span>
            </div>
            <br/>
        </div>
    );
}