import { useEffect } from "react";
import { createPortal } from "react-dom";
import {useIsMobile} from "../../hooks/useIsMobile.ts";

interface PhotoPopupProps {
    photoUrl: string;
    onClose: () => void;
}

export default function PreviewTripPopup({ photoUrl, onClose }: PhotoPopupProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const isMobile = useIsMobile();

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <img src={photoUrl} alt="Trip Photo" className={`w-full ${isMobile ? 'h-auto' : 'h-[90vh]'} object-cover`} />
            </div>
        </div>,
        document.body
    );
}