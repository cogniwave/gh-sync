import logger from "./log";

const BASE_URL = "https://api.github.com";

export const request = async <T>(endpoint: string, method: string, token: string, body?: BodyInit | null) => {
  return new Promise<T>((resolve, reject) => {
    fetch(`${BASE_URL}/repos/${endpoint}`, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then(async (response) => {
        const json = await response.json();

        if ([200, 201, 204].includes(response.status)) {
          resolve(json);
        } else {
          reject(json);
        }
      })
      .catch(reject);
  });
};

interface SelectOption {
  label: string;
  value: string;
  hint?: string;
}

export const promptMultiple = async <T>(message: string, options: SelectOption[]): Promise<T> => {
  return (await logger.prompt(message, { cancel: "reject", type: "multiselect", required: false, options })) as T;
};
