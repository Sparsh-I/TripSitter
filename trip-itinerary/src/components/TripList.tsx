import { useTrips } from '../hooks/UseTrips';

export function TripList() {
    const { trips, deleteTrip } = useTrips();

    return (
        <div>
            {trips.map(trip => (
                <div key={trip.id} className="trip-card">
                    <h3>{trip.destination}</h3>
                    <p>{trip.startDate} → {trip.endDate}</p>
                    <p>{trip.notes}</p>
                    <button onClick={() => deleteTrip(trip.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}