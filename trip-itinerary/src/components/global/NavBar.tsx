import { NavLink } from "react-router-dom";
import menuIcon from '/assets/menu-icon.svg';
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";
import logoTent from '/assets/logo/logo-tent.svg'
import logoText from '/assets/logo/logo-text.svg'
import {supabase} from "../../utils/SupabaseClient.ts";
import logOutIcon from "/assets/log-out.svg";

const NAV_LINKS = [
    { to: "/home", label: "Home" },
    { to: "/my-trips", label: "My Trips" },
    { to: "/connections", label: "Connections" },
    { to: "/my-map", label: "My Map" },
];

export default function NavBar() {
    const [showSidebar, setShowSidebar] = useState(false);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <div className="w-full h-7.5 mt-5 px-14 box-border flex items-center">
                <NavLink to="/home">
                    <div className="flex flex-row justify-center">
                        <img src={logoTent} alt="Logo icon" className="w-17.5"  />
                        <img src={logoText} alt="Logo text" className="w-45" />
                    </div>
                </NavLink>
                
                <table className="flex mt-1.25 ml-7.5 max-md:hidden">
                    <tbody>
                        <tr>
                            {NAV_LINKS.map(({ to, label }) => (
                                <td
                                    key={to}
                                    className="px-3 pb-2 transition-colors duration-200
                                               has-[.active-link]:border-b-[3px]
                                               has-[.active-link]:border-(--primary-colour)"
                                >
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) =>
                                            `text-[#1a1a1a] ${isActive ? "active-link" : ""}`}
                                    >
                                        <p className="cursor-pointer hover:text-(--primary-colour-alt)">{label}</p>
                                    </NavLink>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                <NavLink to="/profile">
                    <span className="absolute top-2.5 right-12.5 block size-12.5 rounded-full
                                     bg-(--primary-colour) bg-cover bg-center max-md:hidden"></span>
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="absolute right-25 block rounded-[110px] bg-transparent focus:outline-none max-md:hidden"
                >
                    <img src={logOutIcon} alt="Log Out" />
                </button>

                <button
                    onClick={() => setShowSidebar(true)}
                    className="absolute right-5 hidden hover:border-white focus:border-white focus:outline-none
                               max-md:block max-md:bg-transparent"
                >
                    <img src={menuIcon} className="w-10" alt="Menu" />
                </button>
            </div>
            <br/>

            {showSidebar && 
                <>
                    <div 
                        onClick={() => setShowSidebar(false)}
                        className="fixed inset-0 z-40 bg-black/40"
                    />
                    <Sidebar onClose={() => setShowSidebar(false)} />
                </>
            }
        </div>
    );
}