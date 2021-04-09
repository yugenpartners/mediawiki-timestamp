import { cli } from 'cli-ux';
import { Command, flags } from '@oclif/command';
const OpenTimestamps = require('opentimestamps');

import { Context, RevisionLog } from '../mediawiki';

export default class Stamp extends Command {
  static description = 'timestamp a MediaWiki export';
  static flags = {
    ...cli.table.flags(),
  };
  static args = [
    { name: 'export', description: 'MediaWiki ".xml" export', required: true },
  ];

  async run() {
    const { args, flags } = this.parse(Stamp);

    // FIXME: <Context>(<unknown>this) has a code-smell.
    const revlog = new RevisionLog(<Context>(<unknown>this));
    cli.action.start(`Replaying ${args.export}`);
    await revlog.fromFile(args.export);
    cli.action.stop(
      `${revlog.revisions.length} revisions of ${revlog.pages.size} pages:`
    );
    revlog.print(flags);

    cli.action.start('Submitting to OpenTimestamps');
    await OpenTimestamps.stamp(
      revlog.revisions.map((rev) => rev._otsTimestamp)
    );
    cli.action.stop(`${revlog.revisions.length} timestamps`);

    await revlog.saveReceipts(args.export);
  }
}
