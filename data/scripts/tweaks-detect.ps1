param(
  [Parameter(Mandatory = $true)][string]$Items
)

# 批量检测：一次进程读完全部项的状态（替代逐项起进程）
$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

function GetReg($p, $n) {
  try { return (Get-ItemProperty -Path $p -Name $n -ErrorAction Stop).$n } catch { return $null }
}

$list = @()
try { $list = Get-Content -Path $Items -Raw -Encoding UTF8 | ConvertFrom-Json } catch {
  [ordered]@{ ok = $false; error = 'bad items file' } | ConvertTo-Json -Compress
  exit 1
}

$out = [ordered]@{}

foreach ($it in $list) {
  $id = "$($it.id)"
  $sp = $it.spec
  $r = [ordered]@{ ok = $true; applied = $false; current = '' }
  try {
    switch ("$($sp.type)") {
      'reg' {
        $root = if ($sp.hive -eq 'HKLM') { 'HKLM:' } else { 'HKCU:' }
        $path = Join-Path $root $sp.key
        $cur = GetReg $path $sp.name
        $r.applied = ($null -ne $cur -and "$cur" -eq "$($sp.on)")
        $r.current = if ($null -eq $cur) { 'not set' } else { "$cur" }
      }
      'regset' {
        $root = if ($sp.hive -eq 'HKLM') { 'HKLM:' } else { 'HKCU:' }
        $path = Join-Path $root $sp.key
        $vals = @($sp.values)
        $hit = 0; $cur = @()
        foreach ($v in $vals) {
          $c = GetReg $path $v.name
          $cur += ("$($v.name)=" + $(if ($null -eq $c) { 'not set' } else { "$c" }))
          if ($null -ne $c -and "$c" -eq "$($v.value)") { $hit++ }
        }
        $r.applied = ($vals.Count -gt 0 -and $hit -eq $vals.Count)
        $r.current = ($cur -join ', ')
      }
      'service' {
        $names = @($sp.names)
        $states = @(); $disabled = 0
        foreach ($n in $names) {
          $sv = Get-Service -Name $n -ErrorAction SilentlyContinue
          if (-not $sv) { continue }
          $states += "$n=$($sv.StartType)"
          if ($sv.StartType -eq 'Disabled') { $disabled++ }
        }
        $r.applied = ($states.Count -gt 0 -and $disabled -eq $states.Count)
        $r.current = ($states -join ', ')
      }
      'nic' {
        $root = 'HKLM:\' + $sp.key
        $pairs = @($sp.pairs)
        $instances = @(Get-ChildItem -Path $root -ErrorAction SilentlyContinue |
          Where-Object { $_.PSChildName -match '^\d{4}$' -or $_.PSChildName -match '^\{[0-9a-fA-F-]{36}\}$' })
        $hit = 0
        foreach ($i in $instances) {
          $okAll = $true
          foreach ($pr in $pairs) {
            $v = GetReg $i.PSPath $pr.name
            if ($null -eq $v -or [int]$v -ne [int]$pr.value) { $okAll = $false }
          }
          if ($okAll) { $hit++ }
        }
        $r.applied = ($instances.Count -gt 0 -and $hit -eq $instances.Count)
        $r.current = "$hit/$($instances.Count) adapters set"
      }
      'mmagent' {
        $mc = $true
        try { $mc = (Get-MMAgent).MemoryCompression } catch {}
        $r.applied = (-not $mc)
        $r.current = $(if ($mc) { 'enabled' } else { 'disabled' })
      }
      'task' {
        $full = "$($sp.path)"
        $cut = $full.LastIndexOf('\')
        $tp = $full.Substring(0, $cut + 1)
        $tn = $full.Substring($cut + 1)
        $t = Get-ScheduledTask -TaskPath $tp -TaskName $tn -ErrorAction SilentlyContinue
        if (-not $t) { $r.applied = $false; $r.current = 'not found' }
        else { $r.applied = ("$($t.State)" -eq 'Disabled'); $r.current = "$($t.State)" }
      }
      'power' {
        $sg = "$($sp.subgroup)"; $st = "$($sp.setting)"; $want = [int64]$sp.value
        $raw = (& powercfg /query SCHEME_CURRENT $sg $st) -join ' '
        $hex = @([regex]::Matches($raw, '0x[0-9A-Fa-f]{8}') | ForEach-Object { $_.Value })
        $cur = $null
        if ($hex.Count -ge 4) { try { $cur = [Convert]::ToInt64($hex[3], 16) } catch {} }
        $r.applied = ($null -ne $cur -and $cur -eq $want)
        $r.current = $(if ($null -eq $cur) { 'unavailable' } else { "$cur" })
      }
      default { $r.ok = $false; $r.error = 'unknown spec type' }
    }
  } catch {
    $r.ok = $false
    $r.error = "$($_.Exception.Message)"
  }
  $out[$id] = $r
}

[ordered]@{ ok = $true; count = $out.Count; states = $out } | ConvertTo-Json -Depth 5 -Compress
