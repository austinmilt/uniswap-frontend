# Uniswap Frontend (Coding Challenge)
Uniswap is a decentralized cryptocurrency
exchange that uses a set of smart contracts
to execute trades on its exchange.

This site gives a minimal view into the status of
Uniswap v3. It was developed as part of a coding
challenge and should not be used to inform financial
decisions.

## Getting Started

### 1. Clone the repo
See instructions on GitHub for how to get the repo.
### 2. Install Dependencies
You will need the following
- [Node.js](https://nodejs.org/en/) (built on 18.x) runtime
- [yarn](https://yarnpkg.com/) dependency manager

You can also get Docker if you want to run this
in a container, though I developed without. See
the [template repo I used](https://github.com/nikitowsky/next-advanced-apollo-starter).

After you have the above dependencies, open the cloned
repo in a terminal and run

```
yarn
```

to install dependencies.

### 3. Run the Site Locally
In your terminal, run

```
yarn dev
```

See [package.json](./package.json) for other scripts.

## Contributing
Follow a standard development pipeline, i.e.
1. Create a new branch (e.g. `feature/new-swaps`)
2. Write failing tests that describe the feature.
3. Implement the feature to make the tests pass.
4. Create a PR.
5. Get your PR approved (and pass all tests).
6. Merge your PR. It will be automatically deployed.
