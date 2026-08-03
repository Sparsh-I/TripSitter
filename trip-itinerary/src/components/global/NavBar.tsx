import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import menuIcon from '../../assets/menu-icon.svg';
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";
import logoTent from '../../assets/logo/logo-tent.svg'
import logoText from '../../assets/logo/logo-text.svg'
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
                <NavLink to="/home">
                    <div className="logo">
                        <img id="icon" src={logoTent} alt="Logo icon" />
                        <img id="text" src={logoText} alt="Logo text" />
                    </div>
                </NavLink>
                <table>
                    <tbody>
                        <tr>
                            <td><NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}><p>Home</p></NavLink></td>
                            <td><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><p>My Trips</p></NavLink></td>
                            <td><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><p>Connections</p></NavLink></td>
                            <td><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><p>My Map</p></NavLink></td>
                        </tr>
                    </tbody>
                </table>
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