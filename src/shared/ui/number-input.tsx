import { type KeyboardEvent } from 'react';

interface NumberInputProps {
    value: string;
    onChange: (value: string) => void;
    min?: string | number;
    max?: string | number;
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
    onEnter?: () => void;
    id?: string;
    testId?: string;
}

export function NumberInput({
    value,
    onChange,
    min,
    max,
    placeholder,
    ariaLabel,
    className,
    onEnter,
    id,
    testId,
}: NumberInputProps) {
    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') onEnter?.();
    }

    return (
        <input
            id={id}
            data-testid={testId}
            type="number"
            min={min}
            max={max}
            value={value}
            aria-label={ariaLabel}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-background focus:ring-primary w-full appearance-none rounded-md border p-2 focus:ring-2 focus:outline-none ${className ?? ''}`}
        />
    );
}
