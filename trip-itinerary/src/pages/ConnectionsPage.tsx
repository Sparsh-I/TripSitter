import NavBar from '../components/global/NavBar.tsx';
// import construction from '../assets/under-construction.png';
import Footer from "../components/global/Footer.tsx";
import '../styles/Connections.css';

export default function ConnectionsPage() {
    function openTab(tabName: string) {
        return undefined;
    }

    return (
        <div>
            <NavBar/>
            <div className="connections-tabs">
                <button className="tab-button" onClick={openTab("Connections")}>Connections</button>
                <button className="tab-button" onClick={openTab("Requests")}>Requests</button>
                <button className="tab-button-alt" onClick={openTab("Add Connection")}>Add Connection</button>
            </div>
            <div className="connections-search">
                <h2>Make a new connection</h2>
                <br></br>
                <div className="input-wrapper">
                    <input
                        className="username-input"
                        type="text"
                        placeholder="Enter a username"
                    />
                    <button style={{whiteSpace: "nowrap", marginLeft: "40px"}}>Send Request</button>    
                </div>
            </div>
            {/* <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10%"}}>
                <img src={construction} alt="Under construction" style={{ maxWidth: "150px" }} />
            </div>
            <div>
                <h1>This page is still under construction.</h1>
            </div> */}
            <div style={{position: "fixed", bottom: 0, width: "100%"}}><Footer/></div>
        </div>
    );
}