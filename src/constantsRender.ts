
export const isTest = require("@electron/remote").process.env.IS_TEST;

export const version = require("@electron/remote").app.getVersion();
