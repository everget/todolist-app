import { useEffect } from 'react';
import { clsx } from 'clsx';
import { config } from '@/config/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useT } from '@/shared/i18n/i18n-context';
import {
    removeNotification,
    selectNotifications,
    type Notification,
} from '@/modules/notifications/notifications-slice';

export function NotificationsContainer() {
    const notifications = useAppSelector(selectNotifications);

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((n: Notification) => (
                <NotificationItem key={n.id} notification={n} />
            ))}
        </div>
    );
}

interface NotificationItemProps {
    notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
    const dispatch = useAppDispatch();
    const t = useT();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeNotification(notification.id));
        }, config.notifications.autoHideDurationInMs);
        return () => clearTimeout(timer);
    }, [dispatch, notification.id]);

    return (
        <div
            role={notification.type === 'error' ? 'alert' : 'status'}
            aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
            className={clsx(
                'flex min-w-[200px] max-w-sm items-center justify-between rounded-md p-4 shadow-lg transition-all duration-300',
                notification.type === 'error' && 'bg-danger text-white',
                notification.type === 'success' && 'bg-success text-white',
                notification.type === 'info' && 'bg-primary text-white'
            )}
        >
            <span className="text-sm font-medium">{notification.message}</span>
            <button
                onClick={() => dispatch(removeNotification(notification.id))}
                aria-label={t('actions.close')}
                className="ml-4 opacity-70 hover:opacity-100 focus:ring-2 focus:ring-white focus:outline-none"
            >
                ✕
            </button>
        </div>
    );
}
