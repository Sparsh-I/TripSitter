import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {useIsMobile} from "../../hooks/useIsMobile.ts";
import type { TripLeg } from "../../types/Trip.ts";

interface Props {
    leg: TripLeg;
    onClose: () => void;
    onSave: (title: string) => Promise<void>;
}

export default function RenameTripPopup({ leg, onClose, onSave }: Props) {
    const [title, setTitle] = useState(leg.legTitle ?? leg.locationLabel);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const isMobile = useIsMobile();

    const saveDisabled = saving || !title.trim();

    async function saveTitle() {
        const trimmed = title.trim();
        if (!trimmed) return;

        setSaving(true);
        
        try {
            await onSave(trimmed);
            onClose();
        } catch (e) {
            console.error(e);
            alert("Couldn't rename this leg. Please try again.");
            setSaving(false);
        }
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup-content w-[30%] max-md:w-[90%] h-auto flex flex-col justify-center items-center"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="popup-close">x</button>
                <h3>Rename leg</h3>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveTitle()}
                    autoFocus
                    className="w-full my-4"
                />
                <button disabled={saveDisabled} onClick={saveTitle} className={`${
                    saveDisabled
                        ? "bg-[#9a9a9a] border-[#9a9a9a] cursor-not-allowed"
                        : "bg-(--primary-colour-alt) border-(--primary-colour-alt) cursor-pointer"}`}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>,
        document.body
    );
}