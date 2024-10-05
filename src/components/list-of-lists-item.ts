import { data } from '@/lib/dom';
import { TaskList } from '@/types';
import { EditButtonView } from './edit-button';
import { RemoveButtonView } from './remove-button';

export function ListOfListsItemView({ id, name }: TaskList) {
	return `
            <li
                ${data('selector', 'list-of-lists-item')} ${data('list-id', id as 'id')}
                class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
                <div ${data(
					'selector',
					'list-of-lists-item-name'
				)} class="text-ellipsis overflow-hidden">${name}</div>
                <div class="flex flex-wrap justify-end gap-2 w-full md:w-auto">
                    ${EditButtonView({ selector: 'edit-list-button' })}
                    ${RemoveButtonView({ selector: 'remove-list-button' })}
                </div>
            </li>
        `;
}
