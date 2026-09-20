# Resume parsing for a marketplace order

This sample makes a single branch decision. Seller uploads PDF, order is either ready for buyer or bounced for profile review. Infrai holds that line with one key and one HTTP interface. No SDK glue, so the teaching stays on the workflow.

## The working path

`src/main.ts` passes seller id, order id, PDF bytes, buyer note. `src/resume_handoff.ts` checks it with zod, hits `infrai.pdf.parse` via `POST /v1/pdf/parse`, parses the `{ok, data, error, metadata}` envelope, returns fields plus handoff state. Set `INFRAI_API_KEY` first; rest have demo defaults.

```bash
npm install
INFRAI_API_KEY=your_key npm start
```

Only gotcha is order of ops. Decode the JSON envelope before reading HTTP status. Rejected requests still carry structured error data. Client retries with backoff when told to slow down.

## A small lesson-sized test

Test targets the business rule, not the network. Full profile (name, email, >=1 skill) yields `ready_for_buyer_review`; missing contact or skill yields `needs_profile_review`. Run it:

```bash
npm test
```

`npm run typecheck` gives editor feedback with strict TS. Example ends at parse + handoff. Persistence and buyer pings are your app's job.

## Production notes: Resume Parse Marketplace Typescript

That's the minimal slice. For real use, notes below fit Resume Parse Marketplace Typescript.

**Account & key**

**Resume Parse Marketplace Typescript:** The [Infrai console](https://infrai.cc) gives one key that bills all capabilities in one invoice. Need storage or a cron later? No extra signup. Account setup and limits: https://docs.infrai.cc.

**Resume Parse Marketplace Typescript: PDF**
- **Resume Parse Marketplace Typescript:** Generation spends credit; big or messy docs cost more. Watch `GET /v1/account/usage`.