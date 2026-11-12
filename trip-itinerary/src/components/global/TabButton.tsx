export function TabButton({ active, alt = false, tab = false, className = "", ...props }:
    { active: boolean; alt?: boolean, tab?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    let style = active
        ? "rounded-4 bg-(--primary-colour) text-black"
        : alt
            ? "rounded-4"
            : "rounded-4 bg-white text-black";
    
    if (tab) {
        const base = "w-[32%] relative rounded-b-none rounded-t-xl border-0 text-black";

        const feet =
            "before:absolute before:bottom-0 before:-left-3 before:size-3 before:rounded-br-xl " +
            "before:shadow-[2px_2px_0_2px_var(--primary-colour-alt)] " +
            "after:absolute after:bottom-0 after:-right-3 after:size-3 after:rounded-bl-xl " +
            "after:shadow-[-2px_2px_0_2px_var(--primary-colour-alt)]";

        style = active
            ? `${base} ${feet} z-10 bg-(--primary-colour-alt) text-white`
            : alt
                ? `${base}`
                : `${base} bg-white hover:bg-(--background-colour-alt)`;
    }

    return <button className={`${style} ${className}`} {...props} />;
}