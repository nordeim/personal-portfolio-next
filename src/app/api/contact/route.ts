import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { ContactApiResponse } from "@/lib/types";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateContact(data: ContactPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 1) {
    errors.push({ field: "name", message: "Name is required." });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be under 100 characters." });
  }

  if (!data.email || data.email.trim().length < 1) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: "message", message: "Message must be at least 10 characters." });
  } else if (data.message.trim().length > 5000) {
    errors.push({ field: "message", message: "Message must be under 5000 characters." });
  }

  return errors;
}

const MAX_BODY_SIZE = 10 * 1024; // 10KB

export async function POST(request: Request): Promise<Response> {
  // Reject oversized payloads before spending resources parsing them
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    const body: ContactApiResponse = {
      success: false,
      error: "Request body too large.",
    };
    return Response.json(body, { status: 413 });
  }

  // Rate limiting: 5 requests per minute per IP
  const ip = getClientIp(request);
  const limit = await rateLimit(ip, { maxRequests: 5, windowMs: 60_000 });

  if (!limit.success) {
    const body: ContactApiResponse = {
      success: false,
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((limit.retryAfterMs ?? 60_000) / 1000),
    };
    return Response.json(body, {
      status: 429,
      headers: {
        "Retry-After": String(body.retryAfter),
      },
    });
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const errorBody: ContactApiResponse = {
      success: false,
      error: "Invalid JSON body.",
    };
    return Response.json(errorBody, { status: 400 });
  }

  // Validate
  if (typeof body !== "object" || body === null) {
    const errorBody: ContactApiResponse = {
      success: false,
      error: "Request body must be an object.",
    };
    return Response.json(errorBody, { status: 400 });
  }

  const data = body as ContactPayload;
  const errors = validateContact(data);

  if (errors.length > 0) {
    const errorBody: ContactApiResponse = {
      success: false,
      error: "Validation failed.",
    };
    return Response.json(errorBody, { status: 422 });
  }

  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  // For now, log to server console
  console.log("[Contact Form]", {
    name: data.name!.trim(),
    email: data.email!.trim(),
    messageLength: data.message!.trim().length,
  });

  const successBody: ContactApiResponse = {
    success: true,
    message: "Message received.",
  };
  return Response.json(successBody, { status: 200 });
}
