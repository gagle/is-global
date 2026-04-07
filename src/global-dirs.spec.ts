import { describe, it, expect } from 'vitest';
import { getNpmGlobalDir, getPnpmGlobalDir, getYarnGlobalDir } from './global-dirs';

describe('getNpmGlobalDir', () => {
  describe('when platform is linux', () => {
    it('should resolve from execPath', () => {
      expect(
        getNpmGlobalDir('/usr/local/bin/node', 'linux', {}),
      ).toBe('/usr/local/lib/node_modules');
    });

    it('should use npm_config_prefix when set', () => {
      expect(
        getNpmGlobalDir('/usr/local/bin/node', 'linux', {
          npm_config_prefix: '/custom/prefix',
        }),
      ).toBe('/custom/prefix/lib/node_modules');
    });

    it('should normalize npm_config_prefix with trailing slash', () => {
      expect(
        getNpmGlobalDir('/usr/local/bin/node', 'linux', {
          npm_config_prefix: '/custom/prefix/',
        }),
      ).toBe('/custom/prefix/lib/node_modules');
    });
  });

  describe('when platform is darwin with Homebrew', () => {
    it('should extract prefix from Cellar path', () => {
      expect(
        getNpmGlobalDir(
          '/opt/homebrew/Cellar/node/21.0.0/bin/node',
          'darwin',
          {},
        ),
      ).toBe('/opt/homebrew/lib/node_modules');
    });
  });

  describe('when platform is darwin with nvm', () => {
    it('should resolve from nvm execPath', () => {
      expect(
        getNpmGlobalDir(
          '/Users/user/.nvm/versions/node/v20.0.0/bin/node',
          'darwin',
          {},
        ),
      ).toBe('/Users/user/.nvm/versions/node/v20.0.0/lib/node_modules');
    });
  });

  describe('when platform is linux with nvm', () => {
    it('should resolve from nvm execPath', () => {
      expect(
        getNpmGlobalDir(
          '/home/user/.nvm/versions/node/v22.0.0/bin/node',
          'linux',
          {},
        ),
      ).toBe('/home/user/.nvm/versions/node/v22.0.0/lib/node_modules');
    });
  });

  describe('when platform is win32', () => {
    it('should use APPDATA when set', () => {
      expect(
        getNpmGlobalDir(
          'C:\\Program Files\\nodejs\\node.exe',
          'win32',
          { APPDATA: 'C:\\Users\\user\\AppData\\Roaming' },
        ),
      ).toBe('C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules');
    });

    it('should fall back to execPath dirname when APPDATA is missing', () => {
      expect(
        getNpmGlobalDir(
          'C:\\Program Files\\nodejs\\node.exe',
          'win32',
          {},
        ),
      ).toBe('C:\\Program Files\\nodejs\\node_modules');
    });

    it('should use npm_config_prefix when set', () => {
      expect(
        getNpmGlobalDir(
          'C:\\Program Files\\nodejs\\node.exe',
          'win32',
          { npm_config_prefix: 'C:\\custom', APPDATA: 'C:\\Users\\user\\AppData\\Roaming' },
        ),
      ).toBe('C:\\custom\\node_modules');
    });
  });
});

describe('getYarnGlobalDir', () => {
  describe('when platform is linux', () => {
    it('should use homedir default', () => {
      expect(
        getYarnGlobalDir('linux', {}, '/home/user'),
      ).toBe('/home/user/.config/yarn/global/node_modules');
    });

    it('should use XDG_DATA_HOME when set', () => {
      expect(
        getYarnGlobalDir('linux', { XDG_DATA_HOME: '/custom/data' }, '/home/user'),
      ).toBe('/custom/data/yarn/global/node_modules');
    });
  });

  describe('when platform is win32', () => {
    it('should use LOCALAPPDATA when set', () => {
      expect(
        getYarnGlobalDir(
          'win32',
          { LOCALAPPDATA: 'C:\\Users\\user\\AppData\\Local' },
          'C:\\Users\\user',
        ),
      ).toBe(
        'C:\\Users\\user\\AppData\\Local\\Yarn\\Data\\global\\node_modules',
      );
    });

    it('should fall back to homedir when LOCALAPPDATA is missing', () => {
      expect(
        getYarnGlobalDir('win32', {}, 'C:\\Users\\user'),
      ).toBe('C:\\Users\\user\\.config\\yarn\\global\\node_modules');
    });
  });
});

describe('getPnpmGlobalDir', () => {
  describe('when PNPM_HOME is set', () => {
    it('should use PNPM_HOME', () => {
      expect(
        getPnpmGlobalDir('linux', {
          PNPM_HOME: '/home/user/.local/share/pnpm',
        }, '/home/user'),
      ).toBe('/home/user/.local/share/pnpm/global');
    });
  });

  describe('when XDG_DATA_HOME is set', () => {
    it('should use XDG_DATA_HOME', () => {
      expect(
        getPnpmGlobalDir('linux', {
          XDG_DATA_HOME: '/custom/data',
        }, '/home/user'),
      ).toBe('/custom/data/pnpm/global');
    });
  });

  describe('when platform is darwin', () => {
    it('should use Library/pnpm', () => {
      expect(
        getPnpmGlobalDir('darwin', {}, '/Users/user'),
      ).toBe('/Users/user/Library/pnpm/global');
    });
  });

  describe('when platform is win32', () => {
    it('should use LOCALAPPDATA when set', () => {
      expect(
        getPnpmGlobalDir(
          'win32',
          { LOCALAPPDATA: 'C:\\Users\\user\\AppData\\Local' },
          'C:\\Users\\user',
        ),
      ).toBe('C:\\Users\\user\\AppData\\Local\\pnpm\\global');
    });

    it('should fall back to homedir/.pnpm when LOCALAPPDATA is missing', () => {
      expect(
        getPnpmGlobalDir('win32', {}, 'C:\\Users\\user'),
      ).toBe('C:\\Users\\user\\.pnpm\\global');
    });
  });

  describe('when platform is linux', () => {
    it('should use .local/share/pnpm', () => {
      expect(
        getPnpmGlobalDir('linux', {}, '/home/user'),
      ).toBe('/home/user/.local/share/pnpm/global');
    });
  });
});
