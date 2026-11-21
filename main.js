const { app, BrowserWindow, ipcMain, shell, nativeImage, dialog, Tray, Menu, nativeTheme, net } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawn, execFile } = require('child_process');

const ROOT = __dirname;
const CONF_PATH = (app.isPackaged && fs.existsSync(path.join(process.resourcesPath, 'config.json')))
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(ROOT, 'config.json');
const defaults = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.example.json'), 'utf8'));
const CONF = { ...defaults, ...readJson(CONF_PATH, {}) };
const TOOLBOX_ROOT = CONF.toolboxRoot;
let TUBA_ROOT = CONF.tubaRoot;   // 稍后由 store / 首次引导覆盖

app.setPath('userData', path.join(app.getPath('appData'), process.env.TB_UD || 'tuba-toolbox-next'));
const USER_DIR = app.getPath('userData');
const TAKEOVER_FILE = path.join(USER_DIR, 'takeover.txt');   // 提权实例接管旧实例的握手文件
const ERR_LOG = path.join(USER_DIR, 'error.log');

// 所有静默失败都往这里写，出问题能查
function logErr(scope, e) {
  try {
    const msg = e && (e.stack || e.message) ? String(e.stack || e.message) : String(e);
    fs.appendFileSync(ERR_LOG, new Date().toISOString() + ' [' + scope + '] ' + msg.split('\n')[0] + '\n');
  } catch (_) {}
}

process.on('uncaughtException', (e) => logErr('uncaught', e));
process.on('unhandledRejection', (e) => logErr('unhandledRejection', e));
const STORE_FILE = path.join(USER_DIR, 'store.json');
const ICON_DIR = path.join(USER_DIR, 'icons');
fs.mkdirSync(ICON_DIR, { recursive: true });

/* ---------------- 状态持久化 ---------------- */
const store = Object.assign({ fav: [], recent: [], counts: {}, theme: 'light', groupOrder: [], catOrder: [], customCats: [], pinned: [], catSort: {}, twOrder: [], sideW: 196, sideWRev: 3, themeMode: 'system', motion: 'full', lang: 'zh' }, readJson(STORE_FILE, {}));
if (store.tubaRoot) TUBA_ROOT = store.tubaRoot;
if (store.lang === 'tw') { store.lang = 'zh'; }   // 繁体支持已移除，回落到简体   // 用户设置过就以 store 为准
function readJson(p, dft) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return dft; } }
function saveStore() { try { fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8'); } catch {} }

/* ---------------- 目录 ---------------- */
const resolve = (p) => p.split('\\').join(path.sep).split('/').join(path.sep);
const exists = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

const FACTORY_BASE = Date.UTC(2024, 0, 1);   // 出厂基准时间
function buildCatalog() {
  const data = readJson(path.join(ROOT, 'data', 'catalog-tuba.json'), { cats: [], tools: [] });
  const tools = [];
  let n = 0;

  let fi = 0;   // 出厂顺序计数
  for (const t of data.tools) {
    const full = TUBA_ROOT && t.rel ? path.join(TUBA_ROOT, resolve(t.rel)) : null;
    tools.push({
      addedAt: FACTORY_BASE - (fi++) * 60000,   // 越靠前越“新”，按创建时间倒序 = 默认顺序
      id: t.id || 't' + (++n),
      name: t.name,
      desc: t.desc || '',
      cat: t.category,
      path: full,
      exists: t.kind === 'info' ? false : !!(full && exists(full)),
      kind: t.kind,
      admin: !!t.admin,
      from: 'tuba',
      rel: t.rel || ''
    });
  }
  for (const m of (CONF.myTools || [])) {
    const full = path.join(TOOLBOX_ROOT, resolve(m.path));
    tools.push({
      id: 'm' + md5(m.path).slice(0, 8),
      name: m.name,
      desc: m.desc || '',
      cat: m.cat || 'system',
      path: full,
      exists: exists(full),
      kind: /\.(cmd|bat)$/i.test(full) ? 'script' : /\.(7z|rar|zip)$/i.test(full) ? 'archive' : /\.txt$/i.test(full) ? 'doc' : 'exe',
      admin: !!m.admin,
      action: m.action || '',
      from: 'mine',
      rel: m.path
    });
  }
  // 用户自定义添加的软件
  for (const c of customTools()) {
    const full = expandEnv(c.path);
    tools.push({
      id: c.id,
      name: c.name,
      desc: c.desc || '',
      cat: c.cat || 'custom',
      path: full,
      exists: !!(full && (exists(full) || existsDir(full))),
      kind: kindOf(full),
      admin: !!c.admin,
      args: c.args || '',
      cwd: c.cwd || '',
      from: 'custom',
      rel: c.path
    });
  }

  const cats = data.cats.slice();
  for (const cc of (store.customCats || [])) {
    if (!cats.some(c => c.id === cc.id)) cats.push({ id: cc.id, name: cc.name, folder: null, icon: 'folder', desc: '自定义分组' });
  }
  // 「自定义」不再是常驻分组：只有老数据里还有工具时才兜底显示
  const hasOrphan = customTools().some(t => (t.cat || 'custom') === 'custom');
  if (hasOrphan && !cats.some(c => c.id === 'custom')) {
    cats.push({ id: 'custom', name: '未分组', folder: null, icon: 'user', desc: '还没归到具体分组的程序' });
  }

  for (const t of tools) {
    t.fav = store.fav.includes(t.id);
    t.count = store.counts[t.id] || 0;
  }
  return { cats, tools };
}
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const existsDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const expandEnv = (p) => String(p || '').replace(/%([^%]+)%/g, (m, k) => process.env[k] || m);

function kindOf(p) {
  if (!p) return 'exe';
  if (existsDir(p)) return 'dir';
  if (/\.(cmd|bat)$/i.test(p)) return 'script';
  if (/\.(7z|rar|zip)$/i.test(p)) return 'archive';
  if (/\.(txt|md|pdf|docx?|xlsx?)$/i.test(p)) return 'doc';
  if (/^https?:/i.test(p)) return 'url';
  if (/\.lnk$/i.test(p)) return 'lnk';
  return 'exe';
}

/* ---------------- 自定义工具 ---------------- */
const CUSTOM_FILE = path.join(USER_DIR, 'custom-tools.json');
function customTools() { return readJson(CUSTOM_FILE, []); }
function saveCustom(list) {
  try { fs.writeFileSync(CUSTOM_FILE, JSON.stringify(list, null, 2), 'utf8'); } catch {}
}
// .lnk 快捷方式取真实目标，便于图标与工作目录
function lnkTarget(lnk) {
  try {
    const s = fs.readFileSync(lnk, 'latin1');
    const m = s.match(/[A-Za-z]:\\\\[^\x00"]{2,260}/);
    if (m) return m[0].replace(/\\\\/g, '\\');
  } catch {}
  return '';
}

/* ---------------- 图标抽取（带磁盘缓存） ---------------- */
async function getIcon(tool) {
  if (!tool.exists) return null;
  if (tool.kind === 'doc') return null;
  const key = md5(tool.path).slice(0, 16) + '.png';
  const cache = path.join(ICON_DIR, key);
  try {
    if (fs.existsSync(cache)) {
      const img = nativeImage.createFromPath(cache);
      if (!img.isEmpty()) return img.toDataURL();
    }
  } catch {}
  try {
    const img = await app.getFileIcon(tool.path, { size: 'large' });
    if (!img || img.isEmpty()) return null;
    try { fs.writeFileSync(cache, img.toPNG()); } catch {}
    return img.toDataURL();
  } catch { return null; }
}

/* ---------------- 启动 ---------------- */
function launchTool(id) {
  const { tools } = buildCatalog();
  const t = tools.find(x => x.id === id);
  if (!t) return { ok: false, msg: '未找到该工具' };
  if (!t.exists) return { ok: false, msg: '文件不存在，可能已被移动或删除' };

  if (t.kind === 'archive') {
    shell.showItemInFolder(t.path);
    return { ok: true, msg: '这是压缩包，已在资源管理器定位，解压后再运行' };
  }
  const cwd = t.cwd || path.dirname(t.path);
  try {
    if (t.kind === 'dir') {
      const err = shell.openPath(t.path);
      if (err) throw new Error(err);
    } else if (t.kind === 'url' || /^https?:/i.test(t.path)) {
      shell.openExternal(t.path);
    } else if (t.admin) {
      const quote = (s) => `'${String(s).replace(/'/g, "''")}'`;
      const params = t.args ? `-ArgumentList ${quote(t.args)} ` : '';
      require('child_process').spawnSync('powershell', [
        '-NoProfile', '-Command',
        `Start-Process -FilePath ${quote(t.path)} ${params}-WorkingDirectory ${quote(cwd)} -Verb RunAs`
      ], { windowsHide: true });
    } else if (/\.(bat|cmd)$/i.test(t.path)) {
      spawn('cmd.exe', ['/c', 'start', '', `"${t.path}"`], { cwd, detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).unref();
    } else if (t.args) {
      spawn(t.path, t.args.split(/\s+/), { cwd, detached: true, stdio: 'ignore' }).unref();
    } else {
      const err = shell.openPath(t.path);
      if (err) throw new Error(err);
    }
  } catch (e) {
    return { ok: false, msg: '启动失败：' + e.message };
  }

  store.counts[id] = (store.counts[id] || 0) + 1;
  store.recent = [{ id, name: t.name, cat: t.cat, ts: Date.now() }, ...store.recent.filter(r => r.id !== id)].slice(0, 40);
  saveStore();
  return { ok: true, msg: '已启动 ' + t.name };
}

/* ---------------- 硬件信息 ---------------- */
const PS_HW = `
$ErrorActionPreference='SilentlyContinue'
$cs = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$os = Get-CimInstance Win32_OperatingSystem
$mb = Get-CimInstance Win32_BaseBoard | Select-Object -First 1
$gpu = Get-CimInstance Win32_VideoController | Where-Object { $_.Name -notmatch 'Basic|Remote|Virtual|MuMu|Parsec|GameViewer|Meta|Oray' } | Select-Object -First 2
$ram = Get-CimInstance Win32_PhysicalMemory | Select-Object -First 4
$disk = Get-CimInstance Win32_DiskDrive | Select-Object -First 4
$mon = Get-CimInstance Win32_PnPEntity | Where-Object { $_.PNPClass -eq 'Monitor' } | Select-Object -First 1
$o = [ordered]@{
  cpu = $cpu.Name -replace '\\s+',' '
  cores = "$($cpu.NumberOfCores)C/$($cpu.NumberOfLogicalProcessors)T"
  freq = $cpu.MaxClockSpeed
  board = "$($mb.Manufacturer) $($mb.Product)"
  os = "$($os.Caption) $($os.Version)"
  osBuild = $os.BuildNumber
  ramTotal = [math]::Round($cs.TotalPhysicalMemory/1GB,1)
  ramSticks = @($ram | ForEach-Object { "$($_.Manufacturer) $([math]::Round($_.Capacity/1GB))G $($_.Speed)MHz $($_.PartNumber)".Trim() })
  gpu = @($gpu | ForEach-Object { "$($_.Name)|$([math]::Round($_.AdapterRAM/1GB,1))|$($_.DriverVersion)" })
  disk = @($disk | ForEach-Object { "$($_.Model)|$([math]::Round($_.Size/1GB))" })
  monitor = $mon.Name
  uptime = [int]((Get-Date) - $os.LastBootUpTime).TotalMinutes
}
$o | ConvertTo-Json -Depth 4 -Compress
`;

function getHardware(force) {
  const cacheFile = path.join(USER_DIR, 'hardware.json');
  if (!force) {
    const c = readJson(cacheFile, null);
    if (c && Date.now() - (c._ts || 0) < 864e5) return c;
  }
  return new Promise(resolve => {
    execFile('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', PS_HW],
      { windowsHide: true, timeout: 20000, maxBuffer: 1 << 22 }, (err, stdout) => {
        if (err || !stdout) return resolve(readJson(cacheFile, {}));
        try {
          const d = JSON.parse(stdout.trim());
          if (d.cpu) d.cpu = d.cpu.trim();
          if (d.board) d.board = d.board.trim();
          d._ts = Date.now();
          fs.writeFileSync(cacheFile, JSON.stringify(d, null, 2), 'utf8');
          resolve(d);
        } catch { resolve(readJson(cacheFile, {})); }
      });
  });
}

/* ---------------- 实时占用 ---------------- */
let lastCpu = os.cpus().map(c => c.times);

function cpuUsage() {
  const now = os.cpus().map(c => c.times);
  let idle = 0, total = 0;
  now.forEach((t, i) => {
    const p = lastCpu[i] || { idle: 0, user: 0, sys: 0, nice: 0, irq: 0 };
    idle += t.idle - p.idle;
    total += (t.user + t.nice + t.sys + t.idle + t.irq) - (p.user + p.nice + p.sys + p.idle + p.irq);
  });
  lastCpu = now;
  return total > 0 ? Math.round((1 - idle / total) * 100) : 0;
}

/* 常驻 powershell 采样网卡字节数：netstat 在中文环境读数不稳定，改读 CIM 计数器 */
let netProc = null, netPrev = null, netRateVal = [0, 0];
const PS_NET = `while($true){
  try {
    $s = Get-NetAdapterStatistics
    $rx = ($s | Measure-Object -Property ReceivedBytes -Sum).Sum
    $tx = ($s | Measure-Object -Property SentBytes -Sum).Sum
    if (-not $rx) { $rx = 0 }
    if (-not $tx) { $tx = 0 }
    Write-Output "$rx $tx"
  } catch { Write-Output "0 0" }
  Start-Sleep -Milliseconds 1000
}`;
function ensureNet() {
  if (netProc) return;
  try {
    netProc = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', PS_NET],
      { windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
    let buf = '';
    netProc.stdout.on('data', d => {
      buf += d.toString('utf8');
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        const m = line.match(/^(\d+)\s+(\d+)$/);
        if (!m) continue;
        const cur = { rx: +m[1], tx: +m[2], t: Date.now() };
        if (netPrev && cur.rx >= netPrev.rx && cur.tx >= netPrev.tx) {
          const dt = (cur.t - netPrev.t) / 1000;
          if (dt > 0.2 && dt < 10) netRateVal = [(cur.rx - netPrev.rx) / dt, (cur.tx - netPrev.tx) / dt];
        }
        netPrev = cur;
      }
    });
    netProc.on('exit', () => { netProc = null; netPrev = null; });
  } catch { netProc = null; }
}
function netRate() { ensureNet(); return Promise.resolve(netRateVal); }

function diskInfo() {
  try {
    const s = fs.statfsSync('C:\\');
    const total = s.blocks * s.bsize, free = s.bavail * s.bsize;
    return { total, free, used: total - free };
  } catch { return { total: 0, free: 0, used: 0 }; }
}

let gpuSmi = null;
// 常驻 nvidia-smi：一个进程循环输出，不再每 1.5 秒新建进程
let gpuProc = null, gpuLatest = null, gpuRetry = 0;
function startGpuWatcher() {
  if (process.platform !== 'win32' || gpuProc || gpuSmi === false) return;
  try {
    gpuProc = spawn('nvidia-smi', [
      '--query-gpu=utilization.gpu,temperature.gpu,memory.used,memory.total',
      '--format=csv,noheader,nounits', '-lms', '1500'
    ], { windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    logErr('gpu-spawn', e);
    gpuSmi = false;
    return;
  }

  let buf = '';
  gpuProc.stdout.on('data', (d) => {
    buf += d.toString('utf8');
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line || !/\d/.test(line)) continue;
      const [u, t, mu, mt] = line.split(',').map(x => x.trim());
      if (isNaN(+u)) continue;
      gpuLatest = { util: +u, temp: +t, memUsed: +mu, memTotal: +mt };
      gpuSmi = true;
      gpuRetry = 0;
    }
  });
  gpuProc.on('error', (e) => { logErr('gpu', e); gpuProc = null; gpuSmi = false; });
  gpuProc.on('close', () => {
    gpuProc = null;
    // 意外退出（驱动重置等）后重试几次，别把功能彻底关死
    if (gpuLatest && gpuRetry < 3) {
      gpuRetry++;
      setTimeout(startGpuWatcher, 3000 * gpuRetry);
    }
  });
}
function stopGpuWatcher() {
  if (!gpuProc) return;
  try {
    // 先摘掉监听再 kill，避免退出过程中回调再触发导致崩溃
    if (gpuProc.stdout) gpuProc.stdout.removeAllListeners();
    gpuProc.removeAllListeners();
    gpuProc.kill();
  } catch (e) { logErr('gpu-kill', e); }
  gpuProc = null;
}

function gpuUsage() {
  if (gpuSmi === false && !gpuRetry) return Promise.resolve(null);
  if (!gpuProc) startGpuWatcher();
  return Promise.resolve(gpuLatest);
}

ipcMain.handle('diag:errors', () => {
  try {
    if (!fs.existsSync(ERR_LOG)) return { lines: [] };
    const all = fs.readFileSync(ERR_LOG, 'utf8').trim().split('\n').filter(Boolean);
    return { lines: all.slice(-60).reverse(), path: ERR_LOG };
  } catch (e) { return { lines: ['读取失败: ' + e.message], path: ERR_LOG }; }
});
ipcMain.handle('diag:clear', () => {
  try { fs.writeFileSync(ERR_LOG, ''); } catch (e) { logErr('diag-clear', e); }
  return { ok: true };
});
ipcMain.handle('log:err', (e, scope, msg) => { logErr('renderer:' + scope, msg); return true; });

ipcMain.handle('stats', async () => {
  const d = diskInfo();
  const net = await netRate();
  const gpu = await gpuUsage();
  return {
    cpu: cpuUsage(),
    mem: { total: os.totalmem(), free: os.freemem() },
    disk: d,
    gpu,
    net: { rx: net[0], tx: net[1] },
    uptime: os.uptime()
  };
});

/* ---------------- IPC ---------------- */
ipcMain.handle('catalog', () => buildCatalog());
ipcMain.handle('icons', async (e, ids) => {
  const { tools } = buildCatalog();
  const out = {};
  for (const id of ids) {
    const t = tools.find(x => x.id === id);
    if (t) { const ic = await getIcon(t); if (ic) out[id] = ic; }
  }
  return out;
});
ipcMain.handle('launch', (e, id) => launchTool(id));
ipcMain.handle('fav', (e, id) => {
  const i = store.fav.indexOf(id);
  if (i >= 0) store.fav.splice(i, 1); else store.fav.push(id);
  saveStore();
  return store.fav.includes(id);
});
ipcMain.handle('hardware', (e, force) => getHardware(force));
ipcMain.handle('store', () => store);
ipcMain.handle('theme', (e, t) => { store.theme = t; saveStore(); applyWindowIcon(t); return t; });
ipcMain.handle('reveal', (e, id) => {
  const { tools } = buildCatalog();
  const t = tools.find(x => x.id === id);
  if (t && t.path) shell.showItemInFolder(t.path);
});
ipcMain.handle('open-folder', (e, which) => {
  const folder = which === 'tuba' ? TUBA_ROOT : TOOLBOX_ROOT;
  if (folder) return shell.openPath(folder);
});
ipcMain.on('win', (e, action) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (!w) return;
  if (action === 'min') w.minimize();
  else if (action === 'max') w.isMaximized() ? w.unmaximize() : w.maximize();
  else if (action === 'close') hideToTray();
});

/* ---------------- PowerShell 脚本（外置到 userData，避免 asar 路径问题） ---------------- */
const SCRIPT_DIR = path.join(USER_DIR, 'scripts');
function ensureScripts() {
  fs.mkdirSync(SCRIPT_DIR, { recursive: true });
  const src = path.join(ROOT, 'data', 'scripts');
  try {
    for (const f of fs.readdirSync(src)) {
      if (!/\.ps1$/i.test(f)) continue;
      fs.copyFileSync(path.join(src, f), path.join(SCRIPT_DIR, f));
    }
  } catch (e) { console.error('script deploy failed', e.message); }
}
ensureScripts();

const SENSOR_DIR = path.join(USER_DIR, 'sensors');
const LHM_LIB = path.join(SENSOR_DIR, 'LibreHardwareMonitorLib.dll');
function ensureSensors() {
  const src = path.join(ROOT, 'data', 'sensors');
  if (!fs.existsSync(src)) return false;
  try {
    fs.mkdirSync(SENSOR_DIR, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      if (!/\.dll$/i.test(f)) continue;
      const dst = path.join(SENSOR_DIR, f);
      const a = fs.statSync(path.join(src, f));
      const b = fs.existsSync(dst) ? fs.statSync(dst) : null;
      if (!b || b.size !== a.size) fs.copyFileSync(path.join(src, f), dst);
    }
    return true;
  } catch { return false; }
}
ensureSensors();

function runPS(name, args = [], timeout = 120000) {
  const file = path.join(SCRIPT_DIR, name);
  return new Promise(resolve => {
    if (!fs.existsSync(file)) return resolve({ ok: false, error: 'script missing: ' + name });
    // stdin 必须是 ignore：Electron 下没有控制台，powershell 会卡在等待输入
    const child = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', file, ...args],
      { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });

    let out = '', err = '', done = false;
    const finish = (r) => { if (done) return; done = true; clearTimeout(timer); resolve(r); };
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      finish({ ok: false, error: '超时（' + Math.round(timeout / 1000) + ' 秒）' });
    }, timeout);

    child.stdout.on('data', d => { out += d.toString('utf8'); });
    child.stderr.on('data', d => { err += d.toString('utf8'); });
    child.on('error', e => finish({ ok: false, error: e.message }));
    child.on('close', () => {
      const i = out.indexOf('{'), j = out.lastIndexOf('}');
      if (i >= 0 && j > i) {
        try { return finish(JSON.parse(out.slice(i, j + 1))); }
        catch (e) { return finish({ ok: false, error: 'JSON 解析失败: ' + e.message }); }
      }
      finish({ ok: false, error: (err || 'no output').slice(0, 300) });
    });
  });
}

/* ---------------- 管理员状态 ---------------- */
let IS_ADMIN = false;
function readCoreIsolation() {
  try {
    const out = require('child_process').execFileSync('reg', [
      'query',
      'HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity',
      '/v', 'Enabled'
    ], { windowsHide: true, encoding: 'utf8', timeout: 3000 });
    return /0x1/.test(out);
  } catch (e) { return null; }   // 读不到就返回未知，不误导
}

function detectAdmin() {
  return new Promise(resolve => {
    execFile('whoami', ['/groups'], { windowsHide: true }, (err, out) => {
      IS_ADMIN = !err && /S-1-16-12288/.test(String(out || ''));
      resolve(IS_ADMIN);
    });
  });
}

ipcMain.handle('is-admin', async () => ({ admin: await detectAdmin() }));
const ELEV_FLAG = path.join(USER_DIR, 'pending-elevation.txt');
const ELEV_FAIL = path.join(USER_DIR, 'elevation-failed.txt');

const ELEV_LOG = path.join(USER_DIR, 'elevation.log');
const ELEV_STARTED = path.join(USER_DIR, 'elevation-started.txt');

function elevLog(msg) {
  try { fs.appendFileSync(ELEV_LOG, new Date().toISOString() + '  ' + msg + '\n'); } catch {}
}
function elevTail(n) {
  try { return fs.readFileSync(ELEV_LOG, 'utf8').trim().split('\n').slice(-(n || 6)); }
  catch (e) { return ['（无日志）']; }
}

ipcMain.handle('relaunch-admin', () => new Promise((resolve) => {
  const exe = process.env.RELAUNCH_TEST_EXE || process.execPath;
  const baseArgs = app.isPackaged ? [] : [path.join(ROOT, 'main.js')];
  const args = baseArgs.concat(['--elevated']);
  const cwd = app.isPackaged ? path.dirname(exe) : ROOT;
  const qs = (v) => "'" + String(v).replace(/'/g, "''") + "'";
  const argList = args.map(qs).join(',');

  elevLog('--- 请求提权 ---');
  elevLog('exe = ' + exe);
  elevLog('args = ' + JSON.stringify(args));

  try { fs.unlinkSync(ELEV_STARTED); } catch {}
  try { fs.unlinkSync(ELEV_FAIL); } catch {}
  try { fs.writeFileSync(ELEV_FLAG, String(Date.now())); } catch {}

  // 用脚本文件而不是 -Command：路径含中文/引号时 -Command 的拼接极易被解析坏
  const psPath = path.join(os.tmpdir(), 'wintoolbox-elevate.ps1');
  const ps = [
    '$ErrorActionPreference = "Stop"',
    'function Log($m) { Add-Content -Path ' + qs(ELEV_LOG) + ' -Value ((Get-Date).ToString("HH:mm:ss") + "  PS: " + $m) -Encoding UTF8 }',
    'Log "脚本启动"',
    'try {',
    '  $p = Start-Process -FilePath ' + qs(exe) + ' -ArgumentList ' + argList + ' -WorkingDirectory ' + qs(cwd) + ' -Verb RunAs -PassThru -ErrorAction Stop',
    '  Set-Content -Path ' + qs(ELEV_STARTED) + ' -Value ([string]$p.Id) -Encoding ASCII',
    '  Log ("已提权，PID " + $p.Id)',
    '} catch {',
    '  Log ("提权被拒绝：" + $_.Exception.Message)',
    '  Set-Content -Path ' + qs(ELEV_FAIL) + ' -Value "1" -Encoding ASCII',
    '}'
  ].join('\r\n');

  try {
    // 必须带 BOM，否则 PS 5.1 按 ANSI 读，中文路径会乱码
    fs.writeFileSync(psPath, '﻿' + ps, 'utf8');
    elevLog('脚本已写入：' + psPath);
  } catch (e) {
    elevLog('写脚本失败：' + e.message);
    resolve({ ok: false, error: '写入提权脚本失败：' + e.message });
    return;
  }

  const errPath = path.join(os.tmpdir(), 'wintoolbox-elevate.err');
  try {
    const errFd = fs.openSync(errPath, 'w');
    const child = spawn('powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psPath],
      { windowsHide: true, stdio: ['ignore', 'pipe', errFd] });
    child.stdout.on('data', (d) => elevLog('PS out: ' + String(d).trim()));
    child.on('error', (e) => elevLog('启动失败：' + e.message));
    child.on('exit', (code) => {
      try {
        fs.closeSync(errFd);
        const err = fs.readFileSync(errPath, 'utf8').trim();
        elevLog('powershell 退出，码 ' + code + (err ? '，错误：' + err.split('\n')[0] : ''));
      } catch (e) { /* ignore */ }
    });
    child.unref();
    elevLog('已拉起 powershell');
  } catch (e) {
    elevLog('spawn 异常：' + e.message);
    resolve({ ok: false, error: '无法启动提权进程：' + e.message });
    return;
  }

  // 等"提权实例已启动"的标记：有就退出，没有就保留窗口并报错
  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    let started = false;
    try { started = fs.existsSync(ELEV_STARTED); } catch {}

    if (started) {
      clearInterval(timer);
      elevLog('收到启动标记，本进程退出');
      try { fs.unlinkSync(ELEV_STARTED); } catch {}
      setTimeout(() => app.quit(), 300);
      resolve({ ok: true, msg: '已以管理员身份重启' });
      return;
    }

    if (tries >= 26) {
      clearInterval(timer);
      elevLog('等待超时，未收到启动标记');
      try { fs.unlinkSync(ELEV_FLAG); } catch {}
      resolve({
        ok: false,
        error: '提权没有成功（UAC 被取消或系统策略拦截）',
        canManual: true,
        manual: '在「' + cwd + '」里右键 WinToolbox.exe → 以管理员身份运行',
        log: elevTail(8)
      });
    }
  }, 350);
}));

ipcMain.handle('elevation-log', () => ({ lines: elevTail(40).slice().reverse() }));

/* ---------------- 系统信息 ---------------- */
const SYSINFO_CACHE = path.join(USER_DIR, 'sysinfo-cache.json');
ipcMain.handle('sysinfo', async (e, force) => {
  const cached = readJson(SYSINFO_CACHE, null);
  if (!force) {
    const adminNow = await detectAdmin();
    // 提权状态变了（比如刚从「以管理员重启」回来）就作废缓存，否则温度永远是旧的「不可用」
    // 老缓存没有 coreIsolation 字段，一并作废，避免温度提示判断错
    const samePrivilege = cached && cached.admin === adminNow && cached.coreIsolation !== undefined;
    if (cached && cached.ok && cached.ts && samePrivilege &&
        Date.now() - new Date(cached.ts).getTime() < 6 * 3600e3) {
      cached.cached = true;
      cached.sensorLib = exists(LHM_LIB);
      return cached;
    }
  }
  const t0 = Date.now();
  const admin = await detectAdmin();
  // 非管理员读不到 CPU 核心温度，传感器增强只在提权后才有意义，避免白白多等几秒
  const [r, snPre] = await Promise.all([
    runPS('sysinfo.ps1', [], 60000),
    admin && exists(LHM_LIB) ? runPS('sensors.ps1', ['-Dir', SENSOR_DIR], 45000) : Promise.resolve(null)
  ]);
  r.ms = Date.now() - t0;
  r.admin = admin;
  r.sensorLib = exists(LHM_LIB);

  // 增强传感器（LibreHardwareMonitor，需管理员才能读到 CPU 核心温度）
  try {
  if (r.ok && r.temps) {
    const sn = snPre;
    if (sn && sn.ok && sn.sensors) {
      const pickTemp = (re, hwRe) => {
        const list = sn.sensors.filter(x => x.type === 'Temperature' && x.value > 0 &&
          re.test(x.name) && (!hwRe || hwRe.test(x.hw)));
        return list.sort((a, b) => b.value - a.value)[0];
      };
      const cpu = pickTemp(/Tctl|Tdie|Package|Core Max|CPU/i, /Cpu/);
      const gpu = pickTemp(/GPU Core/i, /Gpu/);
      const board = pickTemp(/Motherboard|Chipset|Mainboard/i, /Motherboard/);
      if (cpu) r.temps.cpu = cpu.value;
      if (gpu) r.temps.gpu = gpu.value;
      if (board) r.temps.board = board.value;
      r.sensors = { ok: true, admin: sn.admin, count: sn.count };
    } else {
      r.sensors = { ok: false, error: (sn && sn.error) || 'unavailable' };
    }
  }
  } catch (e) { r.sensors = { ok: false, error: 'merge failed: ' + e.message }; }

  if (r.ok) { try { fs.writeFileSync(SYSINFO_CACHE, JSON.stringify(r), 'utf8'); } catch {} }
  return r;
});

/* ---------------- 系统调优 ---------------- */
// 分组展示顺序与元数据（跟着宇奇原版的模块划分走）
const TW_GROUP_META = [
  ['privacy', '隐私保护', '遥测、广告 ID、活动记录、剪贴板同步', 'shield'],
  ['perf', '性能与游戏', '电源方案、游戏模式、调度策略', 'bolt'],
  ['cpu', '处理器', '核心停放、频率策略、异构调度', 'cpu'],
  ['memory', '内存', '内存压缩、页面文件、预读取', 'memory'],
  ['gpu', '显卡', '硬件加速调度、驱动级选项', 'gpu'],
  ['network', '网络优化', 'TCP 参数、节流、QoS', 'refresh'],
  ['task', '任务与启动', '计划任务、开机项', 'clock'],
  ['desktop', '桌面体验', '任务栏、小组件、动画、右键菜单', 'monitor'],
  ['periph', '外设与输入', '鼠标加速、USB 节能', 'mouse'],
  ['service', '系统服务', '后台服务启停', 'server'],
  ['audio', '音频', '音频独占、音量合成', 'play'],
  ['sys', '系统行为', 'UAC、更新、系统提示', 'box'],
  ['clean', '清理', '临时文件、缓存、回收站', 'trash'],
  ['repair', '修复与还原', 'SFC、DISM、系统还原点', 'wrench'],
  ['misc', '其它优化', '零散但有收益的开关', 'chip']
];

function loadTweakDefs() {
  const base = readJson(path.join(ROOT, 'data', 'tweaks.json'), { groups: [], items: [] });
  const extra = readJson(path.join(ROOT, 'data', 'tweaks-yuqi.json'), { items: [] });
  const items = base.items.slice();
  const seen = new Set(items.map(i => i.id));
  for (const it of (extra.items || [])) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    items.push(it);
  }

  const known = new Map((base.groups || []).map(g => [g.id, g]));
  const meta = new Map(TW_GROUP_META.map(m => [m[0], m]));
  const used = new Set(items.map(i => i.group));

  const groups = [];
  for (const [id, name, desc, icon] of TW_GROUP_META) {
    if (!used.has(id)) continue;
    const cur = known.get(id);
    groups.push(cur ? Object.assign({}, cur) : { id, name, desc, icon });
  }
  for (const id of used) {
    if (!groups.some(g => g.id === id)) groups.push({ id, name: id, desc: '', icon: 'box' });
  }
  return { groups, items };
}

ipcMain.handle('tweaks', async () => {
  const def = loadTweakDefs();
  const admin = await detectAdmin();
  return { groups: def.groups, items: def.items, admin };
});
function runTweakOne(item, action, value) {
  const long = ['sfc', 'dism', 'clean-update'].includes(item.id);
  const args = ['-Action', action, '-Id', item.id];
  if (value !== undefined && value !== null && value !== '') args.push('-Value', String(value));
  if (item.spec) args.push('-Spec', JSON.stringify(item.spec));
  return runPS('tweaks.ps1', args, long ? 900000 : 60000);
}

// 批量检测：把整组的 id+spec 写进临时文件，一次进程读完
async function detectBatchStates(items) {
  const list = items
    .filter(i => i && i.spec && (i.kind === 'toggle' || i.kind === 'choice'))
    .map(i => ({ id: i.id, spec: i.spec }));
  if (!list.length) return {};

  const tmp = path.join(os.tmpdir(), 'wintoolbox-detect-' + process.pid + '.json');
  try {
    fs.writeFileSync(tmp, JSON.stringify(list), 'utf8');
    const r = await runPS('tweaks-detect.ps1', ['-Items', tmp], 120000);
    if (r && r.ok && r.states) return r.states;
    if (r && r.error) logErr('detect-batch', r.error);
    return {};
  } catch (e) {
    logErr('detect-batch', e);
    return {};
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

// 并发跑一个队列，limit 路同时进行
async function runPool(list, limit, fn, onTick) {
  const queue = list.slice();
  let done = 0;
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const it = queue.shift();
      try { await fn(it); } catch (e) { logErr('pool', e); }
      done++;
      if (onTick) { try { onTick(done, list.length); } catch (e) { logErr('pool-tick', e); } }
    }
  });
  await Promise.all(workers);
}

ipcMain.handle('tweaks:detect-batch', async (e, ids) => {
  const defs = new Map(loadTweakDefs().items.map(i => [i.id, i]));
  const items = (ids || []).map(id => defs.get(id)).filter(Boolean);
  const states = await detectBatchStates(items);
  return { ok: true, states };
});

ipcMain.handle('tweak', async (e, id, action, value) => {
  const def = loadTweakDefs();
  const item = def.items.find(i => i.id === id);
  if (!item) return { ok: false, error: '未找到该项' };
  if (item.kind === 'pending') return { ok: false, error: '该项尚未接入执行引擎' };
  const r = await runTweakOne(item, action, value);
  if (r && r.needAdmin) {
    return { ok: false, needAdmin: true, error: '需要管理员权限' };
  }
  return r;
});

const PROFILE_VER = 1;

// 可备份的项：有明确开关/取值，pending 与 action 类不参与
function exportableItems() {
  return loadTweakDefs().items.filter(i => i.kind === 'toggle' || i.kind === 'choice');
}

ipcMain.handle('profile:export', async (ev) => {
  const items = exportableItems();
  const states = {};
  let failed = 0;

  const batch = await detectBatchStates(items);

  for (const it of items) {
    const r = batch[it.id];
    if (r && r.ok !== false) {
      states[it.id] = {
        name: it.name,
        group: it.group,
        kind: it.kind,
        risk: it.risk || 'low',
        applied: !!r.applied,
        value: r.value === undefined ? null : r.value,
        current: r.current === undefined ? null : r.current
      };
    } else {
      states[it.id] = {
        name: it.name, group: it.group, kind: it.kind, risk: it.risk || 'low',
        applied: null, error: '读取失败'
      };
      failed++;
    }
  }
  try { ev.sender.send('profile:progress', { done: items.length, total: items.length, phase: '读取当前设置' }); } catch (e) { logErr('profile-progress', e); }

  const doc = {
    app: 'WinToolbox',
    kind: 'windows-settings-profile',
    ver: PROFILE_VER,
    appVersion: app.getVersion(),
    exportedAt: new Date().toISOString(),
    machine: os.hostname(),
    osName: os.type() + ' ' + os.release(),
    total: Object.keys(states).length,
    failed,
    items: states
  };

  const stamp = new Date().toISOString().slice(0, 10);
  // 自动化测试可直接指定路径，跳过系统保存框
  const forced = process.env.TB_PROFILE_SAVE;
  const { canceled, filePath } = forced
    ? { canceled: false, filePath: forced }
    : await dialog.showSaveDialog(win, {
        title: '保存 Windows 设置备份',
        defaultPath: path.join(app.getPath('documents'), 'WinToolbox-设置备份-' + stamp + '.json'),
        filters: [{ name: 'WinToolbox 设置备份', extensions: ['json'] }]
      });
  if (canceled || !filePath) return { ok: false, canceled: true };

  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf8');
  return { ok: true, path: filePath, count: doc.total, failed };
});

ipcMain.handle('profile:pick', async () => {
  const forced2 = process.env.TB_PROFILE_OPEN;
  const { canceled, filePaths } = forced2
    ? { canceled: false, filePaths: [forced2] }
    : await dialog.showOpenDialog(win, {
    title: '选择设置备份文件',
    properties: ['openFile'],
    filters: [{ name: 'WinToolbox 设置备份', extensions: ['json'] }]
  });
  if (canceled || !filePaths || !filePaths[0]) return { ok: false, canceled: true };
  try {
    const doc = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));
    if (!doc || doc.kind !== 'windows-settings-profile' || !doc.items) {
      return { ok: false, error: '这不是 WinToolbox 的设置备份文件' };
    }
    const defs = new Map(loadTweakDefs().items.map(i => [i.id, i]));
    let known = 0, unknown = 0, high = 0, on = 0;
    const highNames = [];
    for (const [id, v] of Object.entries(doc.items)) {
      const d = defs.get(id);
      if (!d || d.kind === 'pending') { unknown++; continue; }
      known++;
      if ((d.risk || 'low') === 'high') high++;
      if (v.applied) on++;
    }
    return {
      ok: true, path: filePaths[0],
      summary: { total: doc.total || Object.keys(doc.items).length, known, unknown, high, appliedCount: on,
                 highNames, exportedAt: doc.exportedAt, machine: doc.machine, osName: doc.osName, appVersion: doc.appVersion },
      doc
    };
  } catch (e) {
    logErr('profile-pick', e);
    return { ok: false, error: '文件解析失败：' + e.message };
  }
});

ipcMain.handle('profile:apply', async (ev, doc, opts) => {
  const options = Object.assign({ includeHigh: false, dryRun: false }, opts || {});
  const defs = new Map(loadTweakDefs().items.map(i => [i.id, i]));
  const plan = [];
  let skippedHigh = 0, skippedUnknown = 0, skippedNoState = 0;
  const highNames = [];

  for (const [id, v] of Object.entries(doc.items || {})) {
    const d = defs.get(id);
    if (!d || d.kind === 'pending') { skippedUnknown++; continue; }
    if (v.applied === null || v.applied === undefined) { skippedNoState++; continue; }
    if ((d.risk || 'low') === 'high' && !options.includeHigh) { skippedHigh++; highNames.push(d.name); continue; }
    plan.push({ item: d, applied: !!v.applied, value: v.value == null ? undefined : v.value });
  }

  let done = 0, okCount = 0, needAdmin = 0;
  const failures = [];

  await runPool(plan, 4, async (step) => {
    if (options.dryRun) { okCount++; return; }
    const r = await runTweakOne(step.item, step.applied ? 'apply' : 'restore', step.applied ? step.value : undefined);
    if (r && r.ok) okCount++;
    else if (r && r.needAdmin) needAdmin++;
    else failures.push({ name: step.item.name, error: (r && r.error) || '未知错误' });
  }, (d, total) => { try { ev.sender.send('profile:progress', { done: d, total, phase: options.dryRun ? '模拟中' : '写入设置' }); } catch (e) { logErr('profile-progress2', e); } });

  saveStore();
  return {
    ok: true, planned: plan.length, applied: okCount, needAdmin,
    skippedHigh, highNames, skippedUnknown, skippedNoState,
    failures: failures.slice(0, 30), failureCount: failures.length
  };
});

/* ---------------- 自定义工具 IPC ---------------- */
ipcMain.handle('custom:pick', async () => {
  const r = await dialog.showOpenDialog({
    title: '选择要添加的程序',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '程序', extensions: ['exe', 'lnk', 'bat', 'cmd', 'url', 'msc', 'cpl'] },
      { name: '全部文件', extensions: ['*'] }
    ]
  });
  if (r.canceled) return { ok: false };
  return { ok: true, paths: r.filePaths };
});

ipcMain.handle('custom:add', (e, items) => {
  const list = customTools();
  const added = [];
  for (const it of items) {
    const raw = String(it.path || '').trim();
    if (!raw) continue;
    // 归一化：去掉重复分隔符、统一写法，避免 C:////Windows//// 这类脏路径
    const p = path.normalize(raw);
    if (list.some(x => x.path.toLowerCase() === p.toLowerCase())) continue;
    const base = path.basename(p).replace(/\.(exe|lnk|bat|cmd|url|msc|cpl)$/i, '');
    list.push({
      id: 'c' + md5(p + Date.now()).slice(0, 8),
      name: it.name || base,
      desc: it.desc || '',
      path: p,
      args: it.args || '',
      cwd: it.cwd || '',
      cat: it.cat || 'custom',
      addedAt: Date.now(),
      admin: !!it.admin
    });
    added.push(base);
  }
  saveCustom(list);
  return { ok: true, added, total: list.length };
});

ipcMain.handle('custom:update', (e, id, patch) => {
  const list = customTools();
  const it = list.find(x => x.id === id);
  if (!it) return { ok: false };
  Object.assign(it, patch);
  saveCustom(list);
  return { ok: true };
});

ipcMain.handle('custom:remove', (e, id) => {
  const list = customTools().filter(x => x.id !== id);
  saveCustom(list);
  store.fav = store.fav.filter(x => x !== id);
  saveStore();
  return { ok: true };
});

ipcMain.handle('custom:relocate', async (e, id) => {
  const r = await dialog.showOpenDialog({ title: '重新指定程序位置', properties: ['openFile'] });
  if (r.canceled) return { ok: false };
  const list = customTools();
  const it = list.find(x => x.id === id);
  if (it) { it.path = r.filePaths[0]; saveCustom(list); }
  return { ok: true, path: r.filePaths[0] };
});

ipcMain.handle('custom:export', async () => {
  const r = await dialog.showSaveDialog({
    title: '导出我的工具清单', defaultPath: 'my-tools.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (r.canceled || !r.filePath) return { ok: false };
  fs.writeFileSync(r.filePath, JSON.stringify(customTools(), null, 2), 'utf8');
  return { ok: true, path: r.filePath };
});

ipcMain.handle('custom:import', async () => {
  const r = await dialog.showOpenDialog({ title: '导入工具清单', properties: ['openFile'], filters: [{ name: 'JSON', extensions: ['json'] }] });
  if (r.canceled) return { ok: false };
  const items = readJson(r.filePaths[0], null);
  if (!Array.isArray(items)) return { ok: false, error: '格式不对' };
  const list = customTools();
  let n = 0;
  for (const it of items) {
    if (!it || !it.path) continue;
    if (list.some(x => x.path.toLowerCase() === String(it.path).toLowerCase())) continue;
    it.id = 'c' + md5(it.path + Date.now() + n).slice(0, 8);
    list.push(it); n++;
  }
  saveCustom(list);
  return { ok: true, added: n };
});

/* ---------------- 侧栏排序与自定义分组 ---------------- */
// 布局版本迁移：老版本存过的宽度一次性失效，之后仍按用户拖动结果保存
if ((store.sideWRev || 1) < 3) {
  store.sideW = 196;
  store.sideWRev = 3;
  saveStore();
}

ipcMain.handle('ui:sidebar', (e, w) => {
  const n = Math.max(160, Math.min(340, Math.round(Number(w) || 196)));
  store.sideW = n;
  saveStore();
  return { ok: true, w: n };
});

ipcMain.handle('sidebar:order', (e, payload) => {
  if (payload && Array.isArray(payload.groups)) store.groupOrder = payload.groups;
  if (payload && Array.isArray(payload.cats)) store.catOrder = payload.cats;
  if (payload && Array.isArray(payload.tw)) store.twOrder = payload.tw;
  saveStore();
  return { ok: true };
});

ipcMain.handle('sidebar:pin', (e, id, on) => {
  const list = store.pinned || (store.pinned = []);
  const i = list.indexOf(id);
  if (on && i < 0) list.unshift(id);
  if (!on && i >= 0) list.splice(i, 1);
  saveStore();
  return { ok: true, pinned: list };
});

ipcMain.handle('sidebar:catsort', (e, id, mode) => {
  store.catSort = store.catSort || {};
  if (!mode || mode === 'default') delete store.catSort[id];
  else store.catSort[id] = mode;
  saveStore();
  return { ok: true };
});

ipcMain.handle('sidebar:addcat', (e, name) => {
  const clean = String(name || '').trim().slice(0, 20) || '我的工具';
  const list = store.customCats || (store.customCats = []);

  // 重名检查：自定义分组 + 内置分类都不能撞
  const taken = new Set();
  for (const c of list) taken.add(String(c.name).trim().toLowerCase());
  try { for (const c of (buildCatalog().cats || [])) taken.add(String(c.name).trim().toLowerCase()); } catch {}
  if (taken.has(clean.toLowerCase())) {
    return { ok: false, error: '已经有叫「' + clean + '」的分组了，换个名字' };
  }

  const id = 'u' + md5(clean + Date.now()).slice(0, 7);
  list.push({ id, name: clean });
  saveStore();
  return { ok: true, cat: { id, name: clean } };
});

ipcMain.handle('sidebar:renamecat', (e, id, name) => {
  const clean = String(name || '').trim().slice(0, 20);
  if (!clean) return { ok: false, error: '名称不能为空' };
  const it = (store.customCats || []).find(c => c.id === id);
  if (!it) return { ok: false, error: '不是自定义分组' };
  const others = (store.customCats || []).filter(c => c.id !== id).map(c => String(c.name).trim().toLowerCase());
  if (others.includes(clean.toLowerCase())) return { ok: false, error: '已经有叫「' + clean + '」的分组了' };
  it.name = clean;
  saveStore();
  return { ok: true };
});

ipcMain.handle('sidebar:removecat', (e, id) => {
  store.customCats = (store.customCats || []).filter(c => c.id !== id);
  // 该分组下的工具退回 custom
  const list = customTools();
  const rest = (store.customCats || [])[0];
  let moved = 0;
  for (const t of list) { if (t.cat === id) { t.cat = rest ? rest.id : 'custom'; moved++; } }
  if (moved) saveCustom(list);
  saveStore();
  return { ok: true, moved };
});

/* ---------------- 图标（白天/夜间） ---------------- */
const ICON_DIR_APP = path.join(USER_DIR, 'icons-app');
function ensureIcons() {
  const src = path.join(ROOT, 'data', 'icons');
  try {
    fs.mkdirSync(ICON_DIR_APP, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      const dst = path.join(ICON_DIR_APP, f);
      const a = fs.statSync(path.join(src, f));
      const b = fs.existsSync(dst) ? fs.statSync(dst) : null;
      if (!b || b.size !== a.size) fs.copyFileSync(path.join(src, f), dst);
    }
  } catch {}
}
ensureIcons();

function iconPath(theme) {
  const base = theme === 'dark' ? 'icon-dark' : 'icon';
  if (process.platform === 'win32') {
    const ico = path.join(ICON_DIR_APP, base + '.ico');
    if (fs.existsSync(ico)) return ico;
  }
  return path.join(ICON_DIR_APP, base + '.png');
}

let lastIconTheme = null;
function applyWindowIcon(theme) {
  if (theme === lastIconTheme) return;
  try {
    const p2 = iconPath(theme);
    if (!fs.existsSync(p2)) return;
    const img = nativeImage.createFromPath(p2);
    if (img.isEmpty()) return;

    if (win && !win.isDestroyed()) {
      win.setIcon(img);
      // 任务栏按钮会缓存图标，切换一次可见性可以强制它重画
      if (process.platform === 'win32') {
        try {
          win.setSkipTaskbar(true);
          setTimeout(() => { try { if (win && !win.isDestroyed()) win.setSkipTaskbar(false); } catch {} }, 40);
        } catch {}
      }
    }
    if (process.platform === 'win32' && app.isPackaged) app.setAppUserModelId('TubaToolbox');
    if (tray && !tray.isDestroyed()) { try { tray.setImage(img); } catch (e) { logErr('tray-icon', e); } }
    if (win && !win.isDestroyed()) { try { win.setBackgroundColor(theme === 'dark' ? '#0f0f12' : '#eef3f4'); } catch (e) { logErr('bgcolor', e); } }
    lastIconTheme = theme;
    try { if (process.env.TB_TRACE) fs.appendFileSync(path.join(USER_DIR, 'icon-trace.txt'), new Date().toISOString() + ' ' + theme + ' ' + path.basename(p2) + '\n'); } catch {}
  } catch {}
}

/* ---------------- 托盘 ---------------- */
let tray = null, isQuitting = false, closePrompting = false;

function showWin() {
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function hideToTray() {
  try { if (win && !win.isDestroyed()) win.hide(); } catch (e) { logErr('hide', e); }
}

function createTray() {
  try {
    const img = nativeImage.createFromPath(iconPath(store.theme || 'light'));
    tray = new Tray(img.isEmpty() ? iconPath('light') : img);
    tray.setToolTip('WinToolbox · 整机工具集');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: '打开主界面', click: showWin },
      { type: 'separator' },
      { label: '退出', click: () => { isQuitting = true; stopGpuWatcher(); app.quit(); } }
    ]));
    tray.on('click', showWin);
    tray.on('double-click', showWin);
  } catch (e) {
    logErr('tray', e);
  }
}

/* 初始窗口几何：没存过、或存的值不合理（换过显示器）就回到默认 1360×880 */
function initialBounds() {
  const b = store.winBounds;
  const def = { width: 1360, height: 880 };
  if (!b || !b.width || !b.height) return def;
  if (b.width < 1040 || b.height < 700) return def;
  try {
    const { screen } = require('electron');
    const area = screen.getPrimaryDisplay().workAreaSize;
    // 位置跑到屏幕外就只保留尺寸，重新居中
    if (b.x > area.width - 200 || b.y > area.height - 200 || b.x < -b.width + 200 || b.y < -100) {
      return { width: b.width, height: b.height };
    }
  } catch (e) { logErr('bounds-init', e); }
  return { x: b.x, y: b.y, width: b.width, height: b.height };
}


/* ---------------- 工具库定位（首次引导用） ---------------- */
function looksLikeTubaRoot(dir) {
  try {
    if (!dir || !fs.existsSync(dir)) return false;
    if (!fs.statSync(dir).isDirectory()) return false;
    const marks = ['处理器工具', '显卡工具', '内存工具', '硬盘工具', '综合检测'];
    let hit = 0;
    for (const m of marks) if (fs.existsSync(path.join(dir, m))) hit++;
    return hit >= 2;
  } catch (e) { return false; }
}

// 用户可能选的是「图吧工具箱」根目录（其下才是 tools）
function normalizeTubaRoot(dir) {
  if (!dir) return null;
  // 合并重复分隔符（手动粘贴路径时常见 D:////a////b），UNC 路径保留开头的双斜杠
  const unc = /^\\[^\\]/.test(dir);
  dir = String(dir).replace(/[\\/]+/g, '\\');
  if (unc && !dir.startsWith('\\\\')) dir = '\\' + dir;
  const cands = [dir, path.join(dir, 'tools'), path.join(dir, 'Tools'), path.join(dir, 'TOOLS')];
  for (const c of cands) if (looksLikeTubaRoot(c)) return c;
  return null;
}

function driveRoots() {
  const out = [];
  for (const ch of 'CDEFGH') {
    const d = ch + ':\\';
    try { if (fs.existsSync(d)) out.push(d); } catch {}
  }
  return out;
}

const SKIP_DIRS = /^(Windows|Windows\.old|Program Files|Program Files \(x86\)|ProgramData|\$Recycle\.Bin|System Volume Information|node_modules|AppData|Recovery|PerfLogs|Config\.Msi)$/i;

// 有上限的广度搜索：最多 3 层、3000 个目录，避免卡死
function scanTubaRoots() {
  const found = new Set();
  // 刚从官网下载解压的目录，多半在「下载」或「桌面」，优先扫这两个
  const priority = [];
  try { priority.push({ dir: app.getPath('downloads'), depth: 0 }); } catch {}
  try { priority.push({ dir: app.getPath('desktop'), depth: 0 }); } catch {}
  const queue = priority.concat(driveRoots().map(d => ({ dir: d, depth: 0 })));
  let visited = 0;
  while (queue.length && visited < 3000) {
    const cur = queue.shift();
    visited++;
    let ents;
    try { ents = fs.readdirSync(cur.dir, { withFileTypes: true }); } catch { continue; }
    for (const e of ents) {
      if (!e.isDirectory()) continue;
      const full = path.join(cur.dir, e.name);
      if (/图吧工具箱|tuba|toolbox/i.test(e.name)) {
        const n = normalizeTubaRoot(full);
        if (n) found.add(n);
        if (found.size >= 8) return [...found];
      }
      if (cur.depth < 2 && !SKIP_DIRS.test(e.name)) queue.push({ dir: full, depth: cur.depth + 1 });
    }
  }
  return [...found];
}

ipcMain.handle('open-external', (e, url) => {
  try {
    if (!/^https?:/.test(String(url))) return { ok: false, error: '只允许 http/https' };
    shell.openExternal(String(url));
    return { ok: true };
  } catch (err) { logErr('open-external', err); return { ok: false, error: err.message }; }
});

ipcMain.handle('settings:get', async () => {
  let total = 0, available = 0;
  try {
    const { tools } = buildCatalog();
    total = tools.length;
    available = tools.filter(t => t.exists).length;
  } catch (e) { logErr('settings-get', e); }
  return {
    root: TUBA_ROOT || '',
    rootOk: looksLikeTubaRoot(TUBA_ROOT),
    total, available,
    theme: store.theme || 'light',
    themeMode: store.themeMode || 'system',
    motion: store.motion || 'full',
    lang: store.lang || 'zh',
    systemDark: nativeTheme.shouldUseDarkColors,
    sideW: store.sideW || 196,
    closeToTray: store.closeToTray !== false,
    closeAsked: !!store.closeAsked,
    autoScanTuba: store.autoScanTuba !== false,
    rememberBounds: true,
    admin: await detectAdmin(),
    version: app.getVersion(),
    userDir: USER_DIR
  };
});

ipcMain.handle('settings:set', (e, key, value) => {
  switch (key) {
    case 'closeToTray': store.closeToTray = !!value; store.closeAsked = true; break;
    case 'autoScanTuba': store.autoScanTuba = !!value; break;
    case 'theme': store.theme = value === 'dark' ? 'dark' : 'light'; break;
    case 'themeMode':
      store.themeMode = ['system', 'light', 'dark'].includes(value) ? value : 'system';
      if (store.themeMode !== 'system') store.theme = store.themeMode;
      break;
    case 'motion': store.motion = ['full', 'lite', 'off'].includes(value) ? value : 'full'; break;
    case 'lang': store.lang = value === 'en' ? 'en' : 'zh'; break;
    case 'sideW': store.sideW = Math.max(160, Math.min(340, Math.round(Number(value) || 196))); break;
    default: return { ok: false, error: '未知设置项' };
  }
  saveStore();
  return { ok: true };
});

// 跟随系统主题：系统切换时通知渲染层
try {
  nativeTheme.on('updated', () => {
    try { if (win && !win.isDestroyed()) win.webContents.send('theme:system', nativeTheme.shouldUseDarkColors); } catch (e) { logErr('theme-event', e); }
  });
} catch (e) { logErr('theme-hook', e); }

ipcMain.handle('settings:open-dir', async (e, which) => {
  const target = which === 'user' ? USER_DIR : (TUBA_ROOT || USER_DIR);
  try { await shell.openPath(target); return { ok: true }; } catch (err) { return { ok: false, error: err.message }; }
});

ipcMain.handle('setup:check', () => {
  const ok = looksLikeTubaRoot(TUBA_ROOT);
  return { ok, root: TUBA_ROOT || '', links: CONF.links || {} };
});

ipcMain.handle('setup:scan', () => {
  const t0 = Date.now();
  const found = scanTubaRoots();
  return { list: found, ms: Date.now() - t0, current: TUBA_ROOT };
});

ipcMain.handle('setup:open-downloads', async () => {
  try { await shell.openPath(app.getPath('downloads')); return { ok: true }; }
  catch (e) { return { ok: false, error: e.message }; }
});

ipcMain.handle('setup:pick', async () => {
  const r = await dialog.showOpenDialog(win, { title: '选择图吧工具箱的 tools 目录', properties: ['openDirectory'] });
  if (r.canceled || !r.filePaths || !r.filePaths[0]) return { ok: false, canceled: true };
  const n = normalizeTubaRoot(r.filePaths[0]);
  if (!n) return { ok: false, error: '这个目录里没找到「处理器工具」「显卡工具」等子文件夹，不像是工具库' };
  return { ok: true, root: n };
});

ipcMain.handle('setup:save', (e, dir) => {
  const n = normalizeTubaRoot(dir);
  if (!n) return { ok: false, error: '目录无效' };
  TUBA_ROOT = n;
  store.tubaRoot = n;
  saveStore();
  const { tools } = buildCatalog();
  const avail = tools.filter(t => t.exists).length;
  return { ok: true, root: n, total: tools.length, available: avail };
});

ipcMain.handle('setup:reset', () => {
  delete store.tubaRoot;
  saveStore();
  TUBA_ROOT = CONF.tubaRoot;
  return { ok: true, root: TUBA_ROOT };
});


/* ---------------- PawnIO：内核隔离下读取 CPU 温度的签名驱动 ---------------- */
const PAWNIO_URL = 'https://github.com/namazso/PawnIO.Setup/releases/download/2.2.0/PawnIO_setup.exe';
const PAWNIO_SHA256 = '1f519a22e47187f70a1379a48ca604981c4fcf694f4e65b734aaa74a9fba3032';
const PI_LIB_PF = 'C:\\Program Files\\PawnIO\\PawnIOLib.dll';
const PI_LIB_APP = path.join(SENSOR_DIR, 'PawnIOLib.dll');
let pawnioInstalling = false;

function pawnioInstalled() {
  try { return fs.existsSync(PI_LIB_PF); } catch (e) { return false; }
}

function pawnioStatus() {
  return {
    installed: pawnioInstalled(),
    libCopied: fs.existsSync(PI_LIB_APP),
    sensorLib: exists(LHM_LIB)
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function matchesPawnioRelease(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex') === PAWNIO_SHA256;
}

function verifyPawnioSigner(file) {
  // PowerShell 7 配置的模块路径不能用于加载 Windows PowerShell 的签名模块。
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => name.toLowerCase() !== 'psmodulepath'));
  return new Promise((resolve) => {
    execFile('powershell', ['-NoProfile', '-Command',
      "$ErrorActionPreference='Stop'; $s=Get-AuthenticodeSignature -LiteralPath '" + file.replace(/'/g, "''") + "'; " +
      "if ($s.Status -eq 'Valid' -and $s.SignerCertificate.Subject -match '(?:^|,\\s*)CN=namazso\\.eu(?:,|$)') { 'OK' }"
    ], { env, windowsHide: true, timeout: 30000 }, (err, out) => resolve(!err && String(out).trim() === 'OK'));
  });
}

ipcMain.handle('sensors:pawnio', () => pawnioStatus());

ipcMain.handle('sensors:pawnio-install', async (ev) => {
  if (!exists(LHM_LIB)) return { ok: false, error: '请先按 README 配置 LibreHardwareMonitor 传感器库。' };
  if (pawnioInstalling) return { ok: false, error: 'PawnIO 安装正在进行。' };
  pawnioInstalling = true;
  const send = msg => { if (!ev.sender.isDestroyed()) ev.sender.send('pawnio:progress', msg); };
  try {
    const already = pawnioInstalled();
    if (!already) {
      const runDir = path.join(USER_DIR, 'pawnio');
      fs.mkdirSync(runDir, { recursive: true });
      const setup = path.join(runDir, 'PawnIO_setup.exe');
      if (!exists(setup) || !matchesPawnioRelease(fs.readFileSync(setup))) {
        send('正在从官方 GitHub 下载 PawnIO…');
        const response = await net.fetch(PAWNIO_URL, { signal: AbortSignal.timeout(90000) });
        if (!response.ok) return { ok: false, error: `下载安装包失败：HTTP ${response.status}` };
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!matchesPawnioRelease(bytes)) return { ok: false, error: '安装包 SHA-256 校验未通过。' };
        fs.writeFileSync(setup, bytes);
      }
      send('校验签名…');
      if (!(await verifyPawnioSigner(setup))) return { ok: false, error: '安装包签名校验未通过。' };
      send('请在弹出的 PawnIO 窗口中确认安装。');
      await new Promise((resolve, reject) => {
        execFile('powershell', ['-NoProfile', '-Command',
          "$ErrorActionPreference='Stop'; Start-Process -Verb RunAs -FilePath '" + setup.replace(/'/g, "''") + "'"
        ], { windowsHide: true, timeout: 90000 }, error => error ? reject(error) : resolve());
      });
      for (let i = 0; i < 90 && !pawnioInstalled(); i++) await sleep(2000);
    }
    if (pawnioInstalled()) {
      fs.copyFileSync(PI_LIB_PF, PI_LIB_APP);
      send('正在重新读取温度…');
      return { ok: true, already };
    }
    return { ok: false, error: '等待超时：未检测到已安装的 PawnIO。' };
  } catch (e) {
    logErr('pawnio', e);
    return { ok: false, error: '未能完成 PawnIO 配置，请检查安装是否取消以及运行日志。' };
  } finally {
    pawnioInstalling = false;
  }
});

/* ---------------- 窗口 ---------------- */
let win;

function reportElevation() {
  // elev-report
  let pending = false, failed = false;
  try { pending = fs.existsSync(ELEV_FLAG); } catch {}
  try { failed = fs.existsSync(ELEV_FAIL); } catch {}
  if (!pending && !failed) return;
  try { fs.unlinkSync(ELEV_FLAG); } catch {}
  try { fs.unlinkSync(ELEV_FAIL); } catch {}
  if (ELEVATED && !failed) return;   // 提权成功，静默
  dialog.showMessageBox({
    type: 'warning',
    title: '提权没有成功',
    message: '系统没有接受提权请求，仍以普通权限运行。',
    detail: '在 UAC 窗口点「否」、或用户账户控制被设为「从不通知」时会出现这种情况。\n\n' +
            '最稳的办法：关掉本程序，右键「WinToolbox.exe」→「以管理员身份运行」。',
    buttons: ['知道了']
  });
}

function createWindow() {
  win = new BrowserWindow({
    ...initialBounds(),
    minWidth: 1040, minHeight: 700,
    frame: false, backgroundColor: '#eef3f4', show: false,
    title: 'WinToolbox',
    icon: iconPath(store.theme || 'light'),
    webPreferences: { preload: path.join(ROOT, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  if (process.env.DBG) {
    win.webContents.on('console-message', (e, lvl, msg) => { try { fs.appendFileSync(path.join(ROOT, 'renderer.log'), msg + '\n'); } catch {} });
    win.webContents.on('render-process-gone', (e, d) => console.log('[crash]', JSON.stringify(d)));
  }
  win.loadFile(path.join(ROOT, 'renderer', 'index.html'));
  win.once('ready-to-show', () => {
    applyWindowIcon(store.theme || 'light');
    createTray();
    win.show();
    if (process.env.SHOT) {
      const out = process.env.SHOT;
      const page = process.env.SHOT_PAGE || '';
      setTimeout(async () => {
        if (page) {
          let js;
          if (['fav','recent','sys','overview'].includes(page)) js = `go('${page}')`;
          else if (page.startsWith('tw:')) js = `go('tw','${page.slice(3)}')`;
          else js = `go('cat','${page}')`;
          await win.webContents.executeJavaScript(js);
          await new Promise(r => setTimeout(r, Number(process.env.SHOT_AFTER || 7000)));
        }
        if (process.env.SHOT_JS) {
          try { fs.writeFileSync(path.join(ROOT, 'shot-js.txt'), String(await win.webContents.executeJavaScript(process.env.SHOT_JS))); } catch (e) { fs.writeFileSync(path.join(ROOT, 'shot-js.txt'), 'ERR ' + e.message); }
        }
        const rect = process.env.SHOT_RECT ? (r => ({ x: r[0], y: r[1], width: r[2], height: r[3] }))(process.env.SHOT_RECT.split(',').map(Number)) : undefined;
        const img = await win.webContents.capturePage(rect);
        fs.writeFileSync(out, img.toPNG());
        app.quit();
      }, Number(process.env.SHOT_DELAY || 6500));
    }
  });
  // 记住窗口几何，下次原样打开
  const saveBounds = () => {
    try {
      if (!win || win.isDestroyed() || win.isMinimized() || win.isMaximized() || win.isFullScreen()) return;
      store.winBounds = win.getBounds();
      saveStore();
    } catch (e) { logErr('bounds', e); }
  };
  let boundsTimer = null;
  win.on('resize', () => { clearTimeout(boundsTimer); boundsTimer = setTimeout(saveBounds, 600); });
  win.on('move', () => { clearTimeout(boundsTimer); boundsTimer = setTimeout(saveBounds, 600); });
  win.on('close', async (e) => {
    saveBounds();
    if (isQuitting || closePrompting) return;

    // 第一次关闭：交给渲染层用应用内弹窗询问，样式跟主题一致
    if (!store.closeAsked) {
      e.preventDefault();
      closePrompting = true;
      try { win.webContents.send('close:ask'); } catch (err) { logErr('close-ask', err); }
      // 渲染层没响应时兜底：3 秒后按"最小化到托盘"处理，避免窗口关不掉
      setTimeout(() => {
        if (closePrompting) {
          closePrompting = false;
          try { if (win && !win.isDestroyed()) win.hide(); } catch (err) { logErr('close-fallback', err); }
        }
      }, 3000);
      return;
    }

    if (store.closeToTray === false) { isQuitting = true; stopGpuWatcher(); app.quit(); return; }
    e.preventDefault();
    win.hide();
  });

  ipcMain.handle('close:answer', (e, opt) => {
    const tray = !opt || opt.tray !== false;
    const remember = !!(opt && opt.remember);
    closePrompting = false;
    if (remember) { store.closeAsked = true; store.closeToTray = tray; saveStore(); }
    if (!tray) { isQuitting = true; stopGpuWatcher(); app.quit(); return { ok: true }; }
    try { if (win && !win.isDestroyed()) win.hide(); } catch (err) { logErr('close-hide', err); }
    return { ok: true };
  });

  win.on('maximize', () => win.webContents.send('win-state', true));
  win.on('unmaximize', () => win.webContents.send('win-state', false));
}

// 提权实例带 --elevated：不抢单实例锁，否则会被正在退出的旧实例挡掉后自杀
const ELEVATED = process.argv.includes('--elevated');

// 用户右键「以管理员身份运行」时不会带 --elevated，必须自己判断真实权限
let IS_ELEVATED = ELEVATED;
if (!IS_ELEVATED) {
  try {
    const r = require('child_process').spawnSync('whoami', ['/groups'], { windowsHide: true, encoding: 'utf8', timeout: 4000 });
    IS_ELEVATED = /S-1-16-12288/.test(String((r && r.stdout) || ''));
  } catch (e) { IS_ELEVATED = false; }
}

// 提权实例不抢单实例锁，否则会被托盘里的旧实例挡掉（这正是"右键管理员启动没反应"的原因）
const gotLock = IS_ELEVATED ? true : app.requestSingleInstanceLock();

if (IS_ELEVATED) {
  // 握手：非提权实例靠这个文件确认新进程确实起来了
  try { fs.writeFileSync(path.join(USER_DIR, 'last-elevated.txt'), String(Date.now())); } catch {}
  // 让还在托盘里的非提权旧实例主动退出，避免出现两个窗口、两份状态
  try { fs.writeFileSync(TAKEOVER_FILE, String(Date.now())); } catch {}
}
if (!gotLock) app.quit();
else {
  app.on('second-instance', () => { if (win) { win.show(); win.focus(); } });

  // 有新进程以管理员身份启动 → 自己（普通权限）让位
  function watchTakeover() {
    setInterval(() => {
      if (IS_ELEVATED) return;
      try {
        if (!fs.existsSync(TAKEOVER_FILE)) return;
        const ts = Number(fs.readFileSync(TAKEOVER_FILE, 'utf8')) || 0;
        if (Date.now() - ts > 15000) return;      // 过期标记忽略
        isQuitting = true;
        stopGpuWatcher();
        app.quit();
      } catch (e) { /* ignore */ }
    }, 600);
  }
  watchTakeover();

  function clearTakeover() {
    if (!IS_ELEVATED) return;
    setTimeout(() => { try { fs.unlinkSync(TAKEOVER_FILE); } catch (e) {} }, 2500);
  }
  app.whenReady().then(() => {

    clearTakeover();
    createWindow();

    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });

  app.on('window-all-closed', () => { if (isQuitting) { stopGpuWatcher(); app.quit(); } });
  app.on('before-quit', () => { isQuitting = true; stopGpuWatcher(); });
app.on('before-quit', () => { if (netProc) { try { netProc.kill(); } catch {} } });
}
