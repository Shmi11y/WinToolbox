# WinToolbox

WinToolbox 是适用于 Windows 10/11 x64 的桌面工具台，在一个窗口里查看硬件状态、启动本地工具并管理系统设置。

- **硬件与监控**：查看 CPU、显卡、内存、磁盘和网络等信息，读取本机支持的实时指标。
- **工具库**：内置 127 个工具索引，支持搜索、收藏、最近使用和添加自己的程序。第一次使用可在工具库选择自己的图吧工具目录。第三方工具可执行文件须另行获取。
- **系统调优**：收录 234 条调优项目及说明，含尚未开放的项目。支持的设置可以检查当前状态、应用后复查。部分操作需要管理员权限。「恢复」的含义以对应项目的说明为准，建议在改动重要设置前保留备份。

## 下载和使用

在 GitHub 的 **Releases** 页面下载 `WinToolbox-0.16.0-win-x64.zip`，完整解压后运行 `WinToolbox.exe`。本版本采用免安装 ZIP，未做代码签名，Windows 可能显示发布者提示。

增强温度读数可选用 [LibreHardwareMonitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases)。在 WinToolbox 的设置中打开应用数据目录，创建 `sensors` 子目录，并将兼容 Windows PowerShell 5.1 的 .NET Framework 版 `LibreHardwareMonitorLib.dll` 和同一发行版所需的依赖 DLL 放入其中，再以管理员权限打开 WinToolbox。具体读数取决于硬件和访问权限。

## 从源码运行和构建

在 Windows x64 上使用 Node.js 和 npm：

```powershell
npm ci
npm start
npm run dist
```

`npm run dist` 将免安装目录生成在 `dist/WinToolbox-win32-x64`。如需自定义本机工具路径，可将 `config.example.json` 复制为本地的 `config.json` 后修改。公开构建使用无本机路径的模板。

## Bug 或意见反馈

邮件：[2605155846@qq.com](mailto:2605155846@qq.com)。反馈 Bug 时请附上 WinToolbox 版本、Windows 版本和复现步骤。

## 许可证

WinToolbox 自有代码采用 [MIT](LICENSE)。第三方组件及索引来源见[第三方声明](THIRD-PARTY-NOTICES.md)。
