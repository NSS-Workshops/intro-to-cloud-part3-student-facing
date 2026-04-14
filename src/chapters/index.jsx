
import { Checkpoint } from '@nss-workshops/nss-core';


import {nav} from "./nav.js";
// setup chapter
import accountSetup from "./setup/account_setup.md?raw";
import backendState from "./setup/backend_state.md?raw";

// ECS chapters
import ecsExplained from "./ecs/ecs_explained.md?raw";
import ecsTerraform from "./ecs/ecs_terraform.md?raw";
import apiDeploy from "./ecs/api_deploy.md?raw";

// Microservices chapters
import lambdaDeploy from "./lambda-microservice/lambda_deploy.md?raw"

// Exploring the system chapters
import clientDeploy from "./system-explorer/client_deploy.md?raw";


const moduleOneId = nav[0].id;
const moduleTwoId = nav[1].id;
const moduleThreeId = nav[2].id;
const moduleFourId = nav[3].id;

export const chapters = [
  {
    id: moduleOneId + "-page-1",
    title: 'Account Setup',
    sectionId: moduleOneId,
    previousChapterId: null,
    content: accountSetup,
    exercise: null
  },
  {
    id: moduleOneId + "-page-2",
    title: 'Setting Up for Backend State',
    sectionId: moduleOneId,
    previousChapterId:  moduleOneId + "-page-1",
    content: backendState,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-1",
    title: 'What is ECS?',
    sectionId: moduleTwoId,
    previousChapterId: null,
    content: ecsExplained,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-2",
    title: 'ECS in Terraform',
    sectionId: moduleTwoId,
    previousChapterId: moduleTwoId + "-page-1",
    content: ecsTerraform,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-3",
    title: 'Deploying to ECS',
    sectionId: moduleTwoId,
    previousChapterId: moduleTwoId + "-page-2",
    content: apiDeploy,
    exercise: null
  },
  {
    id: moduleThreeId + "-page-1",
    title: 'Deploying The Lambda Microservice',
    sectionId: moduleThreeId,
    previousChapterId: null,
    content: lambdaDeploy,
    exercise: null
  },
  {
    id: moduleFourId + "-page-1",
    title: 'Deploying the Client',
    sectionId: moduleFourId,
    previousChapterId: null,
    content: clientDeploy,
    exercise: null
  },
]