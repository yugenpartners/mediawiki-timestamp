import { cli } from 'cli-ux';
import { Command, flags } from '@oclif/command';

import {
  Context,
  Revision,
  RevisionLog,
  VerificationStatus,
} from '../mediawiki';

export default class Verify extends Command {
  static description =
    'verify a MediaWiki ".xml" export against a ".ots.json" collection of OpenTimestamps receipts';
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

  columns = {
    _verificationStatus: {
      header: 'Verification',
      get: (rev: Revision) => VerificationStatus[rev._verificationStatus],
    },
    _verificationResult: {
      extended: true,
      get: (rev: Revision) => rev._verificationResult || '',
      header: 'Verification Result',
    },
  };

  async run() {
    const { args, flags } = this.parse(Verify);

    const revlog = new RevisionLog(<Context>(<unknown>this));

    cli.action.start(`Replaying ${args.export}`);
    await revlog.fromFile(args.export, args.receipts);
    cli.action.stop(
      `${revlog.revisions.length} revisions of ${revlog.pages.size} pages:`
    );

    cli.action.start('Verifying receipts');
    await revlog.verify();
    cli.action.stop();

    revlog.print(flags);
  }
}
