import { useCallback, useEffect, useState } from "react";

interface ContextStateMenu<T> {
    x: number,
    y: number,
    data: T
}

export function useContextMenu<T>() {
    const [menu, setMenu] = useState<ContextStateMenu<T> | null>(null);

    const open = useCallback((e: React.MouseEvent, data: T) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY, data });
    }, []);

    const close = useCallback(() => setMenu(null), []);

    useEffect(() => {
        if (!menu) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        window.addEventListener("click", close);
        window.removeEventListener("contextmenu", close, true);
        window.addEventListener("scroll", close, true);
        window.addEventListener("keydown", onKey);
        
        return (() => {
            window.addEventListener("click", close);
            window.removeEventListener("contextmenu", close, true);
            window.addEventListener("scroll", close, true);
            window.addEventListener("keydown", onKey);
        });
    }, [menu, close]);

    return { menu, open, close }
}