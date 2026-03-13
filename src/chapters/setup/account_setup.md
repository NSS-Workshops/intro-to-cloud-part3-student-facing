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

This tells your terminal session to point to your newly created credentials


## Run Terraform Commands

- With the CLI, SSO into your AWS account using `aws sso login --profile=intro_to_cloud_3`
- Run `terraform init`, `terraform validate`, `terraform plan`, and `terraform apply` commands from the rock-of-ages-infra-cloud3 project directory in your terminal. 
- It is normal for terraform apply to take a few minutes. 