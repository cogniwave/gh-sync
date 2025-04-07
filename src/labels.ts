import { promptMultiple, request } from "./io";
import logger from "./log";
import type { GitHubLabel } from "./types/labels";
import type { Tokens } from "./types";

const mapLabelsToOptions = (labels: GitHubLabel[]) => {
  return labels.map((label) => ({ label: label.name, value: label.id }));
};

const mapLabelsToConfirmation = (message: string, labels: GitHubLabel[]) => {
  return `${message}:\n> ${labels.map((l) => l.name).join("\n  > ")}`;
};

const getLabels = async (repo: string, token: string) => request<GitHubLabel[]>(`${repo}/labels`, "get", token);

export default class LabelSync {
  private toSync: GitHubLabel[] = [];
  private toDelete: GitHubLabel[] = [];

  constructor(private origin: string, private destination: string, private tokens: Tokens) {}

  public async prepare() {
    // stuff with labels
    const [newLabels, existingLabels] = await Promise.all([
      getLabels(this.origin, this.tokens.originToken),
      getLabels(this.destination, this.tokens.destToken),
    ]);

    if (existingLabels.length) {
      const toKeep = await promptMultiple<number[]>(
        `Which of these labels do you want to keep in \`${this.destination}\`? \n(You can choose multiple, leave empty to keep all)`,
        // @ts-expect-error consola expects id to be int, but in our case it's string
        mapLabelsToOptions(existingLabels),
      );

      // delete all tags in destination
      this.toDelete = toKeep.length ? existingLabels.filter((l) => !toKeep.includes(l.id)) : existingLabels;
    }

    const toSync = await promptMultiple<number[]>(
      `Which ones do you want to sync to \`${this.destination}\`? \n(You can choose multiple, leave empty to sync all)`,
      // @ts-expect-error consola expects id to be int, but in our case it's string
      mapLabelsToOptions(newLabels),
    );

    this.toSync = toSync.length ? newLabels.filter((l) => toSync.includes(l.id)) : newLabels;
  }

  public async deleteLabels(labels: GitHubLabel[]) {
    logger.info(`Deleting labels on \`${this.destination}\`...`);

    await Promise.all(
      labels.map((l) => request(`${this.destination}/labels/${l.name}`, "delete", this.tokens.destToken)),
    );

    logger.info(`Labels deleted on ${this.destination}`);
  }

  public async createLabels(labels: GitHubLabel[]) {
    logger.info(`Creating labels on ${this.origin}...`);

    await Promise.all(
      labels.map((l) => {
        return request(
          `${this.origin}/labels`,
          "post",
          this.tokens.originToken,
          JSON.stringify({ name: l.name, color: l.color, description: l.description }),
        );
      }),
    );

    logger.info(`Labels created on ${this.origin}`);
  }

  public async confirmChoices() {
    // confirm label stuff
    let confirmed = await logger.prompt(
      mapLabelsToConfirmation(`These will be added to \`${this.destination}\` from \`${this.origin}\``, this.toSync),
      { type: "confirm", required: true },
    );

    if (!confirmed) {
      logger.error("Stopping");
      return false;
    }

    if (this.toDelete.length) {
      const confirmed = await logger.prompt(
        mapLabelsToConfirmation(`These will be removed from \`${this.destination}\`)`, this.toDelete),
        { type: "confirm", required: true },
      );

      if (!confirmed) {
        logger.error("Stopping");
        return false;
      }
    } else {
      logger.info(`Not deleting any labels from \`${this.destination}\``);
    }

    return true;
  }

  public async sync() {
    // process
    if (this.toDelete.length) {
      await this.deleteLabels(this.toDelete);
    }

    await this.createLabels(this.toSync);
  }
}
