import assert from "node:assert/strict";
import { decideHandoff, intakeSchema } from "../src/resume_handoff.js";

const complete = { name: "Lin", email: "lin@example.com", skills: ["TypeScript"] };
assert.equal(decideHandoff(complete), "ready_for_buyer_review");
assert.equal(decideHandoff({ name: "Lin", skills: [] }), "needs_profile_review");
assert.throws(() => intakeSchema.parse({ sellerId: "s", orderId: "o", pdf: "" }));
console.log("resume handoff decisions pass");
