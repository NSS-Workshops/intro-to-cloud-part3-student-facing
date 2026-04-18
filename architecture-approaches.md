# Lambda → API Communication: Possible Approaches

## The Problem

After the thumbnail Lambda finishes resizing images and writing them to S3, it has no way to notify the API. The `RockImage` record stays at `status='processing'` indefinitely, and the `thumbnail_*_url` fields remain null.

**How should the Lambda communicate back to the API when it's done?**

---

## Approach 1: HTTP Callback (Lambda calls the API directly)

Lambda makes an HTTP request to a new API endpoint (e.g. `PATCH /rock-images/{id}/complete`) after thumbnails are created, passing the thumbnail URLs and status update.

**Pros:**
- Most intuitive — mirrors how humans think about "notify someone when done"
- No additional AWS services required
- Relatively simple to implement
- Easy to understand and debug (standard HTTP request/response)

**Cons:**
- Tight coupling — Lambda must know the API's URL; if the URL changes, Lambda breaks
- Requires service-to-service authentication (how does the API know the request came from Lambda and not an arbitrary caller?)
- Lambda is blocked until the HTTP call completes, adding to billed execution time
- No built-in retry — if the API is down or slow, the notification is lost
- API must be network-accessible from the Lambda's execution environment

---

## Approach 2: Lambda writes directly to the database

Lambda connects to PostgreSQL (RDS) directly and `UPDATE`s the `RockImage` row itself, bypassing the API entirely.

**Pros:**
- Very simple to reason about — no intermediary service
- Fast — no extra network hops through the API
- No additional AWS services required

**Cons:**
- Bypasses all API business logic, ORM validation, and signals
- Database credentials must be stored in Lambda environment variables — a security surface
- Lambda can scale to thousands of concurrent instances, potentially exhausting RDS connection limits
- Violates service boundaries — the database is owned and managed by the API service
- Tightly couples Lambda to the database schema; any schema change could break Lambda
- Not a cloud-native pattern

---

## Approach 3: SQS (Simple Queue Service)

Lambda publishes a completion message to an SQS queue after thumbnails are created. A background worker on the API side (e.g. a Celery worker or polling process) consumes the queue and updates the database.

**Pros:**
- Fully decoupled — Lambda has no knowledge of the API
- Messages are durable: if the API worker is down, messages queue up and are processed when it recovers
- Built-in retry logic and dead-letter queue (DLQ) support for failed messages
- Acts as a buffer under high load — handles burst traffic without overwhelming the API
- Well-supported AWS managed service with strong monitoring via CloudWatch

**Cons:**
- Polling introduces latency — there's a delay between Lambda completing and the API processing the update
- Requires a background worker process running alongside the API (operational overhead)
- More infrastructure to manage: SQS queue, IAM permissions, worker configuration
- Worker adds cost and complexity to the ECS task definition

---

## Approach 4: SNS (Simple Notification Service)

Lambda publishes a completion event to an SNS topic. The API subscribes to the topic via an HTTPS endpoint and receives push notifications when thumbnails are ready.

**Pros:**
- Pub/sub model — multiple consumers can subscribe (e.g. the API, a logging service, a mobile push notification)
- Fan-out is built in — one SNS message can trigger many downstream actions
- Push-based — no polling required; the API receives the event immediately
- Managed service, no worker process needed

**Cons:**
- API must expose a publicly reachable HTTPS endpoint for SNS to deliver to
- Must verify the SNS message signature on every inbound request (security boilerplate)
- Limited retry — if the API endpoint is down, SNS retries for a limited time then discards the message
- Less control over retry and failure behavior compared to SQS
- Harder to replay or reprocess past messages

---

## Approach 5: EventBridge (Event Bus)

Lambda publishes a custom event to an EventBridge event bus after thumbnails are created. EventBridge rules route the event to one or more targets — such as another Lambda that updates the database, an SQS queue, or an API webhook.

**Pros:**
- Extremely decoupled — producer and consumer have no direct knowledge of each other
- Powerful filtering and routing rules (route different events to different targets)
- Serverless — no worker process or infrastructure to manage on the consumer side
- Full audit trail of events via CloudWatch
- Easy to add new consumers later without modifying the Lambda
- Supports many AWS services as targets out of the box

**Cons:**
- More complex to set up, reason about, and debug end-to-end
- Adds latency (~0.5s) compared to direct calls
- Events can be hard to trace across services without additional tooling (e.g. X-Ray)
- May feel like overkill for a single point-to-point notification
- Students need to understand event bus concepts before this pattern makes sense

---

## Approach 6: API/Frontend polls S3 directly

Instead of Lambda notifying the API, the API checks S3 for the existence of thumbnail files whenever the frontend polls `GET /rock-images/{id}`. If the thumbnails exist in S3, the API updates the record at that point.

**Pros:**
- No additional AWS services required
- No changes to the Lambda at all
- Conceptually simple — "check if the files are there yet"

**Cons:**
- Every poll triggers S3 API calls, adding latency and cost
- Polling is not reactive — status only updates when someone explicitly asks
- Fragile: thumbnail files could exist but be corrupted, partially written, or belong to a different version
- At scale, many users polling simultaneously generates many S3 API calls
- Not event-driven — works against cloud-native architecture principles

---

## Comparison Summary

| Approach | Coupling | Extra Services | Reliability | Complexity | Cloud-Native? |
|---|---|---|---|---|---|
| HTTP Callback | High | None | Low (no retry) | Low | Partial |
| Direct DB | Very High | None | Medium | Low | No |
| SQS | Low | SQS + worker | High | Medium | Yes |
| SNS | Low | SNS | Medium | Medium | Yes |
| EventBridge | Very Low | EventBridge | High | High | Yes |
| S3 Polling | Low | None | Low | Low | No |

---

## Discussion Questions

1. Which approach feels most natural, and why might that not be the best choice?
2. What happens to each approach if the API is temporarily unavailable when Lambda finishes?
3. How would you handle authentication between Lambda and the API in Approach 1?
4. At what scale would the direct database approach (Approach 2) break down first?
5. What are the trade-offs between SQS and SNS for this specific use case?
6. When would EventBridge be the clearly correct choice over SQS?
