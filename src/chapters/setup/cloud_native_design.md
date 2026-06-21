
You've heard the phrase already, but let's slow down and be precise about it — because it shapes every decision we'll make in this workshop.

**Cloud native** doesn't mean "runs in the cloud." It means designing a system that takes *advantage* of what the cloud offers, rather than just replicating what you'd do on a physical server.

In Parts 1 and 2, you deployed the Rock of Ages API to a single EC2 instance. That's called **lift and shift** — you took a traditional application and moved it to a cloud server. It works, but you didn't gain much over running it on a server you own. You still have one machine to manage, one point of failure, and limited ability to scale.

Cloud native design asks: *what if we stopped thinking in servers and started thinking in services?*

---

## The Shift in Thinking

Here's the mental model shift:

| Lift and Shift | Cloud Native |
|---|---|
| One server runs the app | Small, specialized services each do one job |
| You manage the OS and runtime | Cloud provider manages infrastructure for you |
| Scale by making the server bigger | Scale each service independently, on demand |
| One failure can take down everything | Failures are isolated; services recover automatically |
| Deploy the whole app for any change | Deploy individual services independently |

Cloud-native systems are designed to take advantage of **elasticity** — the ability to add or remove resources automatically as demand changes.

None of this is abstract — you'll see each of these principles play out concretely in this workshop.

---

## The Core Principles

### Use Managed Services

Cloud-native systems often take advantage of managed services when it makes sense. Instead of spending time installing software, patching servers, and handling infrastructure maintenance, teams can focus on building features and solving business problems.

Rather than provisioning a server, installing a runtime, and keeping it patched, you describe what you need and the cloud provider figures out the rest. You focus on your application; AWS handles the infrastructure beneath it.

### Design for Failure

Cloud native systems assume things will fail — a container crashes, a network call times out, a service is temporarily unavailable — and design to handle it gracefully rather than hoping for the best.

This means building systems where failures are *contained* rather than cascading. If one part of the system goes down, the rest keeps running. Data isn't lost. The system recovers on its own.

### Break Functionality into Services

Not everything belongs in your main application. Work that has different scaling needs, different failure modes, or a clearly distinct responsibility is often better handled by a dedicated service.

When you isolate a piece of functionality, you can scale it independently, deploy it independently, and reason about it in isolation. A bug in that service doesn't take down the whole application.

### Communicate Asynchronously

Some workloads are better handled asynchronously. Rather than waiting for another service to finish its work, a service can place a message on a queue and continue processing. This reduces coupling and can improve resilience when work doesn't need an immediate response.

When Service A sends a message to Service B asynchronously, A doesn't need to know if B is currently available or how long it will take. B processes the message on its own time. Neither service is tightly dependent on the other's availability.

### Automate Infrastructure

Cloud native systems don't rely on a person SSH-ing into a server to make changes. Infrastructure is defined as code and applied automatically through a CI/CD pipeline.

This means changes are reproducible, reviewable, and consistent across environments. There's no manual step that someone might forget or do slightly differently each time.

---

## What This Workshop Is Really About

These principles aren't a checklist — they're a way of thinking. And like most ways of thinking, they're best learned by running into real problems and figuring out how to solve them.

In this workshop, you'll build a new feature for the Rock of Ages app. Along the way you'll encounter moments where the system doesn't behave the way you expect, where the obvious solution turns out to have tradeoffs, and where you have to think carefully about how independent services should talk to each other.

That process — noticing a gap, reasoning through the options, choosing an approach — is what systems design actually looks like. By the end, you'll have built something that embodies these principles. More importantly, you'll understand *why* it's designed the way it is.
