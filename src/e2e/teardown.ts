import { killNode } from "./utils";

export default async function teardown() {
  return killNode();
}