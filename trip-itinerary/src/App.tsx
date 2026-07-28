// Page Imports
import HomePage from "./pages/HomePage.tsx";
import MyTripsPage from "./pages/MyTripsPage.tsx";
import ConnectionsPage from "./pages/ConnectionsPage.tsx";
import MyMapPage from "./pages/MyMapPage.tsx";
import EditTripPage from "./pages/EditTripPage.tsx";
import NewTripPage from "./pages/NewTripPage.tsx";

// Styling, components and function imports
import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import ProtectedRoute from "./components/global/ProtectedRoute.tsx";
import {supabase} from "./utils/SupabaseClient.ts";
import {useEffect, useState} from "react";

async function isLoggedIn(): Promise<boolean> {
    const {data : {user}} = await supabase.auth.getUser();
    return !!user;
}

export default function App() {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;

        isLoggedIn().then((result) => {
            if (!cancelled) setLoggedIn(result);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session?.user);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

  return (
    <Routes>
        <Route path="/" element={loggedIn ? <MainPage/> : <ProtectedRoute><HomePage/></ProtectedRoute>}/>

        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage/></ProtectedRoute>}/>
        <Route path="/connections" element={<ProtectedRoute><ConnectionsPage/></ProtectedRoute>}/>
        <Route path="/my-map" element={<ProtectedRoute><MyMapPage/></ProtectedRoute>}/>

        <Route path="/my-trips/edit-trip/:id" element={<ProtectedRoute><EditTripPage/></ProtectedRoute>}></Route>
        <Route path="/my-trips/new-trip/:id" element={<ProtectedRoute><NewTripPage/></ProtectedRoute>}></Route>
    </Routes>
  )
}