// Top level file is just a mixin of submodules & constants
'use strict';

import { Deflate, deflate, deflateRaw, gzip } from './lib/deflate.js';

import { Inflate, inflate, inflateRaw, ungzip } from './lib/inflate.js';

import * as constants from './lib/zlib/constants.js';

const _Deflate = Deflate;
export { _Deflate as Deflate };
const _deflate = deflate;
export { _deflate as deflate };
const _deflateRaw = deflateRaw;
export { _deflateRaw as deflateRaw };
const _gzip = gzip;
export { _gzip as gzip };
const _Inflate = Inflate;
export { _Inflate as Inflate };
const _inflate = inflate;
export { _inflate as inflate };
const _inflateRaw = inflateRaw;
export { _inflateRaw as inflateRaw };
const _ungzip = ungzip;
export { _ungzip as ungzip };
const _constants = constants;
export { _constants as constants };
