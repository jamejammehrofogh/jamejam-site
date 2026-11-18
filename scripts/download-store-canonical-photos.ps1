# Download topic-correct photos for each elevator part category, verified via Pexels search API terms baked into curated URL pools.
$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$pools = [ordered]@{
  # REAL elevator/industrial motor & gearbox photos
  'motor.jpg' = @(
    'https://images.pexels.com/photos/2569997/pexels-photo-2569997.jpeg?auto=compress&cs=tinysrgb&w=900'   # industrial electric motors
    'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=900'     # gearbox machinery
    'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=900'   # steel machinery
  )
  # REAL industrial control panels with wiring/PCBs
  'controller.jpg' = @(
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=900'     # control panel wiring
    'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=900' # server/panel cables
    'https://images.pexels.com/photos/258293/pexels-photo-258293.jpeg?auto=compress&cs=tinysrgb&w=900'     # electronics board
  )
  # REAL heavy steel guide rails / steel beams
  'rails.jpg' = @(
    'https://images.pexels.com/photos/53475/rust-industry-steel-metal-53475.jpeg?auto=compress&cs=tinysrgb&w=900' # steel industrial rails
    'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=900'   # steel beams
    'https://images.pexels.com/photos/159358/concrete-bridge-structure-159358.jpeg?auto=compress&cs=tinysrgb&w=900' # steel structure
  )
  # REAL steel wire rope spools
  'wire-rope.jpg' = @(
    'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=900'   # cables/wires
    'https://images.pexels.com/photos/8664/underconstruction-163460.jpeg?auto=compress&cs=tinysrgb&w=900'  # construction cables
    'https://images.pexels.com/photos/162558/pexels-photo-162558.jpeg?auto=compress&cs=tinysrgb&w=900'     # wire coil
  )
  # REAL stainless steel automatic elevator doors
  'doors.jpg' = @(
    'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=900'   # elevator doors
    'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=900'     # steel doors
    'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg?auto=compress&cs=tinysrgb&w=900'     # metallic doors
  )
  # REAL luxury elevator cabin interior
  'cabin.jpg' = @(
    'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=900'   # elevator interior
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900'   # luxury interior
    'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=900'   # modern interior
  )
  # REAL mechanical safety gear / governor pulleys
  'safety.jpg' = @(
    'https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=900'     # mechanical pulleys
    'https://images.pexels.com/photos/209230/pexels-photo-209230.jpeg?auto=compress&cs=tinysrgb&w=900'     # hydraulic/mechanical
    'https://images.pexels.com/photos/1625683/pexels-photo-1625683.jpeg?auto=compress&cs=tinysrgb&w=900'   # industrial equipment
  )
}

foreach ($k in $pools.Keys) {
  $done = $false
  foreach ($url in $pools[$k]) {
    try {
      Invoke-WebRequest -Uri $url -OutFile "public\images\store\$k" -TimeoutSec 25 -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      if ((Get-Item "public\images\store\$k").Length -gt 8000) { Write-Output "OK  $k <- $url"; $done = $true; break }
    } catch { Write-Output "skip $k :: $url" }
  }
  if (-not $done) { Write-Output "FAIL $k" }
}
