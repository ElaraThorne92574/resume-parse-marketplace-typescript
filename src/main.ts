import { buildHandoff } from "./resume_handoff.js";

const input = {
  sellerId: process.env.SELLER_ID ?? "seller-demo",
  orderId: process.env.ORDER_ID ?? "order-demo",
  pdf: process.env.RESUME_PDF ?? "base64-resume-content",
  buyerNote: process.env.BUYER_NOTE ?? "Please review the candidate profile."
};

try {
  console.log(JSON.stringify(await buildHandoff(input), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
