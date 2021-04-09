import * as crypto from 'crypto';
import * as fs from 'fs';
import * as libxmljs from 'libxmljs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { cli } from 'cli-ux';
const OpenTimestamps = require('opentimestamps');

import { XMLNS_PREFIX } from './constants';
import { findElements, ns, parseElement } from './util';

export interface Context {
  debug: void;
  log: void;
}

export type Page = {
  id: number;
  title: string;
};

export class RevisionLog {
  ctx: any;
  pages: Map<string, Page>;
  receipts: Map<string, string> | undefined;
  revisions: Array<Revision>;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.pages = new Map();
    this.revisions = new Array();
  }

  async fromFile(xml: string, receipts?: string) {
    // Load and parse the ".xml" export.
    const buf = await fs.readFileSync(xml);
    const doc = <libxmljs.Document>libxmljs.parseXml(buf.toString());
    this.ctx.debug(`xmlns=${ns(doc)[XMLNS_PREFIX]}`);

    if (receipts != undefined) {
      await this.loadReceipts(receipts);
    }

    // Parse the SITEINFO element for metadata about the export.
    const elSiteInfo = <any>await parseElement(doc, `${XMLNS_PREFIX}:siteinfo`);
    this.ctx.debug(
      `Loaded ${buf.length} bytes exported from ${elSiteInfo.siteinfo.sitename} running ${elSiteInfo.siteinfo.generator}`
    );

    // Find all REVISION elements.
    const elRevisions = findElements(doc, '//mw:revision');
    this.revisions = await Promise.all(
      elRevisions.map(async (el) => {
        const R = await Revision.fromElement(this, el);
        this.pages.set(R.page.title, R.page);
        return R;
      })
    );
  }

  print(flags: any) {
    cli.table(
      this.revisions,
      {
        page: { get: (row) => row.page.title },
        id: { header: 'ID' },
        timestamp: {},
        sha1: { header: 'SHA1' },
        _size: { header: 'Size' },
        _otsReceipt: {
          extended: true,
          header: 'Receipt',
          get: (row) => row.serializeReceipt(),
        },
      },
      { sort: 'id', ...flags }
    );
  }

  async loadReceipts(src: string) {
    const buf = await fs.readFileSync(src);
    this.receipts = new Map(Object.entries(JSON.parse(buf.toString())));
  }

  async saveReceipts(xmlFilename: string) {
    const dst = `${path.basename(xmlFilename)}.ots.json`;
    const obj = Object.fromEntries(
      this.revisions.map((rev) => [rev.sha1, rev.serializeReceipt()])
    );
    const buf = JSON.stringify(obj, null, 2);

    await fs.writeFileSync(dst, buf);
    this.ctx.log(`Wrote ${buf.length} bytes to receipt ${dst}`);
  }
}

export class Revision {
  static base = 'base64';

  page: Page;
  id: number;
  timestamp: string;

  // Cf. <https://www.mediawiki.org/wiki/Manual:Revision_table#rev_sha1>.
  // This is included as a convenience for looking up revisions by their
  // SHA1 value given in the MediaWiki export file.
  sha1: string;

  // Our metadata:
  _otsTimestamp: any;
  _sha256: string;
  _size: number;

  static async fromElement(
    log: RevisionLog | null,
    el: libxmljs.Element
  ): Promise<Revision> {
    const R = new Revision();

    const page = await xml2js.parseStringPromise(el.parent().toString());
    R.page = <Page>{
      title: page.page.title[0],
      id: page.page.id[0],
    };
    const revision = await xml2js.parseStringPromise(el.toString());
    R.id = revision.revision.id[0];
    R.sha1 = revision.revision.sha1[0];
    R.timestamp = revision.revision.timestamp[0];

    const buf = el.toString();
    R._size = buf.length;

    const hash = crypto.createHash('sha256');
    hash.update(buf);
    R._sha256 = hash.digest(<crypto.HexBase64Latin1Encoding>Revision.base);

    if (log?.receipts != undefined) {
      R._otsTimestamp = R.deserializeReceipt(log?.receipts.get(R.sha1));
    } else {
      R._otsTimestamp = OpenTimestamps.DetachedTimestampFile.fromHash(
        new OpenTimestamps.Ops.OpSHA256(),
        Buffer.from(R._sha256, Revision.base)
      );
    }

    return R;
  }

  deserializeReceipt(buf: string | undefined): string | undefined {
    if (buf == undefined) return undefined;

    return OpenTimestamps.DetachedTimestampFile.deserialize(
      Buffer.from(buf, Revision.base)
    );
  }

  serializeReceipt(): string {
    if (this._otsTimestamp == undefined) return '';

    return Buffer.from(this._otsTimestamp.serializeToBytes()).toString(
      Revision.base
    );
  }
}
