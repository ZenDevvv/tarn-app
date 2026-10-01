/**
 * Application shell (architecture §10).
 *
 * Nav is semantic and labelled. Design rules come from DESIGN.md — tokens
 * only, no hard-coded hex values, plain second-person copy.
 */
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
] as const;

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="border-b border-border">
        <nav aria-label="Primary" className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
          <span className="text-lg font-semibold">Tarn</span>
          <ul className="flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}