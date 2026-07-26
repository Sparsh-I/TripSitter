import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import menuIcon from '../../assets/menu-icon.png';
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";

export default function NavBar() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div>
            <div className="navbar">
                <h1 className="green-label">TripSitter</h1>
                <ul>
                    <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}><h3>Home</h3></NavLink></li>
                    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><h3>My Trips</h3></NavLink></li>
                    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><h3>Connections</h3></NavLink></li>
                    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><h3>My Map</h3></NavLink></li>
                </ul>
                <span className="navbar-profile"></span>
                <button onClick={() => setShowSidebar(true)}>
                    <img src={menuIcon} className="menu-icon" alt="Menu"></img>
                </button>
            </div>
            <br/>

            {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}
        </div>
    );
}