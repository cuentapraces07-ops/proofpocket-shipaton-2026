Add-Type -AssemblyName System.Speech

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$videoDir = Join-Path $root "video"
New-Item -ItemType Directory -Path $videoDir -Force | Out-Null
$output = Join-Path $videoDir "proofpocket-demo-narration.wav"

$text = @"
ProofPocket is a private evidence locker for independent builders.
It keeps the opportunity, the proof and the next action together before anyone asks for payment.
The overview shows tracked potential, clearly labeled as advertised and unpaid, never as confirmed revenue.
You can add a new opportunity with a payer, a deadline and a validated dollar amount.
Then capture dated evidence checkpoints, so a ready state means something concrete.
Finally, generate a transparent handoff that asks the payer to confirm acceptance, amount and payment process in writing.
ProofPocket is designed to keep the record honest from the first lead to the final payout.
"@

$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
$male = $synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -match "David|Mark|Guy|George|Ryan" } | Select-Object -First 1
if ($male) { $synth.SelectVoice($male.VoiceInfo.Name) }
$synth.Rate = 0
$synth.Volume = 100
$synth.SetOutputToWaveFile($output)
$synth.Speak($text)
$synth.Dispose()
Write-Output ("Generated narration with voice: " + ($(if ($male) { $male.VoiceInfo.Name } else { "system default" })))
