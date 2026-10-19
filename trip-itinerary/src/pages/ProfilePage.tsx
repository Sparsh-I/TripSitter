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

    const INPUT = "read-only:text-[#A6A6A6] max-md:w-[200px] max-md:text-sm";

    function FormGroup({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
        return (
            <div className="grid grid-cols-[150px_400px] items-center gap-12 max-md:block">
                <label htmlFor={id} className="font-bold text-right">{label}</label>
                {children}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-center bg-cover
                        bg-[url('/assets/images/castle.jpg')]">
            <NavLink
                to="/home"
                className="fixed top-7.5 left-7.5 z-10 flex w-15 h-10 items-center justify-center
                        rounded-full !bg-(--primary-colour-alt) !text-(--background-colour)"
            >
                ←
            </NavLink>

            <div className="w-fit p-12.5 max-md:p-7.5 max-md:w-[60%] bg-white rounded-[30px]">
                <h1 className="max-md:text-[1.7rem]">Update your profile</h1>

                <form onSubmit={handleSave} className="mt-10 flex flex-col gap-8 items-center w-full">
                    <FormGroup id="username" label="Username">
                        <input type="text" id="username" placeholder="Username"
                            defaultValue={profile?.username ?? ""} ref={usernameRef} readOnly className={INPUT} />
                    </FormGroup>

                    <FormGroup id="firstName" label="First Name">
                        <input type="text" id="firstName" placeholder="First Name"
                            defaultValue={profile?.firstName ?? ""} ref={firstNameRef} className={INPUT} />
                    </FormGroup>

                    <FormGroup id="lastName" label="Last Name">
                        <input type="text" id="lastName" placeholder="Last Name"
                            defaultValue={profile?.lastName ?? ""} ref={lastNameRef} className={INPUT} />
                    </FormGroup>

                    <FormGroup id="email" label="E-mail">
                        <input type="text" id="email" value={email} readOnly className={INPUT} />
                    </FormGroup>

                    <FormGroup id="residenceCountry" label="Country of Origin">
                        <select id="residenceCountry" ref={countryRef}
                                defaultValue={profile?.residenceCountry ?? ""} className={INPUT}>
                            <option value="">Where's home?</option>
                            {countryList.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </FormGroup>

                    <button type="submit" disabled={saving}>
                        {saving ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}