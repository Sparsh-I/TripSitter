export function TabButton({ active, alt = false, className = "", ...props }:
    { active: boolean; alt?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const style = active
        ? "!rounded-[10px] !bg-(--primary-colour) !text-black"
        : alt
            ? "rounded-[15px]"
            : "!rounded-[10px] !bg-white !text-black";
    return <button className={`${style} ${className}`} {...props} />;
}