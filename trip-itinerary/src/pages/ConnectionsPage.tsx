import NavBar from '../components/global/NavBar.tsx';
// import construction from '../assets/under-construction.png';
import Footer from "../components/global/Footer.tsx";
import '../styles/Connections.css';
import { useState, useEffect } from 'react';
import { getConnections, currentConnections, outgoingRequests, incomingRequests } from "../utils/ConnectionUtils.ts";
import type { Connection, ConnectionStatus } from '../types/Connection.ts';
import { useAuthContext } from '../context/AuthContext.tsx';

type TabName = "Connections" | "Requests" | "Add Connection";

export default function ConnectionsPage() {
    const [activeTab, setActiveTab] = useState<TabName>("Connections");
    const [connections, setConnections] = useState<Connection[]>([]);
    
    const { session } = useAuthContext();
    const userId = session?.user.id;
    
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
    const incoming = incomingRequests(connections, userId || "");
    const outgoing = outgoingRequests(connections, userId || "");

    const data = {
        userId : "user1",
        connectionId: "user2",
    };

    function makeTestConnection(data: any, status: string): Connection {
        const testConnection: Connection = {
            userId: data.userId,
            connectionId: data.connectionId,
            status: status as ConnectionStatus,
            updatedAt: new Date().getDate().toString(),
            createdAt: new Date().getDate().toString(),
        };
        return testConnection;
    }

    function generateTestConnections(num: number): void {
        for (let i = 0; i < num; i++) {
            const val = Math.random();
            val > 0.7 ? 
                current.push(makeTestConnection(data, "accepted")) : 
                val < 0.4 ? 
                    incoming.push(makeTestConnection(data, "pending")) : 
                    outgoing.push(makeTestConnection(data, "pending"));
        }
    }

    generateTestConnections(15);


    return (
        <div className="page-layout">
            <NavBar/>
            <div className="page-content">
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
                            { current.length == 0 ? (
                                <div className="no-content-display">
                                    <h4>No connections yet</h4>
                                </div>
                            ) : (
                                current.map(connection => (
                                    <tr>
                                        <td className="connection-cell left-aligned-cell">
                                            {connection.connectionId}
                                        </td>
                                        <td className="connection-cell right-aligned-cell">View Profile</td>
                                    </tr>
                                ))
                            )}
                        </table>
                    </div>
                )}

                {activeTab === "Requests" && (
                    <div className="connections-requests">
                        <h2>Pending Requests</h2>
                        <br></br>
                        <h4>Incoming</h4>
                        <table>
                            {incoming.length == 0 ? (
                                <div className="no-content-display">
                                    <h4>No incoming requests</h4>
                                </div>
                            ) : (
                                incoming.map(connection => (
                                    <tr>
                                        <td className="connection-cell left-aligned-cell">
                                            {connection.connectionId}
                                        </td>
                                        <td className="connection-cell">View Profile</td>
                                        <td className="connection-cell right-aligned-cell">Accept | Ignore</td>
                                    </tr>
                                ))
                            )}
                        </table>
                        <br></br>
                        <h4>Outgoing</h4>
                        <table>
                            {outgoing.length == 0 ?  (
                                <div className="no-content-display">
                                    <h4>No outgoing requests</h4>
                                </div>
                            ) : (
                                outgoing.map(connection => (
                                    <tr>
                                        <td className="connection-cell left-aligned-cell">
                                            {connection.connectionId}
                                        </td>
                                        <td className="connection-cell">View Profile</td>
                                        <td className="connection-cell right-aligned-cell">Cancel</td>
                                    </tr>
                                ))
                            )}
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
            </div>
            <Footer/>
        </div>
    );
}