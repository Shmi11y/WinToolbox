const fs = require('node:fs/promises');
const path = require('node:path');
const { createPackage } = require('@electron/asar');
const rcedit = require('rcedit');
const electronPath = require('electron');
const { productName, version } = require('../package.json');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const appFiles = [
  'package.json', 'main.js', 'preload.js', 'config.example.json',
  'renderer', 'data/icons', 'data/scripts',
  'data/catalog-tuba.json', 'data/tweaks.json', 'data/tweaks-yuqi.json'
];

async function build() {
  if (process.platform !== 'win32' || process.arch !== 'x64') {
    throw new Error('请使用 Windows x64 上的 Node.js 构建免安装版。');
  }

  await fs.mkdir(dist, { recursive: true });
  const stage = await fs.mkdtemp(path.join(dist, '.build-'));
  const app = path.join(stage, 'app');
  const portable = path.join(stage, 'WinToolbox-win32-x64');
  const output = path.join(dist, 'WinToolbox-win32-x64');

  try {
    await fs.cp(path.dirname(electronPath), portable, { recursive: true });
    for (const file of appFiles) {
      await fs.cp(path.join(root, file), path.join(app, file), { recursive: true });
    }
    await createPackage(app, path.join(portable, 'resources', 'app.asar'));
    await fs.copyFile(path.join(portable, 'LICENSE'), path.join(portable, 'LICENSE.electron.txt'));
    for (const file of ['LICENSE', 'LICENSE.YuqiEngine.txt', 'THIRD-PARTY-NOTICES.md', 'README.md']) {
      await fs.copyFile(path.join(root, file), path.join(portable, file));
    }
    await fs.cp(path.join(root, 'docs', 'screenshots'), path.join(portable, 'docs', 'screenshots'), { recursive: true });
    await fs.copyFile(path.join(root, 'config.example.json'), path.join(portable, 'resources', 'config.json'));

    const executable = path.join(portable, 'WinToolbox.exe');
    await fs.rename(path.join(portable, 'electron.exe'), executable);
    await rcedit(executable, {
      icon: path.join(root, 'build', 'icon.ico'),
      'file-version': `${version}.0`,
      'product-version': `${version}.0`,
      'version-string': { FileDescription: productName, ProductName: productName }
    });

    await fs.rm(output, { recursive: true, force: true });
    await fs.rename(portable, output);
    console.log(`构建完成：${output}`);
  } finally {
    await fs.rm(stage, { recursive: true, force: true });
  }
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
