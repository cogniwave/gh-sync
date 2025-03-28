import { Command } from "@commander-js/extra-typings";

import { SyncArguments, SyncOptions } from "./types/labels";
import { sync } from "./labels";
import { name, version } from "../package.json";

new Command<SyncArguments, SyncOptions>()
  .name(name)
  .description("Helpful executable to sync GitHub labels")
  .version(version)
  .showHelpAfterError("(add --help for additional information)")

  .argument("origin <string>", "origin")
  .argument("destination <string>", "destination")

  .option("-t, --token <string>", "GitHub token to be able to do stuff in GutHub")
  .option("--verbose", `Runs ${name} in verbose mode`)

  // @ts-ignore
  .action(sync)

  .parse();
