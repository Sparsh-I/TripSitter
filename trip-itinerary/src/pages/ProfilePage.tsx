import React, {useEffect, useRef, useState} from "react";
import type {Profile} from "../types/Profile.ts";
import {NavLink, useNavigate} from "react-router-dom";
import {supabase} from "../utils/SupabaseClient.ts";
import {getProfile, updateProfile} from "../utils/ProfileUtils.ts";
import {countryList} from "../utils/LocationUtils.ts";

export default function ProfilePage () {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [email, setEmail] = useState<string>("");

    const usernameRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || cancelled) return;

            setEmail(user.email ?? "");

            try {
                const result = await getProfile(user.id);
                if (!cancelled) setProfile(result);
            } catch (err) {
                console.error("Failed to load profile: ", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            await updateProfile({
                id: user.id,
                username: usernameRef.current?.value || undefined,
                firstName: firstNameRef.current?.value || undefined,
                lastName: lastNameRef.current?.value || undefined,
                email: email,
                residenceCountry: countryRef.current?.value || undefined,
            });

            navigate("/home");
        } catch (err) {
            console.error("Failed to save profile: ", err);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (<div>Loading...</div>)
    }

    return (
        <div>
            <div className="profile-page update">
                <button style={{ position: "fixed", top: "30px", left: "30px" }}>
                    <NavLink to="/home">
                        ←
                    </NavLink>
                </button>
                <div className="profile-form">
                    <h1>Update your profile</h1>

                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                defaultValue={profile?.username ?? ""}
                                ref={usernameRef}
                                readOnly
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="First Name"
                                defaultValue={profile?.firstName ?? ""}
                                ref={firstNameRef}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Last Name"
                                defaultValue={profile?.lastName ?? ""}
                                ref={lastNameRef}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" id="email" value={email} readOnly/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="residenceCountry">Country of Origin</label>
                            <select id="residenceCountry" ref={countryRef} defaultValue={profile?.residenceCountry ?? ""}>
                                <option value="">Where's home?</option>
                                {countryList.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" disabled={saving}>
                            {saving ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}