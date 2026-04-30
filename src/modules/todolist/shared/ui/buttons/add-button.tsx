import type { MouseEventHandler } from 'react';
import { Button } from '@/shared/ui/button';

interface AddButtonProps {
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function AddButton({ label, onClick }: AddButtonProps) {
    return (
        <Button
            ariaLabel={label}
            onClick={onClick}
            className="bg-primary hover:bg-primary-hover focus:ring-primary rounded-md px-4 py-2 text-white focus:ring-2 focus:outline-none"
        >
            {label}
        </Button>
    );
}
