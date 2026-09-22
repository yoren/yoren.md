# yoren.md

Instructions for myself. Written from experience, revised with practice.

This isn’t a description of how I always behave. It’s a reminder of how I want to work—especially when I’m uncertain, absorbed in a problem, or trying to do too much.

## Working with a team

Openness is the foundation. Difficult situations can turn into good outcomes when the team and I stay willing to listen, explain, and change. Keep that possibility open, even when the conversation is uncomfortable.

### Give feedback time to settle

Negative feedback can hurt even when it is delivered with care. Feeling defensive is natural; it doesn’t have to decide how I respond.

When my first reaction is “not my problem,” acknowledge the feedback and give myself 24 hours to digest it before coming back. Let people know I need that time rather than going silent. My response after reflection may be different.

### Ask what better looks like

Whether starting work or responding to feedback, ask for concrete expectations: what to do, what is outside the scope, and how we’ll know the outcome is right. I can’t reliably improve a behavior without understanding what is expected instead.

Explain my understanding in my own words and confirm it. Ask for examples where I’m unsure; “site-wide” and “etc.” aren’t clear boundaries. Don’t mistake agreement for knowing how to act.

### Act on guidance honestly

Once expectations are clear, follow the agreed instructions and put them into practice.

If I have concerns, explain them and ask to resolve them. Don’t quietly ignore guidance or promise something I don’t believe I can follow. Openness means being willing to change, not pretending to agree.

### Revisit the plan when the work changes

Test the change and its likely consequences, and agree where my verification ends and someone else’s acceptance testing begins. Fix problems caused by my work; an adjacent problem isn’t automatically part of the task.

If broader testing, new information, or an unrealistic estimate calls for a different plan, explain why and agree on the change while there are still options. Record unrelated issues separately. Don’t quietly expand the original commitment.

### Keep people in the loop

Share what I’m planning, what I’ve finished, and where I need input. Keep a daily update rhythm when working closely with others, but raise questions as they arise rather than saving them for the update.

Timebox investigation. If I’m still stuck, share what I’ve tried and learned, propose a next step, and ask for a specific decision, pointer, or second opinion. Make uncertainty visible before someone has to ask—not after I’ve exhausted every possibility.

## Engineering and tooling

### Keep responsibilities and dependencies clear

Give each part of the codebase a clear job. Keep business decisions separate from presentation, storage, and framework behavior.

Pass dependencies explicitly. Put framework globals and vendor APIs behind small boundaries where they help isolate behavior and make it testable. Don’t recreate the framework inside those boundaries.

### Make important rules executable

Use automated checks to enforce dependency direction, types, coding standards, and complexity limits. Run the same checks locally and in CI so architectural decisions don’t depend on someone remembering them during review.

Treat a warning as a reason to inspect the design, not immediately suppress the tool. Keep necessary exceptions narrow and explain why they exist.

### Test behavior where it can be proved

Use the narrowest test that can genuinely prove the contract. Test pure decisions in isolation; use real integrations when database behavior, routing, permissions, or framework semantics determine the answer.

Assert meaningful outputs and forbidden side effects, not just that code ran. Derive expected results independently, exercise failure paths and boundaries, and add a regression test when fixing a bug. Keep asynchronous tests deterministic and clean up shared state even when an assertion fails.

### Let difficult tests question the design

When a test needs elaborate setup or mocks, look for mixed responsibilities, hidden dependencies, or too much framework coupling.

Simplify the boundary before adding more testing machinery. Use coverage to find behavior I haven’t examined, not as a substitute for deciding whether the assertions would catch a mistake.

### Verify what I actually ship

Check permissions and validation in the context where they run. Don’t assume a passing unit test proves the behavior of the live request path.

Build from locked dependencies, audit them, and inspect the packaged output for both required and unwanted files. Keep build jobs separate from publishing privileges, and test the release artifact rather than assuming the source tree tells the whole story.

### Leave useful instructions for the next change

Use comments to explain constraints the code cannot express: security, compatibility, accessibility, lifecycle, or a deliberate exception. Don’t narrate the syntax or preserve change history in comments.

Keep project guidance and check commands close to the code so another engineer—or a coding agent—can work within the same boundaries. Verify repository behavior before turning an assumption into an instruction.

### Choose tools for the checks they enable

In my PHP and WordPress work, tools such as Deptrac, PHPStan, PHPCS, and PHPUnit help me enforce boundaries and verify behavior. TypeScript, Vitest, linting, and formatting serve similar roles on the frontend. GitHub Actions makes those checks repeatable in CI.

Choose the tools and thresholds for the project. Carry the discipline between codebases, not every dependency or configuration value.

## Maintaining these instructions

Keep what helps. Revise what doesn’t. Add an instruction when experience gives me a reason to—not because the document looks incomplete.

These instructions should help me act, not become another standard to punish myself with.
