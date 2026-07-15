import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MyTripsPage from "./pages/MyTripsPage.tsx";
import ConnectionsPage from "./pages/ConnectionsPage.tsx";
import MyMapPage from "./pages/MyMapPage.tsx";
import EditTripPage from "./pages/EditTripPage.tsx";

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/my-trips" element={<MyTripsPage/>}/>
        <Route path="/connections" element={<ConnectionsPage/>}/>
        <Route path="/my-map" element={<MyMapPage/>}/>

        <Route path="/edit-trip" element={<EditTripPage/>}></Route>
    </Routes>
  )
}