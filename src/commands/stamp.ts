import * as fs from 'fs';
import * as libxmljs from 'libxmljs';
import * as xml2js from 'xml2js';
import { Command, flags } from '@oclif/command';

export default class Stamp extends Command {
  static description = 'timestamp a MediaWiki export';
  static args = [
    { name: 'export', description: 'MediaWiki ".xml" export', required: true },
  ];

  static prefix = 'mw';

  async run() {
    const { args, flags } = this.parse(Stamp);

    // Load and parse the ".xml" export.
    const data = await fs.readFileSync(args.export);
    const doc = <libxmljs.Document>libxmljs.parseXml(data);
    this.debug(`xmlns=${this.ns(doc).mw}`);

    // Parse the SITEINFO element for metadata about the export.
    const siteinfo = await this.parseElement(doc, 'mw:siteinfo');
    this.log(
      `Loaded ${data.length} bytes exported from ${siteinfo.siteinfo.sitename} running ${siteinfo.siteinfo.generator}`
    );

    // Find all PAGE elements.
    const pages = this.findElements(doc, '//mw:page');
    this.log(`Found ${pages.length} pages`);
  }

  findElements(doc: libxmljs.Document, xpath: string): Array<libxmljs.Element> {
    return doc.find(xpath, this.ns(doc));
  }

  getElement(doc: libxmljs.Document, xpath: string): libxmljs.Element {
    return <libxmljs.Element>doc.get(xpath, this.ns(doc));
  }

  ns(doc: libxmljs.Document): libxmljs.StringMap {
    return { [Stamp.prefix]: <string>doc.root()?.namespace()?.href() };
  }

  async parseElement(doc: libxmljs.Document, xpath: string): Promise<object> {
    return await xml2js.parseStringPromise(
      <string>this.getElement(doc, xpath).toString()
    );
  }
}
