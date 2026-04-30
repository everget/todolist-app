import { useState } from 'react';
import { EmptyContentIcon } from '@/shared/ui/empty-content-icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addList,
    editList,
    removeList,
    selectAllLists,
    selectActiveList,
    setActiveList,
} from '@/modules/todolist/lists/store/lists-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { type TaskList } from '@/types';
import { ListHeader } from '@/modules/todolist/shared/ui/list-header';
import { ListOfListsItem } from './list-of-lists-item';
import { ListForm } from './list-form';

export function ListOfLists() {
    const t = useT();
    const dispatch = useAppDispatch();
    const lists = useAppSelector(selectAllLists);
    const activeList = useAppSelector(selectActiveList);

    const [editingList, setEditingList] = useState<TaskList | null>(null);

    function handleSubmit(name: string) {
        if (editingList) {
            dispatch(editList({ id: editingList.id, name }));
            setEditingList(null);
        } else {
            const newList: TaskList = {
                id: crypto.randomUUID(),
                name,
                isActive: lists.length === 0,
            };
            dispatch(addList(newList));
            dispatch(setActiveList(newList.id));
        }
    }

    function handleEdit(list: TaskList) {
        setEditingList(list);
    }

    function handleCancelEdit() {
        setEditingList(null);
    }

    function handleRemove(id: string) {
        dispatch(removeList(id));
        if (activeList?.id === id) {
            const remaining = lists.filter((l) => l.id !== id);
            if (remaining.length > 0) {
                dispatch(setActiveList(remaining[0].id));
            }
        }
    }

    function handleSelect(id: string) {
        dispatch(setActiveList(id));
    }

    return (
        <div>
            <ListHeader text={t('lists.lists')} />

            <ListForm
                editingList={editingList}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
            />

            <ul role="list" aria-label={t('lists.lists')} className="space-y-2">
                {lists.length === 0 ? (
                    <li>
                        <EmptyContentIcon title={t('lists.noLists')} />
                    </li>
                ) : (
                    lists.map((list) => (
                        <ListOfListsItem
                            key={list.id}
                            list={list}
                            onSelect={handleSelect}
                            onEdit={handleEdit}
                            onRemove={handleRemove}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
