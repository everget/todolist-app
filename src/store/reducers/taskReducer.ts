import { ms, msToString } from '@/lib/ms';
import { Action, AppState } from '@/types';

export function taskReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'ADD_TASK':
			return {
				...state,
				tasks: [...state.tasks, action.payload],
			};
		case 'EDIT_TASK':
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task.id === action.payload.id ? { ...task, ...action.payload } : task
				),
			};
		case 'REMOVE_TASK':
			return {
				...state,
				tasks: state.tasks.filter((task) => task.id !== action.payload),
			};
		case 'REMOVE_COMPLETED_TASKS':
			return {
				...state,
				tasks: state.tasks.filter((task) => {
					if (task.listId === action.payload && task.completed) {
						return false;
					}
					return true;
				}),
			};
		case 'TOGGLE_ALL_TASKS_AS_COMPLETED':
			return {
				...state,
				tasks: state.tasks.map((task) => {
					if (task.listId === action.payload.listId) {
						return {
							...task,
							completed: action.payload.checked,
							completedAt: action.payload.checked ? Date.now() : null,
						};
					}
					return task;
				}),
			};
		case 'MARK_ALL_TASKS_AS_COMPLETED':
			return {
				...state,
				tasks: state.tasks.map((task) => {
					if (task.listId === action.payload && !task.completed) {
						return {
							...task,
							completed: true,
							completedAt: Date.now(),
						};
					}
					return task;
				}),
			};
		case 'UPDATE_TASKS_REMAINING_TIME':
			return {
				...state,
				tasks: state.tasks.map((task) => {
					// TODO: check if estimated time was specified during creation
					if (task.estimateTime) {
						const timeSpent = Date.now() - task.createdAt;
						const remainingTime = ms(task.estimateTime) - timeSpent;
						return { ...task, remainingTime: msToString(remainingTime), timeSpent };
					}
					return task;
				}),
			};
		// case 'REORDER_TASKS':
		// 	const { taskId, newOrder } = action.payload;
		// 	const taskToMove = state.tasks.find((task) => task.id === taskId);
		// 	if (!taskToMove) return state;

		// const newOrder = Array.from(this.taskList.children).map((child) => child.id);
		// this.tasks = newOrder.map((id) => this.tasks.find((task) => task.id === id)!);

		// 	return {
		// 		...state,
		// 		tasks: state.tasks
		// 			.filter((task) => task.id !== taskId)
		// 			.map((task) => {
		// 				if (task.listId === taskToMove.listId) {
		// 					if (task.order >= newOrder && task.order < taskToMove.order) {
		// 						return { ...task, order: task.order + 1 };
		// 					}
		// 					if (task.order <= newOrder && task.order > taskToMove.order) {
		// 						return { ...task, order: task.order - 1 };
		// 					}
		// 				}
		// 				return task;
		// 			})
		// 			.concat({ ...taskToMove, order: newOrder })
		// 			.sort((a, b) => a.order - b.order),
		// 	};
		default:
			return state;
	}
}
