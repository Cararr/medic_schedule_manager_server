import { configure, getLogger } from 'log4js';
configure('./configs/log4js.config.json');
export const logger = getLogger();
