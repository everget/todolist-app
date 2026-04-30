interface ListHeaderProps {
    text: string;
    textSecondPart?: string;
}

export function ListHeader({ text, textSecondPart }: ListHeaderProps) {
    return (
        <h2 className="mb-4 text-xl font-semibold">
            <span>{text}</span>
            {textSecondPart && (
                <>
                    {' - '}
                    <span>{textSecondPart}</span>
                </>
            )}
        </h2>
    );
}
