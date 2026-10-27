import { useEffect, useState } from "react";
import type { Trip } from "../../types/Trip";
import { createPortal } from "react-dom";
import { useAuthContext } from "../../context/AuthContext";
import * as ConnUtils from "../../utils/ConnectionUtils";
import type { TripMember } from "../../types/TripMember";

interface TripMembersPopupProps {
    trip: Trip;
    members: TripMember[];
    onClose: () => void;
    onAddMember: (userId: string) => Promise<void>
}

export default function TripMembersPopup({ trip, members, onClose, onAddMember }: TripMembersPopupProps) {
    const { session } = useAuthContext();
    const userId = session?.user.id;
    
    const [otherUsername, setOtherUsername] = useState("");
    const [sending, ] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string} | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<Record<string, ConnUtils.ProfileSummary>>({});

    const memberIds = new Set([trip.ownerId, ...members.map(m => m.userId) ?? []]);
    const sendDisabled = otherUsername.trim() === "" || sending;

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        (async () => {
            try {
                const conns = ConnUtils.currentConnections(await ConnUtils.getConnections());
                const ids = conns
                    .map(c => ConnUtils.otherUserId(c, userId))
                    .filter(id => !memberIds.has(id))
                    .slice(0, 5);
                const lookup = await ConnUtils.getProfileSummaries(ids);
                if (cancelled) return;
                setSuggestions(ids);
                setProfiles(lookup);
            } catch (err) {
                console.error("Failed to load connections:", err);
            }
        })();

        return () => { cancelled = true; };
    }, [userId, members, trip.ownerId]);

    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(t);
    }, [message]);

    async function handleAddByUsername() {
        const username = otherUsername.trim();
        if (!username) return;
        setBusyId("username");
        try {
            const id = await ConnUtils.getUserIdByUsername(username);
            if (memberIds.has(id)) throw new Error("Already on this trip");
            await onAddMember(id);
            setOtherUsername("");
            setMessage({ type: "success", text: `Request sent to ${username} to join the trip!` });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message ?? "Couldn't add that user. Please try again." });
        } finally {
            setBusyId(null);
        }
    }

    async function handleQuickAdd(id: string) {
        setBusyId(id);
        try {
            await onAddMember(id);
            setMessage({ type: "success", text: `Added ${ConnUtils.displayName(profiles[id])}!` });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Couldn't add that member. Please try again." });
        } finally {
            setBusyId(null);
        }
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content w-[40%] h-[50%]" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <h3 className="truncate mb-3">Share "{trip.title}"</h3>

                <div className="flex">
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Enter a username"
                        value={otherUsername}
                        onChange={e => setOtherUsername(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !sendDisabled && handleAddByUsername()}
                    />
                    <button
                        disabled={sendDisabled}
                        onClick={handleAddByUsername}
                        className={`ml-10 whitespace-nowrap ${
                            sendDisabled
                                ? "bg-[#9a9a9a] border-[#9a9a9a] cursor-not-allowed"
                                : "bg-(--primary-colour-alt) border-(--primary-colour-alt) cursor-pointer"
                        }`}
                    >
                        {busyId === "username" ? "Adding..." : "Add"}
                    </button>
                </div>

                {message && (
                    <p className={`text-start ${message.type === "success" ? "text-(--custom-green)" : "text-(--custom-red)"}`}>
                        {message.text}
                    </p>
                )}

                <h4 className="text-left mt-6 mb-2">Quick add</h4>
                <div className="h-[50%] overflow-y-auto">
                    {suggestions.length === 0 ? (
                        <p className="text-left text-[#909090]">No connections to suggest.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {suggestions.map(id => (
                                <li key={id} className="flex items-center justify-between py-2">
                                    <div className="text-left">
                                        <div>{ConnUtils.displayName(profiles[id])}</div>
                                        {profiles[id]?.username && (
                                            <div className="text-[#909090] text-[0.8rem]">@{profiles[id].username}</div>
                                        )}
                                    </div>
                                    <button
                                        disabled={busyId !== null}
                                        onClick={() => handleQuickAdd(id)}
                                        className="cursor-pointer bg-transparent px-3 py-[5px] text-(--primary-colour-alt) disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {busyId === id ? "Adding..." : "+ Add"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}