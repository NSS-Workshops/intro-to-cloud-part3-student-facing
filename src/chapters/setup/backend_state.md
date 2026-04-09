

## Get the repo

For this workshop, you will see later that we have divided our terraform configurations between our project repositories. This is a common design you will see at some companies as it allows for easier integration of terraform into CICD pipelines and github actions. 

But here we run into a chicken or the egg scenario. We need a backend state configuration to run terraform in github actions, therefore the backend state configuration needs to already exist before we run our actions. Therefore, this will be the only terraform config that we apply manually (locally) in this workshop. 

Repo: [backend-bootstrap](https://github.com/NSS-Workshops/backend-bootstrap)

1. Go to the repo and click the green "Use this template" button at the top and choose "Create a new repository". 
2. In the dropdown under *Owner*, choose your github account. 
3. You can use the same Repository name or create your own. Click "Create Repository"

- Clone your repo locally

## Update Variables

In `variables.tf` update `your-github-username` to your username and update `rock-of-ages-terraform-state-your-initials` to include your initials at the end. Remember s3 bucket names must be globally unique and your github username IS case sensitive. 



## Configure AWS CLI Using Session Token

1. Install the aws cli (If you have not already installed):
  -For mac users: `brew install awscli`
  -For windows users [Download the installer from aws](https://awscli.amazonaws.com/AWSCLIV2.msi)
  -Check that the cli is installed with `aws --version`

2. Configure your AWS CLI profile. You can run this from any directory in your terminal.

    ```bash
    aws configure sso
    ```

Follow the prompts to set up your sso profile. You will need the values listed here:
  - You can name the session anything e.g. `cloud3-session`
  - If prompted for Sso registration scopes just press enter
  - The start url will be `https://nss-se.awsapps.com/start/` (This will redirect you to aws login in the browser. Login and and click allow access)
  - Choose the `intro_to_cloud_3` role.
  - Set the region to `us-east-2`.
  - The output format will be `json`.
  - Name the profile after the role `intro_to_cloud_3`.
  - There should only be one account available to you, the cli should automatically use that account number.

Run:
```bash
export AWS_PROFILE=intro_to_cloud_3
```

This tells your terminal session to point to your newly created credentials. 

## Run Terraform Commands

- With the CLI, SSO into your AWS account using `aws sso login --profile=intro_to_cloud_3`
- In your backend-bootstrap directory, run `terraform init`, `terraform validate`, `terraform plan`, and `terraform apply` commands from the backend-bootstrap project directory in your terminal. Enter `yes` when prompted. 
- If you run into any terraform errors, please reach out to your instructor. 

## Validate the Terraform 

Validate with the console:
  - Navigate to s3 in the AWS console and confirm your bucket was created. (make sure us-east-2 is set as your region)
  - Navigate to dynamoDB in the console and confirm that your state locking table was created. 
  - Navigate to IAM -> Roles -> github_oidc 

Validate with the CLI:
  - run `aws s3 ls` and you should see the name of your bucket in your terminal
  - run `aws dynamodb list-tables`
  - run `aws iam list-roles` 


Now that this terraform is applied, we will not touch this project again for the remainder of the workshop. 