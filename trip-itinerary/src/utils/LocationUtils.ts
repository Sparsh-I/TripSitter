import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

export async function getCountryCode(lat: number, lng: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    const response = await fetch(url, {
        headers: { "User-Agent": "TripSitterApp/1.0" }
    });
    const data = await response.json();

    return data.address?.country_code?.toUpperCase() ?? null; // e.g. "CA", "PS", "SG"
}

countries.registerLocale(enLocale);

export function getAlpha3(alpha2: string): string | undefined {
    return countries.alpha2ToAlpha3(alpha2); // "CA" -> "CAN"
}