import HomePage from "./pages/HomePage.tsx";
import MyTripsPage from "./pages/MyTripsPage.tsx";
import ConnectionsPage from "./pages/ConnectionsPage.tsx";
import MyMapPage from "./pages/MyMapPage.tsx";
import EditTripPage from "./pages/EditTripPage.tsx";
import NewTripPage from "./pages/NewTripPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import ProtectedRoute from "./components/global/ProtectedRoute.tsx";
import { supabase } from "./utils/SupabaseClient.ts";
import { useEffect, useState } from "react";
import { getProfile } from "./utils/ProfileUtils.ts";

async function checkHasProfile(userId: string): Promise<boolean> {
    const profile = await getProfile(userId);
    return !!profile?.username;
}

export default function App() {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function checkAuthAndProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (cancelled) return;

            setLoggedIn(!!user);

            if (user) {
                const complete = await checkHasProfile(user.id);
                if (!cancelled) setProfileComplete(complete);
            } else {
                setProfileComplete(false);
            }
        }

        checkAuthAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session?.user);
            if (session?.user) {
                checkHasProfile(session.user.id).then(complete => {
                    if (!cancelled) setProfileComplete(complete);
                });
            } else {
                setProfileComplete(false);
            }
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    function homeRoute() {
        if (!loggedIn) return <MainPage/>;
        if (loggedIn && profileComplete === false) return <SignUpPage/>;
        return <ProtectedRoute><HomePage/></ProtectedRoute>;
    }

    return (
        <Routes>
            <Route path="/" element={homeRoute()}/>
            <Route path="/sign-up" element={<ProtectedRoute><SignUpPage/></ProtectedRoute>}/>

            <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage/></ProtectedRoute>}/>
            <Route path="/connections" element={<ProtectedRoute><ConnectionsPage/></ProtectedRoute>}/>
            <Route path="/my-map" element={<ProtectedRoute><MyMapPage/></ProtectedRoute>}/>

            <Route path="/my-trips/edit-trip/:id" element={<ProtectedRoute><EditTripPage/></ProtectedRoute>}/>
            <Route path="/my-trips/new-trip" element={<ProtectedRoute><NewTripPage/></ProtectedRoute>}/>
        </Routes>
    );
}