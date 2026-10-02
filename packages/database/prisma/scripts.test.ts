/**
 * Root script-wiring guard.
 *
 * This exists because of a real defect found on 2026-10-02. The root script
 * `db:deploy` was wired as:
 *
 *     pnpm --filter @tarn/database deploy
 *
 * `deploy` is a **built-in pnpm command**, so pnpm resolved it as
 * `pnpm deploy` instead of running the package script named `deploy`, and the
 * command failed with `ERR_PNPM_INVALID_DEPLOY_TARGET`. The documented
 * recovery procedure in `README.md` was therefore broken.
 *
 * It survived review because CI never called the root script — both CI jobs
 * invoke `pnpm --filter @tarn/database exec prisma migrate deploy` inline,
 * which works and silently routes around the defect.
 *
 * The sibling scripts (`generate`, `migrate`, `seed`, `studio`) are not pnpm
 * built-ins and were never affected, so this asserts the whole `db:*` family
 * rather than only the one that broke. That keeps the next person from
 * "simplifying" a working script back into the broken shape.
 *
 * A failure here means a documented command is broken. Fix the script, not the
 * test.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const rootPackageJson = JSON.parse(readFileSync(join(here, '..', '..', '..', 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};

/**
 * pnpm built-in command names that collide with a package script name when a
 * filter is passed without an explicit `run`. `deploy` is the one that bit us.
 */
const PNPM_BUILTINS = ['deploy', 'install', 'add', 'remove', 'link', 'import', 'patch', 'why'];

const dbScripts = Object.entries(rootPackageJson.scripts).filter(([name]) => name.startsWith('db:'));

describe('root db:* scripts', () => {
  it('exist for every documented database command', () => {
    expect(Object.keys(Object.fromEntries(dbScripts)).sort()).toEqual([
      'db:deploy',
      'db:generate',
      'db:migrate',
      'db:seed',
      'db:studio',
    ]);
  });

  it.each(dbScripts)('%s delegates with an explicit `run`', (name, script) => {
    const delegation = script.match(/^pnpm --filter @tarn\/database (\S+)/);

    // Only scripts that delegate through the workspace filter are in scope here.
    if (!delegation) {
      return;
    }

    const verb = delegation[1] as string;

    // `pnpm --filter <pkg> run <script>` — unambiguous.
    if (verb === 'run') {
      expect(script).toMatch(/^pnpm --filter @tarn\/database run \S+/);
      return;
    }

    // Anything else must not be a pnpm built-in, or pnpm will run its own
    // command instead of the package script.
    expect(PNPM_BUILTINS).not.toContain(verb);
  });

  it('keeps db:deploy on the `run` form that fixed the 2026-10-02 defect', () => {
    expect(rootPackageJson.scripts['db:deploy']).toBe('pnpm --filter @tarn/database run deploy');
  });
});
