import { cli } from 'cli-ux';
import { Command, flags } from '@oclif/command';

import { Context, RevisionLog } from '../mediawiki';

export default class Verify extends Command {
  static description =
    'verify a MediaWiki ".xml" export against a collection of OpenTimestamps receipts';
  static flags = {
    ...cli.table.flags(),
  };
  static args = [
    {
      name: 'export',
      description: '".xml" export from MediaWiki',
      required: true,
    },
    {
      name: 'receipts',
      description: '".xml.ots.json" receipt collection from mwts',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = this.parse(Verify);

    const revlog = new RevisionLog(<Context>(<unknown>this));
    cli.action.start(`Replaying ${args.export}`);
    await revlog.fromFile(args.export, args.receipts);
    cli.action.stop(
      `${revlog.revisions.length} revisions of ${revlog.pages.size} pages:`
    );
    revlog.print(flags);
  }
}
