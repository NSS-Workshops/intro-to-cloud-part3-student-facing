This glossary contains important terms and concepts discussed in the ECS module. Understanding them will help solidify and deepen your understanding.

| Term | Definition |
|------|------------|
| ECS (Elastic Container Service) | AWS's service for running and managing Docker containers in the cloud. ECS handles scheduling, scaling, and health monitoring of your containers so you don't have to manage servers manually. |
| Fargate | A serverless compute engine for containers. With Fargate, you don't provision or manage EC2 instances — you specify CPU and memory requirements and AWS runs your containers on infrastructure it manages entirely. |
| EC2 Launch Type | An alternative to Fargate where you provision and manage a fleet of EC2 instances yourself. ECS schedules containers onto those machines, but you remain responsible for patching, sizing, and maintaining the underlying servers. |
| Cluster | The logical grouping that organizes everything in ECS. A cluster is the boundary for your tasks and services — it doesn't run anything itself, it just keeps related resources together. |
| Task Definition | A blueprint that describes how to run a container. It specifies which Docker image to use, how much CPU and memory to allocate, which ports to expose, environment variables, and where to send logs. |
| Task | A running instance of a task definition. When ECS launches a container based on your task definition, that running container is called a task. Tasks are ephemeral — if they crash, they're gone. |
| Service | The ECS resource that keeps a specified number of tasks running at all times. If a task crashes, the service automatically launches a replacement. Services also manage rolling deployments and integrate with a load balancer. |
| Application Load Balancer (ALB) | Distributes incoming HTTP/HTTPS traffic evenly across all healthy running tasks in a service. The ALB is what allows your API to handle many users simultaneously without any single task becoming a bottleneck. |
| ECR (Elastic Container Registry) | AWS's managed Docker image registry. Your CI/CD pipeline builds a Docker image and pushes it to ECR. ECS task definitions reference images stored in ECR. |
| Rolling Deployment | A deployment strategy where new tasks running an updated image are started before old tasks are stopped. This allows ECS to update your application with zero downtime. |
| Configuration Drift | The gradual divergence of a server's actual state from its expected or intended state, caused by manual changes accumulating over time. Containers eliminate this problem because every deployment starts from a clean, reproducible image. |
