import * as fs from 'fs';
import * as libxmljs from 'libxmljs';
import * as xml2js from 'xml2js';
import { cli } from 'cli-ux';
import { Command, flags } from '@oclif/command';
const OpenTimestamps = require('opentimestamps');

import { Revision, RevisionLog } from '../mediawiki';

const xmlnsPrefix: string = 'mw';

export default class Stamp extends Command {
  static description = 'timestamp a MediaWiki export';
  static args = [
    { name: 'export', description: 'MediaWiki ".xml" export', required: true },
  ];

  async run() {
    const { args, flags } = this.parse(Stamp);

    // Load and parse the ".xml" export.
    const buf = await fs.readFileSync(args.export);
    const doc = <libxmljs.Document>libxmljs.parseXml(buf.toString());
    this.debug(`xmlns=${this.ns(doc)[xmlnsPrefix]}`);

    // Parse the SITEINFO element for metadata about the export.
    const elSiteInfo = <any>(
      await this.parseElement(doc, `${xmlnsPrefix}:siteinfo`)
    );
    this.log(
      `Loaded ${buf.length} bytes exported from ${elSiteInfo.siteinfo.sitename} running ${elSiteInfo.siteinfo.generator}`
    );

    // Find all REVISION elements.
    const elRevisions = this.findElements(doc, '//mw:revision');
    const revlog = await Promise.all(
      elRevisions.map(async (el) => Revision.fromElement(el))
    );
    const pages = new Set(revlog.map((rev) => rev.page.title));

    this.log(`Replayed ${revlog.length} revisions of ${pages.size} pages:`);
    this.printRevisionLog(revlog);

    const stamps = await this.stampRevisionLog(revlog);
    this.log(JSON.stringify(stamps));
  }

  findElements(doc: libxmljs.Document, xpath: string): Array<libxmljs.Element> {
    return doc.find(xpath, this.ns(doc));
  }

  getElement(doc: libxmljs.Document, xpath: string): libxmljs.Element {
    return <libxmljs.Element>doc.get(xpath, this.ns(doc));
  }

  ns(doc: libxmljs.Document): libxmljs.StringMap {
    return { [xmlnsPrefix]: <string>doc.root()?.namespace()?.href() };
  }

  async parseElement(doc: libxmljs.Document, xpath: string): Promise<object> {
    return await xml2js.parseStringPromise(
      this.getElement(doc, xpath).toString()
    );
  }

  printRevisionLog(revlog: RevisionLog) {
    cli.table(
      revlog,
      {
        page: { get: (row) => row.page.title },
        id: { header: 'ID' },
        timestamp: {},
        sha1: { header: 'SHA1' },
        _sha256: { header: 'SHA256' },
        _size: { header: 'Size' },
      },
      { sort: 'id' }
    );
  }

  async stampRevisionLog(revlog: RevisionLog) {
    // Build of a map of (SHA1, timestamp) pairs.
    const detaches = new Map(
      revlog.map((rev) => {
        this.printRevisionLog([rev]);
        return [
          rev.sha1,
          OpenTimestamps.DetachedTimestampFile.fromHash(
            new OpenTimestamps.Ops.OpSHA256(),
            Buffer.from(rev._sha256, 'base64')
          ),
        ];
      })
    );
    // Submit all the timestamps in one batch (tree).
    await OpenTimestamps.stamp([...detaches.values()]);
    return detaches;
  }
}
