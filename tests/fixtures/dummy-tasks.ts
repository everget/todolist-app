import { generateUniqueId } from '../../src/lib/generate-unique-id';
import { type Task } from '../../src/types';

const LIST_ID = generateUniqueId();

export const TASKS: Task[] = [
	{
		id: generateUniqueId(),
		listId: LIST_ID,
		text: 'Complete portfolio project',
		priority: 'high',
		createdAt: Date.now(),
		completed: false,
		completedAt: null,
		estimateTime: '2h',
		remainingTime: '2h',
		timeSpent: 0,
	},
	{
		id: generateUniqueId(),
		listId: LIST_ID,
		text: 'Find a new job',
		priority: 'low',
		createdAt: Date.now(),
		completed: false,
		completedAt: null,
		estimateTime: '2h',
		remainingTime: '2h',
		timeSpent: 0,
	},
	{
		id: generateUniqueId(),
		listId: LIST_ID,
		text: 'Study for exams',
		priority: 'medium',
		createdAt: Date.now(),
		completed: false,
		completedAt: null,
		estimateTime: '2h',
		remainingTime: '2h',
		timeSpent: 0,
	},
];

export const LIST = {
	id: LIST_ID,
	name: 'Personal',
	tasks: TASKS,
};
