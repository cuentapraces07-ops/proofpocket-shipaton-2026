Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$out = Join-Path $root "video\scenes"
New-Item -ItemType Directory -Path $out -Force | Out-Null
$width = 1920
$height = 1080

function New-Font {
  param([float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular)
  return [System.Drawing.Font]::new("Segoe UI", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-Text {
  param($g, [string]$text, $font, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [System.Drawing.StringAlignment]$alignment = [System.Drawing.StringAlignment]::Near)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = $alignment
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $format)
  $format.Dispose()
}

function Add-Base($g, $title, $eyebrow) {
  $navy = [System.Drawing.Brushes]::MidnightBlue
  $ink = [System.Drawing.Brushes]::DarkSlateBlue
  $muted = [System.Drawing.Brushes]::SlateGray
  $white = [System.Drawing.Brushes]::White
  $purple = [System.Drawing.Color]::FromArgb(89, 100, 216)
  $g.Clear([System.Drawing.Color]::FromArgb(247, 248, 252))
  $g.FillRectangle($navy, 0, 0, 320, $height)
  Draw-Text $g "PROOFPOCKET" (New-Font 24 ([System.Drawing.FontStyle]::Bold)) $white 42 54 240 45
  Draw-Text $g "PRIVATE EVIDENCE LOCKER" (New-Font 12 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::LightSteelBlue) 42 106 240 30
  Draw-Text $g "Overview" (New-Font 18 ([System.Drawing.FontStyle]::Bold)) $white 42 220 220 40
  Draw-Text $g "Proof" (New-Font 18) ([System.Drawing.Brushes]::LightSteelBlue) 42 280 220 40
  Draw-Text $g "Pro" (New-Font 18) ([System.Drawing.Brushes]::LightSteelBlue) 42 340 220 40
  $g.FillRectangle([System.Drawing.Brushes]::White, 320, 0, $width - 320, $height)
  Draw-Text $g $eyebrow (New-Font 16 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.SolidBrush]::new($purple)) 390 74 1200 30
  Draw-Text $g $title (New-Font 44 ([System.Drawing.FontStyle]::Bold)) $ink 390 112 1400 70
  Draw-Text $g "Local-first. Evidence-first. Honest about what is still unpaid." (New-Font 20) $muted 390 198 1300 38
}

function Save-Scene {
  param([int]$number, [scriptblock]$draw)
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  & $draw $g
  $path = Join-Path $out ("scene-{0:D2}.png" -f $number)
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bitmap.Dispose()
}

Save-Scene 1 {
  param($g)
  Add-Base $g "Work with proof." "A CALM WORKFLOW FOR INDEPENDENT BUILDERS"
  Draw-Text $g "Keep the opportunity, evidence and next action together before asking anyone to pay." (New-Font 32) ([System.Drawing.Brushes]::DarkSlateBlue) 390 330 1100 110
  $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(233, 235, 255)), 390, 520, 1120, 210)
  Draw-Text $g "No fake revenue. No hidden claims." (New-Font 34 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::MidnightBlue) 440 570 1000 60
  Draw-Text $g "ProofPocket labels advertised value as potential until evidence and payer confirmation exist." (New-Font 22) ([System.Drawing.Brushes]::SlateGray) 440 645 1000 58
}

Save-Scene 2 {
  param($g)
  Add-Base $g "See the whole pipeline at a glance." "OVERVIEW"
  $card = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(89, 100, 216))
  $g.FillRectangle($card, 390, 285, 600, 225)
  Draw-Text $g "TRACKED POTENTIAL" (New-Font 15 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::White) 430 325 500 30
  Draw-Text $g "`$100,000" (New-Font 64 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::White) 430 365 500 90
  Draw-Text $g "Advertised, unpaid - not payment confirmation" (New-Font 18) ([System.Drawing.Brushes]::White) 430 465 500 35
  $g.FillRectangle([System.Drawing.Brushes]::WhiteSmoke, 1050, 285, 600, 225)
  Draw-Text $g "Priority opportunity" (New-Font 18 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::DarkSlateBlue) 1090 330 500 35
  Draw-Text $g "RevenueCat Shipaton" (New-Font 26 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::MidnightBlue) 1090 380 500 45
  Draw-Text $g "Deadline - 2026-09-30" (New-Font 19) ([System.Drawing.Brushes]::SlateGray) 1090 445 500 35
}

Save-Scene 3 {
  param($g)
  Add-Base $g "Capture a new opportunity in seconds." "PRIVATE TRACKER"
  $panel = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(250, 250, 253))
  $g.FillRectangle($panel, 390, 285, 1260, 540)
  $labels = @("Opportunity title", "Payer or organizer", "Amount (USD)", "Deadline (YYYY-MM-DD)")
  $values = @("RevenueCat Shipaton", "RevenueCat", "`$100000", "2026-09-30")
  for ($i = 0; $i -lt 4; $i++) {
    $x = if ($i -lt 2) { 440 } else { 1040 }
    $y = if ($i % 2 -eq 0) { 355 } else { 535 }
    Draw-Text $g $labels[$i] (New-Font 16 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::SlateGray) $x $y 500 30
    $g.FillRectangle([System.Drawing.Brushes]::White, $x, $y + 42, 500, 62)
    Draw-Text $g $values[$i] (New-Font 23) ([System.Drawing.Brushes]::DarkSlateBlue) ($x + 18) ($y + 58) 460 34
  }
  Draw-Text $g "Invalid or non-positive amounts are rejected before they affect totals." (New-Font 18) ([System.Drawing.Brushes]::SlateGray) 440 735 1100 38
}

Save-Scene 4 {
  param($g)
  Add-Base $g "Attach proof, not promises." "EVIDENCE LOCKER"
  $g.FillRectangle([System.Drawing.Brushes]::WhiteSmoke, 390, 285, 1260, 500)
  Draw-Text $g "READY" (New-Font 18 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::SeaGreen) 450 340 260 35
  Draw-Text $g "Launch checklist" (New-Font 30 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::MidnightBlue) 450 390 500 50
  Draw-Text $g "Prototype validates local evidence capture and a clear paid tier." (New-Font 21) ([System.Drawing.Brushes]::SlateGray) 450 455 920 65
  $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(39, 174, 114)), 450, 600, 44, 44)
  Draw-Text $g "Verified checkpoint" (New-Font 22 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::DarkSlateBlue) 530 601 520 40
  Draw-Text $g "A dated source/detail pair is visible before a payout request." (New-Font 19) ([System.Drawing.Brushes]::SlateGray) 530 655 820 40
}

Save-Scene 5 {
  param($g)
  Add-Base $g "Generate a transparent handoff." "PAYOUT-READY SUMMARY"
  $g.FillRectangle([System.Drawing.Brushes]::MidnightBlue, 390, 285, 1260, 500)
  Draw-Text $g "Potential amount: `$100,000.00 USD" (New-Font 28 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::White) 450 350 1000 50
  Draw-Text $g "(not a guarantee of payment)" (New-Font 22) ([System.Drawing.Brushes]::LightSteelBlue) 450 410 800 40
  Draw-Text $g "Next action" (New-Font 20 ([System.Drawing.FontStyle]::Bold)) ([System.Drawing.Brushes]::White) 450 505 300 35
  Draw-Text $g "Ask the payer to confirm acceptance, amount and payment process in writing." (New-Font 25) ([System.Drawing.Brushes]::White) 450 555 1060 100
  Draw-Text $g "ProofPocket keeps the record honest from first lead to final payout." (New-Font 22) ([System.Drawing.Brushes]::LightSteelBlue) 450 700 1100 40
}

Write-Output "Generated scenes in $out"
