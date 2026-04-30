import type { MouseEventHandler } from 'react';
import { Button } from '@/shared/ui/button';

interface CancelButtonProps {
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function CancelButton({ label, onClick }: CancelButtonProps) {
    return (
        <Button
            ariaLabel={label}
            onClick={onClick}
            className="bg-danger hover:bg-danger-hover focus:ring-danger rounded-md px-4 py-2 text-white focus:ring-2 focus:outline-none"
        >
            {label}
        </Button>
    );
}
