import '../../styles/Homepage.css';

export default function UpcomingTripWidget() {
    return (
        <div className="upcoming-trips-widget">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <h3 className="white-text">Trip Title</h3>
                        </td>
                        <td>
                            <h3 className="white-text">LOCA➜TION</h3>
                        </td>
                        <td rowSpan={2} style={{ verticalAlign: "middle",  padding: "8px 20px", borderLeft: "1px dashed white" }}>
                            <h3 className="white-text">MMM</h3>
                            <h1 className="white-text" style={{margin: "-5px 0"}}>DD</h1>
                            <h3 className="white-text">YYYY</h3>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <p id="upcoming-trip-desc">This would be where the description of the trip would go, but not sure where this would be pulled from?</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}