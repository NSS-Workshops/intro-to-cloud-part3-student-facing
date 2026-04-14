
Before we start deploying, let's take a step back and understand what ECS actually is and why we're using it.

## What is ECS?

**ECS (Elastic Container Service)** is AWS's service for running Docker containers in the cloud. You already know how to run a containerized application on a single server (EC2). ECS takes that further — it manages *where* your containers run, keeps them healthy, restarts them if they crash, and can even scale them up or down based on traffic.

Think of ECS as a **manager for your containers**. Instead of you manually SSH-ing into a server and running `docker run`, ECS handles all of that for you automatically.

## Fargate vs. EC2

When you run containers with ECS, you have to decide *what kind of infrastructure runs them*. There are two options:

### EC2 Launch Type
You provision and manage a fleet of EC2 virtual machines yourself. ECS schedules your containers onto those machines, but you are responsible for the servers — patching them, sizing them, paying for them whether they're busy or idle.

### Fargate Launch Type
You don't manage any servers at all. You simply tell AWS "I need a container with 1 vCPU and 2GB of memory" and AWS figures out where to run it. You only pay for the resources your container actually uses while it's running.

> **In this workshop we use Fargate.** It's the more cloud native choice — you focus on your application, not on managing servers. This is a core idea in cloud native design: offload as much infrastructure management to the cloud provider as possible.

## Clusters

A **cluster** is the logical grouping that holds everything together in ECS. Think of it as a workspace or a project boundary. All the containers related to your application live inside a cluster.

In your Terraform configuration you'll see a resource that creates a cluster — ours is called `rock-of-ages-api`. The cluster itself doesn't run anything, it's just the container (no pun intended) that organizes your tasks and services.

## Task Definitions

A **task definition** is a blueprint that describes how to run your container. It answers questions like:
- Which Docker image should be used?
- How much CPU and memory does it need?
- What environment variables should be set?
- Which ports should be exposed?
- Where should logs be sent?

You can think of a task definition like a recipe. The recipe doesn't make food by itself — it just describes *how* to make it.

## Tasks

A **task** is a running instance of a task definition — it's the recipe actually being cooked. When ECS launches a container based on your task definition, that running container is called a task.

Tasks are ephemeral. If a task crashes or is stopped, it's gone. That's why we don't rely on a single task staying alive forever — instead, we use a **service** to make sure the right number of tasks are always running.

## Services

A **service** is what keeps your tasks alive and running. You tell the service "I want 2 running instances of this task definition at all times." If one task crashes, the service automatically launches a replacement. If you want to deploy a new version of your app, the service handles swapping out old tasks for new ones with zero downtime.

Services also integrate with a **load balancer**, which distributes incoming requests evenly across all your running tasks. This is how your API can handle many users at once — instead of one server doing all the work, requests are spread across multiple tasks.

## Why ECS Instead of a Plain EC2 Instance?

In the previous workshops you deployed the Rock of Ages API to a single EC2 instance. That worked, but it comes with real limitations that you'd run into quickly in a production system. Here's why ECS (and containerized deployments in general) is a better fit as your application grows.

### Scaling

With a single EC2 instance, you have one server handling every request. If traffic spikes — say, many users hit the app at the same time — that server can become overwhelmed and slow down or crash.

With ECS, you can run **multiple tasks simultaneously** and put a load balancer in front of them to distribute traffic. If you need more capacity, you increase the desired task count and ECS spins up more containers automatically. When traffic drops, you scale back down. You're not paying for idle capacity, and your users aren't hitting a bottleneck.

### Durability

If your EC2 instance crashes or the underlying hardware has a problem, your app is down until you manually intervene. That might mean waking up at 3am to restart a server.

ECS services **continuously monitor your running tasks**. If a task crashes or becomes unhealthy, the service automatically replaces it — usually within seconds — without any action from you. This kind of self-healing behavior is a hallmark of cloud native systems.

### Maintainability

Keeping an EC2 instance healthy over time is ongoing work. You have to patch the operating system, manage software versions, and make sure nothing drifts out of its expected configuration. This is sometimes called **configuration drift** — over time a server accumulates changes that make it hard to reproduce or reason about.

With containers, your entire runtime environment is defined in a `Dockerfile` and rebuilt from scratch on every deployment. Every task runs from the same image, there's no drift, and rolling back to a previous version is just a matter of deploying an older image. Deployments become predictable and repeatable.

### Deployment Safety

Updating an app on a single EC2 instance means there's a window where your app is down or partially updated. ECS services support **rolling deployments** — new tasks running the updated image are started before old ones are stopped. Your users experience no downtime during a release.

### The Bigger Picture

| | Single EC2 | ECS + Fargate |
|---|---|---|
| Handles traffic spikes | No — one server has a fixed limit | Yes — scale out tasks on demand |
| Recovers from crashes | No — manual restart required | Yes — service replaces failed tasks automatically |
| OS/server maintenance | Your responsibility | Managed by AWS (Fargate) |
| Consistent deployments | Hard — server state accumulates | Yes — every deploy starts from a clean image |
| Zero-downtime deploys | Requires extra setup | Built in via rolling updates |

None of this means EC2 is the wrong tool — it has its place. But for running application workloads in a modern, scalable way, ECS gives you a much stronger foundation with far less operational burden.

---

## How It All Fits Together

```
Cluster: rock-of-ages-api
└── Service: rock-of-ages-api-service
    ├── Task (running container) ──┐
    └── Task (running container) ──┴──> Load Balancer ──> Internet
```

1. You push your Docker image to a container registry (ECR).
2. Your task definition points to that image.
3. Your service ensures 2 tasks are always running from that definition.
4. A load balancer sits in front and routes traffic to whichever task is available.
5. If a task goes down, the service replaces it automatically.

This setup is far more resilient than running your app on a single EC2 instance. There's no single point of failure, updates can be deployed without downtime, and the infrastructure largely manages itself.


<iframe width="560" height="315" src="https://www.youtube.com/embed/I9VAMGEjW-Q?si=aQk6CpI1hKCZMzoz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>