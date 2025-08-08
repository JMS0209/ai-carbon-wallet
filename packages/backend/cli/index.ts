#!/usr/bin/env node

import { Command } from 'commander';
import { assignRole } from './commands/provisionRole';
import { revokeRole } from './commands/revokeRole';
import { checkRole } from './commands/checkRole';
import { viewLog } from './commands/viewLog';

const program = new Command();

program
  .name('role-cli')
  .description('CLI for managing Sui roles via Seal')
  .version('0.1.0');

program
  .command('assign')
  .description('Assign a role to an address')
  .requiredOption('--address <address>', 'Target address')
  .requiredOption('--role <role>', 'Role name')
  .action(assignRole);

program
  .command('revoke')
  .description('Revoke a role from an address')
  .requiredOption('--address <address>', 'Target address')
  .requiredOption('--role <role>', 'Role name')
  .action(revokeRole);

program
  .command('check')
  .description('Check if an address has a role')
  .requiredOption('--address <address>', 'Target address')
  .requiredOption('--role <role>', 'Role name')
  .action(checkRole);

program
  .command('log')
  .description('View recent role changes')
  .action(viewLog);

program.parse();