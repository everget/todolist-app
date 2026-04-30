import type { MouseEventHandler } from 'react';
import { Button } from '@/shared/ui/button';

interface EditButtonProps {
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function EditButton({ label, onClick }: EditButtonProps) {
    return (
        <Button
            ariaLabel={label}
            onClick={onClick}
            className="border-border bg-background text-foreground hover:bg-secondary-2 focus:ring-primary inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
            <span className="3xl:inline ml-2 hidden">{label}</span>
        </Button>
    );
}
