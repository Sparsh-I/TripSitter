import { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '../styles/DateRangePicker.css';
import { formatDate } from "../utils/DateUtils.tsx";

interface DatePickerProps {
    selected: DateRange | undefined;
    onSelect: (date: DateRange | undefined) => void;
    variant?: 'default' | 'popup';
    fieldSize: number;
    numMonths: number;
}

export default function DatePicker({ selected, onSelect, variant = 'default', fieldSize, numMonths = 2 }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const inputValue =
        selected?.from && selected?.to
            ? `${formatDate(selected.from)} ➜ ${formatDate(selected.to)}`
            : selected?.from
                ? `${formatDate(selected.from)}-...}`
                : '';

    function clearDates() {
        onSelect(undefined);
    }

    const containerClass = variant === 'popup' ? 'date-picker-input-popup' : 'date-picker-input';

    return (
        <div ref={ref} className={containerClass}>
            <input
                readOnly
                placeholder="When?"
                value={inputValue}
                onClick={() => setOpen((prev) => !prev)}
                className="date-picker-field"
                size={fieldSize}
            />

            {open && (
                <div className="date-picker-dropdown">
                    <DayPicker
                        mode="range"
                        selected={selected}
                        onSelect={onSelect}
                        numberOfMonths={numMonths}
                        disabled={{ before: new Date() }}
                    />
                    <button onClick={clearDates}>Clear</button>
                </div>
            )}
        </div>
    );
}
