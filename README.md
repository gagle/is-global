# is-global

> Zero-dependency check for globally-installed Node.js modules

[![npm version](https://img.shields.io/npm/v/is-global.svg)](https://www.npmjs.com/package/is-global)
[![npm downloads](https://img.shields.io/npm/dm/is-global.svg)](https://www.npmjs.com/package/is-global)
[![license](https://img.shields.io/npm/l/is-global.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![node](https://img.shields.io/node/v/is-global.svg)](https://nodejs.org)

- **Zero dependencies** &mdash; no transitive `node_modules` bloat
- **TypeScript-first** &mdash; written in TypeScript with full type declarations out of the box
- **Dual ESM / CJS** &mdash; works with `import` and `require`
- **npm, yarn and pnpm** &mdash; detects global installs from all three package managers
- **Cross-platform** &mdash; Windows, macOS and Linux, including Homebrew and nvm

## Install

```bash
npm install is-global
```

## Usage

```ts
import { isGlobal } from 'is-global';

if (isGlobal()) {
  console.log('Running as a global module');
} else {
  console.log('Running as a local module');
}
```

The result is computed once and cached for the lifetime of the process.

## Advanced

For custom detection logic or testing, use the pure `checkIsGlobal` function with an explicit context:

```ts
import { checkIsGlobal } from 'is-global';

const result = checkIsGlobal({
  scriptPath: '/usr/local/lib/node_modules/my-cli/bin/index.js',
  execPath: '/usr/local/bin/node',
  platform: 'linux',
  env: {},
  homedir: '/home/user',
});
// true — the script is inside npm's global node_modules
```

### `IsGlobalContext`

| Field | Type | Description |
|-------|------|-------------|
| `scriptPath` | `string` | Absolute path of the running script |
| `execPath` | `string` | Path to the Node.js binary (`process.execPath`) |
| `platform` | `NodeJS.Platform` | Operating system platform (`process.platform`) |
| `env` | `Record<string, string \| undefined>` | Environment variables (`process.env`) |
| `homedir` | `string` | User home directory (`os.homedir()`) |

## How it works

1. If the `npm_config_global` environment variable is `"true"`, the module is global
2. The **npm** global prefix is resolved from `npm_config_prefix`, the Homebrew Cellar path, or the Node.js executable location. The script path is checked against `{prefix}/lib/node_modules` (Unix) or `{prefix}\node_modules` (Windows)
3. The **yarn** data directory is resolved from `XDG_DATA_HOME`, `LOCALAPPDATA` (Windows), or `~/.config/yarn`. The script path is checked against `{dataDir}/global/node_modules`
4. The **pnpm** data directory is resolved from `PNPM_HOME`, `XDG_DATA_HOME`, or platform-specific defaults (`~/Library/pnpm` on macOS, `~/.local/share/pnpm` on Linux, `LOCALAPPDATA\pnpm` on Windows). The script path is checked against `{dataDir}/global/`
5. Symlinks are resolved via `fs.realpathSync` before comparison
