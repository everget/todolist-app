import type { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    ariaLabel?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
    children,
    className = '',
    type = 'button',
    disabled,
    ariaLabel,
    onClick,
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    );
}
