import '../../styles/Homepage.css';
import { NavLink } from "react-router-dom";
import placeholder from '../../assets/trip_preview/placeholder.jpg'

export default function ConnectionsWidget() {

    return (
        <div className="w-full lg:w-[550px] h-[150px] flex align-stretch">
            <div className="[writing-mode:vertical-rl] rotate-180 bg-[var(--secondary-colour)] text-[var(--background-colour)] rounded-r-lg p-1 font-semibold">
                    RECENTLY
            </div>
            <div className="bg-[var(--background-colour)] text-black p-[10px] text-left w-[65%]">
                No recent activity to show!
            </div>

            <div className="connections-side">
                <div className="connections-link">
                    <NavLink className="connections-text" to="/connections">
                        GO TO CONNECTIONS
                    </NavLink>
                </div>
                <img className="placeholder-img" alt="placeholder" src={placeholder}/>
            </div>
        </div>
    );
}