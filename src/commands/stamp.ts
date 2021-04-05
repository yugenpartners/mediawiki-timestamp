import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { Command, flags } from '@oclif/command'

export default class Stamp extends Command {
  static description = 'timestamp a MediaWiki export'

  static args = [{ name: 'export', description: 'MediaWiki ".xml" export', required: true }]

  async run() {
    const { args, flags } = this.parse(Stamp)

    const data = await fs.readFileSync(args.export)
    const xml = await xml2js.parseStringPromise(data);

    const siteinfo = xml.mediawiki.siteinfo[0];
    this.log(`Loaded ${data.length} bytes from ${siteinfo.sitename} running ${siteinfo.generator}`);
  }
}
