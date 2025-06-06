import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeRangePickerProps {
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
  className?: string;
}

export function TimeRangePicker({ value, onChange, className }: TimeRangePickerProps) {
  const [startTime, setStartTime] = useState<number | null>(value ? value[0] : null);
  const [endTime, setEndTime] = useState<number | null>(value ? value[1] : null);

  useEffect(() => {
    if (startTime !== null && endTime !== null) {
      if (endTime <= startTime) {
        setEndTime(null);
      } else {
        onChange([startTime, endTime]);
      }
    } else {
      onChange(null);
    }
  }, [startTime, endTime, onChange]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleStartChange = (hour: string) => {
    const start = parseInt(hour);
    if (value) {
      onChange([start, value[1]]);
    } else {
      onChange([start, start + 1]);
    }
  };

  const handleEndChange = (hour: string) => {
    const end = parseInt(hour);
    if (value) {
      onChange([value[0], end]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={value ? value[0].toString() : undefined} onValueChange={handleStartChange}>
        <SelectTrigger className={`w-[120px] ${className}`}>
          <SelectValue placeholder="Inicio" />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {hours.map((hour) => (
            <SelectItem
              key={hour}
              value={hour.toString()}
              disabled={value ? hour >= value[1] : false}
              className="dark:hover:bg-slate-700"
            >
              {`${hour.toString().padStart(2, "0")}:00`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground">a</span>

      <Select
        value={value ? value[1].toString() : undefined}
        onValueChange={handleEndChange}
        disabled={!value}
      >
        <SelectTrigger className={`w-[120px] ${className}`}>
          <SelectValue placeholder="Fin" />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {hours.map((hour) => (
            <SelectItem
              key={hour}
              value={hour.toString()}
              disabled={hour <= (value ? value[0] : 0)}
              className="dark:hover:bg-slate-700"
            >
              {`${hour.toString().padStart(2, "0")}:00`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 