# BeeWar FE

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

And it's not yet ejected. Don't eject pls

## Quickstart

Setup local config file: Copy contents of `.env.template` to `.env`

Get npm

```text
// install deps
npm install
// start server
npm start
```

To lint before commit

```text
npm run lint
```

You can see `package.json` to see other commands too (in the scripts section), but don't eject pls.

### Local Proxy

See `setupProxy.js` for the proxy settings by `http-proxy-middleware`.
Check the addresses in `.env` file too.
Keep in mind, this only works in development (locally), and not in production,
because in production, you don't run `npm start`.

## Deploy to Heroku

In heroku, the buildpack uses nginx and a static build of the react app.
To set environment variables, you need to open the settings of the heroku project.
Please keep the environment variables in heroku settings and in `.env.heroku` file synced.

In `origin/master` branch,
```text
// deploy
git push heroku master
// see logs
heroku logs --tail
```

### Production Proxy

Open this document: https://elements.heroku.com/buildpacks/mars/create-react-app-buildpack.
See the "proxy for deployment" section.
We have `static.json` file.
