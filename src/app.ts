import { Command } from "@commander-js/extra-typings";

import { SyncArguments, SyncOptions } from "./types/labels";
import { sync } from "./labels";
import { name, description, version } from "../package.json";

new Command<SyncArguments, SyncOptions>()
  .name(name)
  .description(description)
  .version(version)
  .showHelpAfterError("(add --help for additional information)")

  .argument("origin <string>", "Repository where the labels we want to keep are: (`{owner}/{repository}`)")
  .argument("target <string>", "Repository whose labels we're updating (`{owner}/{repository}`)")

  .option("-t, --token <string>", "GitHub token to be able to do stuff in GutHub")
  .option("--verbose", `Runs ${name} in verbose mode`)
  // .option("--clean", "Will delete any existing in the target repos before synchronizing origin's tags")

  // @ts-expect-error todo: fix typing
  .action(sync)

  .parse();
