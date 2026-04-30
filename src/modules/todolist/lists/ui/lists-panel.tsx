import { ListOfLists } from '@/modules/todolist/lists/ui/list-of-lists';

export function ListsPanel() {
    return (
        <aside data-testid="lists-panel" className="w-full md:w-1/4">
            <ListOfLists />
        </aside>
    );
}
