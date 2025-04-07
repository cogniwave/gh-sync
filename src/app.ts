#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";

import LabelSync from "./labels";
import { Action, type SyncOptions, type Tokens } from "./types";
import logger, { setVerbose } from "./log";
import { promptMultiple } from "./io";
import { name, description, version } from "../package.json";

const validateTokens = (opts: SyncOptions): Tokens | null => {
  const token = opts.token || process.env.GITHUB_TOKEN;
  if (token) {
    return { destToken: token, originToken: token };
  }

  const originToken = opts.tokenOrigin || process.env.GITHUB_TOKEN_ORIGIN;
  if (!originToken) {
    logger.error("No origin token specified and couldn't find any in environment");
    return null;
  }

  const destToken = opts.tokenDestination || process.env.GITHUB_TOKEN_DESTINATION;
  if (!destToken) {
    logger.error("No destination token specified and couldn't find any in environment");
    return null;
  }

  return { destToken, originToken };
};

new Command()
  .name(name)
  .description(description)
  .version(version)
  .showHelpAfterError("(add --help for additional information)")

  .argument("origin", "Repository that has the configs you want to sync: (`{owner}/{repository}`)")
  .argument("destination", "Repository where you want to update the configs: (`{owner}/{repository}`)")

  .option("--verbose", `Runs ${name} in verbose mode`, false)
  .option(
    "--token <token>",
    "Auth token to allow gh-sync to do it's thing. Use this if the token is the same for both origin and destination repositories",
  )
  .option("--token-origin <token>", "Auth token of the origin repository, to allow gh-sync to do it's thing")
  .option("--token-destination <token>", "Auth token of the destination repository, to allow gh-sync to do it's thing")

  .action(async function (origin, destination, options: SyncOptions) {
    if (options.verbose) {
      setVerbose();
    }

    if (origin === destination) {
      logger.error("`origin` and `destination` can't be the same");
      return;
    }

    const tokens = validateTokens(options);
    if (!tokens) {
      return;
    }

    const actions = await promptMultiple<string[]>("What do you want to sync ? (you can choose multiple)", [
      // fine grained:
      //    issues read / write; (get and add)
      //    pull requests read / write; (delete labels)
      //    metadata read (mandatory)
      { label: "Labels", value: Action.LABELS, hint: "Check documentation for necessary permissions" },
      {
        label: "Workflows (coming soon)",
        value: Action.WORKFLOWS,
        hint: "Check documentation for necessary permissions",
      },
      {
        label: "Branch rules (coming soon)",
        value: Action.BRANCH_RULES,
        hint: "Check documentation for necessary permissions",
      },
    ]);

    let labelSync: LabelSync | null = null;

    if (actions.includes(Action.LABELS)) {
      labelSync = new LabelSync(origin, destination, tokens);
      labelSync.prepare();
    }

    if (Action.WORKFLOWS in actions) {
      // stuff with workflows
    }

    if (Action.BRANCH_RULES in actions) {
      // stuff with branch rules
    }

    logger.box("Before we proceed, just double checking all the actions..");

    // confirm things
    if (labelSync) {
      labelSync.confirmChoices();
    }

    logger.info("Starting sync process...");

    // process things
    if (labelSync) {
      logger.info("Syncing labels...");
      labelSync.sync();
      logger.info("Finished syncing labels");
    }

    logger.success("GitHub configurations sync'd");
  })

  .parse();
