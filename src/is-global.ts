import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { getNpmGlobalDir, getPnpmGlobalDir, getYarnGlobalDir } from './global-dirs';

export interface IsGlobalContext {
  readonly scriptPath: string;
  readonly execPath: string;
  readonly platform: NodeJS.Platform;
  readonly env: Record<string, string | undefined>;
  readonly homedir: string;
}

function platformPath(platform: NodeJS.Platform): typeof path {
  return platform === 'win32' ? path.win32 : path.posix;
}

function tryRealpath(filePath: string): string {
  try {
    return fs.realpathSync(filePath);
  } catch {
    // noop
    return filePath;
  }
}

function isPathInside(
  scriptPath: string,
  globalDir: string,
  separator: string,
): boolean {
  return (
    scriptPath.startsWith(globalDir + separator) || scriptPath === globalDir
  );
}

export function checkIsGlobal(context: IsGlobalContext): boolean {
  const { scriptPath, execPath, platform, env, homedir } = context;

  if (!scriptPath) {
    return false;
  }

  if (env.npm_config_global === 'true') {
    return true;
  }

  const pathModule = platformPath(platform);
  const resolved = pathModule.resolve(tryRealpath(scriptPath));

  const npmGlobal = pathModule.resolve(
    getNpmGlobalDir(execPath, platform, env),
  );
  if (isPathInside(resolved, npmGlobal, pathModule.sep)) {
    return true;
  }

  const yarnGlobal = pathModule.resolve(
    getYarnGlobalDir(platform, env, homedir),
  );
  if (isPathInside(resolved, yarnGlobal, pathModule.sep)) {
    return true;
  }

  const pnpmGlobal = pathModule.resolve(
    getPnpmGlobalDir(platform, env, homedir),
  );
  if (isPathInside(resolved, pnpmGlobal, pathModule.sep)) {
    return true;
  }

  return false;
}

let cached: boolean | null = null;

export function isGlobal(): boolean {
  if (cached !== null) {
    return cached;
  }

  cached = checkIsGlobal({
    scriptPath: process.argv[1] ?? /* v8 ignore next */ '',
    execPath: process.execPath,
    platform: process.platform,
    env: process.env,
    homedir: os.homedir(),
  });

  return cached;
}
