import image from '../assets/images/double-rainbow.jpg';
import image2 from '../assets/images/path.png';
import {NavLink} from "react-router-dom";
import Login from "../components/Login.tsx";
import '../styles/Main.css';
import logoTent from "../assets/logo/logo-tent.svg";
import logoText from "../assets/logo/logo-text.svg";
import Footer from "../components/global/Footer.tsx";
import {useIsMobile} from "../hooks/useIsMobile.ts";

export default function MainPage() {
    const isMobile = useIsMobile();

    return (
        <div>
            <div className="navbar" id="main-page-nav">
                <NavLink to="/">
                    <div className="logo">
                        <img id="icon" src={logoTent} alt="Logo icon" />
                        <img id="text" src={logoText} alt="Logo text" />
                    </div>
                </NavLink>
            </div>
            {isMobile && (
                <div className="main-container">
                    <Login />
                </div>
            )}
            {!isMobile && (
                <div className="main-container">
                    <img className="main-image" src={image} alt="Double rainbow" />
                    <Login />
                    <img className="main-image" src={image2} alt="Path in a field" />
                </div>
            )}
            <Footer/>
        </div>
    );
}