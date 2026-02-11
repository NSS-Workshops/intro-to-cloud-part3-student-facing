# Curriculum Site Template

A React-based template for creating student-facing curriculum workshop site with interactive exercises, quizzes, and content management.

## Quick Start

### Prerequisites

First-time setup for a project that depends on **nss-core**:

- Create and set your **NPM token (`NPM_TOKEN`)** as described [here](https://github.com/NSS-Workshops/platform?tab=readme-ov-file#installation-consumer-projects-installation)

### Installation

1. **Create environment variables**:
   Create a `.env.local` file in the project root use .env.template as a base and fill in the values:
   ```
   VITE_LEARNING_PLATFORM_API=http://localhost:8000
   ```

   If authentication is enabled (see Configuration section), also add:
   ```
   VITE_OAUTH_CLIENT_ID=your_oauth_client_id
   VITE_PROXY_DOMAIN=your_proxy_domain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173/[course-name]/` where `[course-name]` is derived from your `courseName` configuration.

## Using This Template

This repository serves as a template for creating new workshop curriculum sites. Here's how to get started:

### 1. Configuration Setup

Edit [`src/config.js`](src/config.js) to customize your course:

```javascript
const config = {
  oauthClientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
  proxyDomain: import.meta.env.VITE_PROXY_DOMAIN,
  baseUrl: import.meta.env.BASE_URL,
  learningPlatformApi: import.meta.env.VITE_LEARNING_PLATFORM_API,
  courseName: "Your Course Name Here", // Change this
  doAuth: false, // Set to true if you need authentication
};
```

#### Configuration Options

- **`courseName`** (string): The display name of your course. Used as the HTML page title and throughout the application. Automatically converted to URL-friendly format (lowercase, spaces to hyphens).

- **`doAuth`** (boolean): 
  - `true`: Enables authentication features, requires OAuth environment variables
  - `false`: Disables authentication for simpler deployment

# Enable GitHub Actions for This Repo

When you create a new repository from this template, GitHub copies all workflow files  
(in `.github/workflows/`) but **does not copy secrets or workflow permissions**.  
Follow these steps to get GitHub Actions fully working.

## ✅ Step 1. Enable GitHub Actions

1. Go to your repository on GitHub.  
2. Click the **Actions** tab (top navigation bar).  
3. If you see a yellow banner saying “Workflows aren’t being run on this fork/template yet,”  
   click **“I understand my workflows, enable them.”**  
4. If you see **“Enable GitHub Actions”** — click it to activate workflows.  

Your repo is now allowed to run GitHub Actions.

## 🧱 Step 3. Verify Workflow Permissions

1. Go to **Settings → Actions → General**  
2. Scroll to **Workflow permissions**  
3. Choose **“Read and write permissions”**  
4. Check ✅ **“Allow GitHub Actions to create and approve pull requests”**

### 2. Course Structure Setup

#### Navigation Configuration

Edit [`src/chapters/nav.js`](src/chapters/nav.js) to define your course modules:

```javascript
export const nav = [
  {
    id: "module-1", // Unique identifier for the module
    title: "Module 1 Title",
    description: "Brief description of what this module covers",
    required: true, // Whether completion is required
  },
  {
    id: "module-2",
    title: "Module 2 Title", 
    description: "Another module description",
    required: true,
  },
]
```

#### Chapter Content Configuration

Edit [`src/chapters/index.jsx`](src/chapters/index.jsx) to define your course content. This file demonstrates two important import patterns:

**Raw Imports (for content files):**
```javascript
// Use ?raw suffix for markdown content and code files that should be displayed as text
import pageContent from "./module_1/page_one.md?raw";
import exerciseCode from "./module_1/exercise_1.js?raw";
import solutionCode from "./module_1/solution_1.js?raw";
```

**Module Imports (for executable code):**
```javascript
// Import without ?raw for JavaScript modules that export functions/objects
import {tests as t1} from "./module_1/tests_1.js";
import {questions as q1} from "./module_1/questions_1.jsx";
```

### 3. Creating Course Content

For each module, create a directory structure like:

```
src/chapters/
├── nav.js                    # Module navigation configuration
├── index.jsx                 # Chapter definitions and imports
└── your_module_name/
    ├── page_one.md          # Markdown content (imported with ?raw)
    ├── page_two.md          # Additional pages as needed
    ├── exercise_1.js        # Starter code (imported with ?raw)
    ├── solution_1.js        # Solution code (imported with ?raw)
    ├── tests_1.js           # Test cases (imported as module)
    └── questions_1.jsx      # Quiz questions (imported as module)
```

#### Content File Types

**Markdown Files (`.md`)** - Course content:
- Import with `?raw` suffix
- Contains lesson content, explanations, instructions
- Supports standard markdown syntax

**Exercise Files (`.js`)** - Starter code:
- Import with `?raw` suffix
- Contains incomplete code for students to complete
- Displayed in the code editor

**Solution Files (`.js`)** - Complete solutions:
- Import with `?raw` suffix  
- Contains working solutions to exercises
- Used for validation and instructor reference

**Test Files (`.js`)** - Automated testing:
- Import as JavaScript modules (no `?raw`)
- Must export a `tests` array
- Each test object should have `name`, `test` function, and `message`

**Question Files (`.jsx`)** - Quiz questions:
- Import as JavaScript modules (no `?raw`)
- Must export a `questions` array
- Used with the Checkpoint component for quizzes

### 4. Chapter Configuration

In [`src/chapters/index.jsx`](src/chapters/index.jsx), define your chapters:

```javascript
export const chapters = [
  {
    id: "unique-chapter-id",
    title: "Chapter Title",
    sectionId: "module-id", // Must match nav.js module id
    previousChapterId: null, // or "previous-chapter-id"
    content: markdownContent, // Imported markdown
    exercise: {
      starterCode: exerciseCode,
      solution: solutionCode,
      tests: testArray
    },
    quiz: {
      component: () => <Checkpoint questions={questionArray}/>
    }
  }
]
```

### 5. Environment Variables

The template supports these environment variables:

**Required:**
- `VITE_LEARNING_PLATFORM_API`: API endpoint for the learning platform

**Optional (when `doAuth: true`):**
- `VITE_OAUTH_CLIENT_ID`: OAuth client ID for authentication
- `VITE_PROXY_DOMAIN`: Domain for OAuth proxy

### 6. Deployment

The course name in [`src/config.js`](src/config.js) automatically configures:
- Base path in [`vite.config.js`](vite.config.js)
- GitHub Pages deployment paths
- Internal routing

Example: `"Introduction to React"` becomes `/introduction-to-react/`

## File Import Patterns

Understanding when to use `?raw` vs module imports:

### Use `?raw` for:
- Markdown content files (`.md`)
- Code files that should be displayed as text
- Exercise starter code
- Solution code
- Any file where you want the raw text content

### Use module imports for:
- JavaScript files that export functions or objects
- Test files that export test arrays
- Question files that export question arrays
- React components
- Any executable JavaScript code

## Example Module Structure

```
src/chapters/example_module_1/
├── page_one.md              # Lesson content
├── page_two.md              # Additional content  
├── exercise_1.js            # Student starter code
├── solution_one.js          # Complete solution
├── tests_1.js               # Automated tests
└── questions_1.jsx          # Quiz questions
```

## Development Workflow

1. **Fork/clone this template repository**
2. **Update [`src/config.js`](src/config.js)** with your course details
3. **Modify [`src/chapters/nav.js`](src/chapters/nav.js)** to define your modules
4. **Create content directories** for each module
5. **Add content files** (markdown, exercises, tests, quizzes)
6. **Update [`src/chapters/index.jsx`](src/chapters/index.jsx)** to import and configure your content
7. **Test locally** with `npm run dev`
8. **Deploy** to your hosting platform

## Support

For questions about the NSS Core platform or this template, refer to the [NSS Workshops Platform documentation](https://github.com/NSS-Workshops/platform).

---

*This template is developed by Nashville Software School to provide free, accessible curriculum development tools for educators.*