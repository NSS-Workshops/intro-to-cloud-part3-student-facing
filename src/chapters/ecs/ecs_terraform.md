You will often see terraform configurations that pertain to a project stored in the same repository as the application code. This makes it easy to integrate terraform commands into our CICD process and Github actions. 

## Get the repo

We have created a new repo for our rock of ages api that has updates supporting the new image upload feature. It also includes all the relevant terraform configurations used by this repository in a terraform directory within the project. 

[rock-of-ages-api-with-ecs](https://github.com/NSS-Workshops/rock-of-ages-api-with-ecs)

1. Go to the repo and click the green "Use this template" button at the top and choose "Create a new repository". 
2. In the dropdown under Owner, choose your github account. 
3. You can use the same Repository name or create your own. Click "Create Repository"

Clone your repo locally 

## Explore the project

 Explore the files in the terraform directory. You will see some familiar terraform configurations as well as some new ones pertaining to ECS. Use an LLM to get reacquainted with the terraform files. Paste a file in the LLM and prompt with something like "Can you explain what this terraform is doing? Break it down for me line by line". Try this especially with the new `ecs.tf` file and `network.tf` files as these will contain the most differences from what you've seen so far. 

 You can also explore the new changes pertaining to the rock image feature. Check out `models/rock_image.py` and `views/rock_image_view.py`.




