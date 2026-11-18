$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
# candidate pools — first working URL per product wins
$pools = [ordered]@{
  'control-panel-smart.jpg' = @(
    'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://picsum.photos/seed/panel2/900/700'
  )
  'door-telescopic.jpg' = @(
    'https://images.pexels.com/photos/3773575/pexels-photo-3773575.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://picsum.photos/seed/door2/900/700'
  )
  'rail-t70.jpg' = @(
    'https://images.pexels.com/photos/159358/concrete-bridge-structure-159358.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/53475/rust-industry-steel-metal-53475.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://picsum.photos/seed/rail1/900/700'
  )
  'wire-rope.jpg' = @(
    'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/168781/pexels-photo-1687811.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://images.pexels.com/photos/8664/underconstruction-163460.jpeg?auto=compress&cs=tinysrgb&w=900'
    'https://picsum.photos/seed/rope1/900/700'
  )
}
foreach ($k in $pools.Keys) {
  $done = $false
  foreach ($url in $pools[$k]) {
    try {
      Invoke-WebRequest -Uri $url -OutFile "public\images\store\$k" -TimeoutSec 25 -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      if ((Get-Item "public\images\store\$k").Length -gt 5000) { Write-Output "OK  $k <- $url"; $done = $true; break }
    } catch { }
  }
  if (-not $done) { Write-Output "FAIL $k" }
}
