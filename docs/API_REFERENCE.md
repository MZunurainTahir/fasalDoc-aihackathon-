# FasalDoc — API Reference

**Base URL:** `http://localhost:8000` (development) or your deployed backend URL.

---

## Table of Contents

- [Health Check](#get-health)
- [Diagnose Image](#post-apidignose)
- [Chat](#post-apichat)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## `GET /health`

Returns the server health status and active LLM provider configuration.

### Response

```json
{
  "status": "ok",
  "app": "FasalDoc Backend",
  "hackathon": "BanoQabil AI Hackathon 2026",
  "providers": {
    "gemini": true,
    "groq": true,
    "openrouter": true
  },
  "timeout_ms": 20000
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Always `"ok"` when server is running |
| `app` | `string` | Application name |
| `hackathon` | `string` | Event branding |
| `providers` | `object` | Boolean map of active LLM providers |
| `timeout_ms` | `number` | Configured LLM request timeout |

---

## `POST /api/diagnose`

Diagnoses a crop or livestock disease from an uploaded image using vision LLM models.

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |

### Request Body

```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSk...",
  "type": "crop",
  "cropName": "Tomato",
  "animalType": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `imageBase64` | `string` | Yes | Base64-encoded JPEG image (max ~1024px, q0.7) |
| `type` | `"crop" \| "livestock"` | Yes | Diagnosis domain |
| `cropName` | `string` | Conditional | Crop name when `type` is `"crop"` |
| `animalType` | `string` | Conditional | Animal type when `type` is `"livestock"` |

### Response (200 OK)

```json
{
  "disease": "Tomato Late Blight",
  "confidence": 0.92,
  "remedy": {
    "organic": "Apply neem oil spray (5ml/L) every 5-7 days on affected foliage.",
    "chemical": {
      "activeIngredient": "Mancozeb 75% WP",
      "brands": ["Dithane M-45 (Dow)", "Manzate (UPL)"],
      "dosage": "2.5g/L water, spray at 500L/acre",
      "interval": "7-10 days, max 3 applications"
    },
    "prevention": [
      "Remove and destroy infected plant debris",
      "Ensure adequate plant spacing for air circulation",
      "Avoid overhead irrigation in humid conditions"
    ]
  },
  "urdu": {
    "disease": "ٹماٹر لیٹ بلائٹ",
    "remedy": "نیم کا تیل سپرے (5 ملی لیٹر فی لیٹر) ہر 5-7 دن بعد متاثرہ پتوں پر کریں۔"
  },
  "provider": "gemini"
}
```

### Error Responses

| Status | Body | Cause |
|--------|------|-------|
| `400` | `{ "error": "imageBase64 is required" }` | Missing image data |
| `400` | `{ "error": "type must be crop or livestock" }` | Invalid diagnosis type |
| `503` | `{ "error": "No active LLM key configured" }` | No API keys in backend/.env |
| `504` | `{ "error": "LLM provider timeout" }` | Provider exceeded timeout_ms |

---

## `POST /api/chat`

Sends a conversational agricultural query to the AI assistant with RAG context grounding.

### Request Body

```json
{
  "messages": [
    { "role": "user", "content": "میری گندم کی فصل میں زنگ لگ رہا ہے، کیا علاج ہے؟" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "کون سا سپرے استعمال کروں؟" }
  ],
  "language": "ur"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messages` | `array` | Yes | OpenAI-format message history |
| `language` | `"en" \| "ur"` | No | Response language (default: `"en"`) |

### Response (200 OK)

```json
{
  "reply": "گندم کی زنگ (Wheat Rust) کے لیے ٹیلیبوکس گروپ کی دوائیں استعمال کریں۔ Propiconazole 25% EC (Tilt - Syngenta) 1ml/L پانی میں ملا کر 250 لیٹر فی ایکڑ سپرے کریں۔",
  "ragContext": [
    "Wheat Leaf Rust (Puccinia triticina): Apply propiconazole at 0.1% concentration...",
    "Cultural practices: Early sowing reduces rust severity in Punjab..."
  ],
  "provider": "groq"
}
```

### Error Responses

| Status | Body | Cause |
|--------|------|-------|
| `400` | `{ "error": "messages array is required" }` | Missing messages |
| `503` | `{ "error": "No active LLM key configured" }` | No API keys configured |
| `504` | `{ "error": "LLM provider timeout" }` | Provider exceeded timeout |

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body or missing fields |
| `NO_LLM_KEYS` | 503 | No valid LLM API keys configured |
| `PROVIDER_TIMEOUT` | 504 | All LLM providers timed out |
| `PROVIDER_ERROR` | 502 | Upstream LLM provider returned an error |
| `RATE_LIMITED` | 429 | Too many requests from this IP |

---

## Rate Limiting

The API enforces rate limits via `express-rate-limit`:

| Window | Max Requests | Scope |
|--------|--------------|-------|
| 15 minutes | 100 | Per IP address |

Rate-limited responses return HTTP `429` with:

```json
{
  "error": "Too many requests, please try again later."
}
```

---

## LLM Provider Fallback Chain

When multiple providers are configured, the backend uses a priority-based fallback:

```
Gemini 2.0 Flash  →  Groq (Llama-3.3-70B)  →  OpenRouter (Llama-3.3-70B)
```

If the primary provider fails or times out, the request automatically falls through to the next available provider. If **no** providers are configured, the backend falls back to the offline RAG knowledge engine.

---

## Authentication

The public API does **not** require authentication. User authentication is handled client-side via Supabase Auth tokens. Future versions may require Bearer tokens for API access.

---

## CORS Configuration

CORS is configured via the `CORS_ORIGIN` environment variable:

- `*` (default) — Allow all origins (development)
- `https://fasaldoc.vercel.app` — Single production origin
- `https://app1.com,https://app2.com` — Multiple comma-separated origins

---

*Last updated: September 2026*
