param()
$items = @(
  @{ n='motor-gearless';       fa='موتور گیرلس';    type='gearless' },
  @{ n='motor-geared';         fa='موتور گیربکس';   type='geared' },
  @{ n='control-panel-vvvf';   fa='تابلو فرمان VVVF'; type='panel' },
  @{ n='control-panel-smart';  fa='تابلو هوشمند';   type='panel' },
  @{ n='cabin-steel';          fa='کابین استیل';    type='cabin' },
  @{ n='cabin-mirror';         fa='کابین آینه‌ای';  type='cabin' },
  @{ n='door-central';         fa='درب مرکزی';      type='door' },
  @{ n='door-telescopic';      fa='درب تلسکوپی';    type='door' },
  @{ n='safety-governor';      fa='گاورنر';         type='safety' },
  @{ n='safety-buffer';        fa='ضربه‌گیر';       type='safety' },
  @{ n='rail-t70';             fa='ریل T70';        type='rail' },
  @{ n='wire-rope';            fa='سیم‌بکسل';       type='rope' }
)

function Get-Shape($type) {
  switch ($type) {
    'gearless' { return '<g transform="translate(400,290)"><rect x="-130" y="-100" width="260" height="200" rx="24" fill="#3a3f47"/><rect x="-130" y="-100" width="260" height="200" rx="24" fill="none" stroke="#565d68" stroke-width="4"/><circle cx="-60" cy="0" r="58" fill="none" stroke="#c9a24b" stroke-width="9"/><circle cx="-60" cy="0" r="14" fill="#c9a24b"/><circle cx="62" cy="0" r="58" fill="none" stroke="#c9a24b" stroke-width="9"/><circle cx="62" cy="0" r="14" fill="#c9a24b"/><line x1="-118" y1="-100" x2="-118" y2="-140" stroke="#565d68" stroke-width="7"/><line x1="112" y1="-100" x2="112" y2="-140" stroke="#565d68" stroke-width="7"/><line x1="-130" y1="70" x2="130" y2="70" stroke="#22262b" stroke-width="6" opacity="0.6"/></g>' }
    'geared' { return '<g transform="translate(400,290)"><rect x="-140" y="-80" width="180" height="160" rx="18" fill="#3a3f47"/><rect x="-140" y="-80" width="180" height="160" rx="18" fill="none" stroke="#565d68" stroke-width="4"/><circle cx="-50" cy="0" r="48" fill="none" stroke="#c9a24b" stroke-width="8"/><circle cx="-50" cy="0" r="12" fill="#c9a24b"/><rect x="60" y="-110" width="110" height="220" rx="14" fill="#2c3036"/><rect x="60" y="-110" width="110" height="220" rx="14" fill="none" stroke="#4a505a" stroke-width="4"/><circle cx="115" cy="0" r="62" fill="none" stroke="#c9a24b" stroke-width="9"/><g stroke="#8a8f98" stroke-width="4"><line x1="115" y1="-62" x2="115" y2="-78"/><line x1="115" y1="62" x2="115" y2="78"/><line x1="53" y1="0" x2="38" y2="0"/><line x1="177" y1="0" x2="192" y2="0"/></g></g>' }
    'panel' { return '<g transform="translate(400,290)"><rect x="-110" y="-140" width="220" height="280" rx="14" fill="#3a3f47"/><rect x="-110" y="-140" width="220" height="280" rx="14" fill="none" stroke="#565d68" stroke-width="4"/><rect x="-88" y="-118" width="176" height="110" rx="8" fill="#1b1e22"/><rect x="-88" y="-118" width="176" height="110" rx="8" fill="none" stroke="#4a505a" stroke-width="3"/><g font-family="monospace" font-size="20" fill="#7dc98f" text-anchor="start"><text x="-70" y="-82">VVVF</text><text x="-70" y="-52">RDY  01</text></g><g fill="#2c3036" stroke="#4a505a" stroke-width="2"><rect x="-88" y="12" width="34" height="70" rx="6"/><rect x="-38" y="12" width="34" height="70" rx="6"/><rect x="12" y="12" width="34" height="70" rx="6"/><rect x="62" y="12" width="26" height="70" rx="6"/></g><circle cx="-71" cy="30" r="7" fill="#e05c4b"/><circle cx="-71" cy="58" r="7" fill="#c9a24b"/><circle cx="-21" cy="30" r="7" fill="#5cb87a"/><circle cx="29" cy="30" r="7" fill="#5cb87a"/><line x1="75" y1="20" x2="75" y2="74" stroke="#565d68" stroke-width="4"/></g>' }
    'cabin' { return '<g transform="translate(400,290)"><rect x="-150" y="-160" width="300" height="320" rx="10" fill="#3a3f47"/><rect x="-150" y="-160" width="300" height="320" rx="10" fill="none" stroke="#565d68" stroke-width="4"/><rect x="-118" y="-128" width="236" height="256" rx="6" fill="#b9c2cc"/><rect x="-118" y="-128" width="236" height="256" rx="6" fill="none" stroke="#8a939e" stroke-width="3"/><line x1="0" y1="-128" x2="0" y2="128" stroke="#8a939e" stroke-width="4"/><rect x="-96" y="-106" width="72" height="190" fill="#d7dee5" opacity="0.85"/><rect x="24" y="-106" width="72" height="190" fill="#d7dee5" opacity="0.85"/><rect x="-96" y="96" width="236" height="22" fill="#6b727c"/><rect x="-40" y="-150" width="80" height="10" fill="#c9a24b" rx="4"/></g>' }
    'door' { return '<g transform="translate(400,290)"><rect x="-160" y="-160" width="320" height="320" rx="10" fill="#3a3f47"/><rect x="-160" y="-160" width="320" height="320" rx="10" fill="none" stroke="#565d68" stroke-width="4"/><rect x="-132" y="-132" width="128" height="264" rx="6" fill="#9aa4ae"/><rect x="4" y="-132" width="128" height="264" rx="6" fill="#9aa4ae"/><rect x="-132" y="-132" width="128" height="264" rx="6" fill="none" stroke="#78818c" stroke-width="3"/><rect x="4" y="-132" width="128" height="264" rx="6" fill="none" stroke="#78818c" stroke-width="3"/><line x1="-14" y1="0" x2="14" y2="0" stroke="#c9a24b" stroke-width="10" stroke-linecap="round"/><rect x="-104" y="-100" width="72" height="100" fill="#c3ccd4" opacity="0.6"/><rect x="32" y="-100" width="72" height="100" fill="#c3ccd4" opacity="0.6"/></g>' }
    'safety' { return '<g transform="translate(400,290)"><circle cx="0" cy="-30" r="95" fill="none" stroke="#c9a24b" stroke-width="11"/><circle cx="0" cy="-30" r="58" fill="#3a3f47"/><circle cx="0" cy="-30" r="58" fill="none" stroke="#565d68" stroke-width="4"/><circle cx="0" cy="-30" r="14" fill="#c9a24b"/><g stroke="#c9a24b" stroke-width="6"><line x1="-95" y1="-30" x2="-135" y2="-30"/><line x1="95" y1="-30" x2="135" y2="-30"/><line x1="0" y1="-125" x2="0" y2="-165"/></g><rect x="-60" y="95" width="120" height="60" rx="10" fill="#3a3f47"/><rect x="-60" y="95" width="120" height="60" rx="10" fill="none" stroke="#565d68" stroke-width="4"/><line x1="0" y1="65" x2="0" y2="95" stroke="#565d68" stroke-width="7"/></g>' }
    'rail' { return '<g transform="translate(400,290)"><path d="M -40 -150 L 40 -150 L 26 150 L -26 150 Z" fill="#4a505a"/><path d="M -40 -150 L 40 -150 L 26 150 L -26 150 Z" fill="none" stroke="#6b727c" stroke-width="4"/><rect x="-52" y="-158" width="104" height="20" rx="4" fill="#c9a24b"/><rect x="-30" y="140" width="60" height="16" rx="4" fill="#c9a24b"/><g stroke="#8a8f98" stroke-width="3" opacity="0.7"><line x1="-20" y1="-120" x2="-20" y2="130"/><line x1="20" y1="-120" x2="20" y2="130"/></g></g>' }
    'rope' { return '<g transform="translate(400,290)"><g stroke="#4a505a" stroke-width="14" stroke-linecap="round"><path d="M -170 -120 Q 0 -70 170 -120" fill="none"/><path d="M -170 -40 Q 0 10 170 -40" fill="none"/><path d="M -170 40 Q 0 90 170 40" fill="none"/><path d="M -170 120 Q 0 170 170 120" fill="none"/></g><g stroke="#c9a24b" stroke-width="4" opacity="0.8"><path d="M -170 -120 Q 0 -70 170 -120" fill="none"/><path d="M -170 40 Q 0 90 170 40" fill="none"/></g><circle cx="-170" cy="-120" r="16" fill="#3a3f47" stroke="#6b727c" stroke-width="4"/><circle cx="170" cy="-120" r="16" fill="#3a3f47" stroke="#6b727c" stroke-width="4"/><circle cx="-170" cy="120" r="16" fill="#3a3f47" stroke="#6b727c" stroke-width="4"/><circle cx="170" cy="120" r="16" fill="#3a3f47" stroke="#6b727c" stroke-width="4"/></g>' }
  }
}

foreach ($it in $items) {
  $shape = Get-Shape $it.type
  $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#23262b"/>
      <stop offset="100%" stop-color="#171a1e"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0%" stop-color="#c9a24b" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#c9a24b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e0bd63"/>
      <stop offset="100%" stop-color="#9a7a2e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <rect x="28" y="28" width="744" height="544" rx="22" fill="none" stroke="#3a3f47" stroke-width="3"/>
  <rect x="40" y="40" width="720" height="520" rx="16" fill="none" stroke="url(#acc)" stroke-width="2" opacity="0.55"/>
  ' + $shape + '
  <text x="400" y="545" text-anchor="middle" font-family="Tahoma,sans-serif" font-size="26" font-weight="bold" fill="#b8bec7">' + $it.fa + '</text>
  <text x="58" y="80" text-anchor="start" font-family="Tahoma,sans-serif" font-size="15" fill="#6b727c" letter-spacing="2">JAM JAM ELEVATOR</text>
</svg>'
  [System.IO.File]::WriteAllText("public\images\store\$($it.n).svg", $svg)
}
Write-Output "done: $($items.Count) images"
