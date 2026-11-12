import { useSearchParams } from 'react-router-dom';

export function useTabParam<T extends string>(
    key: string,
    allowed: readonly T[],
    fallback: T,
    resetKeys: string[] = [],
) {
    const [searchParams, setSearchParams] = useSearchParams();

    const raw = searchParams.get(key);
    const active =
        raw !== null && (allowed as readonly string[]).includes(raw)
            ? (raw as T)
            : fallback;

    function open(tab: T) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set(key, tab);
            resetKeys.forEach(k => next.delete(k));
            return next;
        });
    }

    return [active, open] as const;
}