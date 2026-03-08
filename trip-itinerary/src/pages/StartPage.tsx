import { useState } from 'react';
import DatePicker from '../components/DatePicker';
import type {DateRange} from "react-day-picker";

export default function StartPage() {
    const [range, setRange] = useState<DateRange | undefined>(undefined);

    return (
        <div>
            <div className="navbar">
                <h1 className="logo">TripSitter</h1>
                <ul>
                    <li><h3 className="h3-text">Home</h3></li>
                    <li><h3 className="h3-text">My Trips</h3></li>
                    <li><h3 className="h3-text">Connections</h3></li>
                    <li><h3 className="h3-text">My Map</h3></li>
                </ul>
                <div className="navbar-profile">
                    <div className="profile-icon"/>
                </div>
            </div>
            <br/>
            <div id="banner">
                <div className="white-label">
                    <h1 className="h1-text">Welcome back, User! Planning a trip?</h1>
                </div>
                <div className="new-trip">
                    <div>
                        <div className="black-label">
                            <h3 className="h3-text">Title</h3>
                        </div>
                        <input className="title-input" type="text" placeholder="What are we calling this?"/>
                    </div>
                    <div>
                        <div className="black-label">
                            <h3 className="h3-text">Dates</h3>
                        </div>
                        <DatePicker selected={range} onSelect={setRange}/>
                    </div>
                </div>
            </div>
        </div>
    );
}