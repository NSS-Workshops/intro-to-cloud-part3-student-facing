
import { Checkpoint } from '@nss-workshops/nss-core';


import {nav} from "./nav.js";
// AWS S3 hosting chapters
import exampleModuleOnePageOne from "./example_module_1/page_one.md?raw";
import exampleModuleOnePageTwo from "./example_module_1/page_two.md?raw";
import exampleExcerciseOne from "./example_module_1/exercise_1.js?raw";
import exampleSolutionOne from "./example_module_1/solution_one.js?raw";
import {questions as questions} from "./example_module_1/questions_1";
import {tests as t1} from "./example_module_1/tests_1.js";

// CloudFront chapters
import exampleModuleTwoPageOne from "./example_module_2/page_one.md?raw";
import exampleModuleTwoPageTwo from "./example_module_2/page_two.md?raw";
import exampleExcerciseTwo from "./example_module_2/excersize_2.js?raw";
import exampleSolutionTwo from "./example_module_2/solution_2.js?raw";
import {tests as t2} from "./example_module_2/tests_2.js";

const moduleOneId = nav[0].id;
const moduleTwoId = nav[1].id;

export const chapters = [
  {
    id: moduleOneId + "-page-1",
    title: 'Example page 1',
    sectionId: moduleOneId,
    previousChapterId: null,
    content: exampleModuleOnePageOne,
    exercise: {
      starterCode:exampleExcerciseOne,
      solution:exampleSolutionOne,
      tests: t1
    },
    quiz: {component: () => <>
       <h1>Checkpoint</h1>
       <Checkpoint questions={questions}/>
     </>
    }
  },
  {
    id: moduleOneId + "-page-2",
    title: 'Example page 2',
    sectionId: moduleOneId,
    previousChapterId:  moduleOneId + "-page-1",
    content: exampleModuleOnePageTwo,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-1",
    title: 'Example page 1',
    sectionId: moduleTwoId,
    previousChapterId: null,
    content: exampleModuleTwoPageOne,
    exercise: null
  },
  {
    id: moduleTwoId + "-page-2",
    title: 'Example page 2',
    sectionId: moduleTwoId,
    previousChapterId: moduleTwoId + "-page-1",
    content: exampleModuleTwoPageTwo,
    exercise: {
      starterCode: exampleExcerciseTwo,
      solution: exampleSolutionTwo,
      tests: t2
    },
  },
]