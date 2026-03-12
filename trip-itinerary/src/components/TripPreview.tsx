import '../styles/TripPreview.css';

export default function TripPreview() {
    return (
        <div>
            <div className="trip-preview">
                <img src="../assets/placeholder.jpg" alt="placeholder" />
                <div className="trip-options">
                    <button className="alt">Preview</button>
                    <button className="alt">Edit</button>
                    <button className="alt">Share</button>
                </div>
            </div>
        </div>
    );
}