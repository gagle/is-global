import { describe, it, expect, vi } from 'vitest';
import { checkIsGlobal } from './is-global';
import type { IsGlobalContext } from './is-global';

function createContext(
  overrides: Partial<IsGlobalContext> = {},
): IsGlobalContext {
  return {
    scriptPath: '/home/user/project/src/index.js',
    execPath: '/usr/local/bin/node',
    platform: 'linux',
    env: {},
    homedir: '/home/user',
    ...overrides,
  };
}

describe('checkIsGlobal', () => {
  describe('when scriptPath is empty', () => {
    it('should return false', () => {
      expect(checkIsGlobal(createContext({ scriptPath: '' }))).toBe(false);
    });
  });

  describe('when npm_config_global is "true"', () => {
    it('should return true', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/some/path',
            env: { npm_config_global: 'true' },
          }),
        ),
      ).toBe(true);
    });
  });

  describe('when npm_config_global is "false"', () => {
    it('should not short-circuit', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/home/user/project/index.js',
            env: { npm_config_global: 'false' },
          }),
        ),
      ).toBe(false);
    });
  });

  describe('when script is inside npm global node_modules', () => {
    it('should return true on linux', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/usr/local/lib/node_modules/my-cli/bin/index.js',
            execPath: '/usr/local/bin/node',
            platform: 'linux',
          }),
        ),
      ).toBe(true);
    });

    it('should return true on windows with APPDATA', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              'C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\my-cli\\bin\\index.js',
            execPath: 'C:\\Program Files\\nodejs\\node.exe',
            platform: 'win32',
            env: { APPDATA: 'C:\\Users\\user\\AppData\\Roaming' },
          }),
        ),
      ).toBe(true);
    });

    it('should return true on windows without APPDATA', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              'C:\\Program Files\\nodejs\\node_modules\\my-cli\\bin\\index.js',
            execPath: 'C:\\Program Files\\nodejs\\node.exe',
            platform: 'win32',
            env: {},
          }),
        ),
      ).toBe(true);
    });

    it('should return true with Homebrew prefix', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/opt/homebrew/lib/node_modules/my-cli/bin/index.js',
            execPath: '/opt/homebrew/Cellar/node/21.0.0/bin/node',
            platform: 'darwin',
          }),
        ),
      ).toBe(true);
    });

    it('should return true with nvm on linux', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              '/home/user/.nvm/versions/node/v20.0.0/lib/node_modules/my-cli/bin/index.js',
            execPath: '/home/user/.nvm/versions/node/v20.0.0/bin/node',
            platform: 'linux',
          }),
        ),
      ).toBe(true);
    });

    it('should return true with nvm on macOS', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              '/Users/user/.nvm/versions/node/v22.0.0/lib/node_modules/my-cli/bin/index.js',
            execPath: '/Users/user/.nvm/versions/node/v22.0.0/bin/node',
            platform: 'darwin',
          }),
        ),
      ).toBe(true);
    });

    it('should return true with npm_config_prefix', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/custom/prefix/lib/node_modules/my-cli/bin/cli.js',
            execPath: '/usr/local/bin/node',
            platform: 'linux',
            env: { npm_config_prefix: '/custom/prefix' },
          }),
        ),
      ).toBe(true);
    });
  });

  describe('when script is inside yarn global node_modules', () => {
    it('should return true on linux', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              '/home/user/.config/yarn/global/node_modules/my-cli/bin/index.js',
            homedir: '/home/user',
          }),
        ),
      ).toBe(true);
    });

    it('should return true on windows with LOCALAPPDATA', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              'C:\\Users\\user\\AppData\\Local\\Yarn\\Data\\global\\node_modules\\my-cli\\bin\\index.js',
            platform: 'win32',
            env: {
              LOCALAPPDATA: 'C:\\Users\\user\\AppData\\Local',
              APPDATA: 'C:\\Users\\user\\AppData\\Roaming',
            },
            homedir: 'C:\\Users\\user',
          }),
        ),
      ).toBe(true);
    });
  });

  describe('when script is inside pnpm global directory', () => {
    it('should return true with store version 5', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              '/home/user/.local/share/pnpm/global/5/node_modules/my-cli/bin/index.js',
            env: { PNPM_HOME: '/home/user/.local/share/pnpm' },
          }),
        ),
      ).toBe(true);
    });

    it('should return true with store version 6', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              '/home/user/.local/share/pnpm/global/6/node_modules/my-cli/bin/index.js',
            env: { PNPM_HOME: '/home/user/.local/share/pnpm' },
          }),
        ),
      ).toBe(true);
    });

    it('should return true on windows', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath:
              'C:\\Users\\user\\AppData\\Local\\pnpm\\global\\5\\node_modules\\my-cli\\bin\\index.js',
            platform: 'win32',
            env: {
              LOCALAPPDATA: 'C:\\Users\\user\\AppData\\Local',
              APPDATA: 'C:\\Users\\user\\AppData\\Roaming',
            },
            homedir: 'C:\\Users\\user',
          }),
        ),
      ).toBe(true);
    });
  });

  describe('when scriptPath exactly matches a global directory', () => {
    it('should return true', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/usr/local/lib/node_modules',
            execPath: '/usr/local/bin/node',
            platform: 'linux',
          }),
        ),
      ).toBe(true);
    });
  });

  describe('when script is in a local node_modules', () => {
    it('should return false on linux', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/home/user/project/node_modules/.bin/cli',
            execPath: '/usr/local/bin/node',
            platform: 'linux',
          }),
        ),
      ).toBe(false);
    });

    it('should return false on windows', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: 'C:\\Users\\user\\project\\node_modules\\.bin\\cli',
            execPath: 'C:\\Program Files\\nodejs\\node.exe',
            platform: 'win32',
            env: { APPDATA: 'C:\\Users\\user\\AppData\\Roaming' },
          }),
        ),
      ).toBe(false);
    });
  });

  describe('when script is not in any global directory', () => {
    it('should return false', () => {
      expect(
        checkIsGlobal(
          createContext({
            scriptPath: '/home/user/my-project/src/index.js',
          }),
        ),
      ).toBe(false);
    });
  });
});

describe('isGlobal', () => {
  describe('when running in a test environment', () => {
    it('should return false', async () => {
      vi.resetModules();
      const { isGlobal } = await import('./is-global');
      expect(isGlobal()).toBe(false);
    });
  });

  describe('when called multiple times', () => {
    it('should return the cached value', async () => {
      vi.resetModules();
      const { isGlobal } = await import('./is-global');
      const first = isGlobal();
      const second = isGlobal();
      expect(first).toBe(second);
    });
  });
});
