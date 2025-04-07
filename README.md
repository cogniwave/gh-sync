# gh-sync

This tool allows you to synchronize labels between two GitHub repositories. It retrieves the labels from a source repository and updates the labels in the target repository.

It requires a GitHub access token with the necessary permissions to manage labels on GitHub repositories.

## Setup

### Installation 
Install it globally or locally with whatever package manager you use

```bash
npm install -g gh-sync
pnpm add -g gh-sync
yarn global add gh-sync
bun add gh-sync
```

### Direct Execution with npx (or other runners)

If you prefer not to install the tool globally, you can run it directly using:

```bash
npx gh-sync
bunx gh-sync
yarn dlx gh-sync
pnpm gh-sync
```

### Token

Before using the tool, you need to create a GitHub access token with the following required permissions:
- **issues:read and write**: Used to get labels and create new ones
- **pull requests:read and write**: Used to delete tokens in destination repository if you wish

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

- `--verbose`: Runs the tool in verbose mode, providing detailed logs about the operations being performed.
- `-t, --token <string>`: Auth token to allow gh-sync to do it's thing. Use this if the token is the same for both origin and destination repositories"
- `--token-origin`: Auth token of the origin repository, to allow gh-sync to do it's thing
- `--token-destination`: Auth token of the destination repository, to allow gh-sync to do it's thing

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

3. To synchronize labels from `repo-a` to `repo-b` but different tokens:

   ```bash
   gh-sync-labels owner/repo-a owner/repo-b --token-origin repo-a_token --token-destination repo-b_token
   ```

4. To run the tool in verbose mode:

   ```bash
   gh-sync-labels owner/repo-a owner/repo-b --verbose
   ```

## Development 

```bash
bun install
```

To run:

```bash
bun dev
```
