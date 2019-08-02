workflow "push" {
  on = "push"
  resolves = ["push-electron build", "push-lint"]
}

action "push-npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "push-electron build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["push-npm install"]
  args = "run electron:build"
}

action "push-lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["push-npm install"]
  args = "run lint"
}
