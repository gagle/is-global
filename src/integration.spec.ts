import { execSync } from 'node:child_process';
import os from 'node:os';
import { describe, it, expect, vi } from 'vitest';
import { getNpmGlobalDir, getPnpmGlobalDir, getYarnGlobalDir } from './global-dirs';

function tryExec(command: string): string | null {
  try {
    return execSync(command, { encoding: 'utf8', timeout: 10_000 }).trim();
  } catch {
    // noop
    return null;
  }
}

describe('integration', () => {
  describe('when compared to the real npm global directory', () => {
    it('should match npm root -g', () => {
      const actual = tryExec('npm root -g');
      expect(actual).not.toBeNull();
      const ours = getNpmGlobalDir(
        process.execPath,
        process.platform,
        process.env,
      );
      expect(ours).toBe(actual);
    });
  });

  describe('when yarn is installed', () => {
    it('should match yarn global dir', () => {
      const yarnVersion = tryExec('yarn --version');

      if (yarnVersion === null || yarnVersion.startsWith('1')) {
        return;
      }

      const actual = tryExec('yarn config get globalFolder');

      if (actual === null) {
        return;
      }

      const ours = getYarnGlobalDir(
        process.platform,
        process.env,
        os.homedir(),
      );
      expect(ours).toBe(actual);
    });
  });

  describe('when pnpm is installed', () => {
    it('should match pnpm global dir prefix', () => {
      const actual = tryExec('pnpm root -g');

      if (actual === null) {
        return;
      }

      const ours = getPnpmGlobalDir(
        process.platform,
        process.env,
        os.homedir(),
      );
      expect(actual.startsWith(ours)).toBe(true);
    });
  });

  describe('when checking the test runner itself', () => {
    it('should detect that vitest is not globally installed', async () => {
      vi.resetModules();
      const { isGlobal } = await import('./is-global');
      expect(isGlobal()).toBe(false);
    });
  });
});
