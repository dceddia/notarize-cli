const { Command, flags } = require('@oclif/command');

const {
  getNotarizationInfo,
  notarizeApp,
  staple,
} = require('./util');

class NotarizeCliCommand extends Command {
  async run() {
    // eslint-disable-next-line no-shadow
    const { flags } = this.parse(NotarizeCliCommand);
    process.stdout.write('Uploading file... ');
    const { requestStatus, requestUuid } = await notarizeApp(
      flags.file,
      flags['apple-id'],
      flags['team-id'],
      flags.password,
    );

    if (requestStatus === 'Accepted' && !flags['no-staple']) {
      await staple(flags.file);
    }

    const notarizationInfo = await getNotarizationInfo(
      requestUuid,
      flags['apple-id'],
      flags['team-id'],
      flags.password,
    ).catch(() => undefined);
    // eslint-disable-next-line no-unused-expressions
    if (notarizationInfo) {
      const fs = require('fs');
      const timestamp = new Date().toISOString();
      fs.writeFileSync(`${timestamp}-notarization-log.json`, JSON.stringify(notarizationInfo, null, 2));
    } else {
      console.error('Error: could not get notarization info');
    }

    if (requestStatus !== 'Accepted') {
      console.error(`Error: could not notarize file`);
      this.exit(1);
    }
  }
}

NotarizeCliCommand.description = `Notarize a macOS app from the command line
`;

NotarizeCliCommand.flags = {
  file: flags.string({
    description: 'path to the file to notarize',
    required: true,
  }),
  'apple-id': flags.string({
    description: 'Apple ID to use for authentication',
    required: true,
    env: 'NOTARIZE_APPLE_ID',
  }),
  'team-id': flags.string({
    description: 'Team ID to use for authentication',
    required: true,
    env: 'NOTARIZE_TEAM_ID',
  }),
  password: flags.string({
    description: 'password to use for authentication',
    required: true,
    env: 'NOTARIZE_PASSWORD',
  }),
  'no-staple': flags.boolean({
    description: 'disable automatic stapling',
    default: false,
  }),
  version: flags.version({ char: 'v' }),
  help: flags.help({ char: 'h' }),
};

module.exports = NotarizeCliCommand;
