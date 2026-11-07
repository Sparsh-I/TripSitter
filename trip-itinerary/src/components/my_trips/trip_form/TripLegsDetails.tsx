import { useEffect, useState } from 'react';
import addFile from '/assets/my_trips/add-file.svg';
import addSquare from '/assets/my_trips/add-square.svg';
import { countryFlag, getCountryCode } from '../../../utils/LocationUtils.ts';
import type { TripLocation } from '../../global/LocationSearch.tsx';
import type { TripLeg } from '../../../types/Trip.ts';

interface TripLegsDetailsProps {
    tripLeg: TripLeg
}

interface LegPhoto {
    id: string;
    path: string;
    url: string;
}

export default function TripLegsDetails({ tripLeg }: TripLegsDetailsProps) {
    const [flag, setFlag] = useState("");
    const [location, setLocation] = useState<TripLocation | null>(null);

    useEffect(() => {
        if (!tripLeg) return;

        setLocation({lat: tripLeg.lat, lng: tripLeg.lng, label: tripLeg.locationLabel });

        if (!location) return;

        getCountryCode(location.lat, location.lng)
            .then(code => setFlag(countryFlag(code)))
            .catch(() => setFlag(""));
    }, [location?.lat, location?.lng]);

    return (
        <div>
            <div className="flex flex-col items-end">
                <h1 className="font-xl">
                    {flag}
                </h1>
            </div>
            <div className="flex flex-col gap-10">
                <div>
                    <h3 className="text-left pb-3">Photos</h3>
                    <button className="flex flex-col justify-center gap-3 items-center w-100 h-60 bg-gray-200 hover:bg-gray-300">
                        <span className="block size-10">
                            <img src={addSquare} alt="" className="object-cover"/>
                        </span>
                        <p>Upload photo</p>
                    </button>
                </div>

                <div>
                    <h3 className="text-left pb-3">Plan/Notes</h3>
                    <textarea className="w-full h-40"></textarea>
                </div>

                <div>
                    <h3 className="text-left pb-3">Files</h3>
                    <button className="flex flex-col justify-center gap-3 items-center w-35 h-35 bg-gray-200 hover:bg-gray-300">
                        <span className="block size-6">
                            <img src={addFile} alt="" className="object-cover"/>
                        </span>
                        <p>Upload file</p>
                    </button>
                </div>
            </div>
        </div>
    );
}