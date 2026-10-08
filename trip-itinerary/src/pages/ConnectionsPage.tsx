import NavBar from '../components/global/NavBar.tsx';
import Footer from "../components/global/Footer.tsx";
import '../styles/Connections.css';
import { useState, useEffect } from 'react';
import * as ConnUtils from "../utils/ConnectionUtils.ts";
import type { Connection } from '../types/Connection.ts';
import { useAuthContext } from '../context/AuthContext.tsx';
import { useSearchParams } from 'react-router-dom';

const TABS = ["Connections", "Requests", "Add Connection"] as const;
const SUB_TABS = ["Incoming", "Outgoing"] as const;

type TabName = typeof TABS[number];
type SubTabName = typeof SUB_TABS[number];

function parseParams<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
    return value !== null && (allowed as readonly string[]).includes(value)
        ? (value as T)
        : fallback;
}

export default function ConnectionsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = parseParams<TabName>(searchParams.get("tab"), TABS, "Connections");
    const activeSubTab = parseParams<SubTabName>(searchParams.get("sub"), SUB_TABS, "Incoming");
    
    const [connections, setConnections] = useState<Connection[]>([]);
    const [otherUsername, setOtherUsername] = useState("");
    const [profiles, setProfiles] = useState<Record<string, ConnUtils.ProfileSummary>>({});

    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string} | null>(null);
    
    const { session } = useAuthContext();
    const userId = session?.user.id;

    useEffect(() => {
        if (!userId) return; 
        let cancelled = false;
        
        async function load() {
            try {
                const conns = await ConnUtils.getConnections();
                const ids = conns.map(c => ConnUtils.otherUserId(c, userId!));
                const lookup = await ConnUtils.getProfileSummaries(ids);
                if (cancelled) return;
                setConnections(conns);
                setProfiles(lookup);
            } catch (err) {
                console.error(err);
            }
        }

        void load();
        return () => { cancelled = true };
}, [userId]);

    function openTab(tabName: TabName) {
        setSearchParams({tab: tabName})
    }

    function openSubTab(subTabName: SubTabName) {
        setSearchParams({tab: "Requests", sub: subTabName})
    }

    const current = ConnUtils.currentConnections(connections);
    const incoming = ConnUtils.incomingRequests(connections, userId!);
    const outgoing = ConnUtils.outgoingRequests(connections, userId!);

    async function handleSendRequest() {
        if (!userId || !otherUsername) return;
        setSending(true);

        try {
            await ConnUtils.sendConnectionRequest(otherUsername);
            setOtherUsername("");
            setMessage({type: "success", text: `Connection request sent to ${otherUsername}!`})
        } catch (err) {
            setMessage({type: "error", text: "Connection request failed to send. Please try again."})       
            console.error("Failed to send connection request", err);
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(t);
    }, [message]);

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
                            <tbody>
                                { current.length == 0 ? (
                                    <tr>
                                        <td colSpan={3} className="no-content-display">
                                            <h4>No connections yet</h4>
                                        </td>
                                    </tr>
                                ) : (
                                    current.map(connection => {
                                        const other = profiles[ConnUtils.otherUserId(connection, userId!)];
                                        const displayName = other
                                            ? ((other.first_name ?? "") + " " + (other.last_name ?? ""))
                                            : "Unknown User";
                                        
                                        return (
                                            <tr>
                                                <td className="connection-cell left-aligned-cell">
                                                    {displayName}
                                                </td>
                                                <td className="connection-cell right-aligned-cell">
                                                    <button onClick={() => ConnUtils.viewProfile(ConnUtils.otherUserId(connection, userId!))} id="view-profile">View Profile</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "Requests" && (
                    <div className="connections-requests">
                        <h2>Pending Requests</h2>
                        <div className="sub-tabs">
                            <button 
                                className={`sub-tab ${activeSubTab === "Incoming" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openSubTab("Incoming")}
                            >
                                Incoming
                            </button>
                            <button 
                                className={`sub-tab ${activeSubTab === "Outgoing" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openSubTab("Outgoing")}
                            >
                                Outgoing
                            </button>
                        </div>

                        <br></br>

                        {activeSubTab === "Incoming" && (
                            <table>
                                <tbody>
                                    {incoming.length == 0 ? (
                                        <tr>
                                            <td colSpan={3} className="no-content-display">
                                                <h4>No incoming requests</h4>
                                            </td>
                                        </tr>
                                    ) : (
                                        incoming.map(connection => {
                                            const other = profiles[connection.userId];
                                            const displayName = other
                                                ? ((other.first_name ?? "") + " " + (other.last_name ?? ""))
                                                : "Unknown User";

                                            return (
                                                <tr key={`${connection.userId}-${connection.connectionId}`}>
                                                    <td className="connection-cell left-aligned-cell">
                                                        {displayName}
                                                    </td>
                                                    <td className="connection-cell">
                                                        <button onClick={() => ConnUtils.viewProfile(connection.userId)} id="view-profile">View Profile</button>
                                                    </td>
                                                    <td className="connection-cell right-aligned-cell">
                                                        <button onClick={() => ConnUtils.acceptRequest(connection.userId)} id="accept-req" className="green">✓</button>
                                                        <button onClick={() => ConnUtils.ignoreRequest(connection.userId)} id="ignore-req" className="red">✘</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeSubTab === "Outgoing" && (
                            <table>
                                <tbody>
                                    {outgoing.length == 0 ?  (
                                        <tr>
                                            <td colSpan={3} className="no-content-display">
                                                <h4>No outgoing requests</h4>
                                            </td>
                                        </tr>
                                    ) : (
                                        outgoing.map(connection => {
                                            const other = profiles[connection.connectionId];
                                            const displayName = other
                                                ? ((other.first_name ?? "") + " " + (other.last_name ?? ""))
                                                : "Unknown User";
                                            
                                            return (
                                                <tr key={`${connection.userId}-${connection.connectionId}`}>
                                                    <td className="connection-cell left-aligned-cell">
                                                        <div>{displayName}</div>
                                                        {other?.username && (
                                                            <div style={{color: "#909090", fontSize: "0.8rem"}}>@{other.username}</div>
                                                        )}
                                                    </td>
                                                    <td className="connection-cell">
                                                        <button onClick={() => ConnUtils.viewProfile(connection.connectionId)}
                                                        id="view-profile">View Profile</button>
                                                    </td>
                                                    <td className="connection-cell right-aligned-cell">
                                                        <button onClick={() => ConnUtils.cancelRequest(connection.connectionId)} className="red">⏎</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "Add Connection" && (
                    <div className="connections-search">
                        <h2>Make a new connection</h2>
                        <br></br>
                        <div className="input-wrapper">
                            <input
                                id="username-input"
                                className="username-input"
                                type="text"
                                placeholder="Enter a username"
                                value={otherUsername}
                                onChange={(e) => setOtherUsername(e.target.value)}
                            />
                            <button disabled={otherUsername.trim() == "" || sending} 
                                    style={{whiteSpace: "nowrap", marginLeft: "40px",
                                        backgroundColor: otherUsername.trim() == "" || sending ? "#9a9a9a" : "var(--primary-colour-alt)",
                                        borderColor: otherUsername.trim() == "" || sending ? "#9a9a9a" : "var(--primary-colour-alt)",
                                        cursor: otherUsername.trim() == "" || sending ? "not-allowed" : "pointer",
                                    }} onClick={handleSendRequest}>
                                {sending ? "Sending..." : "Send Request"}
                            </button>    
                        </div>
                        {message && (
                            <p style={{textAlign: "start", color: message.type == "success" ? "var(--custom-green)" : "var(--custom-red)"}}>
                                {message.text}
                            </p>
                        )}
                        
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}