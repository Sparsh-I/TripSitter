import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import logOutIcon from "/assets/log-out.svg";
import { supabase } from "../../utils/SupabaseClient.ts";
import { useEffect, useState } from "react";
import { getProfile } from "../../utils/ProfileUtils.ts";

const NAV_LINKS = [
    { to: "/home", label: "Home" },
    { to: "/my-trips", label: "My Trips" },
    { to: "/connections", label: "Connections" },
    { to: "/my-map", label: "My Map" },
];

interface SidebarProps {
    onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        let cancelled = false;

        async function getProfileDetails() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || cancelled) return;
            const profile = await getProfile(user.id);
            if (!profile || cancelled) return;
            setUsername(profile.username);
        }

        void getProfileDetails();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return createPortal(
        <div
            className="fixed right-0 z-1005 flex h-full w-50 flex-col justify-between
                        rounded-none bg-(--background-colour) py-7.5 text-right"
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="list-none pr-5 pl-0">
                {NAV_LINKS.map(({ to, label }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) => isActive ? "active-link" : ""}
                        >
                            <h3 className="leading-[3] [.active-link_&]:underline [.active-link_&]:decoration-(--primary-colour-alt)">
                                {label}
                            </h3>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="flex w-[85%] flex-row justify-evenly self-center">
                <NavLink to="/profile">
                    <span className="relative top-1.25 z-1005 block size-12.5 rounded-full
                                        bg-(--primary-colour) bg-cover bg-center"></span>
                </NavLink>
                <h4 className="ml-2 mt-2.5 truncate">{username}</h4>
                <button
                    onClick={handleLogout}
                    className="mt-1.5 hidden bg-transparent p-2 max-md:block"
                >
                    <img src={logOutIcon} alt="Log Out" />
                </button>
            </div>
        </div>,
        document.body
    );
}