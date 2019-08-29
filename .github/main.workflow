workflow "push" {
  on = "push"
  resolves = [
    "push-electron build",
    "push-lint",
    "push-build",
  ]
}

action "push-npm install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "push-electron build" {
  uses = "actions/npm@master"
  needs = ["push-npm install"]
  args = "run electron:build"
}

action "push-lint" {
  uses = "actions/npm@master"
  needs = ["push-npm install"]
  args = "run lint"
}

action "push-build" {
  uses = "actions/npm@master"
  needs = ["push-npm install"]
  args = "run build"
}
