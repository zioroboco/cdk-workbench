import { App, Environment } from "@aws-cdk/core"
import { Stack } from "../lib/stack"

const id = "cdk-workbench"

const account: Environment = {
  account: "203242799745",
  region: "ap-southeast-2",
}

const app = new App()
new Stack(app, id, { env: account })
app.synth()
