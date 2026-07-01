You've seen the gap. Now it's time to think visually.

One of the most valuable tools an engineer has when working on a distributed system is a good diagram. When a request disappears somewhere across three services and you're not sure where it got stuck, drawing the system often makes the problem obvious in a way that staring at code doesn't.

This page covers the basics of reading and drawing architecture diagrams. Your instructor will lead a live diagramming session where the class maps out the Rock of Ages system together — this is your preparation for that conversation.

---

## The Building Blocks

Architecture diagrams use a small vocabulary. Once you know the shapes, you can read almost any diagram you encounter.

**Boxes** represent things that exist and do work — a service, a database, a storage bucket, a function. The label inside tells you what it is.

**Arrows** represent movement — a request being sent, data flowing, an event being triggered. The direction of the arrow tells you who initiates: an arrow from A to B means A is the one doing the calling or sending.

**Labels on arrows** describe what is being sent or what kind of action is happening. "POST /upload", "S3 ObjectCreated event", "returns presigned URL" — these labels turn a vague connection into a meaningful statement about the system.

**Groups or subgraphs** cluster related things together. You might see a box around everything that runs inside your API layer, or everything inside a VPC. Groups help you see the boundaries between parts of the system at a glance.

**Dashed or dotted arrows** often represent something different from a solid line — an intended-but-missing connection, an async relationship, or a notification that may or may not arrive. Pay attention to line style; it usually means something.

---

## How to Read a Diagram

When you encounter an architecture diagram, resist the urge to take it all in at once. Instead:

1. **Find the entry point.** Where does a request or action start? Usually it's a user, a browser, or an external event.
2. **Follow the arrows.** Trace the path of a single action from start to finish. What does service A send to service B? What does B do with it?
3. **Read the labels.** The label on each arrow is often the most important information in the diagram. Don't skip it.
4. **Look for dead ends.** In a distributed system, a broken feature often shows up as an arrow that goes nowhere — a service that does its job but has no way to tell anyone it's done.
5. **Notice the gaps.** Not everything in a real system is connected. A missing arrow between two services that you'd expect to communicate is a signal worth investigating.

---

## How to Start Drawing One

You don't need special software to draw an architecture diagram — a whiteboard, a piece of paper, or a free tool like [Excalidraw](https://excalidraw.com) all work fine. The goal is clarity, not aesthetics.

A practical approach:

1. **Start with what you know.** Draw a box for each service or resource you're aware of. Don't worry about completeness yet.
2. **Add the connections you're certain about.** Draw an arrow wherever you know one service talks to another. Label it.
3. **Trace a specific user action.** Pick one thing a user does — like uploading an image — and follow it step by step. Add any services or connections you missed.
4. **Mark what you're unsure about.** Use a question mark or a dashed line for connections you think exist but haven't confirmed. These become your investigation targets.
5. **Identify the gaps.** Are there services that seem like they should communicate but don't? Is there a step in the flow where the trail goes cold?

---

## Why This Matters Here

The system you just deployed has multiple independent services: the Django API, a Lambda function, S3, a database. When something goes wrong — or stays stuck — the question isn't just "what is the bug?" It's "which service owns that responsibility, and how does it communicate with the others?"

A diagram forces you to be explicit about those questions. It's also the common language that engineers use to talk about systems with each other — in code reviews, design discussions, incident reviews, and onboarding new teammates.

Come to the instructor-led session ready to contribute. You've seen the system run. You know what the user experience looks like. That's exactly the starting point for drawing what's actually happening underneath.
