export interface Profile {
    id: string;
    firstName: string;
    lastName?: string;
    username: string;
    photoUrl?: string;
    email: string;
    residenceCountry: string;
}