# How to contribute to nES6 :space_invader:

Thanks for your interest on contributing to nES6! Here are a few general guidelines on contributing and reporting bugs to nES6 that we ask you to take a look first.

## Picking issues to work on

Existing issues are tracked in Github, marked with appropriate labels and grouped by milestone. **Currently, we are working towards MVP - please focus issues/tasks tagged with the `MVP` milestone.** If an issue is unassigned, or has little discussion, chime in and mention you'd like to take a stab at it.

If you have a feature idea or bug that has no issue, feel free to report it.

## Reporting Issues

Before reporting a new issue, please be sure that the issue wasn't already reported or fixed by searching on GitHub through our [issues](https://github.com/andymikulski/nES6/issues).

When creating a new issue, be sure to include a **title** and a **clear description** with as much relevant information as possible. For bugs, please provide steps to reproduce.


## Sending Pull Requests

Before sending a new Pull Request, take a look on existing Pull Requests and Issues to see if the proposed change or fix has been discussed in the past, or if the change was already implemented but not yet released.

We expect new Pull Requests to include enough tests for new or changed behavior, and we aim to maintain everything as most backwards compatible as possible, reserving breaking changes to be ship in major releases when necessary - you can wrap the new code path with a setting toggle from the `nES6` module defined as `false` by default to require developers to opt-in for the new behavior. We also welcome Pull Requests that improve our existing documentation.

## Thank you!

Thanks again for your interest on contributing to nES6! :space_invader:
