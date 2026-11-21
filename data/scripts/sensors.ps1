param(
  [string]$Dir = '',
  [string]$Mode = 'read'
)

$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

if (-not $Dir) { $Dir = Split-Path -Parent $MyInvocation.MyCommand.Path }

function Out($o) { $o | ConvertTo-Json -Depth 5 -Compress; exit }
function Fail($m) { Out ([ordered]@{ ok = $false; error = "$m" }) }

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

$lib = Join-Path $Dir 'LibreHardwareMonitorLib.dll'
if (-not (Test-Path $lib)) { Fail 'LibreHardwareMonitorLib.dll not found' }

# resolve dependencies from the same folder (PS 5.1 does not probe it)
$dirLocal = $Dir
[AppDomain]::CurrentDomain.add_AssemblyResolve({
  param($s, $e)
  $n = ($e.Name -split ',')[0]
  $p = Join-Path $dirLocal ($n + '.dll')
  if (Test-Path $p) { try { return [Reflection.Assembly]::LoadFrom($p) } catch { return $null } }
  return $null
})

try { [void][Reflection.Assembly]::LoadFrom($lib) } catch { Fail ('load failed: ' + $_.Exception.Message) }

if ($Mode -eq 'probe') {
  Out ([ordered]@{ ok = $true; admin = $isAdmin; lib = (Get-Item $lib).VersionInfo.FileVersion })
}

$computer = $null
try {
  $computer = New-Object LibreHardwareMonitor.Hardware.Computer
  $computer.IsCpuEnabled = $true
  $computer.IsGpuEnabled = $true
  $computer.Open()

  # iterate with an explicit stack: no recursion, no visitor class
  $list = New-Object System.Collections.ArrayList
  $stack = New-Object System.Collections.Stack
  foreach ($h in $computer.Hardware) { $stack.Push($h) }

  while ($stack.Count -gt 0) {
    $hw = $stack.Pop()
    try { $hw.Update() } catch {}
    foreach ($s in $hw.Sensors) {
      if ($null -eq $s.Value) { continue }
      [void]$list.Add([ordered]@{
        hw     = "$($hw.HardwareType)"
        hwName = "$($hw.Name)"
        type   = "$($s.SensorType)"
        name   = "$($s.Name)"
        value  = [math]::Round([double]$s.Value, 2)
      })
    }
    foreach ($sub in $hw.SubHardware) { $stack.Push($sub) }
  }

  try { $computer.Close() } catch {}
  Out ([ordered]@{ ok = $true; admin = $isAdmin; count = $list.Count; sensors = $list })
} catch {
  $msg = $_.Exception.Message
  if ($computer) { try { $computer.Close() } catch {} }
  Out ([ordered]@{ ok = $false; admin = $isAdmin; error = $msg })
}
