import '../styles/TripPreview.css';
import placeholder from '../assets/trip_preview/placeholder.jpg';
import eye from '../assets/trip_preview/eye.svg';
import eyeHover from '../assets/trip_preview/eye-hover.svg';
import edit from '../assets/trip_preview/edit.svg';
import editHover from '../assets/trip_preview/edit-hover.svg';
import share from '../assets/trip_preview/share.svg';
import shareHover from '../assets/trip_preview/share-hover.svg';
import { useNavigate } from "react-router-dom";

export default function TripPreview() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="trip-preview">
                <img src={placeholder} alt="placeholder"/>
                <div className="trip-options">
                    <button className="alt">
                        <div className="image-container">
                            <img className="img-main" src={eye} alt="Preview"/>
                            <img className="img-hover" src={eyeHover} alt="Preview Hovered"/>
                        </div>
                    </button>
                    <button className="alt" onClick={() => navigate("/edit-trip")}>
                        <div className="image-container">
                            <img className="img-main" src={edit} alt="Edit"/>
                            <img className="img-hover" src={editHover} alt="Edit Hovered"/>
                        </div>
                    </button>
                    <button className="alt">
                        <div className="image-container">
                            <img className="img-main" src={share} alt="Share"/>
                            <img className="img-hover" src={shareHover} alt="Share Hovered"/>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}