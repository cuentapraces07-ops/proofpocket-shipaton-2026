Add-Type -AssemblyName System.Drawing

$size = 1024
$bitmap = [System.Drawing.Bitmap]::new($size, $size)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$bounds = [System.Drawing.Rectangle]::new(0, 0, $size, $size)

$background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  $bounds,
  [System.Drawing.Color]::FromArgb(89, 100, 216),
  [System.Drawing.Color]::FromArgb(23, 26, 43),
  45
)
$graphics.FillRectangle($background, $bounds)

$ringPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 255, 255, 255), 22)
$graphics.DrawEllipse($ringPen, 130, 130, 764, 764)

$font = [System.Drawing.Font]::new("Segoe UI", 470, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$white = [System.Drawing.Brushes]::White
$format = [System.Drawing.StringFormat]::new()
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("P", $font, $white, [System.Drawing.RectangleF]::new(0, 38, $size, $size - 76), $format)

$output = Join-Path $PSScriptRoot "..\assets\proofpocket-icon-1024.png"
$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$format.Dispose()
$font.Dispose()
$ringPen.Dispose()
$background.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
Write-Output $output
