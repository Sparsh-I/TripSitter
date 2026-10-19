import {useAuthContext} from "../../context/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import SplashScreen from "./SplashScreen.tsx";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { session, loading } = useAuthContext();

    if (loading) return <SplashScreen/>
    if (!session) return <Navigate to="/" />;

    return <>{children}</>
}