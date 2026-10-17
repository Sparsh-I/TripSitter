export default function Footer() {
    return (
        <div className="mt-[30px] p-[30px] bg-(--secondary-colour)">
            <p className="!text-(--background-colour)">© {new Date().getFullYear()} TripSitter </p>
        </div>
    );
}