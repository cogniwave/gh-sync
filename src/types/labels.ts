import type { OptionValues, Command } from "@commander-js/extra-typings";

export interface SyncOptions extends OptionValues {
  token?: string;
  clean?: boolean;
  verbose?: boolean;
}

export type SyncArguments = ["source", "origin"];

export type SyncFn = (this: Command, ...args: [...SyncArguments, SyncOptions, Command]) => void | Promise<void>;
