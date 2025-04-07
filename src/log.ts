import consola, { LogLevels } from "consola";

import { name } from "../package.json";

const logger = consola.create({ level: LogLevels.warn }).withTag(name);

export const setVerbose = (): void => {
  logger.level = LogLevels.verbose;
};

export default logger;
