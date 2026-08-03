import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import '../../styles/PopupWindow.css';
import logOutIcon from "../../assets/log-out.svg";
import {supabase} from "../../utils/SupabaseClient.ts";

interface SidebarProps {
    onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <ul>
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>Home</h3></NavLink></li>
                    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>My Trips</h3></NavLink></li>
                    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>Connections</h3></NavLink></li>
                    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>My Map</h3></NavLink></li>
                </ul>
                <div>
                    <div id="profile-small-screen">
                            <span className="navbar-profile"></span>
                            <h4>User Name</h4>
                    </div>
                    <button onClick={handleLogout} className="log-out-icon">
                        <img src={logOutIcon} alt="Log Out" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}