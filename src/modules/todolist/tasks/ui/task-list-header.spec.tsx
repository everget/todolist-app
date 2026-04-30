import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { TaskListHeader } from './task-list-header';

function renderHeader() {
    return render(
        <I18nProvider locale="en">
            <TaskListHeader />
        </I18nProvider>
    );
}

describe('TaskListHeader', () => {
    it('is hidden from assistive technology', () => {
        const { container } = renderHeader();
        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders the tasks column label', () => {
        renderHeader();
        expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    it('renders the priority column label', () => {
        renderHeader();
        expect(screen.getByText('Priority')).toBeInTheDocument();
    });

    it('renders the estimate time column label', () => {
        renderHeader();
        expect(screen.getByText('Estimate time')).toBeInTheDocument();
    });

    it('renders the created-at column label', () => {
        renderHeader();
        expect(screen.getByText('Created at')).toBeInTheDocument();
    });

    it('renders the completed-at column label', () => {
        renderHeader();
        expect(screen.getByText('Completed at')).toBeInTheDocument();
    });
});
