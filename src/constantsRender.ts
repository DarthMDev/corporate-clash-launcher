import {remote} from 'electron';

export let isTest = remote.process.env.IS_TEST;

export let version = remote.app.getVersion();
