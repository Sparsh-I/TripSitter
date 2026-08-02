import {useAuthContext} from "../../context/AuthContext.tsx";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { session, loading } = useAuthContext();

    if (loading) return <p>Loading...</p>
    if (!session) return <Navigate to="/" />;

    return <>{children}</>
}