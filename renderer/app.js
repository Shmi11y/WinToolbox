/* ========== 图标 ========== */
const ICON = {
  cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  memory: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7v10M12 7v10M17 7v10"/>',
  gpu: '<rect x="3" y="6" width="18" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.2"/><path d="M14 9h4M14 12h4M14 15h3M6 20h12"/>',
  disk: '<rect x="3" y="5" width="18" height="6" rx="1.6"/><rect x="3" y="13" width="18" height="6" rx="1.6"/><path d="M7 8h.01M7 16h.01"/>',
  screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><circle cx="12" cy="12" r="3"/>',
  mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>',
  fire: '<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 1.5 2S12 8 12 6c0-1 .5-2 .5-2Z"/>',
  game: '<rect x="2.5" y="7" width="19" height="10" rx="4"/><path d="M7 10v4M5 12h4M16 11h.01M18.5 13.5h.01"/>',
  box: '<path d="M3 8.5 12 3.5l9 5v7L12 20.5l-9-5v-7Z"/><path d="M3 8.5 12 13l9-4.5M12 13v7.5"/>',
  user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/>',
  bolt: '<path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5L13 3Z"/>',
  play: '<path d="M4 5.5A1.5 1.5 0 0 1 6.2 4.2l13 6.6a1.5 1.5 0 0 1 0 2.6l-13 6.6A1.5 1.5 0 0 1 4 18.7V5.5Z"/>',
  star: '<path d="m12 4 2.4 5 5.5.7-4 3.9 1 5.4-4.9-2.6-4.9 2.6 1-5.4-4-3.9 5.5-.7L12 4Z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.8"/>',
  folder: '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17V7.5Z"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4.5h-4.5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M12 3v3M12 18v3"/>',
  doc: '<path d="M6 3h7l5 5v13H6z"/><path d="M13 3v5h5"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.6"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  shield: '<path d="M12 3.5 19 6v6c0 4.2-2.9 7.2-7 8.5-4.1-1.3-7-4.3-7-8.5V6l7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
  server: '<rect x="3.5" y="4" width="17" height="6" rx="1.6"/><rect x="3.5" y="14" width="17" height="6" rx="1.6"/><path d="M7 7h.01M7 17h.01"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/><path d="M10 11v5M14 11v5"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 1 0 5 5L21 13l-8.5 8.5-3.5-3.5L17.5 9.5l-3-3Z"/><path d="m4.5 4.5 4 4"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  alert: '<path d="M12 4 21 20H3L12 4Z"/><path d="M12 10v4M12 17h.01"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  pin: '<path d="M9 3.5h6l-.9 5.1 2.9 2.9v2.1H7v-2.1l2.9-2.9L9 3.5Z"/><path d="M12 13.6V20.5"/>',
  grip: '<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>'
};

const svg = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24">${ICON[name] || ICON.box}</svg>`;

/* ========== 状态 ========== */
const S = {
  cats: [], tools: [], byId: new Map(), icons: {},
  view: { type: 'sys', id: null }, q: '',
  info: null, infoLoading: false,
  tw: null, twState: {}, twGroup: null, admin: false, tubaOk: true, setupLinks: null,
  hist: { cpu: [], mem: [], gpu: [], net: [] },
  collapsed: new Set(),
  theme: 'light'
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ========== 工具函数 ========== */
const fmtB = (n) => {
  if (!n && n !== 0) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0; while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return (i <= 1 ? Math.round(n) : n.toFixed(n >= 100 ? 0 : 1)) + ' ' + u[i];
};
const fmtRate = (n) => fmtB(n) + '/s';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let toastTimer;
function toast(msg, err) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (err ? ' err' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 2600);
}

const TW_ICON = { privacy: 'shield', perf: 'bolt', cpu: 'cpu', memory: 'memory', gpu: 'gpu', network: 'refresh', task: 'clock', desktop: 'monitor', periph: 'mouse', service: 'server', audio: 'play', sys: 'box', clean: 'trash', repair: 'wrench', misc: 'chip' };
const CAT_ICON = { cpu: 'cpu', memory: 'memory', gpu: 'gpu', disk: 'disk', screen: 'screen', bench: 'scan', periph: 'mouse', stress: 'fire', game: 'game', other: 'box', system: 'user', perf2: 'bolt', media: 'play', custom: 'plus' };

/* ========== 启动 ========== */
async function boot() {
  const c = await api.catalog();
  S.cats = c.cats; S.tools = c.tools;
  S.byId = new Map(c.tools.map(t => [t.id, t]));

  const st = await api.store();
  S.theme = st.theme || 'light';
  document.body.dataset.theme = S.theme;
  S.groupOrder = st.groupOrder || [];
  S.catOrder = st.catOrder || [];
  S.pinned = st.pinned || [];
  S.catSort = st.catSort || {};
  S.twOrder = st.twOrder || [];
  _recent = st.recent || [];
  S.admin = !!(await api.isAdmin()).admin;
  setStatus('idle');

  try {
    const st2 = await api.settingsGet();
    if (window.I18N) window.I18N.setLang(st2.lang || 'zh');
    applyMotion(st2.motion || 'full');
    S.themeMode = st2.themeMode || 'system';
    if (S.themeMode === 'system') setTheme(!!st2.systemDark);
    else setTheme(S.themeMode === 'dark');
    api.onSystemTheme((dark) => { if (S.themeMode === 'system') setTheme(dark); });
  } catch (e) { /* 设置读取失败不影响启动 */ }

  try {
    const chk = await api.setupCheck();
    S.tubaOk = !!chk.ok;
    S.setupLinks = chk.links || {};
    if (!S.tubaOk) {
      let auto = true;
      try { const st = await api.settingsGet(); auto = st.autoScanTuba !== false; } catch {}
      if (auto) setTimeout(() => openSetupWizard('pick', { list: [] }), 600);
      else toast('未检测到工具库；点右上角齿轮可以设置');
    }
  } catch (e) { S.tubaOk = true; }
  try {
    const raw = sessionStorage.getItem('langRestore');
    if (raw) {
      sessionStorage.removeItem('langRestore');
      const rst = JSON.parse(raw);
      setTimeout(async () => {
        if (rst.view && rst.view.type) {
          if (rst.view.type === 'cat' || rst.view.type === 'list') go(rst.view.type, rst.view.id);
          else if (rst.view.type === 'tw') go('tw', rst.view.id);
          else go(rst.view.type);
        }
        if (rst.y) setTimeout(() => window.scrollTo(0, rst.y), 350);
      }, 120);
    }
  } catch (e) {}
  applySideW(st.sideW || 196);
  bindSideResizer();
  setBrandIcon();
  renderSidebar();
  go('sys');
  setInterval(tickStats, 1500);
  tickStats();
  loadTweaks();
}

let _recent = [];

/* ========== 侧栏 ========== */
const DEFAULT_GROUPS = ['monitor', 'mine', 'tools', 'system'];

function orderedGroups() {
  const order = S.groupOrder || [];
  const all = DEFAULT_GROUPS.slice();
  const res = order.filter(id => all.includes(id));
  for (const id of all) if (!res.includes(id)) res.push(id);
  return res;
}

function orderedCats() {
  const base = S.cats.filter(c => c.id !== 'overview');
  const order = S.catOrder || [];
  const res = order.map(id => base.find(c => c.id === id)).filter(Boolean);
  for (const c of base) if (!res.includes(c)) res.push(c);
  const pin = (S.pinned || []);
  const pinned = pin.map(id => res.find(c => c.id === id)).filter(Boolean);
  const rest = res.filter(c => !pin.includes(c.id));
  return pinned.concat(rest);
}

function setBrandIcon() {
  // 明暗两版图标由 CSS 双图层交叉淡入控制，这里保留空实现兼容旧调用
}

function navModel() {
  const cats = orderedCats().map(c => ({
    key: 'cat:' + c.id,
    name: c.name,
    icon: c.id.startsWith('u') ? 'folder' : (CAT_ICON[c.id] || 'box'),
    count: S.tools.filter(t => t.cat === c.id && t.exists).length
  }));
  const twAll = (S.tw && S.tw.groups ? S.tw.groups : []);
  const twOrder = S.twOrder || [];
  const twSorted = twOrder.map(id => twAll.find(g => g.id === id)).filter(Boolean);
  for (const g of twAll) if (!twSorted.includes(g)) twSorted.push(g);
  const tws = twSorted.map(g => ({
    key: 'tw:' + g.id, name: g.name, icon: TW_ICON[g.id] || 'wrench'
  }));
  const map = {
    monitor: { id: 'monitor', name: '监控', items: [{ key: 'sys', name: '硬件与监控', icon: 'monitor' }] },
    mine: { id: 'mine', name: '我的', items: [
      { key: 'fav', name: '收藏夹', icon: 'star' },
      { key: 'recent', name: '最近使用', icon: 'clock' }] },
    tools: { id: 'tools', name: '工具库', items: cats, addable: true },
    system: { id: 'system', name: '系统', items: tws }
  };
  return orderedGroups().map(id => map[id]).filter(Boolean);
}

function renderSidebar() {
  const nav = $('#nav');
  const groups = navModel().filter(g => g.items.length);
  const total = groups.reduce((a, g) => a + g.items.length, 0);

  nav.innerHTML = groups.map(g => {
    const collapsed = S.collapsed.has(g.id);
    return `<div class="nav-group${collapsed ? ' collapsed' : ''}" data-group="${g.id}" draggable="true">
      <h4>
        <span class="grip" title="拖动可排序">${svg('grip', 'gripicon')}</span>
        <span class="gname">${g.name}</span>
        ${g.addable ? '<button class="nav-add" data-addcat="1" title="新建分组">' + svg('plus') + '</button>' : ''}
        ${svg('chevron', 'chev')}
      </h4>
      ${g.items.map(it => {
        const cid = it.key.startsWith('cat:') ? it.key.slice(4) : '';
        const pin = cid && (S.pinned || []).includes(cid);
        return `<a class="nav-item${pin ? ' pinned' : ''}" data-key="${it.key}" title="${esc(it.name)}" draggable="true">
        ${pin ? '<i class="pin">' + svg('pin') + '</i>' : ''}${svg(it.icon, 'ni')}<span>${it.name}</span></a>`;
      }).join('')}
    </div>`;
  }).join('') + `<div class="nav-total">${total} 个入口</div>`;

  bindNavClicks();
  bindNavDrag();
  bindSidebarMenu();
  setActive();
  updateFab();
}

function bindNavClicks() {
  $$('.nav-group h4').forEach(h => {
    h.onclick = (e) => {
      if (e.target.closest('[data-addcat]')) return;
      const g = h.parentElement;
      const id = g.dataset.group;
      g.classList.toggle('collapsed');
      if (g.classList.contains('collapsed')) S.collapsed.add(id); else S.collapsed.delete(id);
    };
  });
  $$('[data-addcat]').forEach(b => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const input = await askName('新建分组', '给分组起个名字（默认「我的工具」）', '我的工具');
      if (input === null) return;                       // 点了取消
      const name = String(input || '').trim() || '我的工具';
      const r = await api.addCat(name);
      if (!r || !r.ok) return toast((r && r.error) || '创建失败', true);
      await refreshCatalog();
      go('cat', r.cat.id);
      toast('已创建分组「' + name + '」');
    };
  });
  $$('.nav-item').forEach(el => {
    el.onclick = (e) => {
      if (e.defaultPrevented) return;
      const k = el.dataset.key;
      if (k === 'sys' || k === 'fav' || k === 'recent') return go(k);
      const i = k.indexOf(':');
      go(k.slice(0, i), k.slice(i + 1));
    };
  });
}

/* ---------- 拖动排序（带 FLIP 动画） ---------- */
function flip(selector, keyOf, mutate) {
  const before = new Map();
  $$(selector).forEach(el => before.set(keyOf(el), el.getBoundingClientRect()));
  mutate();
  $$(selector).forEach(el => {
    const a = before.get(keyOf(el));
    if (!a) return;
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (!dx && !dy) return;
    el.animate(
      [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
      { duration: 210, easing: 'cubic-bezier(.2,.75,.3,1)' }
    );
  });
}

function bindNavDrag() {
  let dragEl = null, dragType = null;

  const kindOf = (key) => key.startsWith('cat:') ? 'cat' : key.startsWith('tw:') ? 'tw' : '';

  // 拖动中直接移动 DOM 节点（不重建列表），才能连续跨越多格
  const moveTo = (container, before) => {
    const rects = new Map();
    $$('.nav-item, .nav-group').forEach(el => rects.set(el, el.getBoundingClientRect()));
    if (before) container.insertBefore(dragEl, before);
    else container.appendChild(dragEl);
    rects.forEach((a, el) => {
      if (!el.isConnected || el === dragEl) return;
      const b = el.getBoundingClientRect();
      const dy = a.top - b.top;
      const dx = a.left - b.left;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
        { duration: 170, easing: 'cubic-bezier(.2,.75,.3,1)' });
    });
  };

  $$('.nav-group').forEach(g => {
    g.addEventListener('dragstart', (e) => {
      const item = e.target.closest('.nav-item');
      if (item) {
        const k = item.dataset.key || '';
        const kind = kindOf(k);
        if (!kind) { e.preventDefault(); return; }
        dragType = kind; dragEl = item;
      } else {
        dragType = 'group'; dragEl = g;
      }
      dragEl.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', 'x'); } catch {}
    });

    g.addEventListener('dragend', () => {
      $$('.dragging').forEach(el => el.classList.remove('dragging'));
      if (dragEl) commitOrder();
      dragEl = null; dragType = null;
    });

    g.addEventListener('dragover', (e) => {
      if (dragType !== 'group' || !dragEl || g === dragEl) return;
      e.preventDefault();
      const r = g.getBoundingClientRect();
      const after = (e.clientY - r.top) > r.height / 2;
      moveTo(g.parentElement, after ? g.nextSibling : g);
    });

    g.addEventListener('drop', (e) => {
      if (dragType === 'group') { e.preventDefault(); commitOrder(); }
    });
  });

  $$('.nav-item').forEach(it => {
    it.addEventListener('dragover', (e) => {
      if (!dragEl || dragType === 'group' || it === dragEl) return;
      const k = it.dataset.key || '';
      if (kindOf(k) !== dragType) return;
      e.preventDefault();
      e.stopPropagation();
      const r = it.getBoundingClientRect();
      const after = (e.clientY - r.top) > r.height / 2;
      moveTo(it.parentElement, after ? it.nextSibling : it);
    });
    it.addEventListener('drop', (e) => {
      if (dragType && dragType !== 'group') { e.preventDefault(); commitOrder(); }
    });
  });
}

// 拖动结束后：按当前 DOM 顺序落库
function commitOrder() {
  const groups = $$('.nav-group').map(g => g.dataset.group).filter(Boolean);
  const cats = $$('.nav-item[data-key^="cat:"]').map(el => el.dataset.key.slice(4));
  const tw = $$('.nav-item[data-key^="tw:"]').map(el => el.dataset.key.slice(3));

  if (groups.length) S.groupOrder = groups;
  if (cats.length) {
    // 置顶项始终排在前面
    const pin = S.pinned || [];
    S.catOrder = cats.filter(id => pin.includes(id)).concat(cats.filter(id => !pin.includes(id)));
  }
  if (tw.length) S.twOrder = tw;

  api.sidebarOrder({
    groups: S.groupOrder,
    cats: S.catOrder || [],
    tw: S.twOrder || []
  });
}

/* ---------- 右键菜单 ---------- */
function applyMotion(level) {
  document.body.classList.toggle('motion-lite', level === 'lite');
  document.body.classList.toggle('motion-off', level === 'off');
  S.motion = level;
}

function setTheme(dark) {
  const mode = dark ? 'dark' : 'light';
  if (S.theme === mode) return;
  S.theme = mode;
  document.body.dataset.theme = mode;
  setBrandIcon();
  const bt = document.getElementById('btn-theme');
  if (bt) bt.title = mode === 'dark' ? '切换到白天模式' : '切换到夜间模式';
}

function applySideW(w) {
  const n = Math.max(160, Math.min(340, Math.round(w || 196)));
  document.documentElement.style.setProperty('--side-w', n + 'px');
  // 太窄时藏掉品牌副标题，避免"硬件工具"被挤成两行
  document.body.classList.toggle('narrow-side', n < 196);
  S.sideW = n;
}

/* ========== 首次启动引导：定位图吧工具箱 ========== */
function setupModal(html) {
  const old = document.querySelector('.modal-mask.setup');
  if (old) old.remove();
  const mask = document.createElement('div');
  mask.className = 'modal-mask setup';
  mask.innerHTML = html;
  document.body.appendChild(mask);
  return mask;
}

function openCloseAsk() {
  if (document.querySelector('.modal-mask.close-ask')) return;
  const mask = document.createElement('div');
  mask.className = 'modal-mask close-ask';
  mask.innerHTML = `<div class="modal close-modal">
    <h3>关闭窗口</h3>
    <p>点 × 的时候，希望怎么处理？</p>
    <div class="close-opts">
      <div class="close-opt" data-choice="tray">
        <b>最小化到托盘</b>
        <span>程序继续在后台运行，硬件监控和采集保持工作；托盘图标右键可退出。</span>
      </div>
      <div class="close-opt" data-choice="quit">
        <b>直接退出</b>
        <span>立即关闭程序，实时采集与常驻进程一并停止。</span>
      </div>
    </div>
    <label class="close-remember">
      <input type="checkbox" id="close-remember" checked>
      <span>记住我的选择（以后可在设置里改）</span>
    </label>
    <div class="modal-btns">
      <button class="btn sm" data-close>取消</button>
      <button class="btn sm primary" data-ok>确定</button>
    </div>
  </div>`;
  document.body.appendChild(mask);

  let choice = 'tray';
  const paint = () => mask.querySelectorAll('.close-opt').forEach(el => {
    el.classList.toggle('on', el.dataset.choice === choice);
  });
  paint();

  mask.querySelectorAll('.close-opt').forEach(el => {
    el.onclick = () => { choice = el.dataset.choice; paint(); };
  });

  const close = () => mask.remove();
  mask.querySelector('[data-close]').onclick = () => {
    // 取消 = 不关窗，什么都不做
    close();
    api.closeAnswer({ tray: true, remember: false, cancel: true });
  };
  mask.querySelector('[data-ok]').onclick = async () => {
    const remember = mask.querySelector('#close-remember').checked;
    close();
    await api.closeAnswer({ tray: choice === 'tray', remember });
  };
}

function openSettings() {
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `<div class="modal set-modal">
    <div class="set-head">
      <h3>设置</h3>
      <span class="set-ver" id="set-ver"></span>
    </div>

    <div class="set-sec">
      <div class="set-sec-title">工具库</div>
      <div class="set-line">
        <div class="set-info"><b>位置</b><span id="set-path">读取中…</span></div>
        <div class="set-btns">
          <button class="btn sm" data-scan>重新扫描</button>
          <button class="btn sm" data-change>更改…</button>
          <button class="btn sm" data-opendir>打开</button>
        </div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>识别结果</b><span id="set-stat">—</span></div>
      </div>
    </div>

    <div class="set-sec">
      <div class="set-sec-title">外观</div>
      <div class="set-line">
        <div class="set-info"><b>主题模式</b><span>跟随系统时，系统切换深色会自动跟着变</span></div>
        <div class="seg set-seg" id="set-theme">
          <button data-mode="system">跟随系统</button>
          <button data-mode="light">浅色</button>
          <button data-mode="dark">深色</button>
        </div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>动效</b><span>关闭后不再有过渡与渐显</span></div>
        <div class="seg set-seg" id="set-motion">
          <button data-motion="full">完整</button>
          <button data-motion="lite">精简</button>
          <button data-motion="off">关闭</button>
        </div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>侧栏宽度</b><span id="set-sidew-label">196 px</span></div>
        <div class="set-btns">
          <button class="btn sm" data-sidew="168">窄</button>
          <button class="btn sm" data-sidew="196">标准</button>
          <button class="btn sm" data-sidew="228">宽</button>
        </div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>语言</b><span>界面语言（工具名与系统项说明保持原文）</span></div>
        <div class="seg set-seg" id="set-lang">
          <button data-lang="zh">简体中文</button>
          <button data-lang="en">English</button>
        </div>
      </div>
    </div>

    <div class="set-sec">
      <div class="set-sec-title">行为</div>
      <div class="set-line">
        <div class="set-info"><b>关闭窗口时最小化到托盘</b><span>关掉后点 × 直接退出程序</span></div>
        <div class="sw on" data-sw="closeToTray"><i></i></div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>启动时自动检测工具库</b><span>找不到时弹出引导</span></div>
        <div class="sw on" data-sw="autoScanTuba"><i></i></div>
      </div>
    </div>

    <div class="set-sec">
      <div class="set-sec-title">系统与日志</div>
      <div class="set-line">
        <div class="set-info"><b>运行权限</b><span id="set-admin">—</span></div>
        <div class="set-btns"><button class="btn sm" data-admin>以管理员重启</button></div>
      </div>
      <div class="set-line">
        <div class="set-info"><b>诊断</b><span>查看错误与提权日志</span></div>
        <div class="set-btns"><button class="btn sm" data-diag>运行日志</button><button class="btn sm" data-userdir>数据目录</button></div>
      </div>
    </div>

    <div class="modal-btns"><button class="btn sm primary" data-close>完成</button></div>
  </div>`;
  document.body.appendChild(mask);
  const close = () => mask.remove();
  mask.querySelector('[data-close]').onclick = close;
  mask.onmousedown = (e) => { if (e.target === mask) close(); };

  const q = (sel) => mask.querySelector(sel);
  let cfg = null;

  const paint = (c) => {
    cfg = c;
    q('#set-ver').textContent = 'v' + c.version;
    const pEl = q('#set-path');
    pEl.textContent = c.rootOk ? c.root : '未设置（点「更改」选择工具库目录）';
    pEl.className = c.rootOk ? '' : 'set-bad';
    q('#set-stat').textContent = c.total + ' 个工具索引 · ' + c.available + ' 个已就绪';
    q('#set-admin').textContent = c.admin ? '管理员' : '普通权限（写注册表、改服务受限）';
    q('#set-sidew-label').textContent = c.sideW + ' px';
    mask.querySelectorAll('#set-theme button').forEach(b => {
      b.classList.toggle('on', b.dataset.mode === (c.themeMode || 'system'));
    });
    mask.querySelectorAll('#set-motion button').forEach(b => {
      b.classList.toggle('on', b.dataset.motion === (c.motion || 'full'));
    });
    mask.querySelectorAll('#set-lang button').forEach(b => {
      b.classList.toggle('on', b.dataset.lang === (c.lang || 'zh'));
    });
    mask.querySelectorAll('[data-sw]').forEach(sw => {
      sw.classList.toggle('on', !!c[sw.dataset.sw]);
    });
    const adm = q('[data-admin]');
    if (adm) adm.style.display = c.admin ? 'none' : '';
  };

  api.settingsGet().then(paint);

  q('[data-change]').onclick = async () => {
    const r = await api.setupPick();
    if (r.canceled) return;
    if (!r.ok) { toast(r.error || '目录无效', true); return; }
    const sv = await api.setupSave(r.root);
    if (!sv.ok) { toast(sv.error || '设置失败', true); return; }
    S.tubaOk = true;
    await refreshCatalog();
    renderSidebar();
    toast('工具库已更新：' + sv.available + ' 个工具就绪');
    api.settingsGet().then(paint);
  };

  q('[data-scan]').onclick = async () => {
    toast('正在扫描磁盘…');
    const r = await api.setupScan();
    if (!r.list || !r.list.length) { toast('没有找到工具库，请手动选择', true); return; }
    const sv = await api.setupSave(r.list[0]);
    if (!sv.ok) { toast(sv.error || '设置失败', true); return; }
    S.tubaOk = true;
    await refreshCatalog();
    renderSidebar();
    toast('已找到：' + r.list[0]);
    api.settingsGet().then(paint);
  };

  q('[data-opendir]').onclick = () => {
    if (!cfg || !cfg.rootOk) { toast('还没设置工具库', true); return; }
    api.settingsOpenDir('tuba');
  };
  q('[data-userdir]').onclick = () => api.settingsOpenDir('user');
  q('[data-diag]').onclick = () => { close(); openDiag(); };
  q('[data-admin]').onclick = async () => {
    const olds = q('[data-admin]').textContent;
    q('[data-admin]').disabled = true;
    q('[data-admin]').textContent = '正在请求…';
    const r = await api.relaunchAdmin();
    q('[data-admin]').disabled = false;
    q('[data-admin]').textContent = olds;
    if (!r.ok) toast(r.error || '提权失败', true);
  };

  mask.querySelectorAll('#set-theme button').forEach(b => {
    b.onclick = async () => {
      const mode = b.dataset.mode;
      S.themeMode = mode;
      if (mode === 'system') {
        const st3 = await api.settingsGet();
        setTheme(!!st3.systemDark);
      } else {
        setTheme(mode === 'dark');
      }
      await api.settingsSet('themeMode', mode);
      await api.settingsSet('theme', S.theme);
      mask.querySelectorAll('#set-theme button').forEach(x => x.classList.toggle('on', x === b));
    };
  });

  mask.querySelectorAll('#set-motion button').forEach(b => {
    b.onclick = async () => {
      applyMotion(b.dataset.motion);
      await api.settingsSet('motion', b.dataset.motion);
      mask.querySelectorAll('#set-motion button').forEach(x => x.classList.toggle('on', x === b));
    };
  });

  mask.querySelectorAll('#set-lang button').forEach(b => {
    b.onclick = async () => {
      const lang = b.dataset.lang;
      await api.settingsSet('lang', lang);
      mask.querySelectorAll('#set-lang button').forEach(x => x.classList.toggle('on', x === b));
      // 记住当前位置，重载后回到同一页同一位置
      try {
        sessionStorage.setItem('langRestore', JSON.stringify({
          view: S.view, y: window.scrollY, q: S.q || ''
        }));
      } catch (e) {}
      location.reload();
    };
  });

  mask.querySelectorAll('[data-sidew]').forEach(b => {
    b.onclick = async () => {
      const w = Number(b.dataset.sidew);
      applySideW(w);
      await api.setSideW(w);
      q('#set-sidew-label').textContent = w + ' px';
    };
  });

  mask.querySelectorAll('[data-sw]').forEach(sw => {
    sw.onclick = async () => {
      const key = sw.dataset.sw;
      const next = !sw.classList.contains('on');
      sw.classList.toggle('on', next);
      await api.settingsSet(key, next);
      if (cfg) cfg[key] = next;
      if (key === 'autoScanTuba') toast(next ? '下次启动会检测工具库' : '已关闭启动检测');
      if (key === 'closeToTray') toast(next ? '点 × 将最小化到托盘' : '点 × 将直接退出程序');
    };
  });
}

function openSetupWizard(step, data) {
  const links = (S.setupLinks || {});
  const home = links.tubaHome || 'https://www.tbtool.cn/';
  const dl = links.tubaDownload || home;

  if (step === 'scanning') {
    setupModal(`<div class="modal setup-modal">
      <h3>正在查找工具库</h3>
      <p>在本机磁盘里搜索「图吧工具箱」目录，大概需要几秒…</p>
      <div class="setup-scan"><span class="sk-line"></span></div>
    </div>` + '');
    return;
  }

  if (step === 'done') {
    const m = setupModal(`<div class="modal setup-modal">
      <div class="setup-steps"><i class="on"></i><i class="on"></i></div>
      <h3>设置完成</h3>
      <p class="setup-path">${esc(data.root)}</p>
      <div class="setup-stat">识别到 <b>${data.total}</b> 个工具，其中 <b>${data.available}</b> 个已就绪</div>
      <div class="modal-btns"><button class="btn primary" data-finish>开始使用</button></div>
    </div>`);
    m.querySelector('[data-finish]').onclick = async () => {
      m.remove();
      S.tubaOk = true;
      await refreshCatalog();
      renderSidebar();
      go('sys');
    };
    return;
  }

  // step 1：选择位置
  const cands = (data && data.list) || [];
  const listHtml = cands.length
    ? cands.map(c => `<div class="setup-cand" data-dir="${esc(c)}"><span class="setup-cand-path">${esc(c)}</span><span class="setup-tag">已找到</span></div>`).join('')
    : '<div class="setup-empty">没有自动找到。可以手动选择，或先去下载。</div>';

  const m = setupModal(`<div class="modal setup-modal">
    <div class="setup-steps"><i class="on"></i><i></i></div>
    <h3>先定位你的工具库</h3>
    <div class="setup-desc">
      <p>WinToolbox 不打包任何第三方程序，只做索引，所以需要指向你自己的工具库目录。</p>
      <p><b>位置不限</b>——图吧工具箱解压到哪个盘都行，选那个目录即可；<br>
        你也可以整理一套相同结构的工具库，把它指过来。</p>
      <p class="setup-desc-dim">压缩包解压后，目录里会有「处理器工具」「显卡工具」等文件夹，选它上一级就能识别。</p>
    </div>
    <div class="setup-list">${listHtml}</div>
    <div class="setup-download">
      <div class="setup-dl-tip">还没有图吧工具箱？官网提供压缩包（网盘下载）</div>
      <div class="setup-dl-btns">
        <button class="btn sm" data-opendl title="打开「下载」文件夹，方便找到刚解压的目录">打开下载夹</button>
        <button class="btn sm" data-dl>去官网下载</button>
      </div>
    </div>
    <div class="setup-footer">
      <button class="btn sm" data-skip>稍后设置</button>
      <div class="setup-footer-right">
        <button class="btn sm" data-scan>${svg('refresh')}重新扫描</button>
        <button class="btn sm primary" data-pick>${svg('folder')}手动选择…</button>
      </div>
    </div>
  </div>`);

  const apply = async (dir) => {
    const r = await api.setupSave(dir);
    if (!r.ok) { toast(r.error || '设置失败', true); return; }
    openSetupWizard('done', r);
  };

  m.querySelectorAll('.setup-cand').forEach(el => {
    el.onclick = () => apply(el.dataset.dir);
  });
  m.querySelector('[data-scan]').onclick = async () => {
    openSetupWizard('scanning');
    const r = await api.setupScan();
    openSetupWizard('pick', { list: r.list || [] });
  };
  m.querySelector('[data-pick]').onclick = async () => {
    const r = await api.setupPick();
    if (r.canceled) return;
    if (!r.ok) { toast(r.error || '目录无效', true); return; }
    apply(r.root);
  };
  const od = m.querySelector('[data-opendl]');
  if (od) od.onclick = () => api.openDownloads();
  m.querySelector('[data-dl]').onclick = () => api.openExternal(dl);
  const homeBtn = m.querySelector('[data-home]');
  if (homeBtn) homeBtn.onclick = () => api.openExternal(home);
  m.querySelector('[data-skip]').onclick = () => {
    m.remove();
    toast('已跳过，工具库暂不可用；随时点右上角齿轮重新设置');
    renderSidebar();
  };
}

function bindSideResizer() {
  const bar = document.getElementById('side-resizer');
  const side = document.querySelector('.sidebar');
  if (!bar || !side) return;
  let dragging = false, startX = 0, startW = 0, escaped = false;

  bar.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX;
    startW = side.getBoundingClientRect().width;
    escaped = false;
    document.body.classList.add('resizing');
    e.preventDefault();
    e.stopPropagation();
  });

  // 拖到默认宽度 196 附近会“吸住”一下，越过 ±14px 才脱开
  const DETENT = 196, HOLD = 8, BREAK = 14;

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const raw = startW + (e.clientX - startX);
    let w = raw;
    if (!escaped) {
      if (Math.abs(raw - DETENT) <= HOLD) {
        w = DETENT;
        bar.classList.add('snapped');
      } else if (Math.abs(raw - DETENT) <= BREAK) {
        w = DETENT;                       // 卡在默认值上，形成停顿
        bar.classList.add('snapped');
      } else {
        escaped = true;
        bar.classList.remove('snapped');
      }
    }
    applySideW(w);
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    escaped = false;
    bar.classList.remove('snapped');
    document.body.classList.remove('resizing');
    api.setSideW(S.sideW || 196);
  });

  // 双击复位
  bar.addEventListener('dblclick', () => {
    applySideW(196);
    api.setSideW(196);
    toast('侧栏宽度已复位');
  });
}

function bindSidebarMenu() {
  const side = $('.sidebar');
  side.oncontextmenu = (e) => {
    const item = e.target.closest('.nav-item');
    if (item) {
      const key = item.dataset.key || '';
      if (!key.startsWith('cat:')) return;
      const cid = key.slice(4);
      const label = item.querySelector('span') ? item.querySelector('span').textContent : '分组';
      const isPinned = (S.pinned || []).includes(cid);
      const isUser = /^u/.test(cid);
      const curSort = (S.catSort || {})[cid] || 'default';
      e.preventDefault();
      e.stopPropagation();
      const items = [
        { label: isPinned ? '取消置顶' : '置顶分组', act: async () => {
            await api.pinCat(cid, !isPinned);
            S.pinned = isPinned ? S.pinned.filter(x => x !== cid) : [cid].concat(S.pinned || []);
            renderSidebar();
            toast(isPinned ? '已取消置顶' : '已置顶「' + label + '」');
          } },
        { sep: true },
        { label: '排序：默认顺序' + (curSort === 'default' ? ' ✓' : ''), act: async () => {
            await applyCatSort(cid, 'default');
          } },
        { label: '排序：按名称' + (curSort === 'name' ? ' ✓' : ''), act: async () => {
            await applyCatSort(cid, 'name');
          } },
        { label: '排序：按创建时间' + (curSort === 'time' ? ' ✓' : ''), act: async () => {
            await applyCatSort(cid, 'time');
          } }
      ];
      if (isUser) {
        items.push({ sep: true });
        items.push({ label: '重命名分组', act: async () => {
            const name = await askName('重命名分组', '输入新的分组名称', label);
            if (!name) return;
            const r = await api.renameCat(cid, name);
            if (r && r.ok) { await refreshCatalog(); toast('已重命名为「' + name + '」'); }
            else toast((r && r.error) || '重命名失败', true);
          } });
        items.push({ label: '删除分组', act: async () => {
            if (!await confirmBox('删除分组', '删除「' + label + '」？\n里面的程序会移动到其他自定义分组，不会丢失。', '删除')) return;
            const r = await api.removeCat(cid);
            if (r && r.ok) {
              await refreshCatalog();
              if (S.view.type === 'cat' && S.view.id === cid) go(S.cats.length ? 'cat' : 'sys', S.cats.length ? S.cats[0].id : undefined);
              toast('已删除分组' + (r.moved ? '，' + r.moved + ' 个程序已转移' : ''));
            } else toast('删除失败', true);
          } });
      }
      showMenu(e.clientX, e.clientY, items);
      return;
    }
    e.preventDefault();
    showMenu(e.clientX, e.clientY, [
      { label: '恢复默认排序', act: async () => {
          S.groupOrder = DEFAULT_GROUPS.slice();
          S.catOrder = [];
          await api.sidebarOrder({ groups: DEFAULT_GROUPS, cats: [] });
          renderSidebar();
          toast('已恢复默认排序');
        } },
      { label: '分组按名称排序', act: async () => {
          const order = orderedCats().slice().sort((a, b) => a.name.localeCompare(b.name, 'zh')).map(c => c.id);
          S.catOrder = order;
          await api.sidebarOrder({ groups: orderedGroups(), cats: order });
          renderSidebar();
          toast('已按名称排序');
        } },
      { label: '分组按工具数量排序', act: async () => {
          const order = orderedCats().slice()
            .sort((a, b) => S.tools.filter(t => t.cat === b.id).length - S.tools.filter(t => t.cat === a.id).length)
            .map(c => c.id);
          S.catOrder = order;
          await api.sidebarOrder({ groups: orderedGroups(), cats: order });
          renderSidebar();
          toast('已按数量排序');
        } },
      { sep: true },
      { label: '全部展开', act: () => { S.collapsed.clear(); renderSidebar(); } },
      { label: '全部收起', act: () => { navModel().forEach(g => S.collapsed.add(g.id)); renderSidebar(); } }
    ]);
  };
}

async function applyCatSort(cid, mode) {
  S.catSort = S.catSort || {};
  try { await api.setCatSort(cid, mode); } catch (e) {}
  if (mode === 'default') delete S.catSort[cid];
  else S.catSort[cid] = mode;
  const cat = S.cats.find(c => c.id === cid) || {};
  if (S.view.type === 'cat' && S.view.id === cid) render();
  renderSidebar();
  const tips = { default: '已恢复默认顺序', name: '已按名称排序', time: '已按创建时间排序（新加的在前）' };
  toast((cat.name ? cat.name + '：' : '') + (tips[mode] || '已更新排序'));
}

let menuEl;
function showMenu(x, y, items) {
  closeMenu();
  menuEl = document.createElement('div');
  menuEl.className = 'ctx-menu';
  menuEl.innerHTML = items.map((it, i) => it.sep
    ? '<div class="ctx-sep"></div>'
    : '<div class="ctx-item" data-i="' + i + '">' + esc(it.label) + '</div>').join('');
  document.body.appendChild(menuEl);
  const r = menuEl.getBoundingClientRect();
  menuEl.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
  menuEl.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  menuEl.querySelectorAll('.ctx-item').forEach(el => {
    el.onclick = async () => {
      const it = items[Number(el.dataset.i)];
      closeMenu();
      if (it && it.act) await it.act();
    };
  });
  // 关键：点到菜单内部时不能关闭，否则 click 还没触发菜单就没了
  const onDown = (ev) => {
    if (menuEl && menuEl.contains(ev.target)) return;
    closeMenu();
  };
  const onBlur = () => closeMenu();
  menuCleanup = () => {
    document.removeEventListener('mousedown', onDown);
    window.removeEventListener('blur', onBlur);
    menuCleanup = null;
  };
  setTimeout(() => {
    document.addEventListener('mousedown', onDown);
    window.addEventListener('blur', onBlur);
  }, 0);
}
let menuCleanup = null;
function closeMenu() {
  if (menuCleanup) menuCleanup();
  if (menuEl) { menuEl.remove(); menuEl = null; }
}

/* ---------- 输入弹窗 ---------- */
function confirmBox(title, msg, okText) {
  return new Promise(resolve => {
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `<div class="modal">
      <h3>${esc(title)}</h3>
      <p>${esc(msg).replace(/\n/g, '<br>')}</p>
      <div class="modal-btns">
        <button class="btn sm" data-no>取消</button>
        <button class="btn sm primary" data-yes>${esc(okText || '确定')}</button>
      </div>
    </div>`;
    document.body.appendChild(mask);
    const done = (v) => { mask.remove(); resolve(v); };
    mask.querySelector('[data-yes]').onclick = () => done(true);
    mask.querySelector('[data-no]').onclick = () => done(false);
    mask.onmousedown = (e) => { if (e.target === mask) done(false); };
    setTimeout(() => { const b = mask.querySelector('[data-yes]'); if (b) b.focus(); }, 30);
  });
}

function askName(title, hint, def) {
  return new Promise(resolve => {
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `<div class="modal">
      <h3>${esc(title)}</h3>
      <p>${esc(hint)}</p>
      <input id="modal-input" maxlength="20" value="${esc(def || '')}" />
      <div class="modal-btns">
        <button class="btn sm" data-cancel>取消</button>
        <button class="btn sm primary" data-ok>确定</button>
      </div>
    </div>`;
    document.body.appendChild(mask);
    const input = mask.querySelector('#modal-input');
    setTimeout(() => { input.focus(); input.select(); }, 30);
    const close = (v) => { mask.remove(); resolve(v); };
    mask.querySelector('[data-cancel]').onclick = () => close(null);
    mask.querySelector('[data-ok]').onclick = () => close(input.value.trim());
    input.onkeydown = (e) => {
      if (e.key === 'Enter') close(input.value.trim());
      if (e.key === 'Escape') close(null);
    };
    mask.onmousedown = (e) => { if (e.target === mask) close(null); };
  });
}

function setActive() {
  const key = S.view.type + (S.view.id ? ':' + S.view.id : '');
  $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.key === key));
}

function go(type, id) {
  S.view = { type, id: id || null };
  S.q = '';
  $('#search').value = '';
  setActive();
  render();
  updateFab();
  $('#content').scrollTop = 0;
}

/* ========== 路由 ========== */
function render() {
  if (S.q) return renderSearch($('#content'));
  switch (S.view.type) {
    case 'sys': return renderSys();
    case 'cat': return renderCat();
    case 'tw': return renderTweakGroup();
    case 'fav': return renderList('收藏夹', '常用的放在这里', S.tools.filter(t => t.fav), 'star');
    case 'recent': return renderList('最近使用', '按启动时间倒序', _recent.map(r => S.byId.get(r.id)).filter(Boolean), 'clock');
    default: return renderSys();
  }
}

/* ========== 首页：硬件与监控 ========== */
function renderSys() {
  const el = $('#content');
  $('#page-name').textContent = '硬件与监控';
  $('#page-sub').textContent = '本机硬件信息与实时状态';

  el.innerHTML = `
    <div class="sys-head">
      <div>
        <h2>本机硬件</h2>
        <p id="sys-scan">${S.info ? '上次扫描 ' + new Date(S.info.ts).toLocaleTimeString('zh-CN') : '正在读取…'}</p>
      </div>
      <div class="sys-actions">
        ${S.admin ? '<span class="pill ok">管理员</span>' : '<button class="btn sm" id="btn-admin">以管理员重启</button>'}
        <button class="btn sm" id="btn-rescan">${svg('refresh')}重新扫描</button>
      </div>
    </div>
    <div class="sys-grid">
      <div class="card hw-card" id="hw-card">${S.info ? hwRows(S.info) : hwSkeleton()}</div>
      <div class="sys-col">
        <div class="card mon-card">
          <div class="card-h"><b>实时占用</b><span class="hint" id="mon-hint"></span></div>
          <div class="mon-body" id="mon-body">${monRows()}</div>
        </div>
        <div class="card temp-card">
          <div class="card-h"><b>温度监控</b><span class="hint">${S.info ? (S.admin ? '已启用增强传感器' : '基础模式') : ''}</span></div>
          <div class="temp-body" id="temp-body">${S.info ? tempRows(S.info) : '<div class="loading">—</div>'}</div>
          ${tempNote()}
        </div>
      </div>
    </div>`;

  $('#btn-rescan').onclick = () => { S.info = null; renderSys(); loadInfo(true); };
  bindPawnioBtn();
  const ba = $('#btn-admin');
  if (ba) ba.onclick = () => requestAdmin(ba);
  if (!S.info) loadInfo();
  updateStatsUI();
}

async function loadInfo(force) {
  if (S.infoLoading) return;
  S.infoLoading = true;
  let r = null;
  try {
    r = await api.sysinfo(!!force);
  } catch (e) {
    // 关键：失败也必须解锁，否则 S.infoLoading 永远为 true，界面卡死在骨架屏
    try { api.logErr('sysinfo', e && e.message); } catch (_) {}
    r = { ok: false, error: (e && e.message) || '读取异常' };
  } finally {
    S.infoLoading = false;
  }
  if (r && r.ok) {
    S.info = r;
    S.admin = !!r.admin;
    setStatus('idle');
    if (S.view.type === 'sys') renderSys();
  } else {
    const c = $('#hw-card');
    if (c) c.innerHTML = '<div class="loading err">读取失败：' + esc((r && r.error) || '未知错误') + '<br><span class="mini">点右上角「重新扫描」重试</span></div>';
  }
}

function hwRows(i) {
  const rows = [];
  const os = i.os || {}, cpu = i.cpu || {}, b = i.board || {}, ram = i.ram || {}, mon = i.monitor || {};
  const gpus = i.gpus || [], disks = i.disks || [], vols = i.volumes || [];

  rows.push(row('monitor', '系统',
    `${(os.caption || '').replace('Microsoft ', '')} ${os.arch === 'x64' ? '64 位' : '32 位'}`,
    `版本 ${os.displayVersion || ''} · 内部版本 ${os.build || ''} · 装机于 ${os.installed || '—'} · ${os.hostname || ''}`));

  rows.push(row('cpu', '处理器', cpu.name || '—',
    `${cpu.cores} 核 ${cpu.threads} 线程 · ${(cpu.curMHz / 1000).toFixed(2)} GHz（最高 ${(cpu.maxMHz / 1000).toFixed(2)}）` +
    (cpu.voltage ? ` · ${cpu.voltage.toFixed(2)} V` : '') + (cpu.socket ? ` · ${cpu.socket}` : '') +
    (cpu.l3 ? ` · L3 ${Math.round(cpu.l3 / 1024)} MB` : '')));

  if (gpus.length) {
    rows.push(row('gpu', '显卡',
      gpus.map(g => g.name).join('<br>'),
      gpus.map(g => `${g.brand || '—'}${g.vram ? ' · ' + g.vram + ' GB 显存' : ''}${g.driver ? ' · 驱动 ' + g.driver : ''}`).join('<br>')));
  }

  rows.push(row('chip', '主板', `${b.vendor || ''} ${b.model || ''}`.trim() || '—',
    `${b.chipset ? b.chipset + ' · ' : ''}BIOS ${b.bios || '—'}${b.biosDate ? ' (' + b.biosDate + ')' : ''}`));

  if (disks.length) {
    const total = disks.reduce((a, d) => a + (d.size || 0), 0);
    const kinds = [...new Set(disks.map(d => d.kind))].join(' + ');
    rows.push(row('disk', '硬盘', `${disks.length} 块 · 合计 ${(total / 1024).toFixed(1)} TB · ${kinds}`,
      disks.map(d => `${d.model}　${d.size} GB · ${d.bus || d.kind}${d.temp ? ' · ' + d.temp + '°C' : ''}`).join('<br>')));
  }

  if (vols.length) {
    rows.push(row('folder', '分区',
      vols.map(v => v.name).join('　'),
      vols.map(v => `${v.name} ${v.free}/${v.total} GB`).join('　')));
  }

  if (mon.name || mon.res) {
    rows.push(row('screen', '显示器', mon.name || '—',
      [mon.res, mon.refresh ? mon.refresh + ' Hz' : '', mon.size ? mon.size + ' 英寸' : ''].filter(Boolean).join(' · ')));
  }

  const st = (ram.sticks || []);
  const typeStr = st.length ? `${st[0].type} ${st[0].speed}` : '';
  rows.push(row('memory', '内存', `${ram.total} GB ${typeStr}${ram.channels ? ' · ' + (ram.channels > 1 ? '双通道' : '单通道') : ''}`,
    st.length ? ('<span class="oneline" title="' + esc(st.map(s => s.slot + ' ' + s.size + ' GB' + (s.mfr ? ' ' + s.mfr : '')).join(' | ')) + '">' + st.map(s => `${s.slot} ${s.size} GB${s.mfr ? ' ' + s.mfr : ''}`).join('　') + '</span>') : '—'));

  return rows.join('');
}

// 首次读取硬件信息时的骨架：先把 9 行结构占好，数据到了原地替换，不跳版
function hwSkeleton() {
  const rows = [
    ['cpu', '处理器'], ['gpu', '显卡'], ['memory', '内存'], ['disk', '硬盘'],
    ['screen', '显示器'], ['chip', '主板'], ['monitor', '系统'], ['server', '网络'], ['user', '计算机名']
  ];
  return rows.map(([icon, title]) => `
    <div class="hwrow sk">
      <div class="hi">${svg(icon)}</div>
      <div class="hc">
        <div class="ht">${title}</div>
        <div class="hs"><span class="sk-line"></span></div>
      </div>
    </div>`).join('') + '<div class="sk-tip">正在读取硬件信息…</div>';
}

function row(icon, title, value, sub) {
  return `<div class="hwrow">
    <div class="hi">${svg(icon)}</div>
    <div class="hc">
      <div class="ht">${title}</div>
      <div class="hv">${value}</div>
      ${sub ? `<div class="hs">${sub}</div>` : ''}
    </div>
  </div>`;
}

function monRows() {
  return ['cpu', 'mem', 'gpu', 'vram', 'disk', 'net'].map(k => `
    <div class="mrow" data-m="${k}">
      <span class="ml">${{ cpu: '处理器', mem: '内存', gpu: '显卡', vram: '显存', disk: '磁盘 C', net: '网络' }[k]}</span>
      <div class="bar"><i></i></div>
      <b class="mv">—</b>
    </div>`).join('');
}

function tempStatus(t) {
  if (t == null) return ['na', '不可用'];
  if (t < 50) return ['ok', '良好'];
  if (t < 70) return ['ok', '正常'];
  if (t < 85) return ['warn', '偏高'];
  return ['bad', '过热'];
}

async function requestAdmin(btn) {
  const old = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '正在请求…'; }
  setStatus('busy', '等待 UAC 授权…');
  let r;
  try { r = await api.relaunchAdmin(); } catch (e) { r = { ok: false, error: e.message }; }
  setStatus(r && r.ok ? 'idle' : 'err', r && r.ok ? '提权请求已发出' : '提权失败');
  if (r && r.ok) {
    toast(r.msg || '已请求管理员权限，请在 UAC 窗口点「是」');
  } else {
    toast('提权失败：' + ((r && r.error) || '未知错误'), true);
    if (btn) { btn.disabled = false; btn.textContent = old; }
    if (r && r.canManual) {
      const go = await confirmBox('提权没有成功',
        '程序仍在普通权限下运行，没有退出。\n\n可以改用这个办法：\n1. 关闭本窗口（托盘图标右键 → 退出）\n2. 在文件管理器里右键 WinToolbox.exe\n3. 选「以管理员身份运行」\n\n要现在查看提权日志吗？', '查看日志');
      if (go) {
        const log = await api.elevationLog();
        const mask = document.createElement('div');
        mask.className = 'modal-mask';
        mask.innerHTML = `<div class="modal diag"><h3>提权日志</h3><p>记录每一步的执行情况</p>
          <div class="diag-list">${(log.lines || []).map(l => '<div class="diag-line">' + esc(l) + '</div>').join('')}</div>
          <div class="modal-btns"><button class="btn sm primary" data-close>关闭</button></div></div>`;
        document.body.appendChild(mask);
        mask.querySelector('[data-close]').onclick = () => mask.remove();
        mask.onmousedown = (e) => { if (e.target === mask) mask.remove(); };
      }
    }
  }
}

async function openDiag() {
  let r = { lines: [] };
  try { r = await api.diagErrors(); } catch (e) {}
  const lines = (r.lines || []).slice(0, 40);
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `<div class="modal diag">
    <h3>运行日志</h3>
    <p>${lines.length ? '最近 ' + lines.length + ' 条异常记录' : '没有异常记录，一切正常'}</p>
    <div class="diag-list">${lines.length
      ? lines.map(l => '<div class="diag-line">' + esc(l) + '</div>').join('')
      : '<div class="diag-empty">运行至今没有捕获到错误</div>'}</div>
    <div class="modal-btns">
      <button class="btn sm" data-clear>清空</button>
      <button class="btn sm primary" data-close>关闭</button>
    </div>
  </div>`;
  document.body.appendChild(mask);
  const done = () => mask.remove();
  mask.querySelector('[data-close]').onclick = done;
  mask.querySelector('[data-clear]').onclick = async () => { await api.diagClear(); done(); toast('日志已清空'); };
  mask.onmousedown = (e) => { if (e.target === mask) done(); };
}

let statusTimer;
function setStatus(kind, text) {
  // 空闲态没有动作可报，就显示真正有用的信息：当前权限
  if (kind === 'idle' && (!text || text === '就绪')) {
    text = S.admin ? '管理员模式' : '普通权限';
  }
  const label = document.getElementById('foot-state');
  const dot = document.querySelector('.pill-run i');
  if (label) label.textContent = text;
  if (dot) dot.className = kind + (kind === 'idle' && S.admin ? ' admin' : '');
  const pill = document.querySelector('.pill-run');
  if (pill) {
    pill.title = (kind === 'idle'
      ? (S.admin ? '管理员模式：温度、服务类操作都能用' : '普通权限：部分温度读不到')
      : '当前状态：' + text) + '\n点击查看运行日志';
  }
  clearTimeout(statusTimer);
  if (kind !== 'idle') statusTimer = setTimeout(() => setStatus('idle', '就绪'), 12000);
}

function tempNote() {
  if (!S.info || !S.info.temps) return '';
  const t = S.info.temps;
  const missing = [t.cpu, t.gpu].filter(v => v == null).length;
  if (!missing) return '';

  const en = !!(window.I18N && window.I18N.lang === 'en');
  const ci = S.info.coreIsolation;

  // 1) 非管理员：确实是权限问题
  if (!S.admin) {
    if (en) {
      return `<div class="temp-note">
        <b>${missing} sensor(s) unavailable:</b> CPU temperature requires <b>running as administrator</b>.
        Click "Restart as Admin" at the top right; if nothing happens, right-click WinToolbox.exe → "Run as administrator".
      </div>`;
    }
    return `<div class="temp-note">
      <b>有 ${missing} 项温度读不到：</b>处理器温度需要<b>以管理员身份启动</b>才能读取，
      点右上角「以管理员重启」；如果没反应，直接右键 WinToolbox.exe → 「以管理员身份运行」。
    </div>`;
  }

  if (!S.info.sensorLib && t.cpu == null) {
    return en
      ? '<div class="temp-note">For enhanced CPU readings, set up LibreHardwareMonitor as described in the README, then rescan.</div>'
      : '<div class="temp-note">如需增强 CPU 温度读数，请按 README 配置 LibreHardwareMonitor，再重新扫描。</div>';
  }

  if (ci === true && t.cpu == null) {
    if (en) {
      return `<div class="temp-note">
        <b>Memory integrity is on.</b> PawnIO can help compatible CPU sensors work with this setting enabled.
        <div class="temp-fix"><button class="btn sm primary" data-pawnio>Set up PawnIO</button></div>
      </div>`;
    }
    return `<div class="temp-note">
      <b>内存完整性已开启。</b>可尝试用 PawnIO 读取兼容的 CPU 温度传感器。
      <div class="temp-fix">
        <button class="btn sm primary" data-pawnio>安装温度驱动（PawnIO）</button>
        <span class="temp-fix-hint">下载官方签名安装器，实际读数取决于硬件与传感器支持</span>
      </div>
    </div>`;
  }

  // 3) 管理员、驱动没被拦，仍缺数据：主板未暴露传感器
  if (en) {
    return `<div class="temp-note">
      This motherboard does not expose a CPU temperature sensor through the standard interface;
      it stays unavailable even as administrator.
    </div>`;
  }
  return `<div class="temp-note">
    处理器温度在你这块主板上没有暴露传感器接口，管理员模式下也读不到。
  </div>`;
}

function tempRows(i) {
  const t = i.temps || {};
  const list = [
    ['处理器温度', t.cpu, '主板没提供 ACPI 温区；可让 LibreHardwareMonitor 在后台运行后重扫'],
    ['显卡温度', t.gpu, '来自 nvidia-smi']
  ];
  return list.map(([label, v, tip]) => {
    const [cls, txt] = tempStatus(v);
    const pct = v == null ? 0 : Math.min(100, Math.round(v / 100 * 100));
    return `<div class="trow" title="${esc(tip)}">
      <span class="tl">${label}</span>
      <div class="bar tbar"><i class="${cls}" style="width:${pct}%"></i></div>
      <b class="tv">${v == null ? '—' : v + '°C'}</b>
      <span class="ts ${cls}">${txt}</span>
    </div>`;
  }).join('');
}

/* ========== 分类页（工具） ========== */
function renderCat() {
  const el = $('#content');
  const cat = S.cats.find(c => c.id === S.view.id) || S.cats[0];
  let list = S.tools.filter(t => t.cat === cat.id);
  const mode = (S.catSort || {})[cat.id];
  if (mode === 'name') list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  if (mode === 'time') list = list.slice().sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  $('#page-name').textContent = cat.name;
  $('#page-sub').textContent = cat.desc || '';
  const ok = list.filter(t => t.exists).length;
  const isCustom = cat.id === 'custom' || /^u/.test(cat.id);

  el.innerHTML = `
    <div class="cat-head">
      <div class="ci">${svg(CAT_ICON[cat.id] || 'box')}</div>
      <div><h2>${cat.name}</h2><p>${esc(cat.desc || '')}</p></div>
      <div class="chips">
        ${isCustom ? `<button class="btn sm" id="btn-add2">${svg('plus')}添加程序</button>` : ''}
        <span class="chip">可用 <b>${ok}</b> / ${list.length}</span>
      </div>
    </div>
    ${isCustom && !list.length ? `<div class="empty-page">${svg('plus')}<div>还没有自定义程序<br>点右上角 + 或直接把 exe 拖进窗口</div></div>` : ''}
    ${list.length ? `<div class="tools">${list.map(t => toolCard(t)).join('')}</div>` : ''}
    ${isCustom && list.length ? `<div class="custom-tools">
      <button class="btn sm" id="btn-export">导出清单</button>
      <button class="btn sm" id="btn-import">导入清单</button>
    </div>` : ''}`;

  const a2 = $('#btn-add2'); if (a2) a2.onclick = () => addFlow(cat.id);
  const ex = $('#btn-export'); if (ex) ex.onclick = async () => { const r = await api.customExport(); if (r.ok) toast('已导出到 ' + r.path); };
  const im = $('#btn-import'); if (im) im.onclick = async () => {
    const r = await api.customImport();
    if (r.ok) { await refreshCatalog(); toast(`导入了 ${r.added} 个`); }
  };
  bindTools();
  loadIcons(list);
  document.querySelectorAll('.sr-tw-row').forEach(row => {
    row.onclick = async () => {
      S.q = ''; $('#search').value = '';
      go('tw', row.dataset.goto);
      const id = row.dataset.twid;
      setTimeout(async () => {
        for (let i = 0; i < 30; i++) {
          const el2 = document.querySelector('[data-tw="' + id + '"]');
          if (el2) {
            el2.scrollIntoView({ block: 'center', behavior: 'smooth' });
            el2.classList.add('flash');
            setTimeout(() => el2.classList.remove('flash'), 1600);
            return;
          }
          await new Promise(r => setTimeout(r, 200));
        }
        toast('该项在「' + (row.querySelector('.sr-tw-group') || {}).textContent + '」分组里');
      }, 120);
    };
  });
}

function toolCard(t) {
  const badge = !t.exists && t.kind !== 'info' ? '<span class="tg off">文件缺失</span>'
    : t.kind === 'info' ? '<span class="tg off">未附带</span>'
    : t.kind === 'archive' ? '<span class="tg">压缩包</span>'
    : t.kind === 'doc' ? '<span class="tg">说明</span>'
    : t.admin ? '<span class="tg admin">管理员</span>' : '';
  const ic = S.icons[t.id];
  const custom = t.from === 'custom';
  return `<div class="tool ${t.exists || t.kind === 'info' ? '' : 'disabled'}" data-id="${t.id}" title="${esc(t.name)}${t.desc ? ' — ' + esc(t.desc) : ''}">
    ${ic ? `<img class="ti" src="${ic}">` : `<span class="ti fallback">${svg(t.kind === 'archive' ? 'archive' : t.kind === 'doc' ? 'doc' : 'chip')}</span>`}
    <div class="tb">
      <div class="tn">${esc(t.name)}</div>
      <div class="td">${esc(t.desc || '点击启动')}</div>
      <div class="tmeta">${badge}${t.count ? `<span class="tg">用过 ${t.count} 次</span>` : ''}${!t.exists && t.kind !== 'info'
        ? (t.from === 'custom'
            ? '<button class="tg fix" data-relocate="' + t.id + '">重新指定</button>'
            : '<button class="tg fix" data-fixlib="1">检查工具库</button>')
        : ''}</div>
    </div>
    <span class="t-fav ${t.fav ? 'on' : ''}" data-fav="${t.id}">${svg('star')}</span>
    <span class="t-play">${svg('play')}</span>
    ${custom ? `<span class="t-more" data-more="${t.id}">···</span>` : ''}
  </div>`;
}

function bindTools() {
  document.querySelectorAll('[data-relocate]').forEach(b => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const t = S.tools.find(x => x.id === b.dataset.relocate);
      if (t) await relocate(t);
    };
  });
  document.querySelectorAll('[data-fixlib]').forEach(b => {
    b.onclick = (e) => { e.stopPropagation(); openSettings(); };
  });

  $$('.tool').forEach(el => {
    el.onclick = (e) => {
      if (e.target.closest('[data-fav]')) { toggleFav(el.dataset.id); return; }
      if (e.target.closest('[data-more]')) { customMenu(el.dataset.id, e); return; }
      const t = S.byId.get(el.dataset.id);
      if (!t || t.kind === 'info' || !t.exists) {
        if (t && !t.exists && t.from === 'custom') relocate(t);
        else toast('该项当前不可用', true);
        return;
      }
      startTool(t.id);
    };
    el.oncontextmenu = (e) => { e.preventDefault(); api.reveal(el.dataset.id); };
  });
}

/* ========== 系统调优 ========== */
async function loadTweaks() {
  const r = await api.tweaks();
  if (!r || !r.items) return;
  S.tw = r; S.admin = !!r.admin || S.admin;
  renderSidebar();
  setActive();

}

async function detectTweak(id) {
  const r = await api.tweak(id, 'detect');
  S.twState[id] = { applied: !!(r && r.applied), value: r && r.value, current: r && r.current, ready: true, error: r && r.ok === false, ts: Date.now() };
  if (S.view.type === 'tw') { updateTweakRow(id); refreshTweakHeader(); }
}

async function renderTweakGroup() {
  const el = $('#content');
  if (!S.tw) { el.innerHTML = '<div class="loading">正在读取系统项…</div>'; return; }
  const g = S.tw.groups.find(x => x.id === S.view.id) || S.tw.groups[0];
  const items = S.tw.items.filter(i => i.group === g.id);
  $('#page-name').textContent = g.name;
  $('#page-sub').textContent = g.desc || '';
  const applied = items.filter(i => (S.twState[i.id] || {}).applied).length;

  el.innerHTML = `
    <div class="cat-head">
      <div class="ci">${svg(TW_ICON[g.id] || 'wrench')}</div>
      <div><h2>${g.name}</h2><p>${esc(g.desc || '')}</p></div>
      <div class="chips">
        <span class="chip" id="tw-chip" title="「已生效」= 该条优化当前处于应用状态，读自本机注册表/服务，与是否在本软件里点过无关">${chipText(items)}</span>
        <button class="btn sm" id="btn-profile-save" title="把当前所有系统设置存成文件，换机或重装后可恢复">${svg('archive')}备份设置</button>
        <button class="btn sm" id="btn-profile-load" title="从备份文件恢复系统设置">${svg('refresh')}恢复设置</button>
        ${S.admin ? '<span class="pill ok">管理员</span>' : '<button class="btn sm" id="btn-admin2">以管理员重启</button>'}
      </div>
    </div>
    <div class="tw-legend">开关表示<b>这条优化是否生效</b>——例如「广告 ID」打开，代表广告 ID 已被禁用；关闭则恢复系统默认、广告 ID 重新可用</div>
    <div class="tweaks">${items.map(twRow).join('')}</div>
    <div class="tw-note">开关旁标注的是「这条优化是否生效」，不是「某个功能是否开启」。以「广告 ID」为例：开关打开 = 广告 ID 已被禁用；关闭 = 恢复系统默认，广告 ID 重新可用。状态读自本机注册表/服务，用系统设置或别的软件改过也会同步显示。检测结果来自本机实际状态；「恢复」写回 Windows 默认值，改动前可用上方「备份设置」先存一份。改动注册表类项目后建议重启资源管理器或系统。</div>`;

  const ba = $('#btn-admin2'); if (ba) ba.onclick = () => requestAdmin(ba);
  const bs = $('#btn-profile-save'); if (bs) bs.onclick = () => backupProfile(bs);
  const bl = $('#btn-profile-load'); if (bl) bl.onclick = () => restoreProfile(bl);
  bindTweaks(items);
  detectGroup(items);
}

/* 并发检测当前分组的项，避免一次拉起 30 多个 PowerShell */
async function detectGroup(items) {
  const FRESH = 120000;   // 2 分钟内不重复检测
  const queue = items.filter(i => (i.kind === 'toggle' || i.kind === 'choice') &&
    (!S.twState[i.id] || !S.twState[i.id].ready || (Date.now() - (S.twState[i.id].ts || 0)) > FRESH)).map(i => i.id);
  if (!queue.length) { refreshTweakHeader(); return; }

  // 一次 PowerShell 进程读完整组（原来是逐项起进程，41 项要 10~20 秒）
  const t0 = Date.now();
  let batch = {};
  try {
    const r = await api.tweakDetectBatch(queue);
    batch = (r && r.states) || {};
  } catch (e) { batch = {}; }

  const now = Date.now();
  let missing = [];
  for (const id of queue) {
    const st = batch[id];
    if (st && st.ok !== false) {
      S.twState[id] = {
        applied: !!st.applied, value: st.value, current: st.current,
        ready: true, error: false, ts: now
      };
    } else {
      missing.push(id);
    }
  }

  if (S.view.type === 'tw') {
    for (const id of queue) if (S.twState[id] && S.twState[id].ready) { try { updateTweakRow(id); } catch (e) {} }
  }
  refreshTweakHeader();

  // 批量拿不到的（个别类型不支持）回退到逐项检测
  if (missing.length) {
    const q2 = missing.slice();
    const workers = Array.from({ length: Math.min(4, q2.length) }, async () => {
      while (q2.length) await detectTweak(q2.shift());
    });
    await Promise.all(workers);
    refreshTweakHeader();
  }

  if (window.__twDetectLog) console.log('detect', queue.length, 'items in', Date.now() - t0, 'ms, fallback', missing.length);
}

function chipText(items) {
  const states = items.filter(i => i.kind === 'toggle' || i.kind === 'choice');
  if (!states.length) return '共 ' + items.length + ' 项操作';
  const ready = states.filter(i => (S.twState[i.id] || {}).ready).length;
  const on = states.filter(i => (S.twState[i.id] || {}).applied).length;
  // 还在检测中：显示进度，而不是误导性的 0
  if (ready < states.length) return '检测中 ' + ready + '/' + states.length + ' · 已生效 ' + on;
  return '已生效 ' + on + ' / ' + states.length;
}

function refreshTweakHeader() {
  if (S.view.type !== 'tw' || !S.tw) return;
  const g = S.tw.groups.find(x => x.id === S.view.id);
  if (!g) return;
  const items = S.tw.items.filter(i => i.group === g.id);
  const chip = $('#tw-chip');
  if (chip) chip.textContent = chipText(items);
}

function twRow(item) {
  const st = S.twState[item.id] || {};
  const tagChip = item.tag ? '<span class="risk tag">' + esc(item.tag) + '</span>' : '';
  const risk = { low: ['低风险', 'low'], mid: ['中风险', 'mid'], high: ['高风险', 'high'] }[item.risk] || ['', ''];
  let ctrl = '';
  if (item.kind === 'toggle') {
    const label = !st.ready ? '' : (st.applied ? '已生效' : '未生效');
    ctrl = `<span class="tw-sw-label ${st.applied ? 'on' : ''}">${label}</span>
      <div class="sw ${st.applied ? 'on' : ''}" data-sw="${item.id}" title="开：该条优化生效（例：关闭广告 ID → 广告 ID 被禁用）；关：恢复 Windows 默认行为"><i></i></div>`;
  } else if (item.kind === 'choice') {
    const cur = st.value;
    ctrl = `<div class="seg">${(item.options || []).map(o =>
      `<button data-choice="${item.id}" data-value="${o.value}" class="${cur === o.value ? 'on' : ''}">${o.label}</button>`).join('')}</div>`;
  } else if (item.kind === 'pending') {
    ctrl = '<span class="tw-pending" title="' + esc(item.why || '已收录清单，执行引擎尚未接入') + '">待接入</span>';
  } else {
    ctrl = `<button class="btn sm" data-run="${item.id}">执行</button>`;
  }
  return `<div class="tw${item.kind === 'pending' ? ' pending' : ''}" data-tw="${item.id}">
    <div class="tw-body">
      <div class="tw-name">${item.name}
        ${tagChip}
        <span class="risk ${risk[1]}">${risk[0]}</span>

      </div>
      <div class="tw-desc">${esc(item.desc || '')}${item.kind === 'pending' && item.why ? '<br><span class="why">未开放原因：' + esc(item.why) + '</span>' : ''}</div>
      <div class="tw-target">${esc(item.target || '')}${st.current && item.kind !== 'action' ? ' · 当前：' + esc(st.current) : ''}</div>
    </div>
    <div class="tw-ctrl">${ctrl}</div>
  </div>`;
}

function updateTweakRow(id) {
  const el = $(`[data-tw="${id}"]`);
  if (!el) return;
  const item = S.tw.items.find(i => i.id === id);
  if (!item) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = twRow(item);
  el.replaceWith(tmp.firstElementChild);
  bindTweaks([item]);
}

/* ========== 配置备份 / 恢复 ========== */
let profileProgressBound = false;
function bindProfileProgress() {
  if (profileProgressBound) return;
  profileProgressBound = true;
  api.onProfileProgress((p) => {
    if (!p || !p.total) return;
    setStatus('run', p.phase + ' ' + p.done + '/' + p.total);
  });
}

async function backupProfile(btn) {
  bindProfileProgress();
  const old = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = '读取中…';
  try {
    const r = await api.profileExport();
    if (r.canceled) { toast('已取消'); return; }
    if (!r.ok) { toast(r.error || '备份失败', true); return; }
    setStatus('idle');
    toast('已保存 ' + r.count + ' 项设置到 ' + (r.path || '').split('\\').pop() + (r.failed ? '（' + r.failed + ' 项未读取）' : ''));
  } catch (e) {
    toast('备份失败：' + (e.message || e), true);
  } finally {
    btn.disabled = false;
    btn.innerHTML = old;
    setStatus('idle');
  }
}

async function refreshTweakStates() {
  const g = S.view.type === 'tw' ? S.view.id : null;
  if (!g || !S.tw) return;
  const items = S.tw.items.filter(i => i.group === g);
  S.twState = S.twState || {};
  for (const it of items) delete S.twState[it.id];
  await renderTweakGroup();
}

async function restoreProfile(btn) {
  bindProfileProgress();
  let picked;
  try {
    picked = await api.profilePick();
  } catch (e) {
    toast('读取失败：' + (e.message || e), true);
    return;
  }
  if (!picked.ok) { if (!picked.canceled) toast(picked.error || '无法读取该文件', true); return; }

  const sm = picked.summary || {};
  const when = sm.exportedAt ? new Date(sm.exportedAt).toLocaleString('zh-CN') : '未知时间';
  const parts = [];
  parts.push('备份来自 ' + (sm.machine || '未知设备') + '（' + (sm.osName || '?') + '），' + when + '');
  parts.push('共 ' + (sm.known || 0) + ' 项可在本机恢复' + (sm.appliedCount ? '，其中 ' + sm.appliedCount + ' 项是开启状态' : ''));
  if (sm.high) {
    const names = (sm.highNames || []).slice(0, 8).join('、');
    parts.push('有 ' + sm.high + ' 项属于高风险，默认跳过' + (names ? '：' + names + (sm.highNames.length > 8 ? ' 等' : '') : ''));
  }
  if (sm.unknown) parts.push(sm.unknown + ' 项在本机不存在，将忽略');

  const go = await confirmBox('恢复系统设置', parts.join('\n') + '\n\n恢复会按备份逐项写入，需要管理员权限的项目会失败并单独列出。继续吗？', '开始恢复');
  if (!go) return;

  const old = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = '恢复中…';
  try {
    const r = await api.profileApply(picked.doc, { includeHigh: false });
    setStatus('idle');
    if (!r || !r.ok) { toast('恢复失败', true); return; }

    const lines = ['成功 ' + r.applied + ' / ' + r.planned + ' 项'];
    if (r.needAdmin) lines.push(r.needAdmin + ' 项需要管理员权限，已跳过');
    if (r.skippedHigh) {
      const names = (r.highNames || []).slice(0, 8).join('、');
      lines.push(r.skippedHigh + ' 项高风险已跳过' + (names ? '：' + names + (r.highNames.length > 8 ? ' 等' : '') : ''));
    }
    if (r.failureCount) lines.push(r.failureCount + ' 项写入失败');
    const ok = await confirmBox('恢复完成', lines.join('\n') + (r.failureCount ? '\n\n失败项：' + r.failures.slice(0, 6).map(f => f.name).join('、') : ''), '知道了');
    await refreshTweakStates();
  } catch (e) {
    toast('恢复出错：' + (e.message || e), true);
  } finally {
    btn.disabled = false;
    btn.innerHTML = old;
  }
}

function bindTweaks(items) {
  items.forEach(item => {
    const sw = $(`[data-sw="${item.id}"]`);
    if (sw) sw.onclick = () => runTweak(item, sw.classList.contains('on') ? 'revert' : 'apply');
    $$(`[data-choice="${item.id}"]`).forEach(b => {
      b.onclick = () => runTweak(item, 'apply', b.dataset.value);
    });
    const run = $(`[data-run="${item.id}"]`);
    if (run) run.onclick = () => runTweak(item, 'apply');
  });
}

async function runTweak(item, action, value) {
  if (action === 'apply' && item.risk === 'high') {
    if (!await confirmBox('高风险操作', `「${item.name}」属于高风险项：${item.desc}\n\n确定要继续吗？`, '继续执行')) return;
  }
  const btn = $(`[data-sw="${item.id}"]`) || $(`[data-run="${item.id}"]`);
  if (btn) btn.classList.add('busy');
  setStatus('busy', action === 'apply' ? '正在应用…' : '正在恢复…');
  const r = await api.tweak(item.id, action, value);
  setStatus('idle', '就绪');

  if (r && r.needAdmin) {
    toast('这一项需要管理员权限，请点右上角「以管理员重启」', true);
    if (btn) btn.classList.remove('busy');
    return;
  }
  if (!r || r.ok === false) {
    toast('操作失败：' + ((r && r.error) || '未知错误'), true);
    if (btn) btn.classList.remove('busy');
    return;
  }
  if (r.freed != null) toast(`释放 ${r.freed} MB`);
  else if (r.result) {
    const line = r.result.map(x => `${x.target} 延迟 ${x.avg == null ? '超时' : x.avg + 'ms'} 丢包 ${x.loss}%`).join('，');
    toast(`网络测试：${line}${r.dns != null ? '，DNS ' + r.dns + 'ms' : ''}`);
  } else if (r.msg) toast(String(r.msg).slice(0, 90));
  else toast(action === 'apply' ? '已应用' : '已恢复');
  if (r.reboot) setTimeout(() => toast('该项需要重启后生效'), 1200);

  await detectTweak(item.id);
  if (S.view.type === 'tw') refreshTweakHeader();
}

/* ========== 列表页 ========== */
function renderList(title, sub, list, icon) {
  const el = $('#content');
  $('#page-name').textContent = title;
  $('#page-sub').textContent = sub;
  el.innerHTML = `
    <div class="cat-head">
      <div class="ci">${svg(icon)}</div>
      <div><h2>${title}</h2><p>${sub}</p></div>
      <div class="chips"><span class="chip">共 <b>${list.length}</b> 个</span></div>
    </div>
    ${list.length ? `<div class="tools">${list.map(t => toolCard(t)).join('')}</div>`
      : `<div class="empty-page">${svg(icon)}<div>${title === '收藏夹' ? '把常用的工具点星标收藏，就会出现在这里' : '还没有启动记录'}</div></div>`}`;
  bindTools();
  loadIcons(list);
}

async function loadIcons(list) {
  const need = list.filter(t => t.exists && !S.icons[t.id]).map(t => t.id);
  if (!need.length) return;
  const got = await api.icons(need);
  let dirty = false;
  for (const [id, url] of Object.entries(got)) { S.icons[id] = url; dirty = true; }
  if (!dirty) return;
  $$('.tool').forEach(el => {
    const url = S.icons[el.dataset.id];
    if (!url) return;
    const box = el.querySelector('.ti');
    if (box && box.tagName !== 'IMG') {
      const img = new Image(); img.className = 'ti'; img.src = url;
      box.replaceWith(img);
    }
  });
}

/* ========== 启动工具 ========== */
async function startTool(id) {
  const t = S.byId.get(id);
  setStatus('busy', '启动中…');
  const r = await api.launch(id);
  setStatus(r.ok ? 'idle' : 'err', r.ok ? '就绪' : '启动失败');
  toast(r.msg, !r.ok);
  if (r.ok) {
    t.count = (t.count || 0) + 1;
    _recent = [{ id, name: t.name, ts: Date.now() }, ..._recent.filter(x => x.id !== id)].slice(0, 40);
  }
}

async function toggleFav(id) {
  const on = await api.fav(id);
  const t = S.byId.get(id);
  if (t) t.fav = on;
  const el = $(`.t-fav[data-fav="${id}"]`);
  if (el) el.classList.toggle('on', on);
  toast(on ? '已加入收藏' : '已取消收藏');
  if (S.view.type === 'fav') render();
}

/* ========== 自定义工具 ========== */
async function addFlow(targetCat) {
  const r = await api.customPick();
  if (!r.ok || !r.paths.length) return;
  let dest = targetCat || (S.view.type === 'cat' ? S.view.id : '');
  // 目标必须是用户自建分组；否则落到第一个自建分组，没有就自动建一个
  if (!(dest === 'custom' || /^u/.test(dest))) {
    const first = S.cats.find(c => /^u/.test(c.id));
    if (first) dest = first.id;
    else {
      const cr = await api.addCat('我的工具');
      if (cr && cr.ok) { await refreshCatalog(); dest = cr.cat.id; }
    }
  }
  const res = await api.customAdd(r.paths.map(p => ({ path: p, cat: dest || 'custom' })));
  if (res.ok) {
    await refreshCatalog();
    toast(`已添加 ${res.added.length} 个程序`);
    go('cat', dest || 'custom');
  }
}

async function refreshCatalog() {
  const c = await api.catalog();
  S.cats = c.cats; S.tools = c.tools;
  S.byId = new Map(c.tools.map(t => [t.id, t]));
  renderSidebar(); setActive(); render();
}

async function customMenu(id, ev) {
  const t = S.byId.get(id);
  if (!t) return;
  const act = await confirmBox('处理这个条目', `「${t.name}」\n\n从列表移除，或重新指定它的路径。`, '从列表移除');
  if (act) {
    api.customRemove(id).then(async () => { await refreshCatalog(); toast('已移除'); });
  } else {
    relocate(t);
  }
}

async function relocate(t) {
  const r = await api.customRelocate(t.id);
  if (r.ok) { await refreshCatalog(); toast('路径已更新'); }
}

/* 拖拽添加 */
function bindDrop() {
  const mask = $('#drop-mask');
  let depth = 0;
  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    if (![...(e.dataTransfer.items || [])].some(i => i.kind === 'file')) return;
    depth++; mask.classList.add('show');
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (--depth <= 0) { depth = 0; mask.classList.remove('show'); }
  });
  window.addEventListener('drop', async (e) => {
    e.preventDefault(); depth = 0; mask.classList.remove('show');
    const items = [...(e.dataTransfer.files || [])].map(f => {
      let p = '';
      try { p = api.pathForFile(f); } catch {}
      return { path: p, name: f.name.replace(/\.[^.]+$/, '') };
    }).filter(x => x.path);
    if (!items.length) return;
    const r = await api.customAdd(items);
    if (r.ok) {
      await refreshCatalog();
      go('cat', 'custom');
      toast(r.added.length ? `已添加 ${r.added.length} 个程序` : '这些已经在列表里了');
    }
  });
}

/* ========== 搜索 ========== */
function updateFab() {
  const fab = document.getElementById('fab-add');
  if (!fab) return;
  const show = ['cat', 'list', 'fav', 'recent', 'search'].includes(S.view.type);
  fab.classList.toggle('show', show);
  document.body.classList.toggle('has-fab', show);
}

function bindPawnioBtn() {
  document.querySelectorAll('[data-pawnio]').forEach(b => {
    b.onclick = async () => {
      if (b.dataset.busy === '1') return;
      b.dataset.busy = '1';
      b.disabled = true;
      const label = b.textContent;
      b.textContent = '准备中…';
      window.__pawnioBtn = { el: b, label };
      let r;
      try { r = await api.pawnioInstall(); }
      catch (e) { r = { ok: false, error: (e && e.message) || '调用失败' }; }
      window.__pawnioBtn = null;
      b.dataset.busy = '';
      if (!r || !r.ok) {
        b.disabled = false;
        b.textContent = '重试安装';
        toast((r && r.error) || '安装失败', true);
        return;
      }
      b.textContent = '正在重新读取温度…';
      S.info = null;
      await loadInfo(true);
      if (S.view.type === 'sys') renderSys();
      toast('温度驱动已就绪');
    };
  });
}

function renderSearch(el) {
  const q = S.q.toLowerCase();
  const list = S.tools.filter(t =>
    t.name.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q));
  // 系统调优项也参与搜索
  const twAll = (S.tw && S.tw.items) || [];
  const twList = twAll.filter(i =>
    (i.name || '').toLowerCase().includes(q) ||
    (i.desc || '').toLowerCase().includes(q) ||
    (i.target || '').toLowerCase().includes(q));
  const total = list.length + twList.length;
  $('#page-name').textContent = '搜索结果';
  $('#page-sub').textContent = `“${S.q}” · ${total} 个匹配（工具 ${list.length} / 系统 ${twList.length}）`;
  el.innerHTML = `
    <div class="cat-head">
      <div class="ci">${svg('scan')}</div>
      <div><h2>${total} 个结果</h2><p>${list.length ? '回车启动第一个工具' : '点条目跳到对应分组'}</p></div>
    </div>
    ${list.length ? `<div class="tools">${list.slice(0, 120).map(t => toolCard(t)).join('')}</div>` : ''}
    ${twList.length ? `<div class="sr-tw">
        <h4>系统调优 ${twList.length} 项</h4>
        ${twList.slice(0, 40).map(i => {
          const g = (S.tw.groups || []).find(x => x.id === i.group);
          return `<div class="sr-tw-row" data-goto="${i.group}" data-twid="${i.id}">
            <span class="sr-tw-name">${esc(i.name)}</span>
            <span class="sr-tw-group">${esc(g ? g.name : '')}</span>
            <span class="sr-tw-go">前往 ›</span>
          </div>`;
        }).join('')}
      </div>` : ''}
    ${!total ? `<div class="empty-page">${svg('scan')}<div>没找到和“${esc(S.q)}”相关的工具或设置</div></div>` : ''}`;
  bindTools();
  loadIcons(list);
}

/* ========== 实时状态 ========== */
let ticking = false;
function bar(el, pct) { if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%'; }

async function tickStats() {
  if (ticking) return;
  ticking = true;
  try {
    const s = await api.stats();
    const memPct = Math.round((1 - s.mem.free / s.mem.total) * 100);
    const diskPct = s.disk.total ? Math.round(s.disk.used / s.disk.total * 100) : 0;
    const gpuPct = s.gpu ? s.gpu.util : 0;
    const net = s.net.rx + s.net.tx;

    S.hist.cpu.push(s.cpu); S.hist.mem.push(memPct); S.hist.gpu.push(gpuPct); S.hist.net.push(net);
    Object.keys(S.hist).forEach(k => { if (S.hist[k].length > 40) S.hist[k].shift(); });
    S.lastStats = { s, memPct, diskPct, gpuPct, net };
    updateStatsUI();
  } finally { ticking = false; }
}

function updateStatsUI() {
  if (S.view.type !== 'sys' || !S.lastStats) return;
  const { s, memPct, diskPct, gpuPct, net } = S.lastStats;
  const set = (k, pct, text) => {
    const row = $(`[data-m="${k}"]`);
    if (!row) return;
    bar(row.querySelector('.bar i'), pct);
    row.querySelector('.mv').textContent = text;
  };
  set('cpu', s.cpu, s.cpu + '%');
  set('mem', memPct, memPct + '%');
  set('disk', diskPct, diskPct + '%');
  set('gpu', gpuPct, s.gpu ? gpuPct + '%' : '—');
  if (s.gpu && s.gpu.memTotal) {
    const vp = Math.round((s.gpu.memUsed || 0) / s.gpu.memTotal * 100);
    set('vram', vp, vp + '%');
  } else {
    set('vram', 0, '—');
  }
  set('net', Math.min(100, net / 12.5e6 * 100), fmtRate(net));
  const hint = $('#mon-hint');
  if (hint) hint.textContent = s.gpu ? `${s.gpu.temp}°C · 显存 ${s.gpu.memUsed}/${s.gpu.memTotal} MB` : '';
}

/* ========== 交互绑定 ========== */
$('#search').addEventListener('input', (e) => {
  S.q = e.target.value.trim();
  if (!S.q) { render(); return; }
  renderSearch($('#content'));
});
$('#search').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.target.value = ''; S.q = ''; render(); e.target.blur(); }
  if (e.key === 'Enter') { const f = $('.tool'); if (f) f.click(); }
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); $('#search').focus(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { e.preventDefault(); addFlow(); }
});
$$('.winctl button').forEach(b => b.onclick = () => api.win(b.dataset.win));
const setBtn = $('#btn-settings'); if (setBtn) setBtn.onclick = () => openSettings();
const addBtn = $('#btn-add'); if (addBtn) addBtn.onclick = addFlow;
// 底部状态灯：点击看运行日志
const pill = document.querySelector('.pill-run');
if (pill) { pill.style.cursor = 'pointer'; pill.title = '点击查看运行日志'; pill.onclick = openDiag; }

// 渲染层异常也写进同一份日志
window.addEventListener('error', (e) => { try { api.logErr('window', (e.message || '') + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); } catch (_) {} });
window.addEventListener('unhandledrejection', (e) => { try { api.logErr('promise', String((e.reason && e.reason.message) || e.reason)); } catch (_) {} });

$('#btn-theme').onclick = async () => {
  S.theme = S.theme === 'light' ? 'dark' : 'light';
  document.body.classList.add('theme-anim');
  setTimeout(() => document.body.classList.remove('theme-anim'), 480);
  document.body.dataset.theme = S.theme;
  setBrandIcon();
  const bt = document.getElementById('btn-theme');
  if (bt) bt.title = S.theme === 'dark' ? '切换到白天模式' : '切换到夜间模式';
  await api.theme(S.theme);
};
const fab = document.getElementById('fab-add');
if (fab) fab.onclick = () => addFlow();
const fabBtn = document.getElementById('fab-add');
if (fabBtn) fabBtn.onclick = () => addFlow();
try {
  api.onPawnioProgress((msg) => {
    if (window.__pawnioBtn && window.__pawnioBtn.el) window.__pawnioBtn.el.textContent = msg;
  });
} catch (e) {}
api.onCloseAsk(() => openCloseAsk());
bindDrop();

boot();
