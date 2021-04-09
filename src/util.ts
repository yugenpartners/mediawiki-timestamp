import * as libxmljs from 'libxmljs';
import * as xml2js from 'xml2js';

import { XMLNS_PREFIX } from './constants';

export function findElements(
  doc: libxmljs.Document,
  xpath: string
): Array<libxmljs.Element> {
  return doc.find(xpath, ns(doc));
}

export function getElement(
  doc: libxmljs.Document,
  xpath: string
): libxmljs.Element {
  return <libxmljs.Element>doc.get(xpath, ns(doc));
}

export function ns(doc: libxmljs.Document): libxmljs.StringMap {
  return { [XMLNS_PREFIX]: <string>doc.root()?.namespace()?.href() };
}

export async function parseElement(
  doc: libxmljs.Document,
  xpath: string
): Promise<object> {
  return await xml2js.parseStringPromise(getElement(doc, xpath).toString());
}
