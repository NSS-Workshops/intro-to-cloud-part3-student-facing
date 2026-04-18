## Queues: A Quick Refresher

You've likely encountered a queue as a data structure — first in, first out. Items enter at the back and are processed from the front, in order. That mental model applies directly here.

In distributed systems, a **message queue** works the same way, but instead of data structures in memory, you have services dropping messages into a shared queue and other services picking them up to act on them.

## What is SQS?

**Amazon Simple Queue Service (SQS)** is AWS's managed message queue. You don't provision servers or manage infrastructure — you create a queue, and AWS handles availability, scaling, and durability.

A message in SQS is just a string (usually JSON). One service puts it in. Another service reads it, processes it, and deletes it.

## Key Concepts

**Producers and consumers** — The service that sends messages is the *producer*. The service that reads and processes them is the *consumer*. They don't need to know about each other — they only need to know about the queue.

**Durability** — Messages persist in the queue until a consumer explicitly deletes them. If your consumer goes down, messages queue up and are processed when it recovers. Nothing is lost.

**Long polling** — Instead of constantly asking "are there messages?" (which wastes resources), the consumer can tell SQS to wait up to 20 seconds before responding if the queue is empty. This is called long polling and is the standard approach.

**Visibility timeout** — When a consumer picks up a message, SQS temporarily hides it from other consumers while it's being processed. If the consumer crashes before deleting it, the message becomes visible again and can be retried.

**Message retention** — Messages that aren't consumed within a configurable window (default 4 days, up to 14) are automatically deleted.

## From Data Structure to Cloud Service

You've likely implemented a queue in JavaScript — an array where you push to the back and shift from the front. SQS takes that same concept and turns it into a managed cloud service that multiple independent applications can read from and write to over the network. Instead of one program passing data to itself, you have two completely separate services — Lambda and your Django worker — communicating through a shared queue without ever talking directly to each other.
