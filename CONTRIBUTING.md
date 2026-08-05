# Contributing — Bootcamp Management LMS

How the team collaborates on this project. Read this before opening a pull request.

## Branch model

| Branch | Purpose | Who pushes |
| --- | --- | --- |
| `main` | Production. Only merged from `dev` when stable. | Team Lead |
| `dev` | Integration / preview branch (Vercel). All feature work merges here. | Team Lead |
| `feat/<name>` | One branch per member. Branch off `dev`, PR back into `dev`. | Members |

**Rules**

- Never push directly to `main` or `dev`. Changes arrive only via pull requests.
- Members branch off the latest `dev`, never off `main` or another feature branch.
- Branch names follow the pattern `feat/<name>` (member name, lowercase, no spaces):
  - `feat/abdullah` — Abdullah (frontend auth/dashboard UI)
  - `feat/shahzad` — Shahzad (frontend management screens)
  - `feat/hakimullah` — Hakimullah (backend auth/student/attendance APIs)
  - `feat/shafqatUllah` — Shafqatullah (backend team/project/task/dashboard APIs)

## Getting started

```bash
git clone https://github.com/Qaziaaaa/bootcamp-team-branches-practice.git
cd bootcamp-team-branches-practice
git checkout dev
git pull origin dev
git checkout -b feat/your-name
```

## Daily workflow

1. **Always start from the latest `dev`.**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create your feature branch.**
   ```bash
   git checkout -b feat/your-name
   ```

3. **Work in small commits with clear messages.**
   ```bash
   git add <changed-files>
   git commit -m "feat: add login page UI"
   ```
   Use `feat:`, `fix:`, `docs:`, `chore:` prefixes. Do not commit `.env` or `node_modules`.

4. **Sync your branch with `dev` before pushing.**
   ```bash
   git checkout feat/your-name
   git pull origin dev
   ```

5. **Push and open a pull request into `dev`.**
   ```bash
   git push -u origin feat/your-name
   ```
   Open the PR on GitHub → base: `dev` ← compare: `feat/your-name`. Fill in what you changed and what you tested.

6. **Respond to review.** The team lead (or a reviewer) may request changes. Address them, push again, and reply in the PR.

## Resolving conflicts

Conflicts happen when the same lines changed on both branches. Resolve them in **your** branch before the merge.

```bash
git checkout feat/your-name
git pull origin dev            # pulls latest dev into your branch; conflicts appear here
```

Git marks conflicts with `<<<<<<<`, `=======`, `>>>>>>>` blocks. Open each conflicted file and keep the correct combined version, then:

```bash
git add <resolved-files>
git commit -m "chore: resolve merge conflicts with dev"
git push
```

**Conflict decision rules**

- Different files changed → no real conflict, git merges automatically.
- Same feature added by both sides → keep one, ask the team lead which.
- Shared structure/style changed → `dev`'s version wins for the shell; keep the newer content.

After any conflict resolution, run the app locally and re-test your feature before marking the PR ready.

## PR checklist (before you request review)

- [ ] Branch is named `feat/<name>`
- [ ] PR base is `dev` (not `main`)
- [ ] Branch is up to date with latest `dev`
- [ ] Only your assigned files/tasks are included (no unrelated changes)
- [ ] `.env` is NOT committed; secrets stay out of git
- [ ] Backend changes: `npm run seed` + server starts, your endpoints respond per README
- [ ] Frontend changes: page renders, follows `design.md`, works on mobile width
- [ ] Tests (if present) pass; CI checks are green

## Merge policy

- Feature branches merge into `dev` only after CI passes and the team lead approves.
- The team lead merges `dev` → `main` when `dev` is stable. Members never merge to `main`.
- Merged feature branches are deleted on GitHub after merging.
