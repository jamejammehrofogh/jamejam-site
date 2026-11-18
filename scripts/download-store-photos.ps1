$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$map = [ordered]@{
  'motor-gearless.jpg'      = 'https://images.pexels.com/photos/2569997/pexels-photo-2569997.jpeg?auto=compress&cs=tinysrgb&w=900'
  'motor-geared.jpg'        = 'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=900'
  'control-panel-vvvf.jpg'  = 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=900'
  'control-panel-smart.jpg' = 'https://images.pexels.com/photos/574271/pexels-photo-574271.jpeg?auto=compress&cs=tinysrgb&w=900'
  'cabin-steel.jpg'         = 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=900'
  'cabin-mirror.jpg'        = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900'
  'door-central.jpg'        = 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=900'
  'door-telescopic.jpg'     = 'https://images.pexels.com/photos/3773575/pexels-photo-3773575.jpeg?auto=compress&cs=tinysrgb&w=900'
  'safety-governor.jpg'     = 'https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=900'
  'safety-buffer.jpg'       = 'https://images.pexels.com/photos/209230/pexels-photo-209230.jpeg?auto=compress&cs=tinysrgb&w=900'
  'rail-t70.jpg'            = 'https://images.pexels.com/photos/1625683/pexels-photo-1625683.jpeg?auto=compress&cs=tinysrgb&w=900'
  'wire-rope.jpg'           = 'https://images.pexels.com/photos/162558/pexels-photo-162558.jpeg?auto=compress&cs=tinysrgb&w=900'
}
$ok = 0; $fail = @()
foreach ($k in $map.Keys) {
  $url = $map[$k]
  try {
    Invoke-WebRequest -Uri $url -OutFile "public\images\store\$k" -TimeoutSec 25 -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    $ok++
  } catch {
    $fail += "$k :: $($_.Exception.Message)"
  }
}
Write-Output "downloaded: $ok / $($map.Count)"
$fail | ForEach-Object { Write-Output "FAIL $_" }
Get-ChildItem public\images\store\*.jpg | ForEach-Object { if ($_.Length -lt 5000) { Write-Output "SUSPECT-SMALL: $($_.Name) $($_.Length)" } }
