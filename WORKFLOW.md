# Git Workflow

This document outlines the Git workflow used in our coursework repository.

## Branches

### 1. ``main`` Branch
- Main branch containing stable, deployable code.
- Updated only with code from release branches.

### 2. ``develop`` Branch
- Ongoing development work will be done on this branch
- Feature branches are merged into this branch.

### 3. Release Branches
- Branched off of `develop` when preparing for a new release.
- Bug fixes and final adjustments for the release are made here before merging into `main`.
- Named the same as the release version using semantic versioning (major.minor.patch).

### 4. Feature Branches
- Developers work on feature branches branched off of `develop`.
- Once a feature is complete, pull upstream changes to `develop` via a rebase to ensure a linear history, resolve any conflicts and make a pull request.

## Workflow Commands
#### 1. Create feature branch:

```bash
# update local develop
git checkout develop
git pull --rebase

# create and move to new branch
git checkout -b my-feature-branch develop
```
    
- give branches short descriptive names

#### 2. Make changes:
- Implement the feature, make sure it works properly and then commit
- if you haven't already done so, change the commit message editor to vscode by running ```git config --global core.editor "code --wait"``` . This will open a new tab in vscode to enter the commit and make it easier to make more detailed multi line commits.

```bash
git add
git commit
# write commit message in the vscode tab, save it, and then close the tab
```
- add `fix #Issue-Number` to commit message to automatically link commits to issues they resolve.

- If multiple worked on a single commit, mention them in the commit message by typing `Co-authored-by: NAME <github-email>` at the end of the commit message after an empty line.

```
# Example
Update WORKFLOW.md

Co-authored-by: Penguin2311 <111010740+Penguin2311@users.noreply.github.com>
```

#### 3. Update your local `develop` branch:
```bash
git checkout develop
git pull --rebase
```

#### 5. Rebase your feature branch and resolve conflicts:
```bash
git checkout my-feature-branch
git rebase develop
# Resolve conflicts
```

#### 6. Push changes to remote:
```bash
git push origin my-feature-branch -f
# use git push -u my-feature-branch if first commit and branch doesn't exist in remote
```

#### 7. Open a pull request:
- Bullet points with description of all changes.
- Mention all issues resolved as `- resolve #Issue-Number`

#### 8. Code Review:
- Other team members should review the code and request any improvements or fixes required
- Follow the same process from step 2-6 to push any fixes
- Approval of the project owner and atleast 1 other team member required to merge

#### 9. Merge Code:
- After getting approved, merge the feature branch into the `develop` branch
- Test everything works properly again on `develop`
- Delete the feature branch

#### 10. Release Code:
- Branch off of develop to create a release branch
- Patch any immediate bugs
- Merge release into `main`
- Create a new release on Github

## References
- _Github Docs_ available at https://docs.github.com/
- _Git Workflow_ by jamiebuilds available at https://github.com/jamiebuilds/git-workflow/blob/master/README.md
- _A successful Git branching model_ by Vincent Driessen available at https://nvie.com/posts/a-successful-git-branching-model/
