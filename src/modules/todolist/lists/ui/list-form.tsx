import { useState, useEffect } from 'react';
import { useT } from '@/shared/i18n/i18n-context';
import { TextInput } from '@/shared/ui/text-input';
import { AddButton } from '@/modules/todolist/shared/ui/buttons/add-button';
import { type TaskList } from '@/types';

import { config } from '@/config/config';

interface ListFormProps {
    editingList: TaskList | null;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

export function ListForm({ editingList, onSubmit, onCancel }: ListFormProps) {
    const t = useT();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (editingList) {
            setInputValue(editingList.name);
        } else {
            setInputValue('');
        }
    }, [editingList]);

    function handleSubmit() {
        const name = inputValue.trim();
        if (!name) return;
        onSubmit(name);
        setInputValue('');
    }

    return (
        <div className="mb-4 flex items-center gap-2">
            <TextInput
                value={inputValue}
                onChange={setInputValue}
                ariaLabel={editingList ? t('lists.edit') : t('lists.new')}
                placeholder={t('lists.inputPlaceholder')}
                onEnter={handleSubmit}
                testId="new-list-input"
                maxLength={config.validation.listNameMaxLength}
            />
            <AddButton
                label={editingList ? t('actions.update') : t('actions.add')}
                onClick={handleSubmit}
            />
            {editingList && (
                <button
                    type="button"
                    aria-label={t('actions.close')}
                    onClick={onCancel}
                    className="border-border hover:bg-secondary-2 focus:ring-primary rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
