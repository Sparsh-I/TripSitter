import image from '/assets/images/double-rainbow.jpg';
import image2 from '/assets/images/path.png';
import {NavLink} from "react-router-dom";
import Login from "../../components/Login.tsx";
import logoTent from "/assets/logo/logo-tent.svg";
import logoText from "/assets/logo/logo-text.svg";
import Footer from "../../components/global/Footer.tsx";
import {useIsMobile} from "../../hooks/useIsMobile.ts";

export default function LandingPage() {
    const isMobile = useIsMobile();

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 -mb-7.5">
                <div className="w-full h-7.5 flex justify-center px-3.5 box-border mt-5 max-md:justify-around">
                    <NavLink to="/">
                        <div className="flex flex-row justify-center -mt-10">
                            <img className="w-18" src={logoTent} alt="Logo icon" />
                            <img className="w-50" src={logoText} alt="Logo text" />
                         </div>
                    </NavLink>
                </div>
                {isMobile && (
                    <div className="mt-5 flex flex-row">
                        <Login />
                    </div>
                )}
                {!isMobile && (
                    <div className="mt-5 flex flex-row">
                        <img className="w-[35%] bg-cover bg-center" src={image} alt="Double rainbow" />
                        <Login />
                        <img className="w-[35%] bg-cover bg-center" src={image2} alt="Path in a field" />
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}