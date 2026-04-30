import { forwardRef, type KeyboardEvent } from 'react';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
    onEnter?: () => void;
    testId?: string;
    maxLength?: number;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        { value, onChange, placeholder, ariaLabel, className, onEnter, testId, maxLength = 500 },
        ref
    ) => {
        function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') onEnter?.();
        }

        return (
            <input
                ref={ref}
                type="text"
                value={value}
                aria-label={ariaLabel}
                data-testid={testId}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`bg-background focus:ring-primary w-full rounded-md border p-2 focus:ring-2 focus:outline-none ${className ?? ''}`}
            />
        );
    }
);

TextInput.displayName = 'TextInput';
