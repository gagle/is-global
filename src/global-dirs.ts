import path from 'node:path';

function platformPath(platform: NodeJS.Platform): typeof path {
  return platform === 'win32' ? path.win32 : path.posix;
}

export function getNpmGlobalDir(
  execPath: string,
  platform: NodeJS.Platform,
  env: Record<string, string | undefined>,
): string {
  const pathModule = platformPath(platform);
  const prefix = getNpmPrefix(execPath, platform, env);

  return platform === 'win32'
    ? pathModule.join(prefix, 'node_modules')
    : pathModule.join(prefix, 'lib', 'node_modules');
}

export function getYarnGlobalDir(
  platform: NodeJS.Platform,
  env: Record<string, string | undefined>,
  homedir: string,
): string {
  const pathModule = platformPath(platform);
  let dataDir: string;

  if (platform === 'win32') {
    dataDir = env.LOCALAPPDATA
      ? pathModule.join(env.LOCALAPPDATA, 'Yarn', 'Data')
      : pathModule.join(homedir, '.config', 'yarn');
  } else if (env.XDG_DATA_HOME) {
    dataDir = pathModule.join(env.XDG_DATA_HOME, 'yarn');
  } else {
    dataDir = pathModule.join(homedir, '.config', 'yarn');
  }

  return pathModule.join(dataDir, 'global', 'node_modules');
}

export function getPnpmGlobalDir(
  platform: NodeJS.Platform,
  env: Record<string, string | undefined>,
  homedir: string,
): string {
  const pathModule = platformPath(platform);
  let dataDir: string;

  if (env.PNPM_HOME) {
    dataDir = env.PNPM_HOME;
  } else if (env.XDG_DATA_HOME) {
    dataDir = pathModule.join(env.XDG_DATA_HOME, 'pnpm');
  } else if (platform === 'darwin') {
    dataDir = pathModule.join(homedir, 'Library', 'pnpm');
  } else if (platform === 'win32') {
    dataDir = env.LOCALAPPDATA
      ? pathModule.join(env.LOCALAPPDATA, 'pnpm')
      : pathModule.join(homedir, '.pnpm');
  } else {
    dataDir = pathModule.join(homedir, '.local', 'share', 'pnpm');
  }

  return pathModule.join(dataDir, 'global');
}

function getNpmPrefix(
  execPath: string,
  platform: NodeJS.Platform,
  env: Record<string, string | undefined>,
): string {
  const pathModule = platformPath(platform);

  if (env.npm_config_prefix) {
    return pathModule.resolve(env.npm_config_prefix);
  }

  if (platform === 'win32') {
    return env.APPDATA
      ? pathModule.join(env.APPDATA, 'npm')
      : pathModule.dirname(execPath);
  }

  if (execPath.includes('/Cellar/node')) {
    return execPath.slice(0, execPath.indexOf('/Cellar/node'));
  }

  return pathModule.dirname(pathModule.dirname(execPath));
}
