/* 界面语言（只翻外壳：导航、标题、按钮、设置、状态标签）
   工具名与系统项名称保持原文 —— 那些是软件本名，翻了反而找不到 */

const I18N_EN = {
  // 导航与页面
  '硬件与监控': 'Hardware',
  '收藏夹': 'Favorites',
  '最近使用': 'Recent',
  '工具库': 'Tools',
  '系统调优': 'Tweaks',
  '系统概览': 'Overview',
  '处理器工具': 'Processor',
  '内存工具': 'Memory',
  '显卡工具': 'Graphics',
  '硬盘工具': 'Storage',
  '显示器工具': 'Display',
  '综合检测': 'Benchmark',
  '外设工具': 'Peripherals',
  '烤机压测': 'Stress Test',
  '游戏工具': 'Gaming',
  '其他工具': 'Other',
  '装机必备': 'Essentials',
  '性能调优': 'Performance',
  '影音工具': 'Media',
  '个入口': 'entries',

  // 调优分组
  '隐私保护': 'Privacy',
  '性能与游戏': 'Performance',
  '处理器': 'Processor',
  '内存': 'Memory',
  '显卡': 'Graphics',
  '网络优化': 'Network',
  '任务与启动': 'Tasks & Startup',
  '桌面体验': 'Desktop',
  '外设与输入': 'Input Devices',
  '系统服务': 'Services',
  '音频': 'Audio',
  '系统行为': 'System Behavior',
  '清理': 'Cleanup',
  '修复与还原': 'Repair & Restore',
  '其它优化': 'Misc',

  // 按钮
  '以管理员重启': 'Restart as Admin',
  '管理员': 'Admin',
  '重新扫描': 'Rescan',
  '手动选择…': 'Browse…',
  '打开下载夹': 'Downloads',
  '去官网下载': 'Get TubaToolbox',
  '稍后设置': 'Later',
  '开始使用': 'Get Started',
  '备份设置': 'Backup',
  '恢复设置': 'Restore',
  '执行': 'Run',
  '待接入': 'Pending',
  '新建分组': 'New Group',
  '添加程序': 'Add App',
  '导入清单': 'Import',
  '设置': 'Settings',
  '关闭': 'Close',
  '完成': 'Done',
  '更改…': 'Change…',
  '打开': 'Open',
  '运行日志': 'Logs',
  '数据目录': 'Data Folder',
  '前往': 'Go',
  '窄': 'Narrow',
  '标准': 'Default',
  '宽': 'Wide',

  // 状态
  '已生效': 'On',
  '未生效': 'Off',
  '低风险': 'Low',
  '中风险': 'Medium',
  '高风险': 'High',
  '可用': 'Ready',
  '缺失': 'Missing',
  '已在用': 'In use',
  '未启动': 'Not running',
  '检测中': 'Checking',
  '共': 'Total',
  '项操作': 'actions',

  // 设置面板
  '位置': 'Location',
  '识别结果': 'Detected',
  '外观': 'Appearance',
  '行为': 'Behavior',
  '系统与日志': 'System & Logs',
  '主题模式': 'Theme',
  '跟随系统': 'System',
  '浅色': 'Light',
  '深色': 'Dark',
  '跟随系统时，系统切换深色会自动跟着变': 'Follows your Windows light/dark setting',
  '动效': 'Animations',
  '完整': 'Full',
  '精简': 'Reduced',
  '侧栏宽度': 'Sidebar width',
  '语言': 'Language',
  '界面语言（工具名与系统项说明保持原文）': 'UI only — tool names stay as-is',
  '关闭窗口时最小化到托盘': 'Minimize to tray on close',
  '关掉后点 × 直接退出程序': 'Off: × quits the app',
  '启动时自动检测工具库': 'Check tool library on startup',
  '找不到时弹出引导': 'Shows setup wizard when missing',
  '运行权限': 'Privileges',
  '诊断': 'Diagnostics',
  '查看错误与提权日志': 'Errors and elevation log',
  '版本': 'Version',
  '免安装': 'portable',
  '普通权限（写注册表、改服务受限）': 'Standard (registry writes limited)',

  // 搜索与空态
  '搜索结果': 'Search results',
  '回车启动第一个工具': 'Enter to launch the first tool',
  '点条目跳到对应分组': 'Click a row to open its group',
  '没有更多结果': 'No more results',
  '个结果': 'results',
  '个匹配': 'matches',

  // 引导
  '先定位你的工具库': 'Point to your tool library',
  '正在查找工具库': 'Looking for the tool library',
  '设置完成': 'All set',
  '识别到': 'Found',
  '个工具，其中': 'tools,',
  '个已就绪': 'ready',
  '个工具索引 ·': 'tools indexed ·',
  '已找到': 'Found',
  // —— 补充：首页与硬件卡片 ——
  '监控': 'Monitor',
  '我的': 'Mine',
  '系统': 'System',
  '硬件': 'Hardware',
  '本机硬件': 'This PC',
  '本机硬件信息与实时状态': 'Hardware and live status',
  '实时占用': 'Live usage',
  '温度监控': 'Temperatures',
  '正在读取…': 'Loading…',
  '正在读取硬件信息…': 'Reading hardware info…',
  '基础模式': 'Basic mode',
  '已启用增强传感器': 'Enhanced sensors',
  '硬盘': 'Storage',
  '显示器': 'Display',
  '主板': 'Motherboard',
  '网络': 'Network',
  '计算机名': 'Computer',
  '显存': 'VRAM',
  '磁盘': 'Disk',
  '分区': 'Partitions',
  '普通权限': 'Standard',
  '字节': 'bytes',
  '刷新': 'Refresh',
  '重新扫描硬件': 'Rescan hardware',
  '搜索工具…  Ctrl+F': 'Search tools…  Ctrl+F',
  '搜索工具… Ctrl+F': 'Search tools… Ctrl+F',
  // —— 第二批：状态、提示、空态、拖拽 ——
  '处理器温度': 'CPU temp',
  '显卡温度': 'GPU temp',
  '硬盘温度': 'Disk temp',
  '主板温度': 'Board temp',
  '不可用': 'N/A',
  '良好': 'Good',
  '正常': 'Normal',
  '偏高': 'Warm',
  '过热': 'Hot',
  '松手即可添加': 'Drop to add',
  '当前版本未附带此工具': 'Not bundled in this build',
  '未附带': 'Not bundled',
  '加载中…': 'Loading…',
  '正在加载': 'Loading',
  '没有找到': 'Nothing found',
  '已复制': 'Copied',
  '已保存': 'Saved',
  '已取消': 'Canceled',
  '确定': 'OK',
  '取消': 'Cancel',
  '是': 'Yes',
  '否': 'No',
  '置顶分组': 'Pin group',
  '取消置顶': 'Unpin',
  '排序': 'Sort',
  '按名称': 'By name',
  '按创建时间': 'By date',
  '重命名': 'Rename',
  '删除': 'Delete',
  '添加': 'Add',
  '刷新': 'Refresh',
  '复制路径': 'Copy path',
  '打开所在文件夹': 'Show in folder',
  '以管理员身份启动': 'Run as admin',
  '需要管理员': 'Needs admin',
  '未检测到工具库': 'Tool library not found',
  '处理器温度需要': 'CPU temperature requires',
  '项温度读不到': 'sensor(s) unavailable',
  '隐私防护': 'Privacy',
  '开关表示': 'Switches show ',
  '这条优化是否生效': ' whether the tweak is active ',
  '——例如「广告 ID」打开，代表广告 ID 已被禁用；关闭则恢复系统默认、广告 ID 重新可用':
    ' — e.g. "Advertising ID" on means it is disabled; off restores the Windows default.'

};

const RX_RULES = [
  [/^已生效 (\d+) \/ (\d+)$/, 'On $1 / $2'],
  [/^检测中 (\d+)\/(\d+) · 已生效 (\d+)$/, 'Checking $1/$2 · on $3'],
  [/^· (\d+) 个匹配$/, '· $1 matches'],
  [/^“(.+)” · (\d+) 个匹配（工具 (\d+) \/ 系统 (\d+)）$/, '“$1” · $2 matches (tools $3 / system $4)'],
  [/^(\d+) 个结果$/, '$1 results'],
  [/^系统调优 (\d+) 项$/, 'Tweaks ($1)'],
  [/^(\d+) 个工具索引 · (\d+) 个已就绪$/, '$1 tools indexed · $2 ready'],
  [/^(\d+) 个入口$/, '$1 entries'],
  [/^共 (\d+) 项操作$/, '$1 actions'],
  [/^上次扫描 (.+)$/, 'Last scan $1'],
  [/^磁盘 ([A-Z])$/, 'Disk $1'],
  [/^有 (\d+) 项温度读不到：?$/, '$1 sensor(s) unavailable:'],
  [/^开关表示.*$/, 'Switches show whether each tweak is active'],
  [/^没找到和“(.+)”相关的工具或设置$/, 'No tools or settings match “$1”'],
  [/^没找到和“(.+)”相关的工具$/, 'No tools match “$1”']
];

const ATTRS = ['title', 'placeholder'];

let CUR = 'zh';

function translateText(raw) {
  if (CUR === 'zh') return null;
  const dict = I18N_EN;
  const key = raw.trim();
  if (!key) return null;
  if (dict[key]) return raw.replace(key, dict[key]);
  for (const [rx, rep] of RX_RULES) if (rx.test(key)) return key.replace(rx, rep);
  return null;
}

function applyIn(root) {
  if (CUR === 'zh' || !root) return;
  if (root.nodeType === 3) {
    const t = translateText(root.nodeValue || '');
    if (t !== null) root.nodeValue = t;
    return;
  }
  if (root.nodeType !== 1 && root.nodeType !== 9) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walker.nextNode()) hits.push(walker.currentNode);
  for (const n of hits) {
    if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue;
    const t = translateText(n.nodeValue || '');
    if (t !== null) n.nodeValue = t;
  }
  const els = root.querySelectorAll ? root.querySelectorAll(ATTRS.map(a => '[' + a + ']').join(',')) : [];
  for (const el of els) {
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v) { const t = translateText(v); if (t !== null) el.setAttribute(a, t); }
    }
  }
}

let observer = null;
function startObserver() {
  if (observer) return;
  observer = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') applyIn(m.target);
      else m.addedNodes.forEach(n => applyIn(n));
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

window.I18N = {
  get lang() { return CUR; },
  setLang(lang) {
    CUR = lang === 'en' ? 'en' : 'zh';
    if (CUR === 'zh') {
      if (observer) { observer.disconnect(); observer = null; }
      return;
    }
    startObserver();
    applyIn(document.body);
  },
  apply: applyIn,
  tr: (s) => translateText(s) || s
};
