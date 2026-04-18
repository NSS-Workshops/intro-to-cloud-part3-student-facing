
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
import whyMicroservices from "./lambda-microservice/why_microservices.md?raw"
import lambdaDeploy from "./lambda-microservice/lambda_deploy.md?raw"

// System explorer chapters
import clientDeploy from "./system-explorer/client_deploy.md?raw";
import testFeature from "./system-explorer/test_feature.md?raw";

// System design chapters
import thinkingInSystems from "./system-design/thinking_in_systems.md?raw";
import architectureBrainstorm from "./system-design/architecture_brainstorm.md?raw";

// SQS worker chapters
import sqsExplained from "./sqs-worker/sqs_explained.md?raw";
import sqsApproach from "./sqs-worker/sqs_approach.md?raw";
import updatingLambda from "./sqs-worker/updating_lambda.md?raw";
import apiWorker from "./sqs-worker/api_worker.md?raw";

// Wrap up chapters
import wrapUp from "./wrap-up/wrap_up.md?raw";


const moduleOneId = nav[0].id;
const moduleTwoId = nav[1].id;
const moduleThreeId = nav[2].id;
const moduleFourId = nav[3].id;
const moduleFiveId = nav[4].id;
const moduleSixId = nav[5].id;
const moduleSevenId = nav[6].id;

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
    title: 'Why Microservices?',
    sectionId: moduleThreeId,
    previousChapterId: null,
    content: whyMicroservices,
    exercise: null
  },
  {
    id: moduleThreeId + "-page-2",
    title: 'Deploying The Lambda Microservice',
    sectionId: moduleThreeId,
    previousChapterId: moduleThreeId + "-page-1",
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
  {
    id: moduleFourId + "-page-2",
    title: 'Testing the Image Upload Feature',
    sectionId: moduleFourId,
    previousChapterId: moduleFourId + "-page-1",
    content: testFeature,
    exercise: null
  },
  {
    id: moduleFiveId + "-page-1",
    title: 'Thinking in Systems',
    sectionId: moduleFiveId,
    previousChapterId: null,
    content: thinkingInSystems,
    exercise: null
  },
  {
    id: moduleFiveId + "-page-2",
    title: 'Architecture Brainstorm',
    sectionId: moduleFiveId,
    previousChapterId: moduleFiveId + "-page-1",
    content: architectureBrainstorm,
    exercise: null
  },
  {
    id: moduleSixId + "-page-1",
    title: 'What is SQS?',
    sectionId: moduleSixId,
    previousChapterId: null,
    content: sqsExplained,
    exercise: null
  },
  {
    id: moduleSixId + "-page-2",
    title: 'The SQS Approach',
    sectionId: moduleSixId,
    previousChapterId: moduleSixId + "-page-1",
    content: sqsApproach,
    exercise: null
  },
  {
    id: moduleSixId + "-page-3",
    title: 'Updating Lambda',
    sectionId: moduleSixId,
    previousChapterId: moduleSixId + "-page-2",
    content: updatingLambda,
    exercise: null
  },
  {
    id: moduleSixId + "-page-4",
    title: 'Building and Deploying the API Worker',
    sectionId: moduleSixId,
    previousChapterId: moduleSixId + "-page-3",
    content: apiWorker,
    exercise: null
  },
  {
    id: moduleSevenId + "-page-1",
    title: 'Wrap Up',
    sectionId: moduleSevenId,
    previousChapterId: null,
    content: wrapUp,
    exercise: null
  },
]