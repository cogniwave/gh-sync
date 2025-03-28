// program.command('split')
//   .description('Split a string into substrings and display as an array')
//   .argument('<string>', 'string to split')
//   .option('--first', 'display just the first substring')
//   .option('-s, --separator <char>', 'separator character', ',')
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;
//     console.log(str.split(options.separator, limit));
//   });

import { SyncFn } from "./types/labels";

// const response = await fetch("https://bun.sh/api", {
//   method: "POST",
//   body: JSON.stringify({ message: "Hello from Bun!" }),
//   headers: { "Content-Type": "application/json" },
// });

// const body = await response.json();
// dotenv.config();

// // Load environment variables
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// const ORG_NAME = process.env.ORG_NAME;

// if (!GITHUB_TOKEN || !ORG_NAME) {
//   console.error("Please set GITHUB_TOKEN and ORG_NAME in your .env file");
//   process.exit(1);
// }

// // GitHub API base URL
// const GITHUB_API_BASE_URL = "https://api.github.com";

// // Labels to propagate
// const LABELS = [
//   { name: "bug", color: "d73a4a", description: "Something isn't working" },
//   { name: "enhancement", color: "a2eeef", description: "New feature or request" },
//   { name: "help wanted", color: "008672", description: "Extra attention is needed" },
// ];

// const axiosInstance = axios.create({
//   baseURL: GITHUB_API_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${GITHUB_TOKEN}`,
//     Accept: "application/vnd.github+json",
//   },
// });

// async function getRepositories(): Promise<string[]> {
//   try {
//     const response = await axiosInstance.get(`/orgs/${ORG_NAME}/repos`, {
//       params: { per_page: 100 },
//     });

//     return response.data.map((repo: any) => repo.name);
//   } catch (error) {
//     console.error("Error fetching repositories:", error.response?.data || error.message);
//     throw error;
//   }
// }

// async function createOrUpdateLabel(repo: string, label: { name: string; color: string; description: string }) {
//   try {
//     await axiosInstance.patch(`/repos/${ORG_NAME}/${repo}/labels/${encodeURIComponent(label.name)}`, label);
//     console.log(`Updated label "${label.name}" in repository "${repo}".`);
//   } catch (error: any) {
//     if (error.response?.status === 404) {
//       try {
//         await axiosInstance.post(`/repos/${ORG_NAME}/${repo}/labels`, label);
//         console.log(`Created label "${label.name}" in repository "${repo}".`);
//       } catch (creationError) {
//         console.error(`Error creating label "${label.name}" in repository "${repo}":`, creationError.response?.data || creationError.message);
//       }
//     } else {
//       console.error(`Error updating label "${label.name}" in repository "${repo}":`, error.response?.data || error.message);
//     }
//   }
// }

// async function propagateLabels() {
//   try {
//     const repositories = await getRepositories();

//     for (const repo of repositories) {
//       for (const label of LABELS) {
//         await createOrUpdateLabel(repo, label);
//       }
//     }

//     console.log("Label propagation completed.");
//   } catch (error) {
//     console.error("Error during label propagation:", error.message);
//   }
// }

// // Start the process
// propagateLabels();

export const sync: SyncFn = async function (source, origin, options) {
  // console.log("aqui", this.args, this.opts());
  console.log("aqui", source, origin, options);
};
