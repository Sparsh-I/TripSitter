import '../styles/Homepage.css';

export default function UpcomingTripWidget() {
    return (
        <div className="upcoming-trips-widget">
            <table>
                <tbody>
                    <tr>
                        <td style={{ verticalAlign: "middle",  padding: "8px 20px", borderRight: "1px dashed black" }}>
                            <h3 className="black-text">MMM</h3>
                            <h1 style={{margin: "-5px 0"}}>DD</h1>
                            <h3 className="black-text">YYYY</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}