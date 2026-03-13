You will often see terraform configurations that pertain to a certain project stored in the same repository. This makes it easy to integrate terraform commands into our CICD process and Github actions. 

## Get the repo

We have created a new repo for our rock of ages api that has updates supporting the new image upload feature. It also includes all the relevant terraform configurations used by this repository in a terraform directory within the project. 

Go to this repo and click the green "Use this template" button at the top and choose "Create a new repository". In the dropdown under Owner, choose your github account. You can use the same Repository name or create your own. Click "Create Repository"

[rock-of-ages-api-with-ecs](https://github.com/NSS-Workshops/rock-of-ages-api-with-ecs)

Clone your repo locally 

## Explore the project

 Explore the files in the terraform directory. You will see some familiar terraform configurations as well as some new ones pertaining to ECS. Use an LLM to get reacquainted with the terraform files. Paste a file in the LLM and prompt with something like "Can you explain what this terraform is doing? Break it down for me line by line". Try this especially with the new `ecs.tf` file and `network.tf` files as these will contain the most differences from what you've seen so far. 

 You can also explore the new changes pertaining to the rock image feature. Check out `models/rock_image.py` and `views/rock_image_view.py`.

## Update Variables

1. In the project, navigate to variables.tf 
2. Replace `your-unique-storage-bucket-name` with a unique name. This is the bucket that will hold our client project. Suggestion: "rock-of-ages-client-bucket-initials" replace initials with your initials.  
3. Replace `your-unique-storage-bucket-name` with a unique name. This bucket will hold the images we upload from the client. We will cover this in later chapters. Suggestion: "rock-of-ages-images-initials" replace initials with your initials 
4. Replace `your-github-username` with your github username. Remember this is case sensitive. This is for our github oidc role making it possible to use github actions later 

You may have noticed we are not storing our database password in a terraform.tfvars file. This file is great for storing sensitive passwords when we run terraform locally since we can include it in our .gitignore file. We will include our database password in our github secrets in later steps. 




