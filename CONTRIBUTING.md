## All contributions are welcome and highly appreciated. You can contribute in the following ways:

- Opening an issue where applicable
- Adding an implementation for a new framework
- Updating existing implementations
- Manually testing the CLI on any implemented framework(s)

## Style and convention

It's all pretty standard:

- Commits have to be conventional
- When commiting changes, `fix` and `feat` should be reserved only for changes that will actually bump the semver i.e: fixing a typo or something trivial is more of a `chore` than a `fix`.
- Try to use the ISSUE and PULL_REQUEST templates where applicable.

## Getting started:

- Clone this repo onto your local environment:

```bash
git clone https://github.com/ndaba1/twinit
```

- Install deps and husky hooks

```bash
pnpm install && pnpm prepare
```

- **Make your changes**

- Build and link to first test changes locally

```bash
pnpm build && pnpm link .
```

- Test locally linked version

```bash
pnpm twinit
```

- If changes are successful, proceed to opening a PR
