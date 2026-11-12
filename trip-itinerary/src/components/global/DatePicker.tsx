import { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { formatDate } from "../../utils/TripDateUtils.ts";

interface DatePickerProps {
    selected: DateRange | undefined;
    onSelect: (date: DateRange | undefined) => void;
    variant?: 'default' | 'popup';
    fieldSize: number;
    numMonths?: number;
    minDate?: Date;
    maxDate?: Date;
}

export default function DatePicker({ selected, onSelect, variant = 'default', fieldSize, numMonths = 2, minDate, maxDate }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const disabled: Matcher[] = [
        { before: minDate ?? new Date() },        // default: block the past
        ...(maxDate ? [{ after: maxDate }] : []), // only block the future if a max is set
    ];

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
                <div className="absolute left-65 z-1001 mt-1 w-max rounded-lg bg-white p-2.5
                                shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-md:left-0 max-md:w-77">
                    <DayPicker
                        mode="range"
                        selected={selected}
                        onSelect={onSelect}
                        numberOfMonths={numMonths}
                        disabled={disabled}
                        defaultMonth={selected?.from ?? minDate}
                        startMonth={minDate} 
                        endMonth={maxDate}
                    />
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <button className="bg-gray-500" onClick={clearDates}>Clear</button>
                        <button onClick={() => setOpen(false)}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}
