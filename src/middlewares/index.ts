import { cooldown } from './cooldown';
import { executeCommand } from './executeCommand';
import { guildOnly } from './guildCheck';
import { logging } from './logging';
import { metrics } from './metrics';
import { ownerOnly } from './ownerCheck';
import { permissions } from './permissionCheck';
import { createPipeline } from './pipeline';

export const commandPipeline = createPipeline([
    logging,
    metrics,
    cooldown,
    ownerOnly,
    guildOnly,
    permissions,
    executeCommand,
]);
