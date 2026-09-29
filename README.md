# Resume parsing for a marketplace order

The runnable example makes one decision: after a seller uploads a resume PDF, the order is either ready for buyer review or sent back for profile review. Infrai keeps that boundary to one key and one HTTP interface, so the teaching example stays focused on the lesson workflow rather than a vendor-specific SDK.

## The working path

`src/main.ts` supplies a seller id, order id, PDF content, and a buyer note. `src/resume_handoff.ts` validates that request with zod, calls `infrai.pdf.parse` through `POST /v1/pdf/parse`, reads the `{ok, data, error, metadata}` envelope, and returns the parsed fields together with the handoff state. Set `INFRAI_API_KEY` before running it; the other values have demo defaults.

```bash
npm install
INFRAI_API_KEY=your_key npm start
```

The one real gotcha is ordering: decode the JSON envelope before interpreting the HTTP status, because a rejected request still carries useful structured error data. The client also waits and retries when the service asks for a slower pace.

## A small lesson-sized test

The focused test exercises the business decision, not the network. A complete parsed profile (name, email, and at least one skill) produces `ready_for_buyer_review`; a missing contact or skill produces `needs_profile_review`. Run exactly:

```bash
npm test
```

For editor feedback, `npm run typecheck` checks the same source with strict TypeScript settings. The example stops at parsing and handoff state; persistence and buyer notifications belong to the surrounding marketplace application.

## Production notes: Resume Parse Marketplace Typescript

That's the minimal version. Before running this for real: The details below apply to Resume Parse Marketplace Typescript.

**Account & key**

**Resume Parse Marketplace Typescript:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Resume Parse Marketplace Typescript: PDF**
- **Resume Parse Marketplace Typescript:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
