import NavBar from '../components/global/NavBar.tsx';
// import construction from '../assets/under-construction.png';
import Footer from "../components/global/Footer.tsx";
import '../styles/Connections.css';
import { useState } from 'react';

type TabName = "Connections" | "Requests" | "Add Connection";

export default function ConnectionsPage() {
    const [activeTab, setActiveTab] = useState<TabName>("Connections");

    function openTab(tabName: TabName) {
        setActiveTab(tabName);
    }

    return (
        <div>
            <NavBar/>
            <div className="connections-tabs">
                <button 
                    className={activeTab === "Connections" ? "tab-button-active" : "tab-button"}
                    onClick={() => openTab("Connections")}
                >
                    Connections
                </button>
                <button 
                    className={activeTab === "Requests" ? "tab-button-active" : "tab-button"}
                    onClick={() => openTab("Requests")}
                >
                    Requests
                </button>
                <button 
                    className={activeTab === "Add Connection" ? "tab-button-active" : "tab-button-alt"}
                    onClick={() => openTab("Add Connection")}
                >
                    Add Connection
                </button>
            </div>

            {activeTab === "Connections" && (
                <div className="connections-list">
                    <h2>Your Connections</h2>
                    <br></br>
                    <table>
                        <tr>
                            <td>
                                <div>Connection 1</div>
                                <div>Location 1</div>
                                </td>
                            <td>View Profile</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Connection 2</div>
                                <div>Location 2</div>
                            </td>
                            <td>View Profile</td>
                        </tr>
                        <tr>
                            <td>
                                <div>Connection 3</div>
                                <div>Location 3</div>
                            </td>
                            <td>View Profile</td>
                        </tr>
                    </table>
                </div>
            )}

            {activeTab === "Requests" && (
                <div className="connections-requests">
                    <h2>Pending Requests</h2>
                    <ul>
                        <li>Request 1</li>
                        <li>Request 2</li>
                    </ul>
                </div>
            )}

            {activeTab === "Add Connection" && (
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
            )}

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