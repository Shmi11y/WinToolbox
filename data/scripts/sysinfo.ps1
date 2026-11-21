$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

function GB($b) { if (-not $b) { return $null }; [math]::Round($b / 1GB, 1) }

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$sw = [Diagnostics.Stopwatch]::StartNew()
$t = @{}
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$board = Get-CimInstance Win32_BaseBoard | Select-Object -First 1
$bios = Get-CimInstance Win32_BIOS | Select-Object -First 1
$vc = @(Get-CimInstance Win32_VideoController | Where-Object {
  $_.Name -notmatch 'Basic|Remote|Virtual|MuMu|Parsec|GameViewer|Meta|Oray|ToDesk|Sunlogin'
})

$dispVer = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion').DisplayVersion
$ubr = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion').UBR
$arch = if ([Environment]::Is64BitOperatingSystem) { 'x64' } else { 'x86' }

$curMHz = $cpu.CurrentClockSpeed
if (-not $curMHz -or $curMHz -le 0) { $curMHz = $cpu.MaxClockSpeed }
$volt = $null
if ($cpu.CurrentVoltage -and $cpu.CurrentVoltage -ne 0) { $volt = [math]::Round($cpu.CurrentVoltage / 10, 2) }

# ---------- RAM ----------
$ram = @(Get-CimInstance Win32_PhysicalMemory)
$ramTotal = GB($cs.TotalPhysicalMemory)
$banks = @($ram | ForEach-Object { ("$($_.DeviceLocator)" -replace '\d+$', '') } | Sort-Object -Unique)
$memTypes = @{ 20 = 'DDR'; 21 = 'DDR2'; 24 = 'DDR3'; 26 = 'DDR4'; 34 = 'DDR5' }
$sticks = @()
foreach ($r in $ram) {
  $t = $memTypes[[int]$r.SMBIOSMemoryType]
  if (-not $t) { $t = '' }
  $sticks += [ordered]@{
    slot  = "$($r.DeviceLocator)"
    size  = [int][math]::Round($r.Capacity / 1GB)
    speed = $r.Speed
    mfr   = "$($r.Manufacturer)".Trim()
    part  = "$($r.PartNumber)".Trim()
    type  = $t
  }
}

# ---------- Disk ----------
$pds = @(Get-PhysicalDisk)
$busNames = @{ 3 = 'ATA'; 7 = 'USB'; 8 = 'RAID'; 11 = 'SATA'; 17 = 'NVMe'; 10 = 'iSCSI' }
$disks = @()
foreach ($d in @(Get-CimInstance Win32_DiskDrive)) {
  $pd = $pds | Where-Object {
    $_.FriendlyName -and ($d.Model -like "*$($_.FriendlyName)*" -or $_.FriendlyName -like "*$($d.Model)*")
  } | Select-Object -First 1
  if (-not $pd -and $pds.Count -eq 1) { $pd = $pds[0] }

  $kind = 'HDD'
  $bus = ''
  $temp = $null
  if ($pd) {
    if ($pd.MediaType -eq 4 -or "$($pd.MediaType)" -match 'SSD') { $kind = 'SSD' }
    if ($pd.BusType -eq 17) { $kind = 'NVMe' }
    $bus = $busNames[[int]$pd.BusType]
    if (-not $bus) { $bus = "$($pd.BusType)" }
    if ($isAdmin) {
      $rel = $pd | Get-StorageReliabilityCounter
      if ($rel -and $rel.Temperature -gt 0) { $temp = [int]$rel.Temperature }
    }
  }
  if (-not $bus) { $bus = "$($d.InterfaceType)" }
  $disks += [ordered]@{
    model = "$($d.Model)".Trim()
    size  = [int][math]::Round($d.Size / 1GB)
    kind  = $kind
    bus   = $bus
    temp  = $temp
  }
}

$volumes = @()
foreach ($v in @(Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3")) {
  $volumes += [ordered]@{ name = $v.DeviceID; total = GB($v.Size); free = GB($v.FreeSpace) }
}

# ---------- GPU ----------
$smi = & nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.total,driver_version,utilization.memory --format=csv,noheader,nounits 2>$null
$gpus = @()
foreach ($g in $vc) {
  $vram = $null
  $brand = ''
  if ($g.Name -match 'NVIDIA') { $brand = 'NVIDIA' }
  elseif ($g.Name -match 'AMD|Radeon') { $brand = 'AMD' }
  elseif ($g.Name -match 'Intel') { $brand = 'Intel' }
  if ($smi) {
    foreach ($line in @($smi)) {
      $p = "$line".Split(',')
      if ($p.Count -ge 6 -and $g.Name -like "*$($p[0].Trim())*") {
        $vram = [int][math]::Round([double]$p[3] / 1024, 0)
      }
    }
  }
  if (-not $vram -and $g.AdapterRAM -gt 0) { $vram = [int][math]::Round($g.AdapterRAM / 1GB, 0) }
  $gpus += [ordered]@{
    name    = "$($g.Name)".Trim()
    brand   = $brand
    vram    = $vram
    driver  = "$($g.DriverVersion)"
    res     = if ($g.CurrentHorizontalResolution) { "$($g.CurrentHorizontalResolution)x$($g.CurrentVerticalResolution)" } else { '' }
    refresh = [int]$g.CurrentRefreshRate
  }
}

# ---------- Monitor ----------
$monitor = [ordered]@{ name = ''; res = ''; refresh = $null; size = $null }
$monName = (Get-CimInstance Win32_PnPEntity -Filter "PNPClass='Monitor'" | Select-Object -First 1).Name
if ($monName) {
  if ($monName -match '\(([^)]+)\)') { $monitor.name = $Matches[1] } else { $monitor.name = $monName }
}
$mp = Get-CimInstance -Namespace root\wmi -ClassName WmiMonitorBasicDisplayParams | Select-Object -First 1
if ($mp -and $mp.MaxHorizontalImageSize -gt 0) {
  $h = [double]$mp.MaxHorizontalImageSize
  $v = [double]$mp.MaxVerticalImageSize
  $monitor.size = [math]::Round([math]::Sqrt($h * $h + $v * $v) / 2.54, 1)
}
$vid = $vc | Select-Object -First 1
if ($vid -and $vid.CurrentHorizontalResolution) {
  $monitor.res = "$($vid.CurrentHorizontalResolution)x$($vid.CurrentVerticalResolution)"
  $monitor.refresh = [int]$vid.CurrentRefreshRate
}

# ---------- Chipset (best effort) ----------
$chipset = ''
$chip = Get-CimInstance Win32_PnPEntity -Filter "Name LIKE '%Chipset%' OR Name LIKE '%Host Bridge%'" |
  Where-Object { $_.Name -notmatch 'Generic|PCI Express Root' } | Select-Object -First 1
if ($chip) { $chipset = "$($chip.Name)".Trim() }

# ---------- Temperatures ----------
$temps = [ordered]@{}
$cpuTemp = $null
try {
  $tz = Get-CimInstance -Namespace root\wmi -ClassName MSAcpi_ThermalZoneTemperature -ErrorAction Stop
  if ($tz) {
    $vals = @($tz | ForEach-Object { [math]::Round(($_.CurrentTemperature / 10) - 273.15, 1) } |
      Where-Object { $_ -gt 1 -and $_ -lt 120 })
    if ($vals.Count -gt 0) { $cpuTemp = ($vals | Measure-Object -Maximum).Maximum }
  }
} catch {}
$temps.cpu = $cpuTemp

$gpuTemp = $null
if ($smi) {
  $p0 = @($smi)[0].Split(',')
  if ($p0.Count -ge 3) { $gpuTemp = [int]$p0[1] }
}
$temps.gpu = $gpuTemp

# Fallback: if LibreHardwareMonitor / OpenHardwareMonitor is running with its WMI
# provider enabled, reuse its sensors (user mode, no driver of our own).
$boardTemp = $null
if ($null -eq $cpuTemp -or $null -eq $boardTemp) {
  foreach ($ns in @('root\LibreHardwareMonitor', 'root\OpenHardwareMonitor')) {
    $sensors = Get-CimInstance -Namespace $ns -ClassName Sensor -ErrorAction SilentlyContinue |
      Where-Object { $_.SensorType -eq 'Temperature' -and $_.Value -gt 0 }
    if (-not $sensors) { continue }
    if ($null -eq $cpuTemp) {
      $c = $sensors | Where-Object { $_.Name -match 'CPU Package|CPU \(Tctl|Core Max|Package' } |
        Sort-Object Value -Descending | Select-Object -First 1
      if (-not $c) { $c = $sensors | Where-Object { $_.Name -match 'CPU' } | Sort-Object Value -Descending | Select-Object -First 1 }
      if ($c) { $cpuTemp = [math]::Round([double]$c.Value, 1) }
    }
    if ($null -eq $boardTemp) {
      $b = $sensors | Where-Object { $_.Name -match 'Motherboard|Mainboard|Chipset' } | Select-Object -First 1
      if ($b) { $boardTemp = [math]::Round([double]$b.Value, 1) }
    }
    break
  }
}
$temps.disk = ($disks | Where-Object { $_.temp } | Select-Object -First 1).temp
$temps.board = $boardTemp

$out = [ordered]@{
  ok = $true
  os = [ordered]@{
    caption        = "$($os.Caption)".Trim()
    version        = "$($os.Version)"
    build          = "$($os.BuildNumber).$ubr"
    displayVersion = "$dispVer"
    arch           = $arch
    installed      = if ($os.InstallDate) { $os.InstallDate.ToString('yyyy-MM-dd') } else { '' }
    uptimeMin      = [int]((Get-Date) - $os.LastBootUpTime).TotalMinutes
    hostname       = "$($env:COMPUTERNAME)"
  }
  cpu = [ordered]@{
    name    = "$($cpu.Name)".Trim()
    cores   = $cpu.NumberOfCores
    threads = $cpu.NumberOfLogicalProcessors
    maxMHz  = $cpu.MaxClockSpeed
    curMHz  = $curMHz
    voltage = $volt
    socket  = "$($cpu.SocketDesignation)"
    l3      = $cpu.L3CacheSize
  }
  board = [ordered]@{
    vendor   = "$($board.Manufacturer)".Trim()
    model    = "$($board.Product)".Trim()
    chipset  = $chipset
    bios     = "$($bios.SMBIOSBIOSVersion)".Trim()
    biosDate = if ($bios.ReleaseDate) { $bios.ReleaseDate.ToString('yyyy-MM-dd') } else { '' }
  }
  ram     = [ordered]@{ total = $ramTotal; channels = $banks.Count; sticks = $sticks }
  gpus    = $gpus
  disks   = $disks
  volumes = $volumes
  monitor = $monitor
  temps   = $temps
  ts      = (Get-Date).ToString('o')
  ms      = [int]$sw.ElapsedMilliseconds
}

$out | ConvertTo-Json -Depth 6 -Compress
