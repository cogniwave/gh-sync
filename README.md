# gh-label-sync

This tool allows you to synchronize labels between two GitHub repositories. It retrieves the labels from a source repository and updates the labels in the target repository.

It requires a GitHub access token with the necessary permissions to manage labels on GitHub repositories.

## Setup

### Instalation 
Install it globally or locally with whatever package manager you use

```bash
npm install -g gh-sync-labels
pnpm add -g gh-sync-labels
yarn global add gh-sync-labels
bun add gh-sync-labels
```

### Direct Execution with npx (or other runners)

If you prefer not to install the tool globally, you can run it directly using:

```bash
npx gh-sync-labels
bunx gh-sync-labels
yarn dlx gh-sync-labels
pnpm gh-sync-labels
```

### Token

Before using the tool, you need to create a GitHub access token with the following required permissions:
- **repo**: To manage repositories (read and write labels).
  - **repo:status**: To get the status of repository labels.
  - **repo:labels**: To view and modify the labels of a repository.

## Usage

Once you have your GitHub token, you can use the tool to sync labels between repositories.

### Command Syntax

```bash
gh-sync-labels <origin> <target> [options]
```

### Arguments

- `origin <string>`: The repository from which you want to copy labels in the format of `{owner}/{repository}`
- `target <string>`: The repository where you want to update the labels in the format of `{owner}/{repository}`

### Options

- `-t, --token <string>`: The GitHub token required to interact with GitHub's API. Ensure your token has the necessary permissions (`repo`)
If no token option is provided, *gh-sync-labels* will look for it in your environment variables under `GITHUB_TOKEN`
- `--verbose`: Runs the tool in verbose mode, providing detailed logs about the operations being performed.

### Example Usage

1. To synchronize labels from `repo-a` to `repo-b`:

   ```bash
   gh-sync-labels owner/repo-a owner/repo-b --token your_github_token
   ```

2. To synchronize labels from `repo-a` to `repo-b` with implicit token:

   ```bash
   export $GITHUB_TOKEN = your_github_token
   gh-sync-labels owner/repo-a owner/repo-b
   ```

2. To run the tool in verbose mode:

   ```bash
   gh-sync-labels owner/repo-a owner/repo-b --verbose
   ```


## Disclaimer

There are still improvements needed on this: 
- proper documentation
- sync multiple repos at the same time
- support for repos in org
- deployment flow
- add proper versioning with 

## Development 

```bash
bun install
```

To run:

```bash
bun dev
```
