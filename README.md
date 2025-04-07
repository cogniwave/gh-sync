# gh-sync

This tool allows you to synchronize labels between two GitHub repositories. It retrieves the labels from a source repository and updates the labels in the target repository.

It requires a GitHub access token with the necessary permissions to manage labels on GitHub repositories.

## Setup

### Installation

Install it globally or locally with whatever package manager you use

```bash
npm install -g @cogniwave/gh-sync
pnpm add -g @cogniwave/gh-sync
yarn global add @cogniwave/gh-sync
bun add @cogniwave/gh-sync
```

### Direct Execution with npx (or other runners)

If you prefer not to install the tool globally, you can run it directly using:

```bash
npx @cogniwave/gh-sync
bunx @cogniwave/gh-sync
yarn dlx @cogniwave/gh-sync
pnpm @cogniwave/gh-sync
```

### Token

Before using the tool, you need to create a GitHub access token with the following required permissions:

- **issues:read and write**: Used to get labels and create new ones
- **pull requests:read and write**: Used to delete tokens in destination repository if you wish

## Usage

Once you have your GitHub token, you can use the tool to sync labels between repositories.

### Command Syntax

```bash
@cogniwave/gh-sync <origin> <target> [options]
```

### Arguments

- `origin <string>`: The repository from which you want to copy labels in the format of `{owner}/{repository}`
- `target <string>`: The repository where you want to update the labels in the format of `{owner}/{repository}`

### Options

- `--verbose`: Runs the tool in verbose mode, providing detailed logs about the operations being performed.
- `-t, --token <string>`: Auth token to allow gh-sync to do it's thing. Use this if the token is the same for both origin and destination repositories"
- `--token-origin`: Auth token of the origin repository, to allow gh-sync to do it's thing
- `--token-destination`: Auth token of the destination repository, to allow gh-sync to do it's thing

### Example Usage

1. To synchronize labels from `repo-a` to `repo-b`:

   ```bash
   @cogniwave/gh-sync owner/repo-a owner/repo-b --token your_github_token
   ```

2. To synchronize labels from `repo-a` to `repo-b` with implicit token:

   ```bash
   export $GITHUB_TOKEN = your_github_token
   @cogniwave/gh-sync owner/repo-a owner/repo-b
   ```

3. To synchronize labels from `repo-a` to `repo-b` but different tokens:

   ```bash
   @cogniwave/gh-sync owner/repo-a owner/repo-b --token-origin repo-a_token --token-destination repo-b_token
   ```

4. To run the tool in verbose mode:

   ```bash
   @cogniwave/gh-sync owner/repo-a owner/repo-b --verbose
   ```

## Development

```bash
bun install
```

To run:

```bash
bun dev
```
