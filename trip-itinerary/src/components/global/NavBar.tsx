import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import menuIcon from '../../assets/menu-icon.png';
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";
import {useAuthContext} from "../../context/AuthContext.tsx";
import {supabase} from "../../utils/SupabaseClient.ts";

export default function NavBar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const {session} = useAuthContext();

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <div className="navbar">
                <NavLink to="/home"><h1 className="green-label">TripSitter</h1></NavLink>
                <ul>
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}><h3>Home</h3></NavLink></li>
                    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><h3>My Trips</h3></NavLink></li>
                    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><h3>Connections</h3></NavLink></li>
                    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><h3>My Map</h3></NavLink></li>
                </ul>
                <span id="profile-large-screen" className="navbar-profile"></span>
                { session ? (
                    <button onClick={handleLogout}>Log Out</button>
                ) : (
                    <NavLink to="/">Log In</NavLink>
                )}
                <button onClick={() => setShowSidebar(true)}>
                    <img src={menuIcon} className="menu-icon" alt="Menu"></img>
                </button>
            </div>
            <br/>

            {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}
        </div>
    );
}