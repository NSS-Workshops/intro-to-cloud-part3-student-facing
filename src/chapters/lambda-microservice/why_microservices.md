Before we deploy our Lambda, it's worth stepping back to ask: why build things this way at all?

> **Need a refresher on Lambda?** Check out the [Lambda chapter from Workshop 2](https://nss-workshops.github.io/intro-to-cloud-part2-student-facing/module-7-page-1) before continuing.

## What is a Microservice?

A **microservice** is a small, self-contained piece of software that does one thing and does it well. Instead of building one large application — called a **monolith** — that handles everything (authentication, data storage, image processing, email notifications, etc.), you break the system into independent services that each own a specific responsibility.

Each microservice:
- Has a **single, well-defined job**
- Runs and deploys **independently** from the rest of the system
- Communicates with other services through a well-defined interface (an API, an event, a message queue, etc.)
- Can be written in a **different language or runtime** than the rest of your system if that's the best tool for the job

Think of it like a restaurant kitchen. Rather than one person doing everything from taking orders to washing dishes, you have specialized roles: host, server, line cook, prep cook, dishwasher. Each role is focused, replaceable, and can be scaled independently if you get a rush of customers.

## Why Use Microservices?

### Scalability

Different parts of your system have different traffic patterns. In a typical app, image processing might only happen occasionally — but when it does, it can be expensive (CPU-intensive, slow). With a monolith, heavy image processing competes for resources with your main application. With a microservice, you scale the image processor independently, and when no images need processing, it costs you nothing.

### Dependability

In a monolith, a bug or crash in one feature can take down the whole application. Microservices provide **fault isolation**: if the image resizing service goes down, users can still log in, browse content, and interact with the app. The failure is contained.

### Maintainability

A small service with a single responsibility is much easier to reason about than a large application with interconnected concerns. Smaller codebases are easier to test, easier to update, and easier for a new developer to understand. When something breaks, you know exactly where to look.

### Independent Deployability

With a monolith, deploying a small change to one feature means deploying the entire application. Microservices let you ship changes to one service without touching anything else. This means faster iteration, lower risk per deploy, and the ability for different teams to work independently.

### Technology Flexibility

Because each service is self-contained, you can choose the right tool for each job. Your main API might be Django (Python). Your real-time feature might be Node.js. Your image processor might be a Lambda function with a specialized image library. They don't have to agree on a language or runtime — they just have to agree on how they'll communicate.

## The Tradeoffs

Microservices aren't free. They solve real problems, but they introduce new ones — and it's worth being honest about that.

**Operational complexity.** With a monolith, you deploy one thing. With microservices, you deploy many things, each with its own configuration, infrastructure, and deployment pipeline. You need to think about monitoring across multiple services, and what happens when one service is down and another depends on it.

**Debugging is harder.** In a monolith, a stack trace tells you exactly what happened. In a distributed system, a single user action might touch three services, and figuring out where something went wrong means stitching together logs from each of them.

**More infrastructure to manage.** Each service may need its own database, its own scaling policy, its own alerting. For a small team or an early-stage product, this overhead can slow you down more than a monolith ever would.

**The honest take:** a monolith is often the right starting point. Many successful companies ran monoliths for years before breaking things apart. Microservices make the most sense when a specific part of your system has genuinely different scaling, reliability, or deployment needs — not just because it sounds like good architecture.

---

## How Microservices Communicate: Sync vs. Async

When one service needs to trigger or talk to another, there are two broad approaches:

**Synchronous communication** means one service calls another and waits for a response — like an HTTP API call. Service A sends a request, pauses, and only continues once Service B responds. This is simple and predictable, but it means Service A is now dependent on Service B being available and fast. If B is slow, A is slow. If B is down, A fails.

**Asynchronous communication** means one service fires off a message or event and moves on — it doesn't wait. The receiving service picks up that message and processes it on its own time. Services are decoupled: the sender doesn't need to know if the receiver is up, busy, or even which service will handle it.

Common async mechanisms in AWS include S3 events and SQS (a message queue).

---

## Why a Microservice for Image Resizing?

The Rock of Ages app needs to generate multiple thumbnail sizes whenever a user uploads a photo. This is a perfect candidate for a microservice, and here's why:

**It's event-driven.** Image resizing doesn't need to happen in real time during the upload request. The user uploads the original, and the resize can happen asynchronously in the background. Trying to do this synchronously inside the Django API would slow down every upload request.

**It's CPU-intensive and unpredictable in volume.** Image processing is computationally expensive, and you might get many uploads at once or none at all. A Lambda function scales automatically — zero cost when idle, handles bursts without you provisioning servers.

**It has a single, clear responsibility.** The Lambda does one thing: take an original image from S3 to produce resized thumbnails. It doesn't know or care about users, authentication, or database records. This makes it easy to test, update, and replace independently.

**Failure is isolated.** If the thumbnail service has a bug, users can still upload photos. The originals are safe in S3. The thumbnails can be regenerated later without any data loss.

In short: image resizing is exactly the kind of work that doesn't belong inside your main API — and Lambda is exactly the kind of infrastructure designed for it.
