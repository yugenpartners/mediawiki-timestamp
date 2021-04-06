import * as fs from 'fs';
import * as libxmljs from 'libxmljs';
import * as xml2js from 'xml2js';
import { Command, flags } from '@oclif/command';

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
    return { [xmlnsPrefix]: <string>doc.root()?.namespace()?.href() };
  }

  async parseElement(doc: libxmljs.Document, xpath: string): Promise<object> {
    return await xml2js.parseStringPromise(
      this.getElement(doc, xpath).toString()
    );
  }
}
