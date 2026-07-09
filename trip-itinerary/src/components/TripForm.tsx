import { useState, type FormEvent } from 'react';
import { useTrips } from '../hooks/UseTrips';

export function TripForm() {
    const { addTrip } = useTrips();
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        addTrip({ destination, lat: 0, lng: 0, startDate, endDate, notes });
        setDestination('');
        setStartDate('');
        setEndDate('');
        setNotes('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination" required />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
            <button type="submit">Add Trip</button>
        </form>
    );
}