import image from '../assets/images/double-rainbow.jpg';
import image2 from '../assets/images/path.png';
import {NavLink} from "react-router-dom";
import Login from "../components/Login.tsx";
import '../styles/Main.css';

export default function MainPage() {
    return (
        <div>
            <div className="navbar">
                <NavLink to="/home"><h1 className="green-label">TripSitter</h1></NavLink>
            </div>
            <div className="main-container">
                <img className="main-image" src={image} alt="Night Sky" />
                <Login />
                <img className="main-image" src={image2} alt="Night Sky" />
            </div>
        </div>
    );
}