## What is System Design?

System design is the process of defining how the different pieces of a software system fit together — what services exist, how they communicate, where data lives, and how the system behaves under load or failure.

As systems grow beyond a single application, system design becomes one of the most important skills an engineer can develop. A well-designed system is easier to scale, easier to debug, and easier to hand off to someone new.

One of the most useful tools in system design is the **architecture diagram** — a visual map of the components in your system and the relationships between them.

## The Current Architecture

Here's a diagram of the Rock of Ages system as it stands today:

```mermaid
flowchart TD
    Browser(["Browser"])

    subgraph ClientHosting["Client Hosting"]
        CF["CloudFront"]
        ClientS3[("S3\nStatic Site")]
    end

    subgraph APILayer["API — ECS Fargate"]
        ALB["Application Load Balancer"]
        APITask["Django API\n× 2 tasks"]
    end

    subgraph DataLayer["Data Layer"]
        RDS[("RDS\nPostgreSQL")]
        ImageS3[("S3\nImage Bucket")]
    end

    subgraph ProcessingLayer["Image Processing"]
        Lambda["Lambda\nThumbnail Generator"]
    end

    Browser -->|"1. Load app"| CF
    CF --> ClientS3

    Browser -->|"2. POST /rock-images/upload-url"| ALB
    ALB --> APITask
    APITask -->|"Create RockImage\nstatus='processing'"| RDS
    APITask -->|"Return presigned URL"| Browser

    Browser -->|"3. Direct upload\nvia presigned URL"| ImageS3

    ImageS3 -->|"4. ObjectCreated event"| Lambda
    Lambda -->|"5. Write thumbnails"| ImageS3

    Browser -->|"6. Poll GET /rock-images/id"| ALB
    APITask -->|"Returns status='processing'\nforever"| Browser

    Lambda -. "GAP: Lambda has no way\nto notify the API" .-> APITask
```

Each arrow represents data or a request moving between services. Notice the dashed arrow at the bottom: Lambda writes thumbnails to S3, but has no path back to the API. The `RockImage` record in the database is never updated.

## How to Read an Architecture Diagram

A few things to look for when reading or drawing a diagram like this:

- **Boxes** represent services or resources — things that exist and do work
- **Subgraphs** group related services together (e.g. everything in the API layer)
- **Solid arrows** represent real connections — data flows, API calls, event triggers
- **Dashed arrows** often represent gaps or intended-but-missing connections
- **Direction matters** — an arrow from A to B means A initiates the communication
- **Labels on arrows** describe what is being sent or what kind of action is happening

When you're debugging a distributed system, this kind of diagram is often the first thing you reach for. It helps you trace where a request enters the system, where it might get stuck, and which services are involved.

---

## What Drives System Design Decisions?

Now that you can see the gap, the next question is: *how should we fill it?* There are almost always multiple technically valid solutions to a systems design problem. What separates a good decision from a bad one is understanding the forces at play.

Here are the factors engineers weigh when making design decisions:

### Cost

Every service has a price tag. Some charge per request, some per hour, some by the amount of data stored or transferred. A solution that works at small scale can become expensive at large scale if you're not paying attention to how costs grow.

Good system design asks: *how does this cost change as usage grows? Are we paying for idle capacity, or only for what we actually use?*

### Scalability

Can the solution handle more load without falling apart? A design that works for 10 users per day should ideally work for 10,000 — either automatically, or with predictable changes.

Some solutions scale well horizontally (you add more instances and load is distributed). Others hit ceilings that require a rethink. Understanding *where* the bottleneck will be — before you hit it — is a core system design skill.

### Reliability and Fault Tolerance

What happens when something goes wrong? A reliable system degrades gracefully rather than failing completely. It can retry failed operations, recover from partial outages, and avoid losing data when a component goes down.

Design decisions often trade off between simplicity and resilience. A direct synchronous call between two services is simple to reason about, but if the receiving service is down, the caller fails too.

### Operational Complexity

Every piece you add to a system is something that can break, something you need to monitor, and something a new engineer has to learn. Simpler systems are easier to debug, deploy, and hand off.

This is why the right answer to a system design problem isn't always "add another service." Sometimes a simpler solution — even if it's slightly less optimal — is the better engineering call because it reduces the surface area of things that can go wrong.

### Latency

How fast does the system need to respond? Some operations need to complete within milliseconds (loading a page, submitting a form). Others can happen in the background over seconds or minutes (generating thumbnails, sending an email, generating a report).

Distinguishing between work that needs to be synchronous and work that can be asynchronous is one of the most important decisions in system design. Forcing everything to be synchronous makes systems slow and fragile; going fully async where users need immediate feedback creates a confusing experience.

### Maintainability

Will a new engineer be able to understand this system in six months? Will *you* be able to understand it in six months?

Clever solutions that are hard to explain are often a liability. A design that maps cleanly to the problem it's solving, uses well-understood patterns, and is documented with a diagram is far easier to evolve over time than one that requires deep tribal knowledge to operate.

---

These factors don't all point in the same direction — a solution that's maximally scalable might be expensive and complex; one that's cheap and simple might not hold up under load. System design is the practice of making those tradeoffs explicitly and intentionally, with eyes open to what you're giving up.

Keep these in mind as you brainstorm solutions to the gap in our system.
