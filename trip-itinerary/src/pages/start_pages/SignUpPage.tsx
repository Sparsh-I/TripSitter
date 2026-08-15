import '../../styles/Profile.css';
import React, {useEffect, useRef, useState} from "react";
import {getProfile, updateProfile} from "../../utils/ProfileUtils.ts";
import type {Profile} from "../../types/Profile.ts";
import {supabase} from "../../utils/SupabaseClient.ts";
import {useNavigate} from "react-router-dom";
import {countryList} from "../../utils/LocationUtils.ts";

export default function SignUpPage() {
  const [, setLoading] = useState(true);
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

  async function handleSubmit(e: React.FormEvent) {
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

  return (
      <div>
        <div className="profile-page sign-up">
          <div className="profile-form">
            <h1>Set up your profile</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={profile?.username ?? ""}
                    ref={usernameRef}
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
                  <option value="">Where would you usually start trips from?</option>
                  {countryList.map(country => (
                      <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}