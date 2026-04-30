import { useState, useEffect } from 'react';
import { useT } from '@/shared/i18n/i18n-context';
import { Select } from '@/shared/ui/select';
import { NumberInput } from '@/shared/ui/number-input';

interface EstimateTimeSelectProps {
    value: number | null;
    onChange: (value: number | null) => void;
}

type Unit = 'm' | 'h' | 'd' | 'w';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY;

const UNITS: Array<{ id: Unit; multiplier: number }> = [
    { id: 'w', multiplier: SECONDS_IN_WEEK },
    { id: 'd', multiplier: SECONDS_IN_DAY },
    { id: 'h', multiplier: SECONDS_IN_HOUR },
    { id: 'm', multiplier: SECONDS_IN_MINUTE },
];

function getMultiplier(unit: Unit): number {
    return UNITS.find((u) => u.id === unit)?.multiplier ?? SECONDS_IN_HOUR;
}

function parseSeconds(seconds: number | null): { amount: string; unit: Unit } {
    if (!seconds) return { amount: '', unit: 'h' };

    for (const { id, multiplier } of UNITS) {
        if (seconds % multiplier === 0) {
            return { amount: String(seconds / multiplier), unit: id };
        }
    }

    // Fallback to minutes if it doesn't divide cleanly
    return { amount: String(Math.floor(seconds / SECONDS_IN_MINUTE)), unit: 'm' };
}

export function EstimateTimeSelect({ value, onChange }: EstimateTimeSelectProps) {
    const t = useT();

    const [amount, setAmount] = useState<string>(() => parseSeconds(value).amount);
    const [unit, setUnit] = useState<Unit>(() => parseSeconds(value).unit);

    useEffect(() => {
        const computed = amount === '' ? null : Number(amount) * getMultiplier(unit);
        if (value !== computed) {
            const parsed = parseSeconds(value);
            setAmount(parsed.amount);
            setUnit(parsed.unit);
        }
    }, [value, amount, unit]);

    function handleAmountChange(newAmount: string) {
        setAmount(newAmount);
        if (newAmount === '') {
            onChange(null);
        } else {
            onChange(Number(newAmount) * getMultiplier(unit));
        }
    }

    function handleUnitChange(newUnitStr: string) {
        const newUnit = newUnitStr as Unit;
        setUnit(newUnit);
        if (amount !== '') {
            onChange(Number(amount) * getMultiplier(newUnit));
        }
    }

    const unitOptions = [
        { value: 'm', label: t('units.minutes') },
        { value: 'h', label: t('units.hours') },
        { value: 'd', label: t('units.days') },
        { value: 'w', label: t('units.weeks') },
    ];

    return (
        <div>
            <label htmlFor="estimated-time-amount" className="mb-2 block">
                {t('tasks.estimateTime')}:
            </label>
            <div className="flex gap-2">
                <NumberInput
                    id="estimated-time-amount"
                    testId="estimated-time-amount"
                    min="1"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="1"
                    className="w-1/2"
                />
                <div className="w-1/2">
                    <Select
                        id="estimated-time-unit"
                        testId="estimated-time-unit"
                        value={unit}
                        options={unitOptions}
                        onChange={handleUnitChange}
                    />
                </div>
            </div>
        </div>
    );
}
