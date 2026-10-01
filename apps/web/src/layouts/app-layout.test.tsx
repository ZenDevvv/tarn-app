/**
 * App shell tests.
 *
 * These target the accessibility contract in DESIGN.md §11 and PRD §10.6, which
 * is a requirement rather than a nice-to-have. Copy assertions follow DESIGN.md
 * §12: plain second person, no filler, no exclamation marks.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppLayout } from '../layouts/app-layout';

function renderShell(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppLayout />
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  it('renders the product name and primary navigation', () => {
    renderShell();

    expect(screen.getByText('Tarn')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('uses semantic landmarks', () => {
    renderShell();

    // DESIGN.md §11: semantic HTML, not a pile of divs.
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('exposes a working skip-to-content link (DESIGN.md §11)', async () => {
    const user = userEvent.setup();
    renderShell();

    const skip = screen.getByRole('link', { name: /skip to content/i });
    expect(skip).toHaveAttribute('href', '#main');

    // Visually hidden until focused, but always present for keyboard users.
    await user.tab();
    expect(skip).toHaveFocus();
  });

  it('gives every nav item an accessible name', () => {
    renderShell();

    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAccessibleName();
    }
  });

  it('marks the active nav link for assistive technology', () => {
    renderShell('/dashboard');

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});