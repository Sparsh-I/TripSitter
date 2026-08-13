import '../../styles/SignUp.css';
import React, {useEffect, useRef, useState} from "react";
import {getProfile, updateProfile} from "../../utils/ProfileUtils.ts";
import type {Profile} from "../../types/Profile.ts";
import {supabase} from "../../utils/SupabaseClient.ts";
import {useNavigate} from "react-router-dom";

const countries = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia, Plurinational State of",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, Democratic Republic of the",
  "Cook Islands",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Republic of",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands, Kingdom of the",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "North Macedonia",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Réunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan, Province of China",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Türkiye",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom of Great Britain and Northern Ireland",
  "United States Minor Outlying Islands",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela, Bolivarian Republic of",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

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
        <div className="sign-up-page">
          <div className="sign-up-form">
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
                  {countries.map(country => (
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