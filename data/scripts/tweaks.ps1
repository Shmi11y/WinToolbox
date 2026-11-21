param(
  [string]$Action = 'detect',
  [string]$Id = '',
  [string]$Value = '',
  [string]$Spec = ''
)

$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

function Out($obj) { $obj | ConvertTo-Json -Depth 4 -Compress; exit }
function Fail($msg) { Out ([ordered]@{ ok = $false; error = "$msg" }) }

function GetReg($p, $n) {
  try { return (Get-ItemProperty -Path $p -Name $n -ErrorAction Stop).$n } catch { return $null }
}
function SetReg($p, $n, $v, $type = 'DWord') {
  if (-not (Test-Path $p)) { New-Item -Path $p -Force | Out-Null }
  New-ItemProperty -Path $p -Name $n -Value $v -PropertyType $type -Force | Out-Null
}
function DelReg($p, $n) { Remove-ItemProperty -Path $p -Name $n -ErrorAction SilentlyContinue }

function NeedAdmin() {
  if (-not $isAdmin) { Out ([ordered]@{ ok = $false; needAdmin = $true; error = 'need admin' }) }
}

# Generic executor: registry items described by the spec JSON (data-driven, no per-item code)
if ($Spec) {
  try { $sp = $Spec | ConvertFrom-Json } catch { Fail 'bad spec' }

  # ---- 1. single registry value ----
  if ($sp.type -eq 'reg') {
    $root = if ($sp.hive -eq 'HKLM') { 'HKLM:' } else { 'HKCU:' }
    $path = Join-Path $root $sp.key
    $isStr = ("$($sp.vtype)" -eq 'STRING')
    if ($Action -eq 'detect') {
      $cur = GetReg $path $sp.name
      $on = "$($sp.on)"
      Out ([ordered]@{
        ok = $true
        applied = ($null -ne $cur -and "$cur" -eq $on)
        current = if ($null -eq $cur) { 'not set' } else { "$cur" }
      })
    }
    if ($sp.hive -eq 'HKLM') { NeedAdmin }
    if ($Action -eq 'apply') {
      if ($isStr) { SetReg $path $sp.name "$($sp.on)" 'String' } else { SetReg $path $sp.name ([int]$sp.on) 'DWord' }
    } else {
      if ($null -ne $sp.off) {
        if ($isStr) { SetReg $path $sp.name "$($sp.off)" 'String' } else { SetReg $path $sp.name ([int]$sp.off) 'DWord' }
      } else { DelReg $path $sp.name }
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---- 2. group of services ----
  if ($sp.type -eq 'service') {
    $names = @($sp.names)
    $states = @()
    $disabled = 0
    foreach ($n in $names) {
      $sv = Get-Service -Name $n -ErrorAction SilentlyContinue
      if (-not $sv) { continue }
      $states += "$n=$($sv.StartType)"
      if ($sv.StartType -eq 'Disabled') { $disabled++ }
    }
    if ($Action -eq 'detect') {
      Out ([ordered]@{
        ok = $true
        applied = ($states.Count -gt 0 -and $disabled -eq $states.Count)
        current = ($states -join ', ')
      })
    }
    NeedAdmin
    foreach ($n in $names) {
      $sv = Get-Service -Name $n -ErrorAction SilentlyContinue
      if (-not $sv) { continue }
      if ($Action -eq 'apply') {
        Set-Service -Name $n -StartupType Disabled -ErrorAction SilentlyContinue
        Stop-Service -Name $n -Force -ErrorAction SilentlyContinue
      } else {
        $d = 'Manual'
        if ($n -in @('DiagTrack', 'SysMain', 'WSearch', 'Spooler')) { $d = 'Automatic' }
        Set-Service -Name $n -StartupType $d -ErrorAction SilentlyContinue
        Start-Service -Name $n -ErrorAction SilentlyContinue
      }
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---- 3. per-adapter registry (all instances under a class key) ----
  if ($sp.type -eq 'nic') {
    $root = 'HKLM:\' + $sp.key
    $pairs = @($sp.pairs)
    $instances = @(Get-ChildItem -Path $root -ErrorAction SilentlyContinue |
      Where-Object { $_.PSChildName -match '^\d{4}$' -or $_.PSChildName -match '^\{[0-9a-fA-F-]{36}\}$' })
    if ($Action -eq 'detect') {
      $hit = 0
      foreach ($i in $instances) {
        $ok = $true
        foreach ($pr in $pairs) {
          $v = GetReg $i.PSPath $pr.name
          if ($null -eq $v -or [int]$v -ne [int]$pr.value) { $ok = $false }
        }
        if ($ok) { $hit++ }
      }
      Out ([ordered]@{
        ok = $true
        applied = ($instances.Count -gt 0 -and $hit -eq $instances.Count)
        current = "$hit/$($instances.Count) adapters set"
      })
    }
    NeedAdmin
    foreach ($i in $instances) {
      foreach ($pr in $pairs) {
        if ($Action -eq 'apply') {
          SetReg $i.PSPath $pr.name ([int]$pr.value) 'DWord'
        } else {
          DelReg $i.PSPath $pr.name
        }
      }
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---- 4. several registry values under one key ----
  if ($sp.type -eq 'regset') {
    $root = if ($sp.hive -eq 'HKLM') { 'HKLM:' } else { 'HKCU:' }
    $path = Join-Path $root $sp.key
    $vals = @($sp.values)
    if ($Action -eq 'detect') {
      $hit = 0
      $cur = @()
      foreach ($v in $vals) {
        $c = GetReg $path $v.name
        $cur += ("$($v.name)=" + $(if ($null -eq $c) { 'not set' } else { "$c" }))
        if ($null -ne $c -and "$c" -eq "$($v.value)") { $hit++ }
      }
      Out ([ordered]@{
        ok = $true
        applied = ($vals.Count -gt 0 -and $hit -eq $vals.Count)
        current = ($cur -join ', ')
      })
    }
    if ($sp.hive -eq 'HKLM') { NeedAdmin }
    foreach ($v in $vals) {
      if ($Action -eq 'apply') {
        if ("$($v.vtype)" -eq 'STRING') { SetReg $path $v.name "$($v.value)" 'String' }
        else { SetReg $path $v.name ([int]$v.value) 'DWord' }
      } else {
        DelReg $path $v.name
      }
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---- 5. memory compression (MMAgent) ----
  if ($sp.type -eq 'mmagent') {
    $mc = $true
    try { $mc = (Get-MMAgent).MemoryCompression } catch {}
    if ($Action -eq 'detect') {
      Out ([ordered]@{
        ok = $true
        applied = (-not $mc)
        current = $(if ($mc) { 'enabled' } else { 'disabled' })
      })
    }
    NeedAdmin
    if ($Action -eq 'apply') { Disable-MMAgent -MemoryCompression } else { Enable-MMAgent -MemoryCompression }
    Out ([ordered]@{ ok = $true; reboot = $true })
  }

  # ---- 6. scheduled task ----
  if ($sp.type -eq 'task') {
    $full = "$($sp.path)"
    $cut = $full.LastIndexOf('\')
    $tp = $full.Substring(0, $cut + 1)
    $tn = $full.Substring($cut + 1)
    $t = Get-ScheduledTask -TaskPath $tp -TaskName $tn -ErrorAction SilentlyContinue
    if (-not $t) {
      if ($Action -eq 'detect') { Out ([ordered]@{ ok = $true; applied = $false; current = 'not found' }) }
      Fail 'task not found'
    }
    if ($Action -eq 'detect') {
      Out ([ordered]@{
        ok = $true
        applied = ("$($t.State)" -eq 'Disabled')
        current = "$($t.State)"
      })
    }
    NeedAdmin
    if ($Action -eq 'apply') { Disable-ScheduledTask -TaskPath $tp -TaskName $tn | Out-Null }
    else { Enable-ScheduledTask -TaskPath $tp -TaskName $tn | Out-Null }
    Out ([ordered]@{ ok = $true })
  }

  # ---- 7. power setting (powercfg, keeps a per-item backup for revert) ----
  if ($sp.type -eq 'power') {
    $sg = "$($sp.subgroup)"; $st = "$($sp.setting)"; $want = [int64]$sp.value
    $raw = (& powercfg /query SCHEME_CURRENT $sg $st) -join ' '
    $hex = @([regex]::Matches($raw, '0x[0-9A-Fa-f]{8}') | ForEach-Object { $_.Value })
    $cur = $null
    if ($hex.Count -ge 4) { try { $cur = [Convert]::ToInt64($hex[3], 16) } catch {} }
    if ($Action -eq 'detect') {
      Out ([ordered]@{
        ok = $true
        applied = ($null -ne $cur -and $cur -eq $want)
        current = $(if ($null -eq $cur) { 'unavailable' } else { "$cur" })
      })
    }
    NeedAdmin
    $bkPath = Join-Path (Join-Path $env:APPDATA 'tuba-toolbox-next') 'power-backup.json'
    $bk = @{}
    try { if (Test-Path $bkPath) { (Get-Content $bkPath -Raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $bk[$_.Name] = $_.Value } } } catch {}
    if ($Action -eq 'apply') {
      if ($null -ne $cur -and -not $bk.ContainsKey($Id)) { $bk[$Id] = $cur }
      try { ($bk | ConvertTo-Json -Compress) | Set-Content $bkPath -Encoding UTF8 } catch {}
      & powercfg /setacvalueindex SCHEME_CURRENT $sg $st $want | Out-Null
      & powercfg /setdcvalueindex SCHEME_CURRENT $sg $st $want | Out-Null
      & powercfg /setactive SCHEME_CURRENT | Out-Null
    } else {
      $old = $null
      if ($bk.ContainsKey($Id)) { $old = $bk[$Id] }
      if ($null -ne $old) {
        & powercfg /setacvalueindex SCHEME_CURRENT $sg $st $old | Out-Null
        & powercfg /setdcvalueindex SCHEME_CURRENT $sg $st $old | Out-Null
        & powercfg /setactive SCHEME_CURRENT | Out-Null
        $bk.Remove($Id)
        try { ($bk | ConvertTo-Json -Compress) | Set-Content $bkPath -Encoding UTF8 } catch {}
      } else {
        Fail 'no backup value for this item'
      }
    }
    Out ([ordered]@{ ok = $true })
  }

  Fail ('unsupported spec type: ' + $sp.type)
}

$svcDefault = @{
  'DiagTrack'        = 'Automatic'
  'SysMain'          = 'Automatic'
  'WSearch'          = 'Automatic'
  'Spooler'          = 'Automatic'
  'XblAuthManager'   = 'Manual'
  'XblGameSave'      = 'Manual'
  'XboxGipSvc'       = 'Manual'
  'XboxNetApiSvc'    = 'Manual'
}

function GetSvcState($names) {
  $all = @()
  $anyDisabled = $false
  foreach ($n in $names) {
    $s = Get-Service -Name $n -ErrorAction SilentlyContinue
    if (-not $s) { continue }
    $all += "$($s.Name):$($s.StartType)"
    if ($s.StartType -eq 'Disabled') { $anyDisabled = $true }
  }
  return [ordered]@{ applied = $anyDisabled; current = ($all -join ' / ') }
}

switch ($Id) {

  # ---------------- privacy ----------------
  'telemetry' {
    $p = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'AllowTelemetry'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { SetReg $p 'AllowTelemetry' 0 }
    else { DelReg $p 'AllowTelemetry' }
    Out ([ordered]@{ ok = $true })
  }

  'adid' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'Enabled'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'Enabled' 0 } else { DelReg $p 'Enabled' }
    Out ([ordered]@{ ok = $true })
  }

  'activity' {
    $p = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\System'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'EnableActivityFeed'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') {
      SetReg $p 'EnableActivityFeed' 0
      SetReg $p 'PublishUserActivities' 0
      SetReg $p 'UploadUserActivities' 0
    } else {
      DelReg $p 'EnableActivityFeed'; DelReg $p 'PublishUserActivities'; DelReg $p 'UploadUserActivities'
    }
    Out ([ordered]@{ ok = $true })
  }

  'location' {
    $p = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'Value'
      Out ([ordered]@{ ok = $true; applied = ("$v" -eq 'Deny'); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { SetReg $p 'Value' 'Deny' 'String' } else { SetReg $p 'Value' 'Allow' 'String' }
    Out ([ordered]@{ ok = $true })
  }

  'feedback' {
    $p = 'HKCU:\Software\Microsoft\Siuf\Rules'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'NumberOfSIUFInPeriod'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'NumberOfSIUFInPeriod' 0 } else { DelReg $p 'NumberOfSIUFInPeriod' }
    Out ([ordered]@{ ok = $true })
  }

  'tips' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'SubscribedContent-338389Enabled'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') {
      SetReg $p 'SubscribedContent-338389Enabled' 0
      SetReg $p 'SoftLandingEnabled' 0
      SetReg $p 'SystemPaneSuggestionsEnabled' 0
    } else {
      DelReg $p 'SubscribedContent-338389Enabled'; DelReg $p 'SoftLandingEnabled'; DelReg $p 'SystemPaneSuggestionsEnabled'
    }
    Out ([ordered]@{ ok = $true })
  }

  'cloudsearch' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'BingSearchEnabled'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'BingSearchEnabled' 0; SetReg $p 'CortanaConsent' 0 }
    else { DelReg $p 'BingSearchEnabled'; DelReg $p 'CortanaConsent' }
    Out ([ordered]@{ ok = $true })
  }

  # ---------------- perf ----------------
  'power-plan' {
    $map = @{
      'balanced' = '381b4222-f694-41f0-9685-ff5bb260df2e'
      'high'     = '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c'
      'ultimate' = 'e9a42b02-d5df-448d-aa00-03f14749eb61'
    }
    $cur = (& powercfg /getactivescheme) -join ' '
    if ($Action -eq 'detect') {
      $key = ''
      foreach ($k in $map.Keys) { if ($cur -match $map[$k]) { $key = $k } }
      Out ([ordered]@{ ok = $true; value = $key; applied = $false; current = $cur })
    }
    NeedAdmin
    if (-not $map.ContainsKey($Value)) { Fail 'unknown power plan' }
    $guid = $map[$Value]
    $list = (& powercfg /list) -join "`n"
    if ($list -notmatch $guid) {
      if ($Value -eq 'ultimate') { & powercfg -duplicate-scheme -d $guid | Out-Null }
    }
    & powercfg /setactive $guid | Out-Null
    if ($LASTEXITCODE -ne 0) { Fail 'powercfg failed' }
    Out ([ordered]@{ ok = $true })
  }

  'hags' {
    $p = 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'HwSchMode'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 2); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { SetReg $p 'HwSchMode' 2 } else { SetReg $p 'HwSchMode' 1 }
    Out ([ordered]@{ ok = $true; reboot = $true })
  }

  'gamemode' {
    $p = 'HKCU:\Software\Microsoft\GameBar'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'AutoGameModeEnabled'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 1); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'AutoGameModeEnabled' 1 } else { DelReg $p 'AutoGameModeEnabled' }
    Out ([ordered]@{ ok = $true })
  }

  'memcompression' {
    if ($Action -eq 'detect') {
      $mc = (Get-MMAgent).MemoryCompression
      Out ([ordered]@{ ok = $true; applied = (-not $mc); current = if ($mc) { 'enabled' } else { 'disabled' } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { Disable-MMAgent -MemoryCompression } else { Enable-MMAgent -MemoryCompression }
    Out ([ordered]@{ ok = $true; reboot = $true })
  }

  'netthrottle' {
    $p = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'NetworkThrottlingIndex'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 4294967295 -or $v -eq -1); current = if ($null -eq $v) { 'not set (10)' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { SetReg $p 'NetworkThrottlingIndex' 4294967295 } else { DelReg $p 'NetworkThrottlingIndex' }
    Out ([ordered]@{ ok = $true })
  }

  'gamesched' {
    $p = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'GPU Priority'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 8); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') {
      SetReg $p 'GPU Priority' 8
      SetReg $p 'Priority' 6
      SetReg $p 'Scheduling Category' 'High' 'String'
      SetReg $p 'SFIO Priority' 'High' 'String'
    } else {
      SetReg $p 'GPU Priority' 8
      SetReg $p 'Priority' 2
      SetReg $p 'Scheduling Category' 'Medium' 'String'
      DelReg $p 'SFIO Priority'
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---------------- desktop ----------------
  'taskbar-search' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'SearchboxTaskbarMode'
      if ($null -eq $v) { $v = 2 }
      Out ([ordered]@{ ok = $true; value = "$v"; applied = ($v -ne 2); current = "$v" })
    }
    $v2 = 2
    if ($Value -match '^[012]$') { $v2 = [int]$Value }
    SetReg $p 'SearchboxTaskbarMode' $v2
    Out ([ordered]@{ ok = $true })
  }

  'widgets' {
    $p = 'HKLM:\SOFTWARE\Policies\Microsoft\Dsh'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'AllowNewsAndInterests'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    NeedAdmin
    if ($Action -eq 'apply') { SetReg $p 'AllowNewsAndInterests' 0 } else { DelReg $p 'AllowNewsAndInterests' }
    Out ([ordered]@{ ok = $true })
  }

  'taskview' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'ShowTaskViewButton'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'ShowTaskViewButton' 0 } else { SetReg $p 'ShowTaskViewButton' 1 }
    Out ([ordered]@{ ok = $true })
  }

  'transparency' {
    $p = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
    if ($Action -eq 'detect') {
      $v = GetReg $p 'EnableTransparency'
      Out ([ordered]@{ ok = $true; applied = ($v -eq 0); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p 'EnableTransparency' 0 } else { SetReg $p 'EnableTransparency' 1 }
    Out ([ordered]@{ ok = $true })
  }

  'animations' {
    $p1 = 'HKCU:\Control Panel\Desktop\WindowMetrics'
    $p2 = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects'
    if ($Action -eq 'detect') {
      $v = GetReg $p1 'MinAnimate'
      Out ([ordered]@{ ok = $true; applied = ("$v" -eq '0'); current = if ($null -eq $v) { 'not set' } else { "$v" } })
    }
    if ($Action -eq 'apply') { SetReg $p1 'MinAnimate' '0' 'String'; SetReg $p2 'VisualFXSetting' 2 }
    else { SetReg $p1 'MinAnimate' '1' 'String'; SetReg $p2 'VisualFXSetting' 0 }
    Out ([ordered]@{ ok = $true })
  }

  'classicmenu' {
    $p = 'HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32'
    if ($Action -eq 'detect') {
      $exists = Test-Path $p
      $v = $null
      if ($exists) { $v = (Get-ItemProperty -Path $p -Name '(default)' -ErrorAction SilentlyContinue).'(default)' }
      Out ([ordered]@{ ok = $true; applied = $exists; current = if ($exists) { 'classic' } else { 'win11' } })
    }
    if ($Action -eq 'apply') {
      if (-not (Test-Path $p)) { New-Item -Path $p -Force | Out-Null }
      Set-ItemProperty -Path $p -Name '(default)' -Value '' -Force
    } else {
      Remove-Item -Path 'HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}' -Recurse -Force -ErrorAction SilentlyContinue
    }
    Out ([ordered]@{ ok = $true })
  }

  # ---------------- services ----------------
  'svc-diagtrack'   { $n = @('DiagTrack') }
  'svc-sysmain'     { $n = @('SysMain') }
  'svc-wsearch'     { $n = @('WSearch') }
  'svc-spooler'     { $n = @('Spooler') }
  'svc-xbox'        { $n = @('XblAuthManager', 'XblGameSave', 'XboxGipSvc', 'XboxNetApiSvc') }

  default { }

}

if ($Id -like 'svc-*') {
  $st = GetSvcState $n
  if ($Action -eq 'detect') { Out ([ordered]@{ ok = $true; applied = $st.applied; current = $st.current }) }
  NeedAdmin
  foreach ($s in $n) {
    if (-not (Get-Service -Name $s -ErrorAction SilentlyContinue)) { continue }
    if ($Action -eq 'apply') {
      Set-Service -Name $s -StartupType Disabled -ErrorAction SilentlyContinue
      Stop-Service -Name $s -Force -ErrorAction SilentlyContinue
    } else {
      $d = $svcDefault[$s]
      if (-not $d) { $d = 'Manual' }
      Set-Service -Name $s -StartupType $d -ErrorAction SilentlyContinue
      Start-Service -Name $s -ErrorAction SilentlyContinue
    }
  }
  Out ([ordered]@{ ok = $true })
}

# ---------------- clean ----------------
function DirSize($path) {
  if (-not (Test-Path $path)) { return 0 }
  $s = (Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
    Measure-Object -Property Length -Sum).Sum
  if (-not $s) { return 0 }
  return $s
}
function CleanDir($path) {
  $before = DirSize $path
  Get-ChildItem -Path $path -Force -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
  }
  $after = DirSize $path
  return [math]::Round(($before - $after) / 1MB, 1)
}

if ($Id -eq 'clean-temp' -and $Action -eq 'apply') {
  $a = CleanDir $env:TEMP
  $b = CleanDir (Join-Path $env:SystemRoot 'Temp')
  Out ([ordered]@{ ok = $true; freed = ($a + $b); msg = "released $([math]::Round($a + $b,1)) MB" })
}

if ($Id -eq 'clean-update' -and $Action -eq 'apply') {
  NeedAdmin
  $sd = Join-Path $env:SystemRoot 'SoftwareDistribution\Download'
  $before = DirSize $sd
  Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
  Stop-Service bits -Force -ErrorAction SilentlyContinue
  Get-ChildItem $sd -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  Start-Service wuauserv -ErrorAction SilentlyContinue
  Start-Service bits -ErrorAction SilentlyContinue
  $after = DirSize $sd
  Out ([ordered]@{ ok = $true; freed = [math]::Round(($before - $after) / 1MB, 1) })
}

if ($Id -eq 'clean-thumb' -and $Action -eq 'apply') {
  $dir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Explorer'
  $n = 0
  Get-ChildItem $dir -Filter 'thumbcache_*.db' -Force -ErrorAction SilentlyContinue | ForEach-Object {
    try { Remove-Item $_.FullName -Force -ErrorAction Stop; $n++ } catch {}
  }
  Out ([ordered]@{ ok = $true; freed = 0; msg = "removed $n cache files (locked ones need explorer restart)" })
}

if ($Id -eq 'clean-recycle' -and $Action -eq 'apply') {
  $before = 0
  Get-PSDrive -PSProvider FileSystem | ForEach-Object {
    $rb = Join-Path $_.Root '$Recycle.Bin'
    if (Test-Path $rb) { $before += (DirSize $rb) }
  }
  Clear-RecycleBin -Force -ErrorAction SilentlyContinue
  Out ([ordered]@{ ok = $true; freed = [math]::Round($before / 1MB, 1) })
}

if ($Id -eq 'flushdns' -and $Action -eq 'apply') {
  NeedAdmin
  $r = & ipconfig /flushdns 2>&1
  Out ([ordered]@{ ok = $true; msg = ($r -join ' ') })
}

# ---------------- repair ----------------
if ($Id -eq 'net-test' -and $Action -eq 'apply') {
  $targets = @('223.5.5.5', '119.29.29.29')
  $lines = @()
  foreach ($t in $targets) {
    $pings = @(Test-Connection -ComputerName $t -Count 4 -ErrorAction SilentlyContinue)
    if ($pings.Count -eq 0) {
      $lines += [ordered]@{ target = $t; loss = 100; avg = $null }
    } else {
      $avg = [math]::Round(($pings | Measure-Object -Property ResponseTime -Average).Average, 0)
      $loss = [int]((4 - $pings.Count) / 4 * 100)
      $lines += [ordered]@{ target = $t; loss = $loss; avg = $avg }
    }
  }
  $dns = $null
  try {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    Resolve-DnsName 'www.baidu.com' -Type A -ErrorAction Stop | Out-Null
    $sw.Stop()
    $dns = $sw.ElapsedMilliseconds
  } catch {}
  Out ([ordered]@{ ok = $true; result = $lines; dns = $dns })
}

if ($Id -eq 'restore-point' -and $Action -eq 'apply') {
  NeedAdmin
  $r = & Checkpoint-Computer -Description 'HardwareToolbox' -RestorePointType 'MODIFY_SETTINGS' 2>&1
  if ($LASTEXITCODE -ne 0 -or "$r" -match 'error|failed') {
    Out ([ordered]@{ ok = $false; error = ("$r" -join ' ') })
  }
  Out ([ordered]@{ ok = $true; msg = 'restore point created' })
}

if ($Id -eq 'sfc' -and $Action -eq 'apply') {
  NeedAdmin
  $r = & sfc /scannow 2>&1
  $txt = ($r | Select-Object -Last 3) -join ' '
  Out ([ordered]@{ ok = $true; msg = $txt })
}

if ($Id -eq 'dism' -and $Action -eq 'apply') {
  NeedAdmin
  $r = & DISM /Online /Cleanup-Image /RestoreHealth 2>&1
  $txt = ($r | Select-Object -Last 2) -join ' '
  Out ([ordered]@{ ok = $true; msg = $txt })
}

if ($Action -eq 'detect') { Out ([ordered]@{ ok = $true; applied = $false; current = 'action' }) }
Fail "unknown item: $Id"
