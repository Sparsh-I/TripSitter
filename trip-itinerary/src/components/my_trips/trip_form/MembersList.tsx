import { useCallback, useEffect, useState } from "react";
import type { Trip, TripMember } from "../../../types/Trip.ts";
import * as ConnUtils from "../../../utils/ConnectionUtils.ts";
import { useAuthContext } from "../../../context/AuthContext.tsx";
import TripMembersPopup from "./../TripMembersPopup.tsx";
import { getTripMembers, inviteTripMember } from "../../../utils/TripStorage";

interface MembersListProps {
    trip: Trip
}

export default function MembersList({ trip }: MembersListProps) {
    const { session } = useAuthContext();
    const userId = session?.user.id;

    const [members, setMembers] = useState<TripMember[]>([]);
    const [profiles, setProfiles] = useState<Record<string, ConnUtils.ProfileSummary>>({});
    const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
    const [showPopup, setShowPopup] = useState(false);

    // members + their profiles (also the owner's)
    const loadMembers = useCallback(async () => {
        try {
            const list = await getTripMembers(trip.id);
            setMembers(list);
            const ids = [...new Set([trip.ownerId, ...list.map(m => m.userId)])];
            const lookup = await ConnUtils.getProfileSummaries(ids);
            setProfiles(prev => ({ ...prev, ...lookup }));
        } catch (err) {
            console.error("Failed to load members:", err);
        }
    }, [trip.id, trip.ownerId]);

    useEffect(() => {
        void loadMembers();
    }, [loadMembers]);

    // who the current user already has a connection/request with
    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        ConnUtils.getConnections()
            .then(conns => {
                if (cancelled) return;
                setConnectedIds(new Set(conns.map(c => ConnUtils.otherUserId(c, userId))));
            })
            .catch(err => console.error("Failed to load connections:", err));
        return () => { cancelled = true; };
    }, [userId]);

    async function addMember(id: string) {
        await inviteTripMember(trip.id, id);
        await loadMembers();
    }

    async function sendRequest(otherId: string) {
        const username = profiles[otherId]?.username;
        if (!username) return;
        try {
            await ConnUtils.sendConnectionRequest(username);
            setConnectedIds(prev => new Set(prev).add(otherId));
        } catch (err) {
            console.error(err);
        }
    }

    const canAddConnection = (id: string) => id !== userId && !connectedIds.has(id);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex w-[90%] items-center justify-between py-6">
                <h3 className="m-0">Members</h3>
                <button onClick={() => setShowPopup(true)}>+ Add Member</button>
            </div>

            <ul className="w-[90%] [&_li]:odd:bg-(--background-colour) [&_li]:even:bg-white">
                <li className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <span>{ConnUtils.displayName(profiles[trip.ownerId])}</span>
                        <span className="shrink-0 rounded-full bg-(--primary-colour-alt2) px-2 py-0.5 text-xs">
                            Admin
                        </span>
                    </div>
                    {canAddConnection(trip.ownerId) && (
                        <button className="text-xs rounded-full" onClick={() => sendRequest(trip.ownerId)}>
                            Add connection
                        </button>
                    )}
                </li>

                {members.map(m => (
                    <li key={m.userId} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <span>{ConnUtils.displayName(profiles[m.userId])}</span>
                            <span className="shrink-0 rounded-full bg-(--background-colour-alt) px-2 py-0.5 text-xs">
                                {m.status === "pending" ? "Pending" : "Member"}
                            </span>
                        </div>
                        {canAddConnection(m.userId) && (
                            <button className="text-xs rounded-full" onClick={() => sendRequest(m.userId)}>
                                Add connection
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {showPopup && (
                <TripMembersPopup
                    trip={trip}
                    members={members}
                    onClose={() => setShowPopup(false)}
                    onAddMember={addMember}
                />
            )}
        </div>
    );
}