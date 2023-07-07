
export let isTest = require("@electron/remote").process.env.IS_TEST;

export let version = require("@electron/remote").app.getVersion();
