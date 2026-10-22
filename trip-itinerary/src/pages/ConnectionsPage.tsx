import NavBar from '../components/global/NavBar.tsx';
import Footer from "../components/global/Footer.tsx";
import { useState, useEffect, useCallback } from 'react';
import * as ConnUtils from "../utils/ConnectionUtils.ts";
import type { Connection } from '../types/Connection.ts';
import { useAuthContext } from '../context/AuthContext.tsx';
import { supabase } from '../utils/SupabaseClient.ts';
import { TabButton } from '../components/global/TabButton.tsx';
import { useTabParam } from '../hooks/useTabParam.ts';

const TABS = ["Connections", "Requests", "Add Connection"] as const;
const SUB_TABS = ["Incoming", "Outgoing"] as const;

export default function ConnectionsPage() {
    const [activeTab, openTab] = useTabParam("tab", TABS, "Connections", ["sub"]);
    const [activeSubTab, openSubTab] = useTabParam("sub", SUB_TABS, "Incoming");

    const [connections, setConnections] = useState<Connection[]>([]);
    const [otherUsername, setOtherUsername] = useState("");
    const [profiles, setProfiles] = useState<Record<string, ConnUtils.ProfileSummary>>({});
    
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string} | null>(null);
    
    const { session } = useAuthContext();
    const userId = session?.user.id;
    
    const load = useCallback(async () => {
        if (!userId) return;
        try {
            const conns = await ConnUtils.getConnections();
            const ids = conns.map(c => ConnUtils.otherUserId(c, userId!));
            const lookup = await ConnUtils.getProfileSummaries(ids);
            setConnections(conns);
            setProfiles(lookup);
        } catch (err) {
            console.error(err);
        }
    }, [userId]);
    
    useEffect(() => {
        if (!userId) return; 
        
        const channel = supabase
        .channel(`connections:${userId}`)
        .on("postgres_changes",
            {event: "*", schema: "public", table: "connections", filter: `user_id=eq.${userId}`},
            () => void load())
            .on("postgres_changes",
                {event: "*", schema: "public", table: "connections", filter: `connection_id=eq.${userId}`},
                () => void load())
                .subscribe((status, err) => console.log("realtime:", status, err));
                
                return () => { 
                    void supabase.removeChannel(channel);
                };
            }, [userId, load]);
            
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

    const WRAPPER = "w-full box-border px-[10%]";
    const HEADING = "text-left pt-[50px]";
    const TABLE = "w-full table-fixed";
    const ROW = "odd:bg-[#f2f2f2] even:bg-white";
    const CELL = "px-[5%] py-[1%] align-middle";
    
    const ACTION_BASE = "mx-[5px] cursor-pointer bg-transparent px-3 py-[5px]";
    const ACTION_PLAIN = `${ACTION_BASE} text-(--primary-colour-alt)`;
    const ACTION_GREEN = `${ACTION_BASE} border-2 border-(--custom-green) text-(--custom-green) hover:bg-(--custom-green) hover:text-(--background-colour)`;
    const ACTION_RED = `${ACTION_BASE} border-2 border-(--custom-red) text-(--custom-red) hover:bg-(--custom-red) hover:text-(--background-colour)`;
    
    function displayName(p?: ConnUtils.ProfileSummary) {
        return p ? `${p.first_name ?? ""} ${p.last_name ?? ""}` : "Unknown User";
    }

    const sendDisabled = otherUsername.trim() === "" || sending;
            
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1 p-10">
                <div className="flex justify-center gap-5 mt-10">
                    <TabButton active={activeTab === "Connections"} onClick={() => openTab("Connections")}>Connections</TabButton>
                    <TabButton active={activeTab === "Requests"} onClick={() => openTab("Requests")}>Requests</TabButton>
                    <TabButton active={activeTab === "Add Connection"} alt onClick={() => openTab("Add Connection")}>Add Connection</TabButton>
                </div>

                {activeTab === "Connections" && (
                    <div className={WRAPPER}>
                        <h2 className={HEADING}>Your Connections</h2>
                        <br />
                        <table className={TABLE}>
                            <tbody>
                                {current.length === 0 ? (
                                    <tr><td colSpan={3} className="no-content-display"><h4>No connections yet</h4></td></tr>
                                ) : current.map(connection => {
                                    const otherId = ConnUtils.otherUserId(connection, userId!);
                                    return (
                                        <tr key={`${connection.userId}-${connection.connectionId}`} className={ROW}>
                                            <td className={`${CELL} text-left`}>{displayName(profiles[otherId])}</td>
                                            <td className={`${CELL} text-right`}>
                                                <button className={ACTION_PLAIN} onClick={() => ConnUtils.viewProfile(otherId)}>View Profile</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "Requests" && (
                    <div className={WRAPPER}>
                        <h2 className={HEADING}>Pending Requests</h2>
                        <div className="flex justify-around gap-5 mt-2.5">
                            <TabButton active={activeSubTab === "Incoming"} className="!w-1/2" onClick={() => openSubTab("Incoming")}>Incoming</TabButton>
                            <TabButton active={activeSubTab === "Outgoing"} className="!w-1/2" onClick={() => openSubTab("Outgoing")}>Outgoing</TabButton>
                        </div>
                        <br />

                        {activeSubTab === "Incoming" && (
                            <table className={TABLE}>
                                <tbody>
                                    {incoming.length === 0 ? (
                                        <tr><td colSpan={3} className="no-content-display"><h4>No incoming requests</h4></td></tr>
                                    ) : incoming.map(c => (
                                        <tr key={`${c.userId}-${c.connectionId}`} className={ROW}>
                                            <td className={`${CELL} text-left`}>{displayName(profiles[c.userId])}</td>
                                            <td className={CELL}>
                                                <button className={ACTION_PLAIN} onClick={() => ConnUtils.viewProfile(c.userId)}>View Profile</button>
                                            </td>
                                            <td className={`${CELL} text-right`}>
                                                <button className={ACTION_GREEN} onClick={async () => { await ConnUtils.acceptRequest(c.userId); await load(); }}>✓</button>
                                                <button className={ACTION_RED} onClick={async () => { await ConnUtils.ignoreRequest(c.userId); await load(); }}>✘</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeSubTab === "Outgoing" && (
                            <table className={TABLE}>
                                <tbody>
                                    {outgoing.length === 0 ? (
                                        <tr><td colSpan={3} className="no-content-display"><h4>No outgoing requests</h4></td></tr>
                                    ) : outgoing.map(c => {
                                        const other = profiles[c.connectionId];
                                        return (
                                            <tr key={`${c.userId}-${c.connectionId}`} className={ROW}>
                                                <td className={`${CELL} text-left`}>
                                                    <div>{displayName(other)}</div>
                                                    {other?.username && <div className="text-[#909090] text-[0.8rem]">@{other.username}</div>}
                                                </td>
                                                <td className={CELL}>
                                                    <button className={ACTION_PLAIN} onClick={() => ConnUtils.viewProfile(c.connectionId)}>View Profile</button>
                                                </td>
                                                <td className={`${CELL} text-right`}>
                                                    <button className={ACTION_RED} onClick={async () => { await ConnUtils.cancelRequest(c.connectionId); await load(); }}>⏎</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "Add Connection" && (
                    <div className={WRAPPER}>
                        <h2 className={HEADING}>Make a new connection</h2>
                        <br />
                        <div className="flex">
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Enter a username"
                                value={otherUsername}
                                onChange={(e) => setOtherUsername(e.target.value)}
                            />
                            <button
                                disabled={sendDisabled}
                                onClick={handleSendRequest}
                                className={`ml-10 whitespace-nowrap ${sendDisabled}
                                    ? "bg-[#9a9a9a] border-[#9a9a9a] cursor-not-allowed"
                                    : "bg-(--primary-colour-alt) border-(--primary-colour-alt) cursor-pointer"}`}
                            >
                                {sending ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                        {message && (
                            <p className={`text-start ${message.type === "success" ? "text-(--custom-green)" : "text-(--custom-red)"}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}