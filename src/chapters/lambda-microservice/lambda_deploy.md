Lets complete our backend setup by deploying our lambda microservice for resizing images! 

## Get the repo


[thumbnail-microservice](https://github.com/NSS-Workshops/thumbnail-microservice)

1. Go to the repo and click the green "Use this template" button at the top and choose "Create a new repository". 
2. In the dropdown under *Owner*, choose your github account. 
3. You can use the same Repository name or create your own. Click "Create Repository"

Clone your repo locally 

## Explore the project

Use an LLM to help walk you through the project. The lambda function itself is in `lambda_function.py`. Explore the terraform configuration and github workflows as well. Make sure to jot down any unanswered questions to ask your instructor. 

## Update Variables

1. In the project, navigate to terraform/variables.tf 
2. Replace `your-image-bucket-name` with the same name you used for your s3 bucket to hold images that was created as part of the api repository.  

## Create Github Secrets

Try looking at the yaml files to determine which github secrets you need to create in your repository. 

<details>
<summary>Github Secrets Cheat Sheet</summary>

### Required Secrets

-AWS_REGION
-OIDC_ROLE_TO_ASSUME

</details>

## Trigger deployment

1. Make a push to main
2. In github, go to actions and find the workflow. Verify it is completed and successful.
3. In the AWS console, navigate to the lambda dashboard.
4. Verify that your lambda has been created. 

