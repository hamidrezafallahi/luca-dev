# Tab Cleanup

- Tabs you create are temporary and close automatically at turn end unless you mark them.
- Call `tab.markDeliverable()` when the live tab itself is a user-facing output or requested open page, such as a created or edited document, spreadsheet, slide deck, dashboard, checkout, submitted form result, or a page the user explicitly asked to keep open.
- Call `tab.markHandoff()` only when work must continue from the live page in a later turn, such as a page waiting for user input, login, approval, payment, CAPTCHA, or an unfinished workflow.
- Marks are turn-scoped, and the latest mark for a tab wins. If a temporary handoff tab must survive another turn of browser work, mark it again before asking the user to act or waiting for their reply.
- At turn end, the browser releases control of unmarked user tabs and leaves them open.
- Do not mark research, search, source, intermediate, duplicate, blank, error, or routine navigation tabs. Once you have extracted what you need, let automatic turn cleanup close them.
