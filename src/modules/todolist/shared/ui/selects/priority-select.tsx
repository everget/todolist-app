import { config } from '@/config/config';
import { type TaskPriority } from '@/types';
import { useT } from '@/shared/i18n/i18n-context';
import { Select } from '@/shared/ui/select';

interface PrioritySelectProps {
    value: TaskPriority;
    onChange: (value: TaskPriority) => void;
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
    const t = useT();
    const options = config.tasks.validPriorities.map((p) => ({
        value: p,
        label: t(`tasks.priority.${p}`),
    }));

    return (
        <Select
            id="priority"
            testId="priority-select"
            label={t('tasks.priority.label')}
            value={value}
            options={options}
            onChange={(v) => onChange(v as TaskPriority)}
        />
    );
}
