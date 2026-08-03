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
// import ProtectedRoute from "./components/global/ProtectedRoute.tsx";
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
        <Route path="/" element={loggedIn ? <HomePage/> : <MainPage/>}/>

        <Route path="/home" element={<HomePage/>}/>
        <Route path="/my-trips" element={<MyTripsPage/>}/>
        <Route path="/connections" element={<ConnectionsPage/>}/>
        <Route path="/my-map" element={<MyMapPage/>}/>

        <Route path="/my-trips/edit-trip/:id" element={<EditTripPage/>}></Route>
        <Route path="/my-trips/new-trip" element={<NewTripPage/>}></Route>
    </Routes>
  )
}