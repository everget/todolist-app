import { clsx } from 'clsx';
import { type TaskList } from '@/types';
import { useT } from '@/shared/i18n/i18n-context';
import { EditButton } from '@/modules/todolist/shared/ui/buttons/edit-button';
import { RemoveButton } from '@/modules/todolist/shared/ui/buttons/remove-button';

interface ListOfListsItemProps {
    list: TaskList;
    onSelect: (id: string) => void;
    onEdit: (list: TaskList) => void;
    onRemove: (id: string) => void;
}

export function ListOfListsItem({ list, onSelect, onEdit, onRemove }: ListOfListsItemProps) {
    const t = useT();

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(list.id);
        }
    }

    return (
        <li
            data-testid="list-item"
            role="button"
            tabIndex={0}
            aria-current={list.isActive ? 'true' : undefined}
            aria-label={`${t('lists.select')} ${list.name}`}
            className={clsx(
                'group relative flex cursor-pointer items-center justify-between rounded-md p-3 outline-none focus:ring-2 focus:ring-primary',
                'hover:bg-secondary',
                list.isActive ? 'bg-secondary' : 'bg-background'
            )}
            onClick={() => onSelect(list.id)}
            onKeyDown={handleKeyDown}
        >
            <div data-testid="list-item-name" className="overflow-hidden text-ellipsis md:pr-4">
                {list.name}
            </div>
            <div className="flex w-full flex-wrap justify-end gap-2 transition-opacity md:absolute md:top-1/2 md:right-3 md:w-auto md:-translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                <EditButton
                    label={`${t('actions.edit')} ${list.name}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(list);
                    }}
                />
                <RemoveButton
                    label={`${t('actions.remove')} ${list.name}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(list.id);
                    }}
                />
            </div>
        </li>
    );
}
