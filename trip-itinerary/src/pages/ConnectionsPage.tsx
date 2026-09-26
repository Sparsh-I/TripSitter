import NavBar from '../components/global/NavBar.tsx';
// import construction from '../assets/under-construction.png';
import Footer from "../components/global/Footer.tsx";
import '../styles/Connections.css';
import { useState, useEffect } from 'react';
import { getConnections, currentConnections, pendingRequests } from "../utils/ConnectionUtils.ts";
import type { Connection } from '../types/Connection.ts';

type TabName = "Connections" | "Requests" | "Add Connection";

export default function ConnectionsPage() {
    const [activeTab, setActiveTab] = useState<TabName>("Connections");
    const [connections, setConnections] = useState<Connection[]>([]);
    
        useEffect(() => {
            getConnections()
                .then(connections => setConnections(connections))
                .catch(e => {
                    console.error("Failed to load connections: ", e);
            });
        }, [])

    function openTab(tabName: TabName) {
        setActiveTab(tabName);
    }

    const current = currentConnections(connections);
    const pending = pendingRequests(connections);

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
                        {current.map(connection => (
                            <tr>
                                <td>
                                    <div>{connection.connectionId}</div>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            )}

            {activeTab === "Requests" && (
                <div className="connections-requests">
                    <h2>Pending Requests</h2>
                    <br></br>
                    {/* <h4>Incoming</h4> */}
                    <table>
                        {pending.map(connection => (
                            <tr>
                                <td><div>{connection.connectionId}</div></td>
                                <td>View Profile</td>
                            </tr>
                        ))}
                    </table>
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