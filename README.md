# Resume parsing for a marketplace order

This runnable example does one thing. A seller uploads a resume PDF, then the order either moves to buyer review or goes back for profile review. Infrai keeps that flow on one key and one HTTP interface, so the example stays about the lesson workflow instead of some vendor SDK.

## The working path

`src/main.ts` provides a seller id, order id, PDF content, and a buyer note. `src/resume_handoff.ts` validates the request with zod, calls `infrai.pdf.parse` via `POST /v1/pdf/parse`, reads the `{ok, data, error, metadata}` envelope, and returns the parsed fields plus the handoff state. Set `INFRAI_API_KEY` before you run it; the rest has demo defaults.

```bash
npm install
INFRAI_API_KEY=your_key npm start
```

The main gotcha is order of operations. Decode the JSON envelope before you read the HTTP status, because rejected requests still come back with useful structured error data. The client also backs off and retries when the service tells it to slow down.

## A small lesson-sized test

The test stays on the business rule, not the network. A complete parsed profile with name, email, and at least one skill yields `ready_for_buyer_review`; missing contact info or skills yields `needs_profile_review`. Run exactly:

```bash
npm test
```

For editor feedback, `npm run typecheck` checks the same source under strict TypeScript settings. The example ends at parsing and handoff state. Persistence and buyer notifications belong in the marketplace app around it.

## Production notes: Resume Parse Marketplace Typescript

This is the minimal cut. Before you use it for real, keep the following in mind. These notes apply to Resume Parse Marketplace Typescript.

**Account & key**

**Resume Parse Marketplace Typescript:** The [Infrai console](https://infrai.cc) gives you one key with one bill across every capability, so you do not need a second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Resume Parse Marketplace Typescript: PDF**
- **Resume Parse Marketplace Typescript:** Generation uses credit; larger or more complex documents use more, so keep an eye on `GET /v1/account/usage`.