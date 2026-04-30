import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Go</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies extra CSS classes when provided', () => {
        render(<Button className="my-class">Styled</Button>);
        expect(screen.getByRole('button')).toHaveClass('my-class');
    });

    it('behaves as a plain button by default, not a form submit', () => {
        render(<Button>Plain</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('can be configured as a form submit button', () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('uses an accessible label when provided', () => {
        render(<Button ariaLabel="close dialog">✕</Button>);
        expect(screen.getByRole('button', { name: 'close dialog' })).toBeInTheDocument();
    });
});
