import consola, { LogLevels } from "consola";

import { name } from "../package.json";
import { GitHubLabel } from "./types/labels";

// todo: improve this whole code

const logger = consola.create({ level: LogLevels.verbose }).withTag(name);
const BASE_URL = "https://api.github.com";

export async function deleteLabels(repo: string, labels: GitHubLabel[], token: string) {
  await Promise.all(
    labels.map((l) => {
      return new Promise((resolve, reject) => {
        fetch(`${BASE_URL}/repos/${repo}/labels/${l.name}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
          .then(async (response) => {
            const json = await response.json();

            if (response.status !== 204) {
              console.log("error", json, response.status);
              reject(json);
            } else {
              resolve(json);
            }
          })
          .catch(reject);
      });
    }),
  );

  logger.info(`Labels deleted on ${repo}`);
}

export async function createLabels(repo: string, labels: GitHubLabel[], token: string) {
  logger.info(`Creating labels on ${repo}...`);

  await Promise.all(
    labels.map((l) => {
      return new Promise((resolve, reject) => {
        fetch(`${BASE_URL}/repos/${repo}/labels`, {
          method: "post",
          body: JSON.stringify({
            name: l.name,
            color: l.color,
            description: l.description,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
          .then(async (response) => {
            const json = await response.json();
            console.log(json, response.status);

            if (response.status !== 201) {
              reject(json);
            } else {
              resolve(json);
            }
          })
          .catch(reject);
      });
    }),
  );

  logger.info(`Labels created on ${repo}`);
}

// const getNewLabels = async (repo: string, token: string) => {
//   const response = await fetch(`${BASE_URL}/repos/${repo}/labels`, {
//     method: "get",
//     headers: { "Content-Type": "application/vnd.github+json", Authorization: `Bearer ${token}` },
//   });

//   return (await response.json()) as GitHubLabel[];
// };

// export const sync = async function (source, target, options) {
//   const token = options.token || process.env.GITHUB_TOKEN;
//   if (!token) {
//     logger.error("No token specified and couldn't find any in environment");
//     return;
//   }

//   if (!options.verbose) {
//     logger.level = LogLevels.warn;
//   }

//   try {
//     const newLabels = await getNewLabels(source, token);

//     await updateLabels(target, newLabels, token, options.clean ?? false);

//     logger.success("Labels sync'd.");
//   } catch (error) {
//     logger.error("Error during label sync:", error);
//   }
// };

export const getLabels = async (repo: string, token: string) => {
  const response = await fetch(`${BASE_URL}/repos/${repo}/labels`, {
    method: "get",
    headers: { "Content-Type": "application/vnd.github+json", Authorization: `Bearer ${token}` },
  });

  const json = await response.json();

  if (response.status !== 200) {
    throw json;
  }

  return json as GitHubLabel[];
};

// todo: add support for all repos in org instead of just 1
// export const sync: SyncFn = async function (source, target, options) {
//   const token = options.token || process.env.GITHUB_TOKEN;
//   if (!token) {
//     logger.error("No token specified and couldn't find any in environment");
//     return;
//   }

//   if (!options.verbose) {
//     logger.level = LogLevels.warn;
//   }

//   try {
//     const newLabels = await getNewLabels(source, token);
//     const repos = await getRepositories(source, token);

//     await Promise.all(
//       repos.map((repo) => {
//         return updateLabels(repo, newLabels, token, options.clean ?? false);
//       }),
//     );

//     logger.log("Label propagation completed.");
//   } catch (error) {
//     logger.error("Error during label sync:", error);
//   }
// };

// async function updateLabels(repo: string, labels: GitHubLabel[], token: string, cleanup: boolean) {
//   if (cleanup) {
//     // cleanup existing labels
//   }

//   await Promise.all(
//     labels.map((l) => {
//       fetch(`${BASE_URL}/repos/${repo}/labels`, {
//         method: "post",
//         // @ts-ignore
//         body: l,
//         headers: { "Content-Type": "application/vnd.github+json", Authorization: `Bearer ${token}` },
//       });
//     }),
//   );

//   logger.info(`Updated labels for ${repo}`);
// }

// todo: type result
// async function getRepositories(org: string, token: string): Promise<any[]> {
//   logger.info(`Fetching repos of org ${org}`);

//   return await (
//     await fetch(`${BASE_URL}/orgs/${org}/repos`, {
//       method: "get",
//       headers: { "Content-Type": "application/vnd.github+json", Authorization: `Bearer ${token}` },
//     })
//   ).json();
// }
