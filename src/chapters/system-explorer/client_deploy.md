Now, we are ready to deploy our client and test our new image upload feature end-to-end

## Get the repo


[rock-of-ages-client-cloud3](https://github.com/NSS-Workshops/rock-of-ages-client-cloud3)

1. Go to the repo and click the green "Use this template" button at the top and choose "Create a new repository". 
2. In the dropdown under *Owner*, choose your github account. 
3. You can use the same Repository name or create your own. Click "Create Repository"

Clone your repo locally 

## Explore the project

Check out the new service in `src/services/rockImageService.js`. Here you'll find all of our api calls pertaining to the new image feature. There is also a new `RockImage.jsx` component. And, as usual, reacquaint yourself with the terraform and .github/workflow files. 

## Update Variables

1. In the project, navigate to terraform/variables.tf 
2. Replace `your-unique-client-bucket-name` with a unique bucket name to host our client front end. 

## Create Github Secrets

Try looking at the yaml files to determine which github secrets you need to create in your repository. 

<details>
<summary>Github Secrets Cheat Sheet</summary>

### Required Secrets

-AWS_REGION
-OIDC_ROLE_TO_ASSUME

</details>

## Trigger deployment

1. Update `.env` by replacing `<your-alb-dns-name>` 
2. Make a push to main
3. In github, go to actions and find the workflow. Verify it is completed and successful.
4. In the AWS console, navigate to the s3 dashboard.
5. Verify that your s3 client bucket has been created. 

## Test End to End 

1. Go to the cloudfront dashboard and get your cloudfront domain.
2. Navigate to the domain in your browser, remember to force http in the url and update your site settings to allow you to do this 

