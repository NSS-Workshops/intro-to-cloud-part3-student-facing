
Welcome to **Intro to Cloud Part 3**! This workshop is where things get real. You'll move beyond deploying a single server and into the world of **cloud native design** — building a system made of independent, specialized services that communicate with each other asynchronously.

The thread running through the entire workshop is a concrete feature: **image uploads for the Rock of Ages app**. You won't just be setting up infrastructure in isolation — you'll be building something, watching it partially work, identifying what's missing, designing a solution, and shipping it end-to-end. That's what engineering actually looks like.

This workshop also represents the closest thing to a **real production setup** you'll encounter in this series. Terraform runs inside GitHub Actions CI/CD pipelines, backend state is managed remotely, the API runs on ECS with a load balancer, and services communicate through an event-driven message queue. If you end up working with AWS professionally, this architecture won't be unfamiliar.

Fair warning: **this workshop will stretch your brain.** There will be moments where the system feels large, the pieces aren't obviously connected, and you're not sure what's missing. That's intentional. Sit with the confusion — it's a sign you're building real mental models, not just following steps.

## 📝 Summary

Here's what you'll learn:

- What **cloud native design** means and how it differs from simply moving an app to the cloud
- How to run containerized applications at scale using **ECS (Elastic Container Service)** with **Fargate**
- How to break functionality into independent services — the **microservices** pattern
- How to use **AWS Lambda** as an event-driven microservice for image resizing
- What **event-driven architecture** is and how services can react to things that happen rather than waiting to be called
- How services decouple using a **message queue** — specifically **Amazon SQS**
- How to run **Terraform inside CI/CD pipelines** using GitHub Actions and OIDC authentication
- How to manage Terraform **backend state** remotely so pipelines can safely apply infrastructure changes
- How to **read and draw architecture diagrams** that map out distributed systems
- How to think through **systems design** — identifying gaps, proposing solutions, and weighing tradeoffs

You'll work hands-on with **Amazon Web Services (AWS)** including:
- **ECS + Fargate** (container orchestration)
- **ECR** (Elastic Container Registry)
- **ALB** (Application Load Balancer)
- **Lambda** (Serverless Functions / microservice)
- **S3** (object storage — images and frontend hosting)
- **CloudFront** (CDN for the client)
- **SQS** (Simple Queue Service)
- **RDS** (Relational Database Service)
- **IAM** (Identity and Access Management)
- **GitHub Actions** (CI/CD pipelines running Terraform)

You'll come away thinking in systems — not just deploying apps.




## 🗓️ Course Structure

- **Live Zoom Sessions**: 2 sessions per week, each 2 hours long
- **Slack Channel**: For discussions, announcements 
    - Slack Channel: Join the conversation, ask questions, and stay updated.
    Look for: #cloud-deployment-fundamentals-{your cohort number} — for example, Cohort One = #cloud-deployment-fundamentals-01
- **Session Format**:
  - **Hour 1**: Learn core concepts and collaboratively set up resources in the cloud (instructor-supported)
  - **Hour 2**: Instructor-led walkthroughs, with discussion and deeper insights
- **How to reach us**
  - Got a question? The #help channel on Slack is the perfect place to ask!

---
## 📚 Session Breakdown

There will be seven class sessions held on Zoom.


#### Session 1: CLI Setup and Backend State

Before we can run Terraform in a CI/CD pipeline, we need a foundation for managing Terraform state remotely. This is the one piece of infrastructure we apply manually — everything after this runs through GitHub Actions.

- AWS CLI setup and SSO configuration
- What is Terraform backend state, and why does it matter for pipelines?
- The "chicken and egg" problem: why backend state has to exist before the pipeline can run
- Cloning and applying the `backend-bootstrap` repo
- Validating your S3 bucket, DynamoDB lock table, and GitHub OIDC role in the AWS console and CLI

#### Session 2: ECS and Fargate — Running the API at Scale

In the previous workshops, the Rock of Ages API ran on a single EC2 instance. That works, but it has real limitations. This session introduces **ECS with Fargate** — a much more production-realistic way to run containerized applications.

- What is ECS, and what problem does it solve?
- Fargate vs. EC2 launch type — why we use Fargate
- ECS concepts: clusters, task definitions, tasks, and services
- How a load balancer distributes traffic across multiple running tasks
- Why ECS gives you scaling, self-healing, and zero-downtime deploys that EC2 alone can't
- Deploying the Rock of Ages API to ECS using Terraform running in GitHub Actions

#### Session 3: Microservices and Lambda

The image upload feature requires resizing photos into multiple thumbnail sizes. Rather than doing this inside the Django API, we're going to build a dedicated Lambda function. This session explains why that's the right call — and how to ship it.

- What is a microservice?
- Why break functionality into separate services? (Scalability, fault isolation, independent deployability)
- The honest tradeoffs — microservices aren't free
- Synchronous vs. asynchronous communication between services
- Why image resizing is a perfect Lambda use case
- Deploying the thumbnail microservice via GitHub Actions

#### Session 4: System Exploration — Deploy the Client and Test the Feature

Now that the API and Lambda microservice are deployed, it's time to get the full system running and test the image upload feature end-to-end. Things will work — up to a point.

- Deploying the React client to S3 + CloudFront via GitHub Actions
- Walking through the image upload flow in the browser
- What happens when you upload an image: the presigned URL flow, the S3 event trigger, Lambda running in the background
- Watching the feature fail: thumbnails are generated, but the database record never updates
- Identifying the **gap** in our distributed system

#### Session 5: Systems Design — Finding the Solution

The gap we found in Session 4 is a real systems design problem: This session is hands-on thinking work, not coding.

- What is systems design, and why do engineers spend so much time on it?
- How to read and draw architecture diagrams
- **Group exercise**: in small teams, brainstorm and sketch out one or two solutions to the gap we identified. 
- Class debrief: teams share their approaches, and the instructor walks through the pros, cons, and real-world implications of each

This is the session that most closely resembles a real engineering design conversation. Come ready to think out loud.

#### Session 6: SQS — Decoupling Services with a Message Queue

After exploring the options, we'll land on using **Amazon SQS** as the bridge between Lambda and the API. This session explains what SQS is, why it's the right fit, and how to read the architecture that reflects our chosen approach.

- What is a message queue, and how does it work?
- SQS concepts: producers, consumers, visibility timeout, durability, long polling
- How SQS decouples services — the sender doesn't need to know who's listening
- Reading the updated architecture diagram: tracing the new message flow from Lambda → SQS → API worker
- Understanding the approach we're taking and why

#### Session 7: Finishing the Feature — Lambda, the API Worker, and End-to-End Testing

The final session pulls everything together. We update Lambda to publish to SQS, update the API to consume from it, and test the full image upload flow from browser to database.

- Updating the Lambda function to publish a completion message to SQS
- Updating the Terraform to create the SQS queue and wire up permissions
- Adding a background worker to the Django API to poll SQS and update `RockImage` status
- Triggering deployments and watching the pieces connect
- Testing the feature end-to-end in the browser
- Diagramming the final architecture — the complete, working system

---

## Course Completion Requirements
- Attendance:  
    - An 80% attendance rate is expected. Students must inform the instructor of any planned absence. 
    - Students who miss two consecutive sessions without prior notification to the instructor will be considered dropped from the course. 
- Final Assessment: one-on-one meeting with an instructor
    - Students will be required to show that they have set up the AWS services covered throughout the course. 
    - Students will answer a few "interview" questions to show that they can discuss what they've learned and use the vocabulary correctly. We are not expecting mastery just a basic understanding of the concepts. 
