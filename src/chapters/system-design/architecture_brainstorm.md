## The Problem

Lambda successfully creates thumbnails and stores them in S3. But the Django API — running in ECS — has no idea this happened. The `RockImage` record in the database stays in `processing` forever because nothing ever updates it.

Your challenge: **how should Lambda communicate back to the API when thumbnails are ready?**

## Group Activity

Break into groups of 2–3. You have to brainstorm as many solutions as you can think of. Use diagramming tools. Use LLMs! 

## LLM Prompts

This is a very new way of thinking. Use LLMs to the best of your ability. The key to getting useful output is giving the LLM enough context about your specific system — don't just ask a generic question. Include the relevant code and explain the constraint clearly.

Here is a good starting prompt. Paste the contents of `lambda_function.py` and `rock_image.py` (the Django model) where indicated:

---

*I'm building a distributed system on AWS. I have a Django API running on ECS Fargate and an AWS Lambda function that processes images. Here is the Lambda function:*

*[paste lambda_function.py here]*

*Here is the Django model the API uses to track images:*

*[paste rock_image.py here]*

*When a user uploads an image, the API creates a RockImage record with status='processing' and returns a presigned S3 URL. The client uploads directly to S3. S3 triggers the Lambda, which creates thumbnails and writes them back to S3. The problem is that Lambda has no way to notify the API when it's done, so the RockImage record stays in 'processing' forever.*

*What are the different approaches for Lambda to communicate back to the API? For each approach, explain how it works, what AWS services or infrastructure it requires, the tradeoffs, and how tightly coupled it makes the two services.*

---

From there, ask follow-up questions. Try prompts like:
- *"What would go wrong with approach X if the API was temporarily down?"*
- *"Which of these approaches is most common in production systems and why?"*
- *"Can you draw a diagram of how approach X would work?"*

For each approach your group comes up with, try to answer:

1. **How does it work?** Sketch it out — what sends a message, what receives it, what happens in what order?
2. **What does it require?** New AWS services? Code changes? Infrastructure changes?
3. **What could go wrong?** What happens if the API is temporarily down when Lambda finishes? What if a message gets lost?
4. **How tightly coupled is it?** Does Lambda need to know anything specific about the API for this to work?

Don't worry about whether your approach is "right" — the goal is to think through the tradeoffs. Your instructor will walk through each approach with the class after the activity.
