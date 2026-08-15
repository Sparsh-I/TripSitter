import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import '../../styles/PopupWindow.css';
import logOutIcon from "../../assets/log-out.svg";
import {supabase} from "../../utils/SupabaseClient.ts";
import {useEffect, useState} from "react";
import {getProfile} from "../../utils/ProfileUtils.ts";

interface SidebarProps {
    onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        let cancelled = false;

        async function getProfileDetails() {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user || cancelled) return;
            const profile = await getProfile(user.id);
            if (!profile) return;
            setUsername(profile.username);
        }

        void getProfileDetails();

        return () => {
            cancelled = true;
        };
    });

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <ul style={{paddingRight: "20px", paddingInlineStart: "0"}}>
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>Home</h3></NavLink></li>
                    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>My Trips</h3></NavLink></li>
                    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>Connections</h3></NavLink></li>
                    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""} onClick={onClose}><h3>My Map</h3></NavLink></li>
                </ul>
                <div className="profile-options">
                    <div id="profile-small-screen">
                        <NavLink to="/profile">
                            <span className="navbar-profile"></span>
                        </NavLink>
                    </div>
                    <h4>{username}</h4>
                    <button onClick={handleLogout} className="log-out-icon">
                        <img src={logOutIcon} alt="Log Out" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}