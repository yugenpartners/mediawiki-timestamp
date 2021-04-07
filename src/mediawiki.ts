import * as crypto from 'crypto';
import * as libxmljs from 'libxmljs';
import * as xml2js from 'xml2js';
const OpenTimestamps = require('opentimestamps');

type Page = {
  id: number;
  title: string;
};

type RevisionLog = Array<Revision>;

class Revision {
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

  static async fromElement(el: libxmljs.Element): Promise<Revision> {
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

    R._otsTimestamp = OpenTimestamps.DetachedTimestampFile.fromHash(
      new OpenTimestamps.Ops.OpSHA256(),
      Buffer.from(R._sha256, Revision.base)
    );

    return R;
  }

  serializeReceipt(): string {
    return Buffer.from(this._otsTimestamp.serializeToBytes()).toString(
      Revision.base
    );
  }
}

export { Page, Revision, RevisionLog };
