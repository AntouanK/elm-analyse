import { Config, ElmApp, LogMessage } from '../domain';

export function setup(app: ElmApp, config: Config) {
    // if the --logging flag is set, log all messages to the console
    if (config.logging && config.format === 'human') {
        app.ports.log.subscribe((data: LogMessage) => {
            console.log(data.level + ':', data.message);
        });
    }
}
