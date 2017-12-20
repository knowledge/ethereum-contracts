# Contributing
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Reporting bugs](#reporting-bugs)
- [Git Workflow](#git-workflow)
- [Pull Request General Guidelines](#pull-request-general-guidelines)
  - [Always follow these rules:](#always-follow-these-rules)
- [How To Create a Pull Request](#how-to-create-a-pull-request)
- [Advanced Git tools](#advanced-git-tools)
- [Version Numbers](#version-numbers)
    - [Breaking.Feature.Fix](#breakingfeaturefix)
      - [Breaking](#breaking)
      - [Feature](#feature)
      - [Fix](#fix)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Reporting bugs

Before submitting your issue please check that you've completed the following steps:

* Made sure you're on the latest version
* Used the search feature to ensure that the bug hasn't been reported before

Bug reports should contain the following information:

* Summary: A brief description.
* Steps to reproduce: How did you encounter the bug? Instructions to reproduce it.
* Expected behavior: How did you expect it to behave?
* Actual behavior: How did it actually behave?
* References: Links to any related tickets or information sources.
* If possible, attach visual documentation of the bug. Screenshot or animated gif

## Git Workflow
At Knowledge we use Github Flow https://knowledge.github.io/knowledge-project-guidelines/git/


## Pull Request General Guidelines

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned.
* Check for related issues on the issue tracker.
* Non-trivial changes should be discussed on an issue first.
* Let us know you're working on the issue.
* Develop in a topic branch, not master.
* Provide useful pull request description
* Squash your commits.
* Write a good description of your PR.

### Always follow these rules:

* Commit each fix as a separate change.
* Provide useful commit messages.
* Use the imperative mood in the subject line. Eg. `fix login error`, `add config file`, `remove unused code`
* Provide a short commit message in the first line (50-72 character). Looking at the output of `gitk` or `git log --oneline` might help you understand why.
* Reference the git issue on the body of your commit message, never on the first line. Eg:
```
git commit -m 'add login feature
#3'
```
* Don't pollute the log! http://bit.ly/1MDciJG
  * Don't push to master any 'merge messages'
  * Update your local development branch with `git pull --rebase origin master`
  * Always Rebase over merge.

## How To Create a Pull Request
__Clone the repo__

* Click the GitHub fork button to create your own fork.
* Clone your fork of the repo to your dev system.

```
git clone git@github.com:knowledge/knowledge-repo-boilerplate.git
```

__Let us Know you're working on the issue__ ( for non-trivial updates )

If you're actively working on an issue, please comment in the issue thread stating that you're working on a fix, or (if you're an official contributor) assign it to yourself.

If there's no issue, please create one.

This way, others will know they shouldn't try to work on a fix at the same time.


__Create a feature branch__

```
git checkout -b <your-branch-name>
```

__Make your changes and commit__

* Make sure you comply with the [.editorconfig](http://editorconfig.org/)
* Provide a useful short description.
* Reference the git issue on the body of your commit message, never on the first line.
```
git commit -m '<short description of change>
#<your-issue-number>'
```

__Create a Pull Request__

Create a pull request so others can review the changes.

```
git push <your-git-account> <your-feature-branch>
```

* Open your repository fork on GitHub
* You should see a button to create a pull request - Press it
* Reference the issue number in your pull request message.
* Consider mentioning a contributor in your pull request comments to alert them that it's available for review
* **Wait for the reviewer to approve and merge the request**
* Minor documentation grammar/spelling fixes (code example changes should be reviewed)

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Advanced Git tools

There are also tools like [Hub](https://hub.github.com/) and [git-extras](https://github.com/tj/git-extras) that facilitate interacting with Github.
You can leverage these tools to contribute to this repository.


## Version Numbers

[Semver](http://semver.org), except the version roles have the semantic names, "Breaking.Feature.Fix" instead of "Major.Minor.Patch".


#### Breaking.Feature.Fix

We don't decide what the version will be. The API changes decide. Version numbers are for computers, not people. Release names are for people.

##### Breaking

Any breaking change, no matter how small increments the Breaking version number. Incrementing the Breaking version number has absolutely no relationship with issuing a release.

##### Feature

When any new feature is added. This could be as small as a new public property, or as large as a new module contract being exposed.

##### Fix

When a documented feature does not behave as documented, or when a security issue is discovered and fixed without altering documented behavior.
