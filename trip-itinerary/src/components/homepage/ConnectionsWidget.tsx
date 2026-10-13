import '../../styles/Homepage.css';
import { NavLink } from "react-router-dom";
import placeholder from '../../assets/trip_preview/placeholder.jpg'

export default function ConnectionsWidget() {

    return (
        <div className="w-[550px] max-md:w-full h-[150px] flex align-stretch">
            <div className="[writing-mode:vertical-rl] rotate-180 bg-[var(--secondary-colour)] text-[var(--background-colour)] rounded-r-lg p-1 font-semibold">
                    RECENTLY
            </div>
            <div className="bg-[var(--background-colour)] text-black p-[10px] text-left w-[65%]">
                No recent activity to show!
            </div>

            <div className="w-[150px] mt-[-24px]">
                <div className="bg-[var(--primary-colour-alt)] rounded-t-lg whitespace-nowrap hover:underline">
                    <NavLink className="!text-[var(--background-colour-alt)] text-xs max-md:text-2xs" to="/connections">
                        GO TO CONNECTIONS
                    </NavLink>
                </div>
                <img className="rounded-bl-lg w-full h-[85%] obejct-cover" alt="placeholder" src={placeholder}/>
            </div>
        </div>
    );
}