import { NavLink } from "react-router-dom";
import '../../styles/NavBar.css';
import menuIcon from '../../assets/menu-icon.svg';
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";
import logoTent from '../../assets/logo/logo-tent.svg'
import logoText from '../../assets/logo/logo-text.svg'

export default function NavBar() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div>
            <div className="navbar">
                <NavLink to="/">
                    <div className="logo">
                        <img id="icon" src={logoTent} alt="Logo icon" />
                        <img id="text" src={logoText} alt="Logo text" />
                    </div>
                </NavLink>
                <table>
                    <tbody>
                        <tr>
                            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}><td><p>Home</p></td></NavLink>
                            <NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><td><p>My Trips</p></td></NavLink>
                            <NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><td><p>Connections</p></td></NavLink>
                            <NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><td><p>My Map</p></td></NavLink>
                        </tr>
                    </tbody>
                </table>
                {/*<ul>*/}
                {/*    <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}><p>Home</p></NavLink></li>*/}
                {/*    <li><NavLink to="/my-trips" className={({ isActive }) => isActive ? "active-link" : ""}><p>My Trips</p></NavLink></li>*/}
                {/*    <li><NavLink to="/connections" className={({ isActive }) => isActive ? "active-link" : ""}><p>Connections</p></NavLink></li>*/}
                {/*    <li><NavLink to="/my-map" className={({ isActive }) => isActive ? "active-link" : ""}><p>My Map</p></NavLink></li>*/}
                {/*</ul>*/}
                <span id="profile-large-screen" className="navbar-profile"></span>
                <button onClick={() => setShowSidebar(true)}>
                    <img src={menuIcon} className="menu-icon" alt="Menu"></img>
                </button>
            </div>
            <br/>

            {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}
        </div>
    );
}