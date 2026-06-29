This glossary contains important terms and concepts discussed in the Microservices module. Understanding them will help solidify and deepen your understanding.

| Term | Definition |
|------|------------|
| Microservice | A small, self-contained piece of software that does one thing and does it well. Microservices run and deploy independently from the rest of the system and communicate through well-defined interfaces. |
| Monolith | A single, large application that handles all responsibilities — authentication, data storage, business logic, image processing, notifications, and more — in one deployable unit. |
| Fault Isolation | The property of a distributed system where a failure in one service is contained and does not bring down the rest of the system. If the image processing service has a bug, users can still log in and use the app. |
| Independent Deployability | The ability to deploy one service without touching or redeploying any other. Each microservice can be updated, rolled back, or replaced on its own schedule. |
| Synchronous Communication | A pattern where one service calls another and waits for a response before continuing. Simple and predictable, but it means the caller is dependent on the called service being available and responsive. |
| Asynchronous Communication | A pattern where one service fires off a message or event and moves on without waiting. The receiving service processes the message on its own time. Services are loosely coupled and don't depend on each other's availability. |
| Event-Driven Architecture | A design pattern where services react to events — things that have already happened — rather than being called directly. An S3 upload completing, for example, is an event that can automatically trigger downstream work. |
| S3 Event Trigger | A notification that S3 fires when something happens in a bucket, such as a new object being created. AWS services like Lambda can subscribe to these events and run automatically in response. |
| Lambda Function | A serverless function that runs in response to a trigger. You provide the code; AWS handles provisioning, scaling, and execution. Lambda functions are billed only for the time they actually run. |
| OIDC (OpenID Connect) | An authentication protocol that allows GitHub Actions to prove its identity to AWS without storing long-lived credentials as secrets. Instead of an access key, GitHub receives a short-lived token scoped to a specific IAM role. |
| Execution Role | The IAM role that a Lambda function assumes when it runs. The permissions attached to this role determine what AWS services and resources the function is allowed to access. |
