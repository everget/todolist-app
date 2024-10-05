import { store } from '@/store';

const locales = {
	en: {
		actions: {
			add: 'Add',
			edit: 'Edit',
			move: 'Move',
			remove: 'Remove',
			update: 'Update',
			open: 'Open',
			close: 'Close',
			cancel: 'Cancel',
			done: 'Done',
			ok: 'Ok',
			sort: 'Sort',
		},
		flags: {
			en: 'Flag of the United Kingdom',
			br: 'Flag of Brazil',
			es: 'Flag of Spain',
			ua: 'Flag of Ukraine',
			ru: 'Flag of Russia',
		},
		date: 'Date',
		default: 'Default',
		lists: {
			lists: 'Lists',
			new: 'New List',
			edit: 'Edit List',
			remove: 'Remove List',
			inputPlaceholder: 'New List...',
			noLists: 'No lists are created yet',
			noListSelected: 'No list selected',
		},
		moon: 'Moon',
		none: 'None',
		sun: 'Sun',
		tasks: {
			tasks: 'Tasks',
			new: 'New Task',
			edit: 'Edit task',
			remove: 'Remove task',
			moveToList: 'Move to list',
			inputPlaceholder: 'New Task...',
			priority: {
				label: 'Priority',
				high: 'High',
				medium: 'Medium',
				low: 'Low',
				none: 'None',
			},
			at: 'at',
			createdAt: 'Created at',
			completedAt: 'Completed at',
			estimateTime: 'Estimate time',
			remainingTime: 'Remaining time',
			left: 'tasks left',
			noTasks: 'No tasks are created yet',
			filter: {
				all: 'All',
				active: 'Active',
				completed: 'Completed',
			},
			clearCompleted: 'Clear completed',
			completeAll: 'Complete all',
			markAllAsCompleted: 'Mark all as completed',
		},
		sort: 'Sort',
		toggleTheme: 'Toggle theme',
	},
	'pt-br': {
		actions: {
			add: 'Adicionar',
			edit: 'Editar',
			move: 'Mover',
			remove: 'Remover',
			update: 'Atualizar',
			open: 'Abrir',
			close: 'Fechar',
			cancel: 'Cancelar',
			done: 'Concluído',
			ok: 'Ok',
			sort: 'Ordenar',
		},
		flags: {
			en: 'Bandeira do Reino Unido',
			br: 'Bandeira do Brasil',
			es: 'Bandeira da Espanha',
			ua: 'Bandeira da Ucrânia',
			ru: 'Bandeira da Rússia',
		},
		date: 'Data',
		default: 'Padrão',
		lists: {
			lists: 'Listas',
			new: 'Nova Lista',
			edit: 'Editar Lista',
			remove: 'Remover Lista',
			inputPlaceholder: 'Nova Lista...',
			noLists: 'Nenhuma lista foi criada ainda',
			noListSelected: 'Nenhuma lista selecionada',
		},
		moon: 'Lua',
		none: 'Nenhuma',
		sun: 'Sol',
		tasks: {
			tasks: 'Tarefas',
			new: 'Nova Tarefa',
			edit: 'Editar tarefa',
			remove: 'Remover tarefa',
			moveToList: 'Mover para a lista',
			inputPlaceholder: 'Nova Tarefa...',
			priority: {
				label: 'Prioridade',
				high: 'Alta',
				medium: 'Média',
				low: 'Baixa',
				none: 'Nenhuma',
			},
			at: 'às',
			createdAt: 'Criado em',
			completedAt: 'Concluído em',
			estimateTime: 'Tempo estimado',
			remainingTime: 'Tempo restante',
			left: 'tarefas restantes',
			noTasks: 'Nenhuma tarefa foi criada ainda',
			filter: {
				all: 'Todas',
				active: 'Ativas',
				completed: 'Concluídas',
			},
			clearCompleted: 'Limpar concluídas',
			completeAll: 'Concluir tudo',
			markAllAsCompleted: 'Marcar tudo como concluído',
		},
		sort: 'Ordenar',
		toggleTheme: 'Alternar tema',
	},
	es: {
		actions: {
			add: 'Añadir',
			edit: 'Editar',
			move: 'Mover',
			remove: 'Eliminar',
			update: 'Actualizar',
			open: 'Abrir',
			close: 'Cerrar',
			cancel: 'Cancelar',
			done: 'Hecho',
			ok: 'Ok',
			sort: 'Ordenar',
		},
		flags: {
			en: 'Bandera del Reino Unido',
			br: 'Bandera de Brasil',
			es: 'Bandera de España',
			ua: 'Bandera de Ucrania',
			ru: 'Bandera de Rusia',
		},
		date: 'Fecha',
		default: 'Predeterminado',
		lists: {
			lists: 'Listas',
			new: 'Nueva Lista',
			edit: 'Editar Lista',
			remove: 'Eliminar Lista',
			inputPlaceholder: 'Nueva Lista...',
			noLists: 'Aún no se ha creado ninguna lista',
			noListSelected: 'No se ha seleccionado ninguna lista',
		},
		moon: 'Luna',
		none: 'Ninguna',
		sun: 'Sol',
		tasks: {
			tasks: 'Tareas',
			new: 'Nueva Tarea',
			edit: 'Editar tarea',
			remove: 'Eliminar tarea',
			moveToList: 'Mover a la lista',
			inputPlaceholder: 'Nueva Tarea...',
			priority: {
				label: 'Prioridad',
				high: 'Alta',
				medium: 'Media',
				low: 'Baja',
				none: 'Ninguna',
			},
			at: 'a las',
			createdAt: 'Creado el',
			completedAt: 'Completado a las',
			estimateTime: 'Tiempo estimado',
			remainingTime: 'Tiempo restante',
			left: 'tareas restantes',
			noTasks: 'Aún no se ha creado ninguna tarea',
			filter: {
				all: 'Todas',
				active: 'Activas',
				completed: 'Completadas',
			},
			clearCompleted: 'Limpiar completadas',
			completeAll: 'Completar todo',
			markAllAsCompleted: 'Marcar todo como completado',
		},
		sort: 'Ordenar',
		toggleTheme: 'Alternar tema',
	},
	ua: {
		actions: {
			add: 'Додати',
			edit: 'Редагувати',
			move: 'Перемістити',
			remove: 'Видалити',
			update: 'Оновити',
			open: 'Відкрити',
			close: 'Закрити',
			cancel: 'Скасувати',
			done: 'Готово',
			ok: 'Ок',
			sort: 'Сортувати',
		},
		flags: {
			en: 'Прапор Сполученого Королівства',
			br: 'Прапор Бразилії',
			es: 'Прапор Іспанії',
			ua: 'Прапор України',
			ru: 'Прапор Росії',
		},
		date: 'Дата',
		default: 'За замовчуванням',
		lists: {
			lists: 'Списки',
			new: 'Новий список',
			edit: 'Редагувати список',
			remove: 'Видалити список',
			inputPlaceholder: 'Новий список...',
			noLists: 'Списки ще не створені',
			noListSelected: 'Список не вибрано',
		},
		moon: 'Місяць',
		none: 'Немає',
		sun: 'Сонце',
		tasks: {
			tasks: 'Завдання',
			new: 'Нове завдання',
			edit: 'Редагувати завдання',
			remove: 'Видалити завдання',
			moveToList: 'Перемістити до списку',
			inputPlaceholder: 'Нове завдання...',
			priority: {
				label: 'Пріоритет',
				high: 'Високий',
				medium: 'Середній',
				low: 'Низький',
				none: 'Немає',
			},
			at: 'о',
			createdAt: 'Створено',
			completedAt: 'Завершено о',
			estimateTime: 'Орієнтовний час',
			remainingTime: 'Залишковий час',
			left: 'залишилося завдань',
			noTasks: 'Завдання ще не створені',
			filter: {
				all: 'Усі',
				active: 'Активні',
				completed: 'Виконані',
			},
			clearCompleted: 'Очистити виконані',
			completeAll: 'Завершити все',
			markAllAsCompleted: 'Позначити все як завершене',
		},
		sort: 'Сортувати',
		toggleTheme: 'Перемкнути тему',
	},
	ru: {
		actions: {
			add: 'Добавить',
			edit: 'Редактировать',
			move: 'Переместить',
			remove: 'Удалить',
			update: 'Обновить',
			open: 'Открыть',
			close: 'Закрыть',
			cancel: 'Отменить',
			done: 'Готово',
			ok: 'Ок',
			sort: 'Сортировать',
		},
		flags: {
			en: 'Флаг Соединенного Королевства',
			br: 'Флаг Бразилии',
			es: 'Флаг Испании',
			ua: 'Флаг Украины',
			ru: 'Флаг России',
		},
		date: 'Дата',
		default: 'По умолчанию',
		lists: {
			lists: 'Списки',
			new: 'Новый список',
			edit: 'Редактировать список',
			remove: 'Удалить список',
			inputPlaceholder: 'Новый список...',
			noLists: 'Списки еще не созданы',
			noListSelected: 'Список не выбран',
		},
		moon: 'Луна',
		none: 'Нет',
		sun: 'Солнце',
		tasks: {
			tasks: 'Задачи',
			new: 'Новая задача',
			edit: 'Редактировать задачу',
			remove: 'Удалить задачу',
			moveToList: 'Переместить в список',
			inputPlaceholder: 'Новая задача...',
			priority: {
				label: 'Приоритет',
				high: 'Высокий',
				medium: 'Средний',
				low: 'Низкий',
				none: 'Нет',
			},
			at: 'в',
			createdAt: 'Создано',
			completedAt: 'Завершено в',
			estimateTime: 'Расчетное время',
			remainingTime: 'Оставшееся время',
			left: 'осталось задач',
			noTasks: 'Задачи еще не созданы',
			filter: {
				all: 'Все',
				active: 'Активные',
				completed: 'Выполненные',
			},
			clearCompleted: 'Очистить выполненные',
			completeAll: 'Завершить все',
			markAllAsCompleted: 'Отметить всё как завершённое',
		},
		sort: 'Сортировать',
		toggleTheme: 'Переключить тему',
	},
} as const;

// https://gist.github.com/sstur/faa75a1eb04e5b8bcf689bdb4343939b?permalink_comment_id=4604410#gistcomment-4604410
type LocaleMap = typeof locales;
type LocaleName = keyof LocaleMap;
type Translations = LocaleMap[LocaleName];

type NestedStringObject = {
	[key: string]: string | NestedStringObject;
};

type StringKeysOrNever<T extends object> = keyof T extends infer S extends string ? S : never;

type PathKey<First extends string, Tail> = `${First}${Tail extends string ? `.${Tail}` : never}`;

type PathInto<T extends NestedStringObject> = keyof {
	[K in StringKeysOrNever<T> as T[K] extends string
		? K
		: T[K] extends NestedStringObject
			? PathKey<K, PathInto<T[K]>>
			: never]: never; // Use `never` instead of any to prevent the type being used for actual objects
};

function get<T extends NestedStringObject>(obj: T, path: string[]): string | undefined {
	return path.reduce(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(acc: any, key) => (acc && typeof acc === 'object' ? acc[key] : undefined),
		obj
	);
}

class TranslationServiceImpl {
	constructor() {}

	t<K extends PathInto<Translations>>(key: K): string {
		const currentLocale = store.getState().locale;
		const translation = get(locales[currentLocale], key.split('.'));

		if (typeof translation !== 'string') {
			console.warn(`Translation not found for key: ${key}`);
			return key;
		}

		return translation;
	}
}

export const TranslationService = new TranslationServiceImpl();
