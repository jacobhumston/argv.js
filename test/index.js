import * as module from '../';
import process from 'node:process';

const s = new module.Parser('positional', { arguments: [{ name: 'cheese', required: true }] });

const a = await s.parse("s")
a.expected["cheese"].value