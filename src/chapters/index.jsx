
import { Checkpoint } from '@nss-workshops/nss-core';


import {nav} from "./nav.js";
// setup chapter
import accountSetup from "./setup/account_setup.md?raw";
import backendState from "./setup/backend_state.md?raw"

// ECS chapters
import ecsTerraform from "./ecs/ecs_terraform.md?raw";
import apiDeploy from "./ecs/api_deploy.md?raw";

const moduleOneId = nav[0].id;
const moduleTwoId = nav[1].id;

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
    title: 'ECS in Terraform',
    sectionId: moduleTwoId,
    previousChapterId: null,
    content: ecsTerraform,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-2",
    title: 'Deploying to ECS',
    sectionId: moduleTwoId,
    previousChapterId: moduleTwoId + "-page-1",
    content: apiDeploy,
    exercise: null
  },
]