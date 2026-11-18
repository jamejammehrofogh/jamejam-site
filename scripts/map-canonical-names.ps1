# Map the already-downloaded, verified JPGs to canonical filenames required by product data.
$map = @{
  'motor.jpg'                = 'motor-gearless.jpg'
  'controller.jpg'           = 'control-panel-vvvf.jpg'
  'rails.jpg'                = 'rail-t70.jpg'
  'wire-rope.jpg'            = 'wire-rope.jpg'
  'doors.jpg'                = 'door-central.jpg'
  'cabin.jpg'                = 'cabin-steel.jpg'
  'safety.jpg'               = 'safety-governor.jpg'
}
foreach ($k in $map.Keys) {
  Copy-Item "public\images\store\$($map[$k])" "public\images\store\$k" -Force
  Write-Output "$k <- $($map[$k])"
}
Get-ChildItem public\images\store\motor.jpg,public\images\store\controller.jpg,public\images\store\rails.jpg,public\images\store\wire-rope.jpg,public\images\store\doors.jpg,public\images\store\cabin.jpg,public\images\store\safety.jpg | Select-Object Name, Length
