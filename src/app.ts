import consola, { LogLevels } from "consola";
import { Command } from "@commander-js/extra-typings";

import type { GitHubLabel } from "./types/labels";
import { getLabels, deleteLabels, createLabels } from "./labels";
import { name, description, version } from "../package.json";
import { Action } from "./types/actions";

new Command()
  .name(name)
  .description(description)
  .version(version)
  .showHelpAfterError("(add --help for additional information)")

  .argument("origin", "Repository where the labels we want to keep are: (`{owner}/{repository}`)")
  .argument("destination", "Repository whose labels we're updating (`{owner}/{repository}`)")

  .option("-t, --token <token>", "GitHub token to be able to do stuff in GutHub")
  .option("--verbose", `Runs ${name} in verbose mode`, false)

  // @ts-expect-error typing for commanderjs is wrong (even according to their documentation)
  .action(async function (origin, destination, options: SyncOptions) {
    const logger = consola.create({ level: options.verbose ? LogLevels.verbose : LogLevels.verbose }).withTag(name);

    if (origin === destination) {
      logger.error("`origin` and `destination` can't be the same");
      return;
    }

    const token = options.token || process.env.GITHUB_TOKEN;

    if (!token) {
      logger.error("No token specified and couldn't find any in environment");
      return;
    }

    // @ts-expect-error again, typing is wrong for commanderjs. prompt result here is string[], not SelectionOption[]
    const actions: string[] = await logger.prompt("What do you want to sync ? (you can choose multiple)", {
      type: "multiselect",
      cancel: "reject",
      options: [
        // fine grained:
        //    issues read / write; (get and add)
        //    pull requests read / write; (delete labels)
        //    metadata read (mandatory)
        { label: "Labels", value: Action.LABELS, hint: "Check documentation for necessary permissions" },
        { label: "Workflows", value: Action.WORKFLOWS, hint: "Check documentation for necessary permissions" },
        { label: "Branch rules", value: Action.BRANCH_RULES, hint: "Check documentation for necessary permissions" },
      ],
      required: true,
    });

    let labelsToDelete: GitHubLabel[] = [];
    let labelsToSync: GitHubLabel[] = [];

    if (actions.includes(Action.LABELS)) {
      // stuff with labels
      const [newLabels, existingLabels] = await Promise.all([getLabels(origin, token), getLabels(destination, token)]);

      // @ts-expect-error typing is wrong for commanderjs, and we're also kinda hacking it to prevent unnecessary str <> int conversions
      const toSync: number[] = await logger.prompt(
        `Which ones do you want to sync to \`${destination}\`? \n(You can choose multiple, leave empty to sync all)`,
        {
          cancel: "reject",
          type: "multiselect",
          required: false,
          // @ts-expect-error consola expects id to be int, but in our case it's string
          options: newLabels.map((label) => ({ label: label.name, value: label.id })),
        },
      );

      if (existingLabels.length) {
        // @ts-expect-error typing is wrong for commanderjs, and we're also kinda hacking it to prevent unnecessary str <> int conversions
        const toKeep: number[] = await logger.prompt(
          `Which of these labels do you want to keep in \`${destination}\`? \n(You can choose multiple, leave empty to keep all)`,
          {
            type: "multiselect",
            cancel: "reject",
            required: false,
            // @ts-expect-error consola expects id to be int, but in our case it's string
            options: existingLabels.map((label) => ({ label: label.name, value: label.id })),
          },
        );

        // delete all tags in destination
        labelsToDelete = toKeep.length ? existingLabels.filter((l) => !toKeep.includes(l.id)) : existingLabels;
      }

      // toSync
      labelsToSync = toSync.length ? newLabels.filter((l) => toSync.includes(l.id)) : newLabels;
    }

    if (Action.WORKFLOWS in actions) {
      // stuff with workflows
    }

    if (Action.BRANCH_RULES in actions) {
      // stuff with branch rules
    }

    logger.box("Before we proceed, we want to double check we're gonna do the correct actions");

    // confirm label stuff
    const labelsToSyncConfirmed = await logger.prompt(
      `These will be added to \`${destination}\` from \`${origin}\`:\n> ${labelsToSync
        .map((l) => l.name)
        .join("\n  > ")}`,
      { type: "confirm", required: true },
    );

    if (!labelsToSyncConfirmed) {
      logger.error("Stopping");
      return;
    }

    if (labelsToDelete.length) {
      const labelsToDeleteConfirmed = await logger.prompt(
        `These will be removed from \`${destination}\`:\n> ${labelsToDelete.map((l) => l.name).join("\n  > ")}`,
        { type: "confirm", required: true },
      );

      if (!labelsToDeleteConfirmed) {
        logger.error("Stopping");
        return;
      }
    } else {
      logger.info(`Not deleting any labels from \`${destination}\``);
    }

    // process
    if (labelsToDelete.length) {
      logger.info(`Deleting labels on \`${destination}\`...`);
      await deleteLabels(destination, labelsToDelete, token);
    }

    logger.info(`Adding new labels to \`${destination}\`...`);
    await createLabels(destination, labelsToSync, token);
  })

  .parse();
