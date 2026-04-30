interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
}

export function Checkbox({ checked, onChange, ariaLabel }: CheckboxProps) {
    return (
        <input
            type="checkbox"
            checked={checked}
            aria-label={ariaLabel}
            onChange={(e) => onChange(e.target.checked)}
            className="form-checkbox border-border bg-secondary text-primary focus:ring-primary h-6 w-6 rounded"
        />
    );
}
