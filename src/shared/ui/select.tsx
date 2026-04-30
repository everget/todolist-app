interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    id: string;
    label?: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    testId?: string;
}

export function Select({ id, label, value, options, onChange, testId }: SelectProps) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="mb-2 block">
                    {label}:
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    data-testid={testId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-background focus:ring-primary w-full appearance-none rounded-md border p-2 focus:ring-2 focus:outline-none"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <div className="border-b-foreground inline-block rotate-45 border-r-2 border-b-2 p-[3px]" />
                </div>
            </div>
        </div>
    );
}
