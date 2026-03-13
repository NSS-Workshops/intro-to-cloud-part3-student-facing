Let's deploy our api using CICD and github actions. 

## Create Github Secrets

By now you should be somewhat familiar with the github actions yaml files found under .github/workflows. These files have changed since workshop 2 in a few ways: We are running terraform commands directly in our github runner, we have updated `deploy.yml` to support ecs rather than ec2, and we have added a new `destroy.yml` file. Try using an LLM to explain these files line by line. 

## Create Github Secrets

Try looking at the yaml files to determine which github secrets you need to create in your repository. 

<details>
<summary>Github Secrets Cheat Sheet</summary>

### Required Secrets

-AWS_REGION
-OIDC_ROLE_TO_ASSUME
-ECR_REGISTRY
-ECR_REPOSITORY
-DB_PASSWORD

</details>



## Trigger Github Actions

- Make a commit and push to main. (You may need to add a comment somewhere to allow this)
- The Build & Push Docker Image workflow should trigger automatically. Monitor this for a successful pipeline. 
- Once Build and Push Docker Image is successful. Manually trigger the Deploy to ECS workflow. 
- *DO NOT* trigger the destroy workflow yet! 

## Explore the console 

- Navigate to the ECS console in your AWS account
- Click on the rock-of-ages-api cluster
- Click on the tasks tab. If you are able to see two running tasks, the service deployed successfully! 

Additionally:
- Navigate to the EC2 console
- On the left hand navigation click on target groups and click on the `rock-of-ages-api-tg`
- Here you should see a status "Healthy" 

## Optional Challenge
Currently we only have the health check configured on our target group. If you navigate back to your tasks in ECS you will see health status as unknown. 
Use whatever tools at your disposal, including LLMs, to make an update to your terraform configuration that would allow us to see health status on individual tasks. You will need to re-run the `terraform apply` command after making your configuration change 


## At the end of each class
From here on out during this workshop, the instructor will remind you at the end of class to trigger the destroy github actions workflow. The reason we are doing this is because the cost of the services associated with ECS and RDS will begin to add up quite a lot for multiple student accounts throughout the course of this workshop. We ask that you destroy after every class and redeploy your api at the beginning of each class. We have tried to make this as seamless and automated as possible using github actions workflows so that it will only take a few clicks which further demonstrates the power of github actions and automated CICD practices. 