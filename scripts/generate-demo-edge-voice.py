"""Generate the demo narration with a clearly male neural voice.

This is an asset-generation helper only; it contains no account data or
credentials. The text is the same transparent product narration used by the
local demo.
"""

import asyncio
from pathlib import Path

import edge_tts


TEXT = """ProofPocket is a private evidence locker for independent builders.
It keeps the opportunity, the proof and the next action together before anyone asks for payment.
The overview shows tracked potential, clearly labeled as advertised and unpaid, never as confirmed revenue.
You can add a new opportunity with a payer, a deadline and a validated dollar amount.
Then capture dated evidence checkpoints, so a ready state means something concrete.
Finally, generate a transparent handoff that asks the payer to confirm acceptance, amount and payment process in writing.
ProofPocket is designed to keep the record honest from the first lead to the final payout."""


async def main() -> None:
    output = Path(__file__).resolve().parents[1] / "video" / "proofpocket-demo-male-neural.mp3"
    await edge_tts.Communicate(TEXT, "en-US-GuyNeural", rate="+0%", volume="+0%").save(str(output))
    print(f"Generated male neural narration: {output}")


if __name__ == "__main__":
    asyncio.run(main())
