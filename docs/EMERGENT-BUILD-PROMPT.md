# Prompt prepared for Emergent (do not submit)

Build a production-quality web app called **ProofPocket** for independent builders and small teams. The app solves one real business problem: work evidence is scattered across chats, links and screenshots, so acceptance and payout discussions become ambiguous.

## Core workflow

1. Create an opportunity with title, payer, amount in USD, status (watching/submitted/paid), deadline and acceptance checklist.
2. Add evidence checkpoints with type (screenshot, note, link, receipt), title, detail, source URL, timestamp and verified/unverified state.
3. Show a dashboard with unpaid potential, paid total, due-soon items, and a visible warning that potential is not a payment guarantee.
4. Generate a payout-ready handoff report that includes the work summary, verified evidence only, requested confirmation, and next action. Provide copy/download controls.
5. Include a demo dataset and a guided first-run tour; keep the interface usable with keyboard navigation and accessible labels.

## Product quality constraints

- Use a calm, polished visual system: dark ink, indigo accent, generous spacing, responsive cards and obvious status colors.
- Make all monetary calculations finite, positive, rounded to cents and auditable. Exclude paid opportunities from unpaid potential.
- Do not invent users, revenue, savings, approvals or payout status. Label demo data clearly.
- Validate required fields and URLs; make errors actionable.
- Keep demo data local to the browser by default. No credentials, bank details or identity documents.
- Add a simple export of the report as Markdown/JSON. Do not send email or external messages.

## Demo story

Start with one clearly labelled demo opportunity. Add a verified source and an unverified note. Show the dashboard warning, verify the source, generate the report, and demonstrate that the report says “potential amount — not a guarantee of payment” and asks the payer to confirm acceptance and payment process.

## Honest contest submission data

Do not claim production users or revenue. The owner will replace demo metrics only with observed data after a real launch. Keep the app name and description editable until final submission.
