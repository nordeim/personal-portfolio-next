import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

export async function POST(request: Request) {
  // Rate limiting: 5 requests per minute per IP
  const ip = getClientIp(request);
  const limit = await rateLimit(ip, { maxRequests: 5, windowMs: 60_000 });

  if (!limit.success) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 60_000) / 1000)),
        },
      },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Validate
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const data = body as ContactPayload;
  const errors = validateContact(data);

  if (errors.length > 0) {
    return Response.json(
      { error: "Validation failed.", details: errors },
      { status: 422 },
    );
  }

  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  // For now, log to server console
  console.log("[Contact Form]", {
    name: data.name!.trim(),
    email: data.email!.trim(),
    messageLength: data.message!.trim().length,
  });

  return Response.json(
    { success: true, message: "Message received." },
    { status: 200 },
  );
}
