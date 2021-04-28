# Contributing

## Directories

```
├── public/
├── src/
│   ├── index.js
│   ├── context.js
│   ├── setupProxy.js
│   ├── view/ (main pages are located here)
│   │   ├── App.js (contains main routing logic)
│   │   │   Routings can also be nested into other directories
│   │   └── game/ (example nested directory)
│   ├── components/ (React components)
│   │   └── navigation/ (example. this is for navigation bar)
│   ├── modules/ (big modules that is not a react component)
│   │   └── api/ (all http api calls has to be in this module)
│   ├── pixi/ (pixijs related classes)
│   └── utils/ (utility functions)
├── .env (these are configs)
├── README.md
```

## CSS styling

We use BEM convention.
Check this out: https://css-tricks.com/bem-101/

## eslint

Before commiting, make sure to run the lint scripts.

```text
// normal lint
npm run lint
// some errors/warnings can be fixed automatically
npm run lint-fix
```

The complete rules can be seen in `package.json`
