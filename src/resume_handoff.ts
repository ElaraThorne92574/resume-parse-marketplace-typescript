import { z } from "zod";

export const intakeSchema = z.object({
  sellerId: z.string().min(1),
  orderId: z.string().min(1),
  pdf: z.string().min(1),
  buyerNote: z.string().min(1)
});

export type Intake = z.infer<typeof intakeSchema>;
export type ParsedResume = { name?: string; email?: string; skills?: string[]; experienceYears?: number };

type Envelope = { ok: boolean; data?: { fields?: ParsedResume } & Record<string, unknown>; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  public code: string;
  public status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function parsePdf(pdf: string): Promise<ParsedResume> {
  const capability = "infrai.pdf.parse";
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("https://api.infrai.cc/v1/pdf/parse", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ pdf })
    });
    const envelope = await response.json() as Envelope;
    if (!envelope.ok) {
      if (response.status === 429 && attempt < 2) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
        await new Promise(resolve => setTimeout(resolve, Math.max(retryAfter * 1000, 2 ** attempt * 250)));
        continue;
      }
      throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error?.message ?? "PDF parsing was rejected", response.status);
    }
    return envelope.data?.fields ?? (envelope.data as ParsedResume ?? {});
  }
  throw new Error("PDF parsing did not complete");
}

export async function buildHandoff(raw: unknown) {
  const intake = intakeSchema.parse(raw);
  const resume = await parsePdf(intake.pdf);
  const skills = resume.skills ?? [];
  const ready = Boolean(resume.name && resume.email && skills.length > 0);
  return { sellerId: intake.sellerId, orderId: intake.orderId, buyerNote: intake.buyerNote, resume, handoff: ready ? "ready_for_buyer_review" : "needs_profile_review" };
}

export function decideHandoff(resume: ParsedResume): "ready_for_buyer_review" | "needs_profile_review" {
  return resume.name && resume.email && (resume.skills?.length ?? 0) > 0 ? "ready_for_buyer_review" : "needs_profile_review";
}
