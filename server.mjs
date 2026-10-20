import { createRequire } from 'module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../opt/npm-tools/node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib3 = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib3.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib3.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib3.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib3.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib3.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var {
      types: { isUint8Array }
    } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage2(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http2 = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL2 } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http2.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http2 = __require("http");
    var { Duplex } = __require("stream");
    var { createHash } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http2.createServer((req, res) => {
            const body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server2 = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server2.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server2, map) {
      for (const event of Object.keys(map)) server2.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server2.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server2) {
      server2._state = CLOSED;
      server2.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http2.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server2, req, socket, code, message, headers) {
      if (server2.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server2.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// server/index.ts
import http from "node:http";
import fs2 from "node:fs";
import path2 from "node:path";
import zlib2 from "node:zlib";
import crypto3 from "node:crypto";

// ../../../opt/npm-tools/node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// src/data/languages.ts
var LANGS = [
  { code: "en", name: "English", native: "English" },
  { code: "ur", name: "Urdu", native: "\u0627\u0631\u062F\u0648" },
  { code: "hi", name: "Hindi", native: "\u0939\u093F\u0928\u094D\u0926\u0940" },
  { code: "ar", name: "Arabic", native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "\u7B80\u4F53\u4E2D\u6587" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "\u7E41\u9AD4\u4E2D\u6587" },
  { code: "es", name: "Spanish", native: "Espa\xF1ol" },
  { code: "fr", name: "French", native: "Fran\xE7ais" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Portugu\xEAs" },
  { code: "ru", name: "Russian", native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
  { code: "ja", name: "Japanese", native: "\u65E5\u672C\u8A9E" },
  { code: "ko", name: "Korean", native: "\uD55C\uAD6D\uC5B4" },
  { code: "tr", name: "Turkish", native: "T\xFCrk\xE7e" },
  { code: "fa", name: "Persian", native: "\u0641\u0627\u0631\u0633\u06CC" },
  { code: "bn", name: "Bengali", native: "\u09AC\u09BE\u0982\u09B2\u09BE" },
  { code: "pa", name: "Punjabi", native: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40" },
  { code: "ps", name: "Pashto", native: "\u067E\u069A\u062A\u0648" },
  { code: "sd", name: "Sindhi", native: "\u0633\u0646\u068C\u064A" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "uk", name: "Ukrainian", native: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" },
  { code: "vi", name: "Vietnamese", native: "Ti\u1EBFng Vi\u1EC7t" },
  { code: "th", name: "Thai", native: "\u0E44\u0E17\u0E22" },
  { code: "tl", name: "Filipino", native: "Filipino" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "sq", name: "Albanian", native: "Shqip" },
  { code: "am", name: "Amharic", native: "\u12A0\u121B\u122D\u129B" },
  { code: "hy", name: "Armenian", native: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576" },
  { code: "as", name: "Assamese", native: "\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE" },
  { code: "ay", name: "Aymara", native: "Aymar aru" },
  { code: "az", name: "Azerbaijani", native: "Az\u0259rbaycan" },
  { code: "bm", name: "Bambara", native: "Bamanankan" },
  { code: "eu", name: "Basque", native: "Euskara" },
  { code: "be", name: "Belarusian", native: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F" },
  { code: "bho", name: "Bhojpuri", native: "\u092D\u094B\u091C\u092A\u0941\u0930\u0940" },
  { code: "bs", name: "Bosnian", native: "Bosanski" },
  { code: "bg", name: "Bulgarian", native: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438" },
  { code: "ca", name: "Catalan", native: "Catal\xE0" },
  { code: "ceb", name: "Cebuano", native: "Cebuano" },
  { code: "ny", name: "Chichewa", native: "Chichewa" },
  { code: "co", name: "Corsican", native: "Corsu" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "cs", name: "Czech", native: "\u010Ce\u0161tina" },
  { code: "da", name: "Danish", native: "Dansk" },
  { code: "dv", name: "Dhivehi", native: "\u078B\u07A8\u0788\u07AC\u0780\u07A8" },
  { code: "doi", name: "Dogri", native: "\u0921\u094B\u0917\u0930\u0940" },
  { code: "eo", name: "Esperanto", native: "Esperanto" },
  { code: "et", name: "Estonian", native: "Eesti" },
  { code: "ee", name: "Ewe", native: "E\u028Begbe" },
  { code: "fi", name: "Finnish", native: "Suomi" },
  { code: "fy", name: "Frisian", native: "Frysk" },
  { code: "gl", name: "Galician", native: "Galego" },
  { code: "ka", name: "Georgian", native: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8" },
  { code: "el", name: "Greek", native: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC" },
  { code: "gn", name: "Guarani", native: "Ava\xF1e'\u1EBD" },
  { code: "gu", name: "Gujarati", native: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0" },
  { code: "ht", name: "Haitian Creole", native: "Krey\xF2l ayisyen" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "haw", name: "Hawaiian", native: "\u02BB\u014Clelo Hawai\u02BBi" },
  { code: "he", name: "Hebrew", native: "\u05E2\u05D1\u05E8\u05D9\u05EA" },
  { code: "hmn", name: "Hmong", native: "Hmoob" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "is", name: "Icelandic", native: "\xCDslenska" },
  { code: "ig", name: "Igbo", native: "Igbo" },
  { code: "ilo", name: "Ilocano", native: "Ilokano" },
  { code: "ga", name: "Irish", native: "Gaeilge" },
  { code: "jv", name: "Javanese", native: "Basa Jawa" },
  { code: "kn", name: "Kannada", native: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1" },
  { code: "kk", name: "Kazakh", native: "\u049A\u0430\u0437\u0430\u049B" },
  { code: "km", name: "Khmer", native: "\u1781\u17D2\u1798\u17C2\u179A" },
  { code: "rw", name: "Kinyarwanda", native: "Kinyarwanda" },
  { code: "gom", name: "Konkani", native: "\u0915\u094B\u0902\u0915\u0923\u0940" },
  { code: "kri", name: "Krio", native: "Krio" },
  { code: "ku", name: "Kurdish (Kurmanji)", native: "Kurd\xEE" },
  { code: "ckb", name: "Kurdish (Sorani)", native: "\u06A9\u0648\u0631\u062F\u06CC" },
  { code: "ky", name: "Kyrgyz", native: "\u041A\u044B\u0440\u0433\u044B\u0437\u0447\u0430" },
  { code: "lo", name: "Lao", native: "\u0EA5\u0EB2\u0EA7" },
  { code: "la", name: "Latin", native: "Latina" },
  { code: "lv", name: "Latvian", native: "Latvie\u0161u" },
  { code: "ln", name: "Lingala", native: "Ling\xE1la" },
  { code: "lt", name: "Lithuanian", native: "Lietuvi\u0173" },
  { code: "lg", name: "Luganda", native: "Luganda" },
  { code: "lb", name: "Luxembourgish", native: "L\xEBtzebuergesch" },
  { code: "mk", name: "Macedonian", native: "\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438" },
  { code: "mai", name: "Maithili", native: "\u092E\u0948\u0925\u093F\u0932\u0940" },
  { code: "mg", name: "Malagasy", native: "Malagasy" },
  { code: "ml", name: "Malayalam", native: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02" },
  { code: "mt", name: "Maltese", native: "Malti" },
  { code: "mi", name: "Maori", native: "M\u0101ori" },
  { code: "mr", name: "Marathi", native: "\u092E\u0930\u093E\u0920\u0940" },
  { code: "mni-Mtei", name: "Meiteilon (Manipuri)", native: "\uABC3\uABE4\uABC7\uABE9\uABC2\uABE3\uABDF" },
  { code: "lus", name: "Mizo", native: "Mizo \u1E6Dawng" },
  { code: "mn", name: "Mongolian", native: "\u041C\u043E\u043D\u0433\u043E\u043B" },
  { code: "my", name: "Myanmar (Burmese)", native: "\u1019\u103C\u1014\u103A\u1019\u102C" },
  { code: "ne", name: "Nepali", native: "\u0928\u0947\u092A\u093E\u0932\u0940" },
  { code: "no", name: "Norwegian", native: "Norsk" },
  { code: "or", name: "Odia (Oriya)", native: "\u0B13\u0B21\u0B3C\u0B3F\u0B06" },
  { code: "om", name: "Oromo", native: "Afaan Oromoo" },
  { code: "qu", name: "Quechua", native: "Runa Simi" },
  { code: "ro", name: "Romanian", native: "Rom\xE2n\u0103" },
  { code: "sm", name: "Samoan", native: "Gagana S\u0101moa" },
  { code: "sa", name: "Sanskrit", native: "\u0938\u0902\u0938\u094D\u0915\u0943\u0924\u092E\u094D" },
  { code: "gd", name: "Scots Gaelic", native: "G\xE0idhlig" },
  { code: "nso", name: "Sepedi", native: "Sepedi" },
  { code: "sr", name: "Serbian", native: "\u0421\u0440\u043F\u0441\u043A\u0438" },
  { code: "st", name: "Sesotho", native: "Sesotho" },
  { code: "sn", name: "Shona", native: "chiShona" },
  { code: "si", name: "Sinhala", native: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD" },
  { code: "sk", name: "Slovak", native: "Sloven\u010Dina" },
  { code: "sl", name: "Slovenian", native: "Sloven\u0161\u010Dina" },
  { code: "so", name: "Somali", native: "Soomaali" },
  { code: "su", name: "Sundanese", native: "Basa Sunda" },
  { code: "sv", name: "Swedish", native: "Svenska" },
  { code: "tg", name: "Tajik", native: "\u0422\u043E\u04B7\u0438\u043A\u04E3" },
  { code: "ta", name: "Tamil", native: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD" },
  { code: "tt", name: "Tatar", native: "\u0422\u0430\u0442\u0430\u0440" },
  { code: "te", name: "Telugu", native: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41" },
  { code: "ti", name: "Tigrinya", native: "\u1275\u130D\u122D\u129B" },
  { code: "ts", name: "Tsonga", native: "Xitsonga" },
  { code: "tk", name: "Turkmen", native: "T\xFCrkmen" },
  { code: "ak", name: "Twi", native: "Twi" },
  { code: "ug", name: "Uyghur", native: "\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5" },
  { code: "uz", name: "Uzbek", native: "O'zbek" },
  { code: "cy", name: "Welsh", native: "Cymraeg" },
  { code: "xh", name: "Xhosa", native: "isiXhosa" },
  { code: "yi", name: "Yiddish", native: "\u05D9\u05D9\u05B4\u05D3\u05D9\u05E9" },
  { code: "yo", name: "Yoruba", native: "Yor\xF9b\xE1" },
  { code: "zu", name: "Zulu", native: "isiZulu" }
];
var langName = (code) => LANGS.find((l) => l.code === code)?.name || "English";

// server/edu.ts
import crypto from "node:crypto";
var TYPES = ["school", "college", "university", "institute"];
var ACADEMY = "academy";
var B32 = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
var newCode = () => {
  const b = crypto.randomBytes(12);
  let s = "";
  for (let i = 0; i < 12; i++) s += B32[b[i] % B32.length];
  return `FC-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
};
function seed() {
  const now = Date.now();
  const inst = { id: ACADEMY, owner: ACADEMY, type: "institute", name: "Fyrus Academy", tagline: "Free starter courses from the Ministry of Education", color: "#2f6fe0", staff: [ACADEMY], verified: true, at: now };
  const t = { id: ACADEMY, name: "Fyrus Academy instructors", subject: "AI, prompts and selling safely", bio: "The Ministry of Education team that teaches every new arrival the basics. Courses are free.", at: now };
  const C = (id, title, summary, skills, level, lessons) => ({ id, teacher: ACADEMY, teacherName: t.name, inst: ACADEMY, instName: inst.name, title, summary, skills, level, fee: 0, lessons, students: 0, at: now });
  const courses = [
    C("agents-101", "AI Agents 101: build your first agent", "What an AI agent is, how to give it a job, tools and memory, and how to test it before you sell it.", ["AI agents", "Prompt design", "Testing"], "Beginner", [
      { title: "What is an AI agent?", body: "An AI agent is a language model that is given a goal, instructions and tools, and then works in steps until the goal is done. A chatbot answers one message; an agent plans, uses tools (search, a calculator, your files) and checks its own work.\n\nIn Fyrus you can sell agents in your shop. Buyers try a live demo first, so a clear, reliable agent sells best.", q: "What makes an agent different from a simple chatbot?", opts: ["It has a nicer avatar", "It works in steps towards a goal and can use tools", "It only speaks English"], ans: 1 },
      { title: "Give it one clear job", body: 'Agents fail most often because the job is vague. Write the job in one sentence ("Turn a product photo and price into a shop listing"). Then list: who the user is, what a good result looks like, what it must never do, and the exact output format.\n\nShort, specific instructions beat long, general ones.', q: "Which job description is best?", opts: ["Be helpful with business stuff", "Turn a product photo and price into a 60-word shop listing with 3 bullet points", "Do anything the user asks"], ans: 1 },
      { title: "Tools and memory", body: "Tools let an agent act: look things up, calculate, read a file, call an API. Give only the tools the job needs. Memory lets it remember facts between steps or sessions; keep it to what is useful (the user's shop name, preferred tone) and never store passwords or card numbers.", q: "What should an agent never store in memory?", opts: ["The shop name", "The preferred tone", "Passwords and card numbers"], ans: 2 },
      { title: "Test before you sell", body: "Make a list of 10 real requests, including 3 tricky ones (missing information, a rude user, a request it must refuse). Run them all, note every bad answer, fix the instructions and run them again. Keep the list; run it after every change.", q: "How many test requests should include tricky cases in the example?", opts: ["None", "3 of 10", "All of them"], ans: 1 },
      { title: "Publish in your shop", body: "Open a shop from the dock (Learn & Work \u2192 Open a shop), choose AI agent, write the job in the tagline and set a fair price. Turn on the live demo so buyers can try it. Answer reviews; good reviews bring more visitors from the market street." }
    ]),
    C("prompts-basics", "Prompt Writing Basics", "Write prompts that get the same good answer every time: role, task, context, format and examples.", ["Prompt writing", "Clear instructions"], "Beginner", [
      { title: "The five parts of a prompt", body: "A strong prompt has: a role (who the model is), the task, the context it needs, the output format and, when useful, an example. Missing context is the most common reason for a weak answer.", q: "Which is the most common reason for a weak answer?", opts: ["Missing context", "Too many emojis", "Using English"], ans: 0 },
      { title: "Show, don't only tell", body: "One good example of the answer you want is worth a paragraph of rules. If you need a table, show a two-row table. If you need a tone, paste a sentence in that tone." },
      { title: "Ask for the format", body: 'Say exactly how the answer should look: "three bullet points", "JSON with keys name and price", "under 80 words". Formats make answers easy to use and easy to check.', q: "Which instruction controls the format?", opts: ["Be smart", "Reply as JSON with keys name and price", "Think hard"], ans: 1 },
      { title: "Iterate", body: "Treat a prompt like code: change one thing at a time, keep the versions that work, and test with the same inputs each time." }
    ]),
    C("sell-safely", "Selling and buying safely in Fyrus", "How escrow works, how to spot a scam, and what to do if a deal goes wrong.", ["Escrow", "Trust & safety", "Customer care"], "Beginner", [
      { title: "Escrow in one minute", body: "When a buyer pays, the money waits in the Central Bank escrow. The seller is paid when the digital file is delivered or the parcel arrives, after a short inspection window. Neither side can run away with the money.", q: "Where does the money wait during a deal?", opts: ["In the seller's wallet", "In Central Bank escrow", "Nowhere"], ans: 1 },
      { title: "Spotting a scam", body: 'Red flags: someone asks you to pay outside Fyrus, sends a link to "verify" your account, asks for a password or card number, or pushes you to hurry. Fyrus staff never ask for passwords.', q: "Which one is a red flag?", opts: ["A clear product photo", "A request to pay outside Fyrus", "A delivery date"], ans: 1 },
      { title: "When something goes wrong", body: "Keep the conversation inside Fyrus, take screenshots, and file a case at the Law & Court office within the inspection window. The court can freeze the payment and refund the buyer when the seller did not deliver." }
    ])
  ];
  return { inst: { [ACADEMY]: inst }, teachers: { [ACADEMY]: t }, courses: Object.fromEntries(courses.map((c) => [c.id, c])) };
}
function createEdu(d) {
  if (!d.db.edu) {
    d.db.edu = { ...seed(), enr: {}, certs: {}, earn: {}, secret: crypto.randomBytes(32).toString("hex") };
    d.save();
  }
  const E = d.db.edu;
  const SECRET = process.env.CERT_SECRET || E.secret;
  const sign = (c) => crypto.createHmac("sha256", SECRET).update(JSON.stringify([c.code, c.student, c.studentName, c.teacher, c.teacherName, c.instName || "", c.course, c.courseTitle, c.skills, c.level, c.lessons, c.issuedAt])).digest("hex").slice(0, 32);
  const valid = (c) => !!c && c.sig === sign(c);
  const forStudent = (c) => ({ ...c, lessons: c.lessons.map((l) => ({ title: l.title, body: l.body, video: l.video, q: l.q, opts: l.opts })) });
  const nameOf2 = (id) => id === ACADEMY ? E.teachers[ACADEMY].name : d.db.users[id]?.name || "Citizen";
  const canTeachAt = (uid, instId) => !instId || E.inst[instId] && (E.inst[instId].owner === uid || E.inst[instId].staff.includes(uid));
  const changed = () => {
    d.save();
    d.broadcast({ t: "edu_changed" });
  };
  function issue(en, by) {
    const c = E.courses[en.course];
    if (!c) return "No such course.";
    if (c.teacher !== by) return "Only the teacher of this course can issue its certificate.";
    if (!en.completedAt) return "The student has not finished every lesson yet.";
    if (en.cert && E.certs[en.cert]) return E.certs[en.cert];
    const i = c.inst ? E.inst[c.inst] : void 0;
    const base = { code: newCode(), student: en.user, studentName: d.db.users[en.user]?.name || en.userName, teacher: c.teacher, teacherName: nameOf2(c.teacher), inst: i?.id, instName: i?.name, instType: i?.type, instVerified: i?.verified, course: c.id, courseTitle: c.title, skills: c.skills, level: c.level, lessons: c.lessons.length, issuedAt: Date.now() };
    const cert = { ...base, sig: sign(base) };
    E.certs[cert.code] = cert;
    en.cert = cert.code;
    d.save();
    d.news?.("education", `Certificate issued: "${c.title}"${i ? ` at ${i.name}` : ""}`);
    const l = d.liveOf(en.user);
    if (l) d.send(l.ws, { t: "edu_certified", cert });
    return cert;
  }
  function mine(uid) {
    const teaching = Object.values(E.courses).filter((c) => c.teacher === uid);
    const ids = new Set(teaching.map((c) => c.id));
    const earn = E.earn[uid] || 0;
    if (earn) {
      E.earn[uid] = 0;
      d.save();
    }
    return {
      t: "edu_mine",
      teacher: E.teachers[uid] || null,
      enr: Object.values(E.enr).filter((e) => e.user === uid),
      certs: Object.values(E.certs).filter((c) => c.student === uid),
      inst: Object.values(E.inst).filter((i) => i.owner === uid || i.staff.includes(uid)),
      teaching,
      students: Object.values(E.enr).filter((e) => ids.has(e.course)).map((e) => ({ ...e, total: E.courses[e.course].lessons.length })),
      earn
    };
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("edu_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "edu_list":
        reply({ t: "edu_list", inst: Object.values(E.inst), teachers: Object.values(E.teachers), courses: Object.values(E.courses).map(forStudent) });
        return true;
      case "edu_mine":
        reply(mine(u.id));
        return true;
      case "edu_teacher": {
        const subject = d.clean(m.subject, 60), bio = d.clean(m.bio, 400);
        if (!subject) {
          err("Add the subject you teach.");
          return true;
        }
        E.teachers[u.id] = { id: u.id, name: u.name, subject, bio, at: E.teachers[u.id]?.at || Date.now() };
        changed();
        reply(mine(u.id));
        return true;
      }
      case "edu_inst": {
        const type = TYPES.includes(m.type) ? m.type : null;
        const name = d.clean(m.name, 60);
        if (!type || name.length < 3) {
          err("Pick a type and a name of at least 3 letters.");
          return true;
        }
        if (Object.values(E.inst).filter((i2) => i2.owner === u.id).length >= 3) {
          err("You can register up to 3 institutions.");
          return true;
        }
        if (Object.values(E.inst).some((i2) => i2.name.toLowerCase() === name.toLowerCase())) {
          err("That name is already registered.");
          return true;
        }
        const i = { id: "i" + d.rid(6), owner: u.id, type, name, tagline: d.clean(m.tagline, 120), color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#2f6fe0", staff: [u.id], verified: false, at: Date.now() };
        E.inst[i.id] = i;
        if (!E.teachers[u.id]) E.teachers[u.id] = { id: u.id, name: u.name, subject: type === "school" ? "School teacher" : "Instructor", bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        return true;
      }
      case "edu_staff": {
        const i = E.inst[m.inst];
        if (!i || i.owner !== u.id) {
          err("Only the owner can add teachers.");
          return true;
        }
        const x = d.findByNumber(String(m.number || ""));
        if (!x) {
          err("No citizen has that number.");
          return true;
        }
        if (!i.staff.includes(x.id)) i.staff.push(x.id);
        if (!E.teachers[x.id]) E.teachers[x.id] = { id: x.id, name: x.name, subject: `Teacher at ${i.name}`, bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        const l = d.liveOf(x.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} added you as a teacher at ${i.name}.` });
        return true;
      }
      case "edu_course": {
        if (!E.teachers[u.id]) {
          err("Register as a teacher first.");
          return true;
        }
        const instId = m.inst ? String(m.inst) : void 0;
        if (!canTeachAt(u.id, instId)) {
          err("You do not teach at that institution.");
          return true;
        }
        const lessons = (Array.isArray(m.lessons) ? m.lessons : []).slice(0, 30).map((l) => {
          const opts = Array.isArray(l.opts) ? l.opts.map((o) => d.clean(o, 120)).filter(Boolean).slice(0, 5) : void 0;
          const q = d.clean(l.q, 200);
          const video = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(String(l.video || "")) ? d.clean(l.video, 200) : void 0;
          return { title: d.clean(l.title, 80), body: String(l.body || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").slice(0, 4e3), video, ...q && opts && opts.length >= 2 ? { q, opts, ans: Math.max(0, Math.min(opts.length - 1, Math.round(+l.ans || 0))) } : {} };
        }).filter((l) => l.title && l.body);
        const title = d.clean(m.title, 80);
        if (title.length < 4 || !lessons.length) {
          err("A course needs a title and at least one lesson.");
          return true;
        }
        const old = m.id ? E.courses[m.id] : void 0;
        if (old && old.teacher !== u.id) {
          err("That is not your course.");
          return true;
        }
        const i = instId ? E.inst[instId] : void 0;
        const c = { id: old?.id || "c" + d.rid(6), teacher: u.id, teacherName: u.name, inst: i?.id, instName: i?.name, title, summary: d.clean(m.summary, 300), skills: (Array.isArray(m.skills) ? m.skills : String(m.skills || "").split(",")).map((s) => d.clean(s, 30)).filter(Boolean).slice(0, 6), level: ["Beginner", "Intermediate", "Advanced"].includes(m.level) ? m.level : "Beginner", fee: Math.max(0, Math.min(1e5, Math.round(+m.fee || 0))), lessons, students: old?.students || 0, at: old?.at || Date.now() };
        E.courses[c.id] = c;
        changed();
        if (!old) d.news?.("education", `New course in Education City: "${c.title}"${c.fee ? "" : " (free)"}`);
        reply(mine(u.id));
        reply({ t: "ok", text: old ? "Course updated." : "Course published in Education City." });
        return true;
      }
      case "edu_enroll": {
        const c = E.courses[m.course];
        if (!c) {
          err("No such course.");
          return true;
        }
        if (c.teacher === u.id) {
          err("You teach this course.");
          return true;
        }
        const k = c.id + "|" + u.id;
        if (E.enr[k]) {
          reply(mine(u.id));
          return true;
        }
        if (c.fee > 0 && c.teacher !== ACADEMY) {
          if (d.pay) {
            const share = Math.round(c.fee * 0.9 * 100) / 100;
            if (!d.pay(u.id, c.teacher, share, `Course fee: ${c.title}`)) {
              err("Not enough FYC for this course.");
              return true;
            }
            d.pay(u.id, "treasury", Math.round((c.fee - share) * 100) / 100, `Education levy 10%: ${c.title}`);
          } else E.earn[c.teacher] = (E.earn[c.teacher] || 0) + Math.round(c.fee * 0.9);
        }
        E.enr[k] = { course: c.id, user: u.id, userName: u.name, at: Date.now(), done: [] };
        c.students++;
        {
          const l = d.liveOf(c.teacher);
          if (l) d.send(l.ws, mine(c.teacher));
        }
        d.save();
        reply(mine(u.id));
        return true;
      }
      case "edu_done": {
        const c = E.courses[m.course];
        const en = c && E.enr[c.id + "|" + u.id];
        const i = Math.round(+m.lesson);
        if (!c || !en || !(i >= 0 && i < c.lessons.length)) {
          err("Enrol in the course first.");
          return true;
        }
        const L = c.lessons[i];
        if (L.q && L.ans !== void 0 && Math.round(+m.answer) !== L.ans) {
          reply({ t: "edu_wrong", course: c.id, lesson: i });
          return true;
        }
        if (!en.done.includes(i)) en.done.push(i);
        if (!en.completedAt && en.done.length >= c.lessons.length) {
          en.completedAt = Date.now();
          const tl = d.liveOf(c.teacher);
          if (tl) {
            d.send(tl.ws, { t: "note", text: `${u.name} finished "${c.title}". You can issue the certificate.` });
            d.send(tl.ws, mine(c.teacher));
          }
          if (c.teacher === ACADEMY) issue(en, ACADEMY);
        }
        d.save();
        reply(mine(u.id));
        return true;
      }
      case "edu_issue": {
        const en = E.enr[String(m.course) + "|" + String(m.student)];
        if (!en) {
          err("That student is not enrolled.");
          return true;
        }
        const r = issue(en, u.id);
        if (typeof r === "string") err(r);
        else {
          reply({ t: "ok", text: `Certificate ${r.code} issued to ${r.studentName}.` });
          reply(mine(u.id));
        }
        return true;
      }
      case "edu_verify": {
        const c = E.certs[d.clean(m.code, 20).toUpperCase()];
        reply({ t: "edu_cert", code: m.code, cert: c && valid(c) ? c : null });
        return true;
      }
    }
    return true;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  function http2(path3, res) {
    const mm = path3.match(/^\/(verify|api\/cert)\/([A-Za-z0-9-]{6,20})\/?$/);
    if (!mm) return false;
    const c = E.certs[mm[2].toUpperCase()];
    const ok = valid(c);
    if (mm[1] === "api/cert") {
      res.writeHead(ok ? 200 : 404, { "content-type": "application/json", "access-control-allow-origin": "*" });
      res.end(JSON.stringify(ok ? { valid: true, cert: { ...c, sig: void 0 } } : { valid: false }));
      return true;
    }
    const date = ok ? new Date(c.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "";
    const body = ok ? `<div class="ok">\u2713 Valid certificate</div><h1>${esc(c.courseTitle)}</h1><p class="who">Awarded to <b>${esc(c.studentName)}</b></p>
      <dl><dt>Issued by</dt><dd>${esc(c.teacherName)}</dd><dt>Institution</dt><dd>${c.instName ? esc(c.instName) + (c.instType ? ` (${c.instType})` : "") + (c.instVerified ? " \xB7 verified by the Ministry of Education" : " \xB7 registered") : "Independent teacher"}</dd>
      <dt>Skills</dt><dd>${c.skills.map(esc).join(", ") || "\u2014"}</dd><dt>Level</dt><dd>${esc(c.level)} \xB7 ${c.lessons} lessons completed</dd><dt>Date</dt><dd>${date}</dd><dt>Code</dt><dd><code>${esc(c.code)}</code></dd></dl>
      <p class="note">This is a Fyrus course-completion certificate issued by the teacher named above. It is not a government degree.</p>` : `<div class="bad">\u2715 Not found</div><h1>No valid certificate with this code</h1><p class="note">Check the code for typos. Codes look like FC-XXXX-XXXX-XXXX.</p>`;
    res.writeHead(ok ? 200 : 404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache", "X-Content-Type-Options": "nosniff" });
    res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificate check \xB7 Fyrus</title><style>
      body{margin:0;font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;background:#0b1220;color:#e8edf5;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
      .card{max-width:560px;width:100%;background:#121a2b;border:1px solid #2a3550;border-radius:16px;padding:28px}.brand{color:#ffc27a;font:700 13px ui-monospace,monospace;letter-spacing:.12em}
      h1{font-size:24px;margin:.4em 0}.ok{color:#45e0ae;font-weight:700}.bad{color:#ff7a8a;font-weight:700}.who{font-size:18px}dl{display:grid;grid-template-columns:120px 1fr;gap:6px 12px;margin:18px 0}dt{color:#8a96ad}dd{margin:0}
      .note{color:#8a96ad;font-size:13px}a{color:#7fb8ff}code{background:#0b1220;padding:2px 6px;border-radius:6px}</style></head>
      <body><main class="card"><div class="brand">REPUBLIC OF FYRUS \xB7 MINISTRY OF EDUCATION</div>${body}<p><a href="/">Visit Fyrus</a></p></main></body></html>`);
    return true;
  }
  return { onMessage: onMessage2, http: http2 };
}

// server/bank.ts
var OPENING_CAP = 5e4;
var DAILY_GAME_CAP = +(process.env.DAILY_REWARD_CAP || 15e4);
var SPECIAL = /* @__PURE__ */ new Set(["treasury", "escrow"]);
var r2 = (n) => Math.round(n * 100) / 100;
function createBank(d) {
  if (!d.db.bank) {
    d.db.bank = { acct: {}, ledger: [], seq: 1 };
    d.save();
  }
  const B = d.db.bank;
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const acct = (id) => B.acct[id] ||= { bal: 0, opened: Date.now(), day: today(), dayIn: 0, bond: 0, strikes: 0, sales: 0, bought: 0 };
  const has = (id) => !!B.acct[id];
  const bal = (id) => B.acct[id] ? B.acct[id].bal : 0;
  const notify = (id) => {
    if (SPECIAL.has(id)) return;
    const l = d.liveOf(id);
    const a = B.acct[id];
    if (l && a) d.send(l.ws, { t: "bank", bal: a.bal, bond: a.bond, held: heldFor(id), strikes: a.strikes, banned: !!a.banned, sales: a.sales });
  };
  let heldFor = () => 0;
  function log(from, to, amount, memo) {
    B.ledger.push({ id: B.seq++, at: Date.now(), from, to, amount: r2(amount), memo: memo.slice(0, 120) });
    if (B.ledger.length > 2e4) B.ledger.splice(0, B.ledger.length - 2e4);
  }
  function transfer(from, to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0) || from === to) return false;
    if (from !== "mint") {
      const a = acct(from);
      if (a.bal + 1e-9 < amount) return false;
      a.bal = r2(a.bal - amount);
    }
    if (to !== "burn") {
      const b = acct(to);
      b.bal = r2(b.bal + amount);
    }
    log(from, to, amount, memo);
    d.save();
    notify(from);
    notify(to);
    return true;
  }
  function history(id, n = 60) {
    const out = [];
    for (let i = B.ledger.length - 1; i >= 0 && out.length < n; i--) {
      const t = B.ledger[i];
      if (t.from === id || t.to === id) out.push({ ...t, dir: t.to === id ? "in" : "out", other: t.to === id ? t.from : t.to, otherName: d.nameOf(t.to === id ? t.from : t.to) });
    }
    return out;
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("bank_") || m.t.startsWith("bond_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "bank_hello": {
        if (!has(u.id)) {
          acct(u.id);
          const open = Math.max(0, Math.min(OPENING_CAP, Math.round(+m.local || 0)));
          if (open > 0) transfer("mint", u.id, open, "Opening balance moved from your beta wallet");
          else d.save();
        }
        notify(u.id);
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "bank_op": {
        const amt = r2(+m.amount || 0);
        const label = d.clean(m.label, 100) || "City payment";
        if (!amt) return true;
        const a = acct(u.id);
        if (a.banned && amt > 0) {
          notify(u.id);
          return true;
        }
        if (amt < 0) {
          if (!transfer(u.id, "treasury", -amt, label)) {
            notify(u.id);
            reply({ t: "note", text: "Not enough FYC in your bank account for that." });
          }
          return true;
        }
        if (a.day !== today()) {
          a.day = today();
          a.dayIn = 0;
        }
        const room = Math.max(0, DAILY_GAME_CAP - a.dayIn);
        const ok = Math.min(room, amt);
        if (ok > 0) {
          a.dayIn += ok;
          transfer("mint", u.id, ok, label);
        }
        if (ok < amt) {
          notify(u.id);
          reply({ t: "note", text: `Daily limit for rewards and test packs reached (${DAILY_GAME_CAP.toLocaleString("en-US")} FYC). It resets tomorrow.` });
        }
        return true;
      }
      case "bank_send": {
        const to = d.findByNumber(String(m.to || ""));
        const amt = r2(+m.amount || 0);
        const note = d.clean(m.note, 80);
        if (!to) {
          err("No citizen has that number.");
          return true;
        }
        if (to.id === u.id) {
          err("That is your own number.");
          return true;
        }
        if (!(amt >= 1) || amt > 1e6) {
          err("Enter an amount between 1 and 1,000,000 FYC.");
          return true;
        }
        if (acct(u.id).banned) {
          err("This account is suspended by the Fyrus Court.");
          return true;
        }
        if (!transfer(u.id, to.id, amt, `FyrusPay ${note ? "\xB7 " + note : ""}`.trim())) {
          err("Not enough FYC.");
          return true;
        }
        reply({ t: "ok", text: `Sent ${amt.toLocaleString("en-US")} FYC to ${to.name} (${to.number}).` });
        const l = d.liveOf(to.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} sent you ${amt.toLocaleString("en-US")} FYC${note ? `: "${note}"` : ""}.` });
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "bank_hist":
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      case "bond_stake": {
        const amt = Math.round(+m.amount || 0);
        if (amt < 100) {
          err("The smallest bond is 100 FYC.");
          return true;
        }
        if (!transfer(u.id, "escrow", amt, "Seller security bond")) {
          err("Not enough FYC for the bond.");
          return true;
        }
        acct(u.id).bond += amt;
        d.save();
        notify(u.id);
        reply({ t: "ok", text: `Bond is now ${acct(u.id).bond.toLocaleString("en-US")} FYC.` });
        return true;
      }
      case "bond_withdraw": {
        const a = acct(u.id);
        if (!a.bond) return true;
        if (busy(u.id)) {
          err("Finish or settle your open orders first.");
          return true;
        }
        const amt = a.bond;
        a.bond = 0;
        transfer("escrow", u.id, amt, "Seller bond returned");
        reply({ t: "ok", text: "Bond returned to your account." });
        return true;
      }
    }
    return true;
  }
  let busy = () => false;
  return { onMessage: onMessage2, transfer, bal, acct, notify, history, setHeld: (f) => {
    heldFor = f;
  }, setBusy: (f) => {
    busy = f;
  } };
}

// server/market.ts
var TYPES2 = ["skill", "course", "digital", "physical", "brand"];
var H = 36e5;
var INSPECT_MS = +(process.env.INSPECT_MS || 72 * H);
var RESPOND_MS = +(process.env.RESPOND_MS || 48 * H);
var MIN_AUCTION_MS = +(process.env.MIN_AUCTION_MS || H);
var SNIPE_MS = +(process.env.SNIPE_MS ?? 12e4);
var FEE = 0.05;
var BOND_LIMIT = 1e3;
var bondNeeded = (price) => price > BOND_LIMIT ? Math.max(500, Math.round(price * 0.1)) : 0;
var BANNED_GOODS = /\b(gun|guns|pistol|rifle|ammo|ammunition|explosive|grenade|cocaine|heroin|meth|weed|cannabis|marijuana|opioid|fentanyl|steroid|counterfeit|replica|fake id|fake passport|stolen|hacked account|credit card dump|cvv|malware|ransomware|keylogger|botnet|ddos|escort|adult content|porn)\b/i;
var SCAM_WORDS = /\b(pay outside|outside fyrus|whatsapp me|telegram me|western union|gift ?card|bitcoin|crypto wallet|usdt|send your password|verify your account|seed phrase|private key|guaranteed profit|double your money)\b/i;
var BAD_LINK = /(https?:\/\/)?(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rb\.gy|grabify|iplogger)\b|http:\/\/|\.(exe|scr|bat|cmd|msi|apk|jar|vbs|ps1)(\?|\b)/i;
function sentinel(text, price, type) {
  if (BANNED_GOODS.test(text)) return "Sentinel blocked this listing: prohibited goods or services.";
  if (SCAM_WORDS.test(text)) return "Sentinel blocked this listing: it asks for payment or contact outside Fyrus, or for secrets.";
  if (BAD_LINK.test(text)) return "Sentinel blocked a link: use https links to normal sites, no link shorteners or program files.";
  if (!(price >= 1) || price > 1e6) return "Sentinel: price must be between 1 and 1,000,000 FYC.";
  if (type === "digital" && price > 5e4) return "Sentinel: digital items above 50,000 FYC need a manual review. Lower the price.";
  return null;
}
function createMarket(d) {
  if (!d.db.market) {
    d.db.market = { listings: {}, orders: {} };
    d.save();
  }
  const K = d.db.market;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pushMine = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, mine(id));
  };
  const changed = () => {
    d.save();
    d.broadcast({ t: "mk_changed" });
  };
  const pub2 = (l) => ({ ...l, delivery: void 0, hasDelivery: !!l.delivery, bids: (l.bids || []).slice(-10).map((b) => ({ name: b.name, amount: b.amount, at: b.at })), topBid: l.bids?.length ? l.bids[l.bids.length - 1].amount : void 0, trust: trustOf(l.seller) });
  const trustOf = (id) => {
    const a = bank2.acct(id);
    return { sales: a.sales, bond: a.bond, strikes: a.strikes, tier: a.strikes ? "Warned" : a.sales >= 25 && a.bond >= 2e3 ? "Gold" : a.sales >= 5 ? "Trusted" : a.bond >= 500 ? "Bonded" : "New" };
  };
  bank2.setHeld((id) => Object.values(K.listings).reduce((s, l) => s + (l.status === "active" && l.bids?.length && l.bids[l.bids.length - 1].user === id ? l.bids[l.bids.length - 1].amount : 0), 0));
  bank2.setBusy((id) => Object.values(K.orders).some((o) => o.seller === id && !["released", "refunded"].includes(o.status)) || Object.values(K.listings).some((l) => l.seller === id && l.status === "active" && l.price > BOND_LIMIT));
  function mine(id) {
    const os = Object.values(K.orders);
    return {
      t: "mk_mine",
      listings: Object.values(K.listings).filter((l) => l.seller === id && l.status !== "removed").map((l) => ({ ...pub2(l), delivery: l.delivery })),
      bought: os.filter((o) => o.buyer === id).map((o) => ({ ...o, address: o.address })).sort((a, b) => b.at - a.at),
      sold: os.filter((o) => o.seller === id).sort((a, b) => b.at - a.at),
      court: d.isAdmin(id) ? os.filter((o) => o.status === "review" || o.status === "disputed") : void 0,
      admin: d.isAdmin(id),
      trust: trustOf(id)
    };
  }
  function makeOrder(l, buyer, amount, address) {
    const days = l.type === "physical" ? (l.shipDays || 7) + 2 : l.type === "skill" ? (l.skillDays || 5) + 2 : 1;
    const o = { id: "o" + d.rid(7), listing: l.id, title: l.title, type: l.type, buyer: buyer.id, buyerName: buyer.name, seller: l.seller, sellerName: l.sellerName, amount, status: "paid", at: Date.now(), dueBy: Date.now() + days * 24 * H, address };
    if ((l.type === "digital" || l.type === "course") && l.delivery) {
      o.status = "delivered";
      o.deliveredAt = Date.now();
      o.inspectUntil = Date.now() + INSPECT_MS;
    }
    K.orders[o.id] = o;
    l.sold++;
    if (l.type === "physical" || l.type === "brand") l.stock = Math.max(0, l.stock - 1);
    if (l.mode === "fixed" && l.stock <= 0 && (l.type === "physical" || l.type === "brand")) l.status = "sold";
    bank2.acct(buyer.id).bought++;
    d.save();
    note(l.seller, `New order: ${l.title} (${amount.toLocaleString("en-US")} FYC held in escrow).`);
    pushMine(l.seller);
    return o;
  }
  function release(o, why) {
    if (!["paid", "delivered"].includes(o.status)) return;
    const fee = Math.round(o.amount * FEE * 100) / 100;
    bank2.transfer("escrow", o.seller, o.amount - fee, `Sale released: ${o.title}`);
    if (fee > 0) bank2.transfer("escrow", "treasury", fee, `Market fee 5%: ${o.title}`);
    o.status = "released";
    o.closedAt = Date.now();
    bank2.acct(o.seller).sales++;
    d.save();
    note(o.seller, `Payment released for "${o.title}" (${why}).`);
    d.news?.("market", `Sold on Fyrus Market: "${o.title}" for ${o.amount.toLocaleString("en-US")} FYC`);
    pushMine(o.seller);
    pushMine(o.buyer);
  }
  function refund(o, why, strike) {
    if (["released", "refunded"].includes(o.status)) return;
    bank2.transfer("escrow", o.buyer, o.amount, `Refund: ${o.title}`);
    o.status = "refunded";
    o.closedAt = Date.now();
    const l = K.listings[o.listing];
    if (l && (l.type === "physical" || l.type === "brand")) l.stock++;
    if (strike) {
      const a = bank2.acct(o.seller);
      a.strikes++;
      if (a.strikes >= 3) ban(o.seller, "three court rulings against this seller");
    }
    d.save();
    note(o.buyer, `Refunded ${o.amount.toLocaleString("en-US")} FYC for "${o.title}" (${why}).`);
    note(o.seller, `Order "${o.title}" was refunded to the buyer (${why}).`);
    pushMine(o.buyer);
    pushMine(o.seller);
    bank2.notify(o.seller);
  }
  function ban(id, why) {
    const a = bank2.acct(id);
    if (a.banned) return;
    a.banned = true;
    Object.values(K.listings).filter((l) => l.seller === id && l.status === "active").forEach((l) => {
      refundBids(l);
      l.status = "removed";
    });
    Object.values(K.orders).filter((o) => o.seller === id && ["paid", "delivered", "disputed", "review"].includes(o.status)).forEach((o) => refund(o, "seller banned", false));
    if (a.bond) {
      bank2.transfer("escrow", "treasury", a.bond, "Bond forfeited (seller banned)");
      a.bond = 0;
    }
    d.save();
    note(id, `Your seller account is permanently banned by the Fyrus Court: ${why}.`);
    changed();
  }
  function refundBids(l) {
    const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
    if (top) bank2.transfer("escrow", top.user, top.amount, `Bid returned: ${l.title}`);
  }
  function finishAuction(l) {
    if (l.status !== "active" || l.mode !== "auction") return;
    const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
    if (!top || l.reserve && top.amount < l.reserve) {
      if (top) refundBids(l);
      l.status = "ended";
      note(l.seller, `Auction ended without a sale: ${l.title}${top ? " (reserve not met)" : ""}.`);
      if (top) note(top.user, `Auction "${l.title}" ended below the reserve. Your bid is back.`);
      changed();
      return;
    }
    l.status = "sold";
    makeOrder(l, { id: top.user, name: top.name }, top.amount);
    note(top.user, `You won "${l.title}" for ${top.amount.toLocaleString("en-US")} FYC. It is safe in escrow.`);
    pushMine(top.user);
    changed();
  }
  setInterval(() => {
    const now = Date.now();
    Object.values(K.listings).forEach((l) => {
      if (l.status === "active" && l.mode === "auction" && l.endsAt && now >= l.endsAt) finishAuction(l);
    });
    Object.values(K.orders).forEach((o) => {
      if (o.status === "delivered" && o.inspectUntil && now >= o.inspectUntil) release(o, "inspection window ended");
      else if (o.status === "disputed" && o.dispute && now >= o.dispute.respondBy && !o.dispute.sellerText) {
        o.dispute.ruling = "Seller did not answer in time: refunded automatically.";
        o.dispute.ruledBy = "Fyrus Court (automatic)";
        o.dispute.ruledAt = now;
        refund(o, "seller did not answer the dispute", true);
      }
    });
  }, +(process.env.MARKET_TICK_MS || 15e3));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("mk_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const a = bank2.acct(u.id);
    const myOrder = (id, as) => {
      const o = K.orders[String(id)];
      return o && o[as] === u.id ? o : void 0;
    };
    switch (m.t) {
      case "mk_list":
        reply({ t: "mk_list", listings: Object.values(K.listings).filter((l) => l.status === "active").map(pub2).sort((x, y) => y.at - x.at), now: Date.now() });
        return true;
      case "mk_mine":
        reply(mine(u.id));
        return true;
      case "mk_create": {
        if (a.banned) {
          err("This account is banned from selling.");
          return true;
        }
        const type = TYPES2.includes(m.type) ? m.type : null;
        const title = d.clean(m.title, 80);
        const desc = String(m.desc || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").slice(0, 2e3);
        const price = Math.round(+m.price || 0);
        const mode = m.mode === "auction" ? "auction" : "fixed";
        const delivery = String(m.delivery || "").slice(0, 2e3);
        if (!type || title.length < 4) {
          err("Pick a seller type and a title of at least 4 letters.");
          return true;
        }
        const bad = sentinel(`${title} ${desc} ${delivery}`, price, type);
        if (bad) {
          err(bad);
          return true;
        }
        if ((type === "digital" || type === "course") && !delivery.trim()) {
          err("Add what the buyer receives (a download link, licence key or the content itself). It stays hidden until they pay.");
          return true;
        }
        const need = Math.max(bondNeeded(price), type === "brand" ? 2e3 : 0);
        if (a.bond < need) {
          err(`This listing needs a seller bond of ${need.toLocaleString("en-US")} FYC (you have ${a.bond.toLocaleString("en-US")}). Stake it in the Sell tab; you get it back when you stop selling.`);
          return true;
        }
        if (Object.values(K.listings).filter((l2) => l2.seller === u.id && l2.status === "active").length >= 30) {
          err("You can have up to 30 active listings.");
          return true;
        }
        const hours = Math.max(MIN_AUCTION_MS / H, Math.min(168, +m.hours || 24));
        const l = {
          id: "l" + d.rid(7),
          seller: u.id,
          sellerName: u.name,
          type,
          title,
          desc,
          price,
          mode,
          stock: type === "physical" || type === "brand" ? Math.max(1, Math.min(9999, Math.round(+m.stock || 1))) : 9999,
          shipDays: type === "physical" || type === "brand" ? Math.max(1, Math.min(60, Math.round(+m.shipDays || 7))) : void 0,
          skillDays: type === "skill" ? Math.max(1, Math.min(90, Math.round(+m.skillDays || 5))) : void 0,
          icon: d.clean(m.icon, 4) || "\u25C6",
          color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#2f6fe0",
          delivery: delivery || void 0,
          status: "active",
          sold: 0,
          at: Date.now(),
          ...mode === "auction" ? { endsAt: Date.now() + hours * H, reserve: Math.max(0, Math.round(+m.reserve || 0)) || void 0, bids: [] } : {}
        };
        K.listings[l.id] = l;
        changed();
        d.news?.("market", `New on Fyrus Market: "${l.title}" \xB7 ${l.mode === "auction" ? "auction from" : ""} ${l.price.toLocaleString("en-US")} FYC`.replace("\xB7  ", "\xB7 "));
        reply(mine(u.id));
        reply({ t: "ok", text: mode === "auction" ? "Auction is live." : "Listing is live in Fyrus Market." });
        return true;
      }
      case "mk_remove": {
        const l = K.listings[m.id];
        if (!l || l.seller !== u.id) return true;
        if (l.mode === "auction" && l.bids?.length) {
          err("An auction with bids cannot be removed.");
          return true;
        }
        l.status = "removed";
        changed();
        reply(mine(u.id));
        return true;
      }
      case "mk_buy": {
        const l = K.listings[m.id];
        if (!l || l.status !== "active" || l.mode !== "fixed") {
          err("This item is not for sale any more.");
          return true;
        }
        if (l.seller === u.id) {
          err("That is your own listing.");
          return true;
        }
        if (a.banned) {
          err("This account is suspended.");
          return true;
        }
        const address = l.type === "physical" || l.type === "brand" ? d.clean(m.address, 300) : void 0;
        if ((l.type === "physical" || l.type === "brand") && (!address || address.length < 10)) {
          err("Add your delivery address (only the seller sees it).");
          return true;
        }
        if (!bank2.transfer(u.id, "escrow", l.price, `Escrow: ${l.title}`)) {
          err("Not enough FYC.");
          return true;
        }
        const o = makeOrder(l, u, l.price, address);
        changed();
        reply(mine(u.id));
        reply({ t: "ok", text: o.status === "delivered" ? "Paid into escrow. Your item is ready in My orders." : "Paid into escrow. The seller has been told." });
        return true;
      }
      case "mk_bid": {
        const l = K.listings[m.id];
        const amount = Math.round(+m.amount || 0);
        if (!l || l.status !== "active" || l.mode !== "auction") {
          err("This auction is closed.");
          return true;
        }
        if (l.seller === u.id) {
          err("You cannot bid on your own auction.");
          return true;
        }
        if (a.banned) {
          err("This account is suspended.");
          return true;
        }
        const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
        const min = top ? top.amount + Math.max(1, Math.round(top.amount * 0.05)) : l.price;
        if (amount < min) {
          err(`The lowest bid now is ${min.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (top && top.user === u.id) {
          if (!bank2.transfer(u.id, "escrow", amount - top.amount, `Bid raised: ${l.title}`)) {
            err("Not enough FYC.");
            return true;
          }
        } else {
          if (!bank2.transfer(u.id, "escrow", amount, `Bid held: ${l.title}`)) {
            err("Not enough FYC.");
            return true;
          }
          if (top) {
            bank2.transfer("escrow", top.user, top.amount, `Outbid, bid returned: ${l.title}`);
            note(top.user, `You were outbid on "${l.title}". Your ${top.amount.toLocaleString("en-US")} FYC is back.`);
          }
        }
        l.bids.push({ user: u.id, name: u.name, amount, at: Date.now() });
        if (l.endsAt && SNIPE_MS && l.endsAt - Date.now() < SNIPE_MS) l.endsAt += SNIPE_MS;
        changed();
        bank2.notify(u.id);
        reply({ t: "ok", text: `You lead with ${amount.toLocaleString("en-US")} FYC (held in escrow until the auction ends).` });
        return true;
      }
      case "mk_deliver": {
        const o = myOrder(m.order, "seller");
        if (!o || o.status !== "paid") {
          err("Nothing to deliver on that order.");
          return true;
        }
        o.note = d.clean(m.note, 1e3);
        o.tracking = d.clean(m.tracking, 80) || void 0;
        if (sentinel(o.note || "", 1, o.type)) {
          err("Sentinel blocked this message.");
          return true;
        }
        o.status = "delivered";
        o.deliveredAt = Date.now();
        o.inspectUntil = Date.now() + INSPECT_MS + (o.type === "physical" || o.type === "brand" ? (K.listings[o.listing]?.shipDays || 7) * 24 * H : 0);
        d.save();
        note(o.buyer, `"${o.title}" was ${o.type === "physical" || o.type === "brand" ? "shipped" : "delivered"}. Check it and confirm, or open a dispute before the window ends.`);
        pushMine(o.buyer);
        reply(mine(u.id));
        return true;
      }
      case "mk_open": {
        const o = myOrder(m.order, "buyer");
        const l = o && K.listings[o.listing];
        if (!o || !l) return true;
        o.opened = true;
        d.save();
        reply({ t: "mk_delivery", order: o.id, content: l.delivery || o.note || "" });
        return true;
      }
      case "mk_confirm": {
        const o = myOrder(m.order, "buyer");
        if (!o || !["paid", "delivered"].includes(o.status)) return true;
        release(o, "buyer confirmed");
        reply({ t: "ok", text: "Payment released to the seller. Thank you!" });
        return true;
      }
      case "mk_dispute": {
        const o = myOrder(m.order, "buyer");
        if (!o || !["paid", "delivered"].includes(o.status)) {
          err("This order cannot be disputed now.");
          return true;
        }
        if (o.status === "paid" && Date.now() < o.dueBy && o.type !== "digital" && o.type !== "course") {
          err(`The seller still has time to deliver (until ${new Date(o.dueBy).toUTCString().slice(5, 22)} UTC). You can dispute after that, or once it is delivered.`);
          return true;
        }
        const reason = d.clean(m.reason, 600);
        if (reason.length < 10) {
          err("Explain what went wrong (at least 10 letters).");
          return true;
        }
        o.status = "disputed";
        o.dispute = { reason, evidence: d.clean(m.evidence, 600), at: Date.now(), respondBy: Date.now() + RESPOND_MS };
        d.save();
        note(o.seller, `Dispute opened on "${o.title}". Answer within 48 hours or the buyer is refunded automatically.`);
        pushMine(o.seller);
        reply(mine(u.id));
        reply({ t: "ok", text: "Payment frozen. The seller has 48 hours to answer." });
        return true;
      }
      case "mk_respond": {
        const o = myOrder(m.order, "seller");
        if (!o || o.status !== "disputed" || !o.dispute) return true;
        if (m.refund) {
          o.dispute.ruling = "Seller accepted the refund.";
          o.dispute.ruledBy = o.sellerName;
          o.dispute.ruledAt = Date.now();
          refund(o, "seller accepted", false);
          return true;
        }
        o.dispute.sellerText = d.clean(m.text, 800);
        if (!o.dispute.sellerText) {
          err("Write your answer.");
          return true;
        }
        o.status = "review";
        d.save();
        note(o.buyer, `The seller answered your dispute on "${o.title}". The Fyrus Court will review it.`);
        pushMine(o.buyer);
        reply(mine(u.id));
        return true;
      }
      case "mk_rule": {
        if (!d.isAdmin(u.id)) {
          err("Only Fyrus Court judges can rule.");
          return true;
        }
        const o = K.orders[m.order];
        if (!o || !["disputed", "review"].includes(o.status) || !o.dispute) return true;
        o.dispute.ruling = d.clean(m.note, 400) || (m.refund ? "Refund to the buyer." : "Payment to the seller.");
        o.dispute.ruledBy = `Judge ${u.name}`;
        o.dispute.ruledAt = Date.now();
        if (m.refund) refund(o, "Fyrus Court ruling", true);
        else {
          o.status = "delivered";
          release(o, "Fyrus Court ruling");
        }
        if (m.ban) ban(o.seller, d.clean(m.note, 200) || "fraud proven in court");
        d.news?.("court", `Fyrus Court ruled on a market dispute: ${m.refund ? "the buyer was refunded" : "payment went to the seller"}${m.ban ? "; the seller is permanently banned" : ""}`);
        reply(mine(u.id));
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, release, refund, ban };
}

// src/data/societies.ts
var STREET = 10;
var rectH = (rows, sp) => 8 + rows * sp + Math.floor((rows - 1) / 2) * STREET + 8;
var SOCIETIES = [
  { id: "executive", code: "EX", tier: 2, name: "Executive Enclave", tagline: "Townhouses and villas for merchants, teachers and professionals", color: "#4da3ff", x0: -210, z0: 345, cols: 35, rows: 20, sp: 12, count: 700, empty: 140, base: 25e3, passport: false, gate: { x: 0, z: 333, face: { x: 0, z: 400 } } },
  { id: "marina", code: "MB", tier: 3, name: "Marina Bay Society", tagline: "Gated oceanfront mansions with private yacht docks", color: "#45e0ae", x0: 470, z0: -366, cols: 50, rows: 10, sp: 12, count: 500, empty: 100, base: 8e4, passport: false, gate: { x: 458, z: -300, face: { x: 520, z: -300 } } },
  { id: "royal", code: "RS", tier: 4, name: "Royal Sky Society", tagline: "Ultra-exclusive hillside mansions with AI security \u2014 passport holders and invited guests only", color: "#ffc27a", x0: -1010, z0: -150, cols: 25, rows: 17, sp: 16, count: 410, empty: 120, base: 25e4, passport: true, gate: { x: -584, z: 0, face: { x: -650, z: 0 } } }
];
var STARTER = { id: "starter", code: "SC", tier: 1, name: "Starter Commons", tagline: "Clean modern studio apartments \u2014 free for every visitor", color: "#a8d8ff", x: 330, z: 260, towers: 6, floors: 24, perFloor: 8 };
var societyRect = (s) => ({ x0: s.x0, z0: s.z0, x1: s.x0 + s.cols * s.sp + 16, z1: s.z0 + rectH(s.rows, s.sp) });
var STARTER_RECT = { x0: STARTER.x - 50, z0: STARTER.z - 60, x1: STARTER.x + 50, z1: STARTER.z + 60 };
var ESTATE_RECTS = [...SOCIETIES.map(societyRect), STARTER_RECT].map((r) => ({ x0: r.x0 - 10, z0: r.z0 - 10, x1: r.x1 + 10, z1: r.z1 + 10 }));
var h32 = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
var FIRSTN = ["Ayesha", "Omar", "Lina", "Noah", "Sara", "Bilal", "Mei", "Arjun", "Zara", "Leo", "Hana", "Yusuf", "Ivy", "Kenji", "Amara", "Diego", "Nora", "Samir", "Elena", "Tariq", "Maya", "Ravi", "Chloe", "Imran", "Sofia", "Daniyal", "Aiko", "Hamza", "Lucia", "Farah"];
var LASTN = ["Khan", "Malik", "Chen", "Silva", "Haddad", "Patel", "Rossi", "Kim", "Okafor", "Novak", "Rahman", "Tanaka", "Garcia", "Iqbal", "Larsen", "Mensah", "Costa", "Sato", "Qureshi", "Moreau"];
var cache = {};
function plotsOf(s) {
  if (cache[s.id]) return cache[s.id];
  const ids = Array.from({ length: s.count }, (_, i) => `${s.code}-${String(i + 1).padStart(4, "0")}`);
  const empty = new Set([...ids].sort((a, b) => h32(a + "e") - h32(b + "e")).slice(0, s.empty));
  const out = ids.map((id, i) => {
    const col = i % s.cols, row = Math.floor(i / s.cols);
    const h = h32(id);
    const x = s.x0 + 8 + s.sp / 2 + col * s.sp;
    const z = s.z0 + 8 + s.sp / 2 + row * s.sp + Math.floor(row / 2) * STREET;
    const seaFront = s.id === "marina" && row <= 1;
    const price = Math.round(s.base * (seaFront ? 1.6 : 1) * (0.9 + h % 200 / 1e3) / 100) * 100;
    const isEmpty = empty.has(id);
    return { id, soc: s.id, n: i + 1, x, z, face: row % 2 === 0 ? -1 : 1, size: s.sp - 2, price, seaFront, empty: isEmpty, resident: isEmpty ? void 0 : `${FIRSTN[h % FIRSTN.length]} ${LASTN[(h >>> 8) % LASTN.length]}`, style: (h >>> 16) % 3 };
  });
  return cache[s.id] = out;
}
var estatePlotById = (id) => {
  const s = SOCIETIES.find((x) => id.startsWith(x.code + "-"));
  return s ? plotsOf(s)[+id.slice(3) - 1] : void 0;
};
var societyById = (id) => SOCIETIES.find((s) => s.id === id);
var RESIDENTS = SOCIETIES.reduce((a, s) => a + s.count - s.empty, 0);
var EMPTY_PLOTS = SOCIETIES.reduce((a, s) => a + s.empty, 0);
var STUDIOS = STARTER.towers * STARTER.floors * STARTER.perFloor;
var studioId = (k) => {
  const per = STARTER.floors * STARTER.perFloor;
  const t = Math.floor(k / per), r = k % per;
  return `SC-T${t + 1}-${String(Math.floor(r / STARTER.perFloor) + 1).padStart(2, "0")}${String.fromCharCode(65 + r % STARTER.perFloor)}`;
};

// server/estate.ts
var H2 = 36e5;
var RENT_PERIOD_MS = +(process.env.RENT_PERIOD_MS || 30 * 24 * H2);
var TAX = 0.05;
function createEstate(d) {
  if (!d.db.estate) {
    d.db.estate = { plots: {}, studios: {}, passes: {} };
    d.save();
  }
  const E = d.db.estate;
  const bank2 = d.bank;
  const isPassport = (id) => {
    const p = d.db.users[id]?.passport;
    return !!p && p.kind !== "visa";
  };
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pub2 = (id, p) => ({ id, owner: p.owner, ownerName: p.ownerName, style: p.style, sign: p.sign, sale: p.sale, rent: p.rent ? { price: p.rent.price, tenantName: p.rent.tenantName, tenant: p.rent.tenant, paidUntil: p.rent.paidUntil, ending: p.rent.ending } : void 0, auction: p.auction ? { endsAt: p.auction.endsAt, start: p.auction.start, reserve: !!p.auction.reserve, top: p.auction.bids.at(-1)?.amount, topName: p.auction.bids.at(-1)?.name, bids: p.auction.bids.length } : void 0 });
  const state = () => ({ t: "est_state", plots: Object.fromEntries(Object.entries(E.plots).map(([k, v]) => [k, pub2(k, v)])), studios: Object.keys(E.studios).length, now: Date.now() });
  const changed = (ids) => {
    d.save();
    d.broadcast({ t: "est_update", plots: Object.fromEntries(ids.map((k) => [k, E.plots[k] ? pub2(k, E.plots[k]) : null])) });
  };
  const mine = (uid) => ({ t: "est_mine", owned: Object.entries(E.plots).filter(([, p]) => p.owner === uid).map(([k, p]) => pub2(k, p)), renting: Object.entries(E.plots).filter(([, p]) => p.rent?.tenant === uid).map(([k, p]) => pub2(k, p)), studio: E.studios[uid] || null, passes: (E.passes[uid] || []).filter((p) => p.until > Date.now()), passport: isPassport(uid) });
  const pushMine = (uid) => {
    const l = d.liveOf(uid);
    if (l) d.send(l.ws, mine(uid));
  };
  const canEnterRoyal = (uid) => isPassport(uid) || (E.passes[uid] || []).some((p) => p.until > Date.now()) || Object.entries(E.plots).some(([k, p]) => k.startsWith("RS-") && (p.owner === uid || p.rent?.tenant === uid));
  function transferPlot(id, to, paid) {
    const p = E.plots[id];
    const prevOwner = p?.owner;
    const tenant = p?.rent?.tenant ? p.rent : void 0;
    E.plots[id] = { owner: to.id, ownerName: to.name, boughtAt: Date.now(), paid, style: p?.style, rent: tenant ? { ...tenant, ending: true } : void 0 };
    if (prevOwner && prevOwner !== to.id) pushMine(prevOwner);
    pushMine(to.id);
  }
  function finishAuction(id) {
    const p = E.plots[id];
    const a = p?.auction;
    if (!p || !a) return;
    const top = a.bids.at(-1);
    p.auction = void 0;
    if (!top || a.reserve && top.amount < a.reserve) {
      if (top) {
        bank2.transfer("escrow", top.user, top.amount, `Bid returned: plot ${id}`);
        note(top.user, `Auction for plot ${id} ended below the reserve. Your bid is back.`);
      }
      note(p.owner, `Your auction for plot ${id} ended without a sale.`);
      changed([id]);
      return;
    }
    const tax = isPassport(p.owner) ? 0 : Math.round(top.amount * TAX);
    const seller = p.owner;
    bank2.transfer("escrow", seller, top.amount - tax, `Plot ${id} sold at auction`);
    if (tax) bank2.transfer("escrow", "treasury", tax, `Land transfer tax 5%: ${id}`);
    transferPlot(id, { id: top.user, name: top.name }, top.amount);
    note(top.user, `You won plot ${id} for ${top.amount.toLocaleString("en-US")} FYC. The title is yours.`);
    note(seller, `Plot ${id} sold at auction for ${top.amount.toLocaleString("en-US")} FYC.`);
    changed([id]);
    d.news?.("property", `Auction: plot ${id} sold for ${top.amount.toLocaleString("en-US")} FYC`);
  }
  function collectRent(id) {
    const p = E.plots[id];
    const r = p?.rent;
    if (!p || !r?.tenant || !r.paidUntil || Date.now() < r.paidUntil) return;
    if (r.ending || !bank2.transfer(r.tenant, p.owner, r.price, `Rent: plot ${id}`)) {
      const t = r.tenant;
      note(t, r.ending ? `Your lease on plot ${id} has ended.` : `Your lease on plot ${id} ended: not enough FYC for this month's rent.`);
      note(p.owner, `The lease on plot ${id} ended. It is free to rent again.`);
      p.rent = r.ending ? void 0 : { price: r.price };
      pushMine(t);
      pushMine(p.owner);
      changed([id]);
      return;
    }
    r.paidUntil += RENT_PERIOD_MS;
    note(p.owner, `Rent received for plot ${id}: ${r.price.toLocaleString("en-US")} FYC.`);
    d.save();
    pushMine(p.owner);
    pushMine(r.tenant);
  }
  setInterval(() => {
    const now = Date.now();
    for (const [id, p] of Object.entries(E.plots)) {
      if (p.auction && now >= p.auction.endsAt) finishAuction(id);
      if (p.rent?.tenant && p.rent.paidUntil && now >= p.rent.paidUntil) collectRent(id);
    }
  }, +(process.env.ESTATE_TICK_MS || 15e3));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("est_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const plot = m.plot ? estatePlotById(String(m.plot)) : void 0;
    const rec = plot ? E.plots[plot.id] : void 0;
    const soc = plot ? societyById(plot.soc) : void 0;
    const banned = bank2.acct(u.id).banned;
    switch (m.t) {
      case "est_state":
        reply(state());
        reply(mine(u.id));
        return true;
      case "est_mine":
        reply(mine(u.id));
        return true;
      case "est_buy": {
        if (!plot || !soc) {
          err("No such plot.");
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        if (soc.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (!rec) {
          if (!plot.empty) {
            err("A resident lives here. It is not for sale.");
            return true;
          }
          if (!bank2.transfer(u.id, "treasury", plot.price, `Plot ${plot.id} in ${soc.name} (Land Office)`)) {
            err(`You need ${plot.price.toLocaleString("en-US")} FYC.`);
            return true;
          }
          transferPlot(plot.id, u, plot.price);
          changed([plot.id]);
          reply({ t: "ok", text: `Plot ${plot.id} in ${soc.name} is yours.` });
          d.news?.("property", `Land Office sold plot ${plot.id} in ${soc.name} for ${plot.price.toLocaleString("en-US")} FYC`);
          return true;
        }
        if (rec.owner === u.id) {
          err("You already own this plot.");
          return true;
        }
        if (!rec.sale) {
          err("The owner is not selling this plot.");
          return true;
        }
        const price = rec.sale;
        const tax = isPassport(u.id) ? 0 : Math.round(price * TAX);
        const seller = rec.owner;
        if (!bank2.transfer(u.id, seller, price, `Plot ${plot.id} bought from ${rec.ownerName}`)) {
          err(`You need ${price.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (tax && !bank2.transfer(u.id, "treasury", tax, `Land transfer tax 5%: ${plot.id}`)) {
        }
        transferPlot(plot.id, u, price);
        note(seller, `Plot ${plot.id} sold to ${u.name} for ${price.toLocaleString("en-US")} FYC.`);
        changed([plot.id]);
        d.news?.("property", `Plot ${plot.id} in ${soc.name} changed hands for ${price.toLocaleString("en-US")} FYC`);
        reply({ t: "ok", text: `Plot ${plot.id} is yours.` });
        return true;
      }
      case "est_list": {
        if (!plot || !rec || rec.owner !== u.id) {
          err("That is not your plot.");
          return true;
        }
        if (rec.auction?.bids.length) {
          err("This plot has bids. Wait for the auction to end.");
          return true;
        }
        const mode = String(m.mode);
        const price = Math.round(+m.price || 0);
        if (mode === "none") {
          if (rec.auction) rec.auction = void 0;
          rec.sale = void 0;
          if (rec.rent && !rec.rent.tenant) rec.rent = void 0;
          changed([plot.id]);
          reply(mine(u.id));
          return true;
        }
        if (!(price >= 1 && price <= 5e7)) {
          err("Enter a price between 1 and 50,000,000 FYC.");
          return true;
        }
        if (mode === "sale") {
          rec.sale = price;
          rec.auction = void 0;
        } else if (mode === "auction") {
          const hours = Math.max(+(process.env.MIN_AUCTION_MS || H2) / H2, Math.min(168, +m.hours || 24));
          rec.sale = void 0;
          rec.auction = { start: price, reserve: Math.max(0, Math.round(+m.reserve || 0)) || void 0, endsAt: Date.now() + hours * H2, bids: [] };
        } else if (mode === "rent") {
          if (rec.rent?.tenant) {
            err("It is already rented. End the lease first.");
            return true;
          }
          rec.rent = { price };
        } else {
          err("Pick sale, auction or rent.");
          return true;
        }
        changed([plot.id]);
        reply(mine(u.id));
        reply({ t: "ok", text: mode === "rent" ? `Plot ${plot.id} is up for rent at ${price.toLocaleString("en-US")} FYC a month.` : mode === "auction" ? `Auction for plot ${plot.id} is live.` : `Plot ${plot.id} is for sale.` });
        return true;
      }
      case "est_bid": {
        const a = rec?.auction;
        const amount = Math.round(+m.amount || 0);
        if (!plot || !rec || !a) {
          err("This plot is not at auction.");
          return true;
        }
        if (rec.owner === u.id) {
          err("You cannot bid on your own plot.");
          return true;
        }
        if (soc?.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        const top = a.bids.at(-1);
        const min = top ? top.amount + Math.max(1, Math.round(top.amount * 0.05)) : a.start;
        if (amount < min) {
          err(`The lowest bid now is ${min.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (top?.user === u.id) {
          if (!bank2.transfer(u.id, "escrow", amount - top.amount, `Bid raised: plot ${plot.id}`)) {
            err("Not enough FYC.");
            return true;
          }
        } else {
          if (!bank2.transfer(u.id, "escrow", amount, `Bid held: plot ${plot.id}`)) {
            err("Not enough FYC.");
            return true;
          }
          if (top) {
            bank2.transfer("escrow", top.user, top.amount, `Outbid, bid returned: plot ${plot.id}`);
            note(top.user, `You were outbid on plot ${plot.id}. Your FYC is back.`);
          }
        }
        a.bids.push({ user: u.id, name: u.name, amount, at: Date.now() });
        const snipe = +(process.env.SNIPE_MS ?? 12e4);
        if (snipe && a.endsAt - Date.now() < snipe) a.endsAt += snipe;
        changed([plot.id]);
        reply({ t: "ok", text: `You lead with ${amount.toLocaleString("en-US")} FYC.` });
        return true;
      }
      case "est_rent": {
        const r = rec?.rent;
        if (!plot || !rec || !r || r.tenant) {
          err("This plot is not available to rent.");
          return true;
        }
        if (rec.owner === u.id) {
          err("This is your own plot.");
          return true;
        }
        if (soc?.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        if (!bank2.transfer(u.id, rec.owner, r.price, `Rent (first month): plot ${plot.id}`)) {
          err(`You need ${r.price.toLocaleString("en-US")} FYC for the first month.`);
          return true;
        }
        rec.rent = { price: r.price, tenant: u.id, tenantName: u.name, since: Date.now(), paidUntil: Date.now() + RENT_PERIOD_MS };
        note(rec.owner, `${u.name} rented plot ${plot.id} for ${r.price.toLocaleString("en-US")} FYC a month.`);
        pushMine(rec.owner);
        changed([plot.id]);
        reply(mine(u.id));
        reply({ t: "ok", text: `You rent plot ${plot.id}. Rent is paid automatically each month.` });
        return true;
      }
      case "est_endlease": {
        const r = rec?.rent;
        if (!plot || !rec || !r?.tenant || r.tenant !== u.id && rec.owner !== u.id) return true;
        r.ending = true;
        note(r.tenant === u.id ? rec.owner : r.tenant, `The lease on plot ${plot.id} will end on ${new Date(r.paidUntil).toUTCString().slice(5, 16)}.`);
        changed([plot.id]);
        reply(mine(u.id));
        return true;
      }
      case "est_build": {
        if (!plot || !rec || rec.owner !== u.id && rec.rent?.tenant !== u.id) {
          err("Only the owner or tenant can build.");
          return true;
        }
        rec.style = Math.max(0, Math.min(3, Math.round(+m.style || 0)));
        rec.sign = d.clean(m.sign, 24) || void 0;
        changed([plot.id]);
        reply(mine(u.id));
        return true;
      }
      case "est_studio": {
        if (E.studios[u.id]) {
          reply(mine(u.id));
          return true;
        }
        const used = new Set(Object.values(E.studios));
        let k = 0;
        while (k < STUDIOS && used.has(studioId(k))) k++;
        if (k >= STUDIOS) {
          err("All studios are taken. New towers are coming.");
          return true;
        }
        E.studios[u.id] = studioId(k);
        d.save();
        reply(mine(u.id));
        reply({ t: "ok", text: `Studio ${studioId(k)} in Starter Commons is yours, free.` });
        return true;
      }
      case "est_pass": {
        if (!canEnterRoyal(u.id)) {
          err("Only Royal Sky residents and passport holders can invite guests.");
          return true;
        }
        const g = d.findByNumber(String(m.number || ""));
        if (!g) {
          err("No citizen has that number.");
          return true;
        }
        E.passes[g.id] = [...(E.passes[g.id] || []).filter((p) => p.until > Date.now()), { by: u.id, byName: u.name, until: Date.now() + 24 * H2 }];
        d.save();
        note(g.id, `${u.name} invited you to Royal Sky Society. Your gate pass is valid for 24 hours.`);
        pushMine(g.id);
        reply({ t: "ok", text: `${g.name} can enter Royal Sky for 24 hours.` });
        return true;
      }
    }
    return true;
  }
  void SOCIETIES;
  return { onMessage: onMessage2, canEnterRoyal };
}

// src/data/media.ts
var AD_PRICES = {
  "ad-core-n": 900,
  "ad-core-w": 650,
  "ad-market-n": 800,
  "ad-market-s": 760,
  "ad-club": 450,
  "ad-pool": 360,
  "ad-gardens": 380,
  "ad-marina": 500,
  "ad-avenue-w": 580,
  "ad-avenue-e": 420,
  "ad-skyport": 340,
  "ad-homes": 280
};
var AD_DAYS = [1, 7, 14, 30];
var adCost = (spot, days) => Math.round((AD_PRICES[spot] || 0) * days * (days >= 30 ? 0.75 : days >= 14 ? 0.85 : days >= 7 ? 0.9 : 1));
var AD_IMAGE_MAX = 6e4;
var HALLS = [
  { id: "grand", name: "Grand Conference Hall", kind: "conference", site: "halls", cap: 200, hourly: 600, color: "#4da3ff", desc: "Main stage, giant screen and 200 seats. Product launches, summits, graduations." },
  { id: "summit", name: "Summit Room", kind: "conference", site: "halls", cap: 60, hourly: 250, color: "#ffc27a", desc: "Boardroom-style room for meetups, panels and investor pitches." },
  { id: "studio", name: "Workshop Studio", kind: "conference", site: "halls", cap: 30, hourly: 120, color: "#45e0ae", desc: "Small room with a whiteboard wall for classes and hands-on workshops." },
  { id: "skyline", name: "Skyline Lounge", kind: "lounge", site: "lounge", cap: 80, hourly: 300, color: "#c792ea", desc: "Sofas, a mocktail bar and city views. Networking nights and listening parties." },
  { id: "rooftop", name: "Rooftop Chill Lounge", kind: "lounge", site: "lounge", cap: 40, hourly: 150, color: "#ff9a3c", desc: "Open-air rooftop with fire tables for small, relaxed hangouts." },
  { id: "arena", name: "Gaming Arena", kind: "gaming", site: "lounge", cap: 120, hourly: 400, color: "#e5484d", desc: "Gaming rigs, an arena screen and stands. Watch parties and skill tournaments." }
];
var hallById = (id) => HALLS.find((h) => h.id === id);
var HALL_MAX_HOURS = 6;
var TICKET_MAX = 5e3;
var HOST_SHARE = 0.9;
var NEWS_CATS = {
  nation: { label: "Nation", color: "#ffc27a" },
  economy: { label: "Economy", color: "#45e0ae" },
  property: { label: "Property", color: "#4da3ff" },
  market: { label: "Market", color: "#ff9a3c" },
  education: { label: "Education", color: "#7fd1ff" },
  events: { label: "Events", color: "#c792ea" },
  court: { label: "Court", color: "#e5484d" },
  ads: { label: "Billboards", color: "#f1c40f" },
  citizen: { label: "Citizen report", color: "#a8d8ff" }
};
var WORLD_FEEDS = [
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "NPR World", url: "https://feeds.npr.org/1004/rss.xml" }
];

// server/news.ts
var H3 = 36e5;
var FEED_EVERY = +(process.env.NEWS_FEED_MS || 20 * 6e4);
var FEEDS = (() => {
  const e = String(process.env.NEWS_FEEDS || "").trim();
  if (e === "off") return [];
  if (!e) return WORLD_FEEDS;
  return e.split(",").map((u) => u.trim()).filter((u) => /^https:\/\//.test(u)).map((url) => ({ name: new URL(url).hostname.replace(/^(www|feeds)\./, ""), url }));
})();
var decode = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, " ").trim();
function parseRss(xml, source) {
  const out = [];
  for (const m of xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/g)) {
    const it = m[0];
    const title = decode(it.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || "");
    let link = decode(it.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] || "") || (it.match(/<link[^>]*href="([^"]+)"/)?.[1] || "");
    const date = decode(it.match(/<(pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/\1>/)?.[2] || "");
    if (!title || !/^https:\/\//.test(link)) continue;
    link = link.slice(0, 400);
    out.push({ title: title.slice(0, 220), link, source, at: Date.parse(date) || Date.now() });
  }
  return out;
}
function createNews(d) {
  if (!d.db.news) {
    d.db.news = { items: [], seq: 0 };
    d.save();
  }
  const N = d.db.news;
  let world = [];
  let worldAt = 0;
  let worldErr = "";
  const visible = () => N.items.filter((i) => !i.hidden).slice(-80).reverse();
  const pub2 = (i) => ({ id: i.id, kind: i.kind, cat: i.cat, title: i.title, body: i.body, at: i.at, byName: i.byName, flags: i.flags?.length || 0 });
  const state = () => ({ t: "news_state", fyrus: visible().map(pub2), world, worldAt, worldErr: world.length ? "" : worldErr, sources: FEEDS.map((f) => f.name) });
  function report2(cat, title, body) {
    const last = N.items.at(-1);
    if (last && last.title === title && Date.now() - last.at < 6e4) return;
    const it = { id: ++N.seq, kind: "fyrus", cat: NEWS_CATS[cat] ? cat : "nation", title: title.slice(0, 160), body: body?.slice(0, 600), at: Date.now() };
    N.items.push(it);
    if (N.items.length > 400) N.items.splice(0, N.items.length - 400);
    d.save();
    d.broadcast({ t: "news_new", item: pub2(it) });
  }
  async function fetchWorld() {
    if (!FEEDS.length) return;
    const all = [];
    const errs = [];
    await Promise.all(FEEDS.map(async (f) => {
      const ac = new AbortController();
      const tm = setTimeout(() => ac.abort(), 8e3);
      try {
        const r = await fetch(f.url, { signal: ac.signal, headers: { "user-agent": "FyrusNews/1.0 (+https://fyrus.io)", accept: "application/rss+xml, application/xml, text/xml" } });
        if (!r.ok) throw new Error("HTTP " + r.status);
        all.push(...parseRss((await r.text()).slice(0, 2e6), f.name).slice(0, 25));
      } catch (e) {
        errs.push(`${f.name}: ${e?.name === "AbortError" ? "timeout" : e?.message || "failed"}`);
      } finally {
        clearTimeout(tm);
      }
    }));
    if (all.length) {
      const seen = /* @__PURE__ */ new Set();
      world = all.filter((w) => !seen.has(w.link) && seen.add(w.link)).sort((a, b) => b.at - a.at).slice(0, 45);
      worldAt = Date.now();
      d.broadcast({ t: "news_world", world, worldAt });
    }
    worldErr = errs.join(" \xB7 ");
    if (errs.length) console.log("news feeds:", worldErr);
  }
  if (FEEDS.length) {
    setTimeout(fetchWorld, 3e3);
    setInterval(fetchWorld, FEED_EVERY);
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("news_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "news_state":
        reply(state());
        return true;
      case "news_submit": {
        const pp = d.db.users[u.id]?.passport;
        if (!pp || pp.kind === "visa") {
          err("Citizen reports are for Fyrus passport holders.");
          return true;
        }
        const title = d.filter(d.clean(m.title, 120));
        const body = d.filter(String(m.body || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, 1200));
        if (title.length < 10 || body.length < 40) {
          err("Write a headline (10+ letters) and the story (40+ letters).");
          return true;
        }
        const bad = sentinel(`${title} ${body}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this report"));
          return true;
        }
        const today = N.items.filter((i) => i.by === u.id && Date.now() - i.at < 24 * H3).length;
        if (today >= 3) {
          err("You can post 3 citizen reports a day.");
          return true;
        }
        const it = { id: ++N.seq, kind: "citizen", cat: "citizen", title, body, at: Date.now(), by: u.id, byName: d.shown(u.id), flags: [] };
        N.items.push(it);
        if (N.items.length > 400) N.items.splice(0, N.items.length - 400);
        d.save();
        d.broadcast({ t: "news_new", item: pub2(it) });
        reply({ t: "ok", text: "Your report is live on Fyrus News (labelled as a citizen report)." });
        return true;
      }
      case "news_flag": {
        const it = N.items.find((i) => i.id === +m.id);
        if (!it || it.kind !== "citizen" || it.hidden) return true;
        it.flags = it.flags || [];
        if (!it.flags.includes(u.id) && it.by !== u.id) it.flags.push(u.id);
        if (it.flags.length >= 3) {
          it.hidden = true;
          d.broadcast({ t: "news_gone", id: it.id });
        }
        d.save();
        reply({ t: "ok", text: it.hidden ? "Report taken off air after flags from citizens." : "Thanks, the report was flagged for review." });
        return true;
      }
      case "news_remove": {
        const it = N.items.find((i) => i.id === +m.id);
        if (!it) return true;
        if (!d.isAdmin(u.id) && it.by !== u.id) {
          err("Only the reporter or a Fyrus judge can remove this.");
          return true;
        }
        it.hidden = true;
        d.save();
        d.broadcast({ t: "news_gone", id: it.id });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, report: report2, state, fetchWorld };
}

// server/ads.ts
var DAY = +(process.env.AD_DAY_MS || 24 * 36e5);
var TICK = +(process.env.ADS_TICK_MS || 3e4);
function createAds(d) {
  if (!d.db.ads) {
    d.db.ads = { list: [], revenue: 0 };
    d.save();
  }
  const A = d.db.ads;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const live2 = (now = Date.now()) => A.list.filter((a) => !a.removed && a.start <= now && a.end > now);
  const pub2 = (a, img) => ({ id: a.id, spot: a.spot, ownerName: a.ownerName, brand: a.brand, headline: a.headline, color: a.color, category: a.category, image: img ? a.image : void 0, start: a.start, end: a.end, owner: a.owner });
  const freeFrom = (spot) => Math.max(Date.now(), ...A.list.filter((a) => a.spot === spot && !a.removed).map((a) => a.end));
  const state = () => {
    const now = Date.now();
    const cur = live2(now);
    return { t: "ads_state", live: cur.map((a) => pub2(a, true)), next: Object.fromEntries(Object.keys(AD_PRICES).map((s) => [s, freeFrom(s)])), queue: A.list.filter((a) => !a.removed && a.start > now).map((a) => pub2(a, false)), prices: AD_PRICES, revenue: A.revenue, now };
  };
  const mine = (uid) => ({ t: "ads_mine", list: A.list.filter((a) => a.owner === uid).slice(-30).reverse().map((a) => ({ ...pub2(a, false), paid: a.paid, removed: a.removed })) });
  let sig = "";
  const push = () => {
    const s = state();
    sig = s.live.map((a) => a.id).join(",");
    d.save();
    d.broadcast(s);
  };
  setInterval(() => {
    const now = Date.now();
    const ids = live2(now).map((a) => a.id).join(",");
    if (ids !== sig) push();
    if (A.list.length > 600) A.list = A.list.filter((a) => a.end > now - 30 * 24 * 36e5);
  }, TICK);
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("ad_") || m.t.startsWith("ads_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "ads_state":
        reply(state());
        return true;
      case "ads_mine":
        reply(mine(u.id));
        return true;
      case "ad_book": {
        const spot = String(m.spot || "");
        if (!AD_PRICES[spot]) {
          err("No such billboard.");
          return true;
        }
        if (bank2.acct(u.id).banned) {
          err("This account is suspended.");
          return true;
        }
        const days = AD_DAYS.includes(+m.days) ? +m.days : 0;
        if (!days) {
          err("Pick 1, 7, 14 or 30 days.");
          return true;
        }
        const brand = d.filter(d.clean(m.brand, 30));
        const headline = d.filter(d.clean(m.headline, 26));
        if (brand.length < 2 || headline.length < 3) {
          err("Add a name and a headline.");
          return true;
        }
        const bad = sentinel(`${brand} ${headline}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this ad"));
          return true;
        }
        const image = typeof m.image === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(m.image) && m.image.length <= AD_IMAGE_MAX ? m.image : void 0;
        if (m.image && !image) {
          err("The poster must be a JPEG, PNG or WebP under 45 KB. Try a smaller image.");
          return true;
        }
        if (A.list.filter((a2) => a2.owner === u.id && !a2.removed && a2.end > Date.now()).length >= 6) {
          err("You can have up to 6 billboard bookings at a time.");
          return true;
        }
        const cost = adCost(spot, days);
        const start = freeFrom(spot);
        if (!bank2.transfer(u.id, "treasury", cost, `Billboard ${spot} \xB7 ${days} day${days > 1 ? "s" : ""}`)) {
          err(`You need ${cost.toLocaleString("en-US")} FYC for this booking.`);
          return true;
        }
        const a = { id: "ad" + d.rid(6), spot, owner: u.id, ownerName: u.name, brand, headline, color: /^#[0-9a-fA-F]{6}$/.test(String(m.color)) ? m.color : "#ff9a3c", category: d.clean(m.category, 20) || "Brand", image, start, end: start + days * DAY, paid: cost, at: Date.now() };
        A.list.push(a);
        A.revenue += cost;
        push();
        reply(mine(u.id));
        reply({ t: "ok", text: start <= Date.now() + 1e3 ? `Your ad is live now for ${days} day${days > 1 ? "s" : ""}.` : `Booked. Your ad goes live ${new Date(start).toUTCString().slice(5, 22)} UTC, after the current booking.` });
        d.news?.("ads", `New billboard: ${brand} \u2014 "${headline}"`);
        return true;
      }
      case "ad_cancel": {
        const a = A.list.find((x) => x.id === m.id && x.owner === u.id && !x.removed);
        if (!a) return true;
        if (a.start <= Date.now()) {
          err("This ad is already live. Live bookings run to the end and are not refunded.");
          return true;
        }
        a.removed = "cancelled";
        bank2.transfer("treasury", u.id, a.paid, `Billboard booking cancelled: ${a.spot}`);
        A.revenue -= a.paid;
        const later = A.list.filter((x) => x.spot === a.spot && !x.removed && x.start >= a.end).sort((x, y) => x.start - y.start);
        let t = Math.max(Date.now(), ...A.list.filter((x) => x.spot === a.spot && !x.removed && x.start < a.start).map((x) => x.end));
        later.forEach((x) => {
          const len = x.end - x.start;
          x.start = t;
          x.end = t + len;
          t = x.end;
        });
        push();
        reply(mine(u.id));
        reply({ t: "ok", text: "Booking cancelled and refunded." });
        return true;
      }
      case "ad_remove": {
        if (!d.isAdmin(u.id)) {
          err("Only Fyrus judges can remove ads.");
          return true;
        }
        const a = A.list.find((x) => x.id === m.id && !x.removed);
        if (!a) return true;
        const now = Date.now();
        const unused = Math.round(a.paid * Math.max(0, Math.min(1, (a.end - Math.max(now, a.start)) / (a.end - a.start))));
        a.removed = d.clean(m.reason, 200) || "Removed by a Fyrus judge";
        if (unused > 0) {
          bank2.transfer("treasury", a.owner, unused, `Billboard removed, unused days refunded: ${a.spot}`);
          A.revenue -= unused;
        }
        note(a.owner, `Your billboard "${a.headline}" was removed: ${a.removed}.${unused > 0 ? ` ${unused.toLocaleString("en-US")} FYC refunded.` : ""}`);
        push();
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, state };
}

// server/halls.ts
var H4 = +(process.env.HALL_HOUR_MS || 36e5);
var TICK2 = +(process.env.HALLS_TICK_MS || 2e4);
function createHalls(d) {
  if (!d.db.halls) {
    d.db.halls = { events: {} };
    d.save();
  }
  const K = d.db.halls;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pub2 = (e, uid) => ({ id: e.id, hall: e.hall, hostName: e.hostName, host: e.host, title: e.title, desc: e.desc, start: e.start, end: e.end, price: e.price, going: e.tickets.length, cap: hallById(e.hall)?.cap || 0, status: e.status, mine: uid ? e.tickets.includes(uid) : void 0 });
  const upcoming = () => Object.values(K.events).filter((e) => e.status === "scheduled").sort((a, b) => a.start - b.start);
  const list = (uid) => ({ t: "hall_list", events: upcoming().slice(0, 80).map((e) => pub2(e, uid)), now: Date.now() });
  const changed = () => {
    d.save();
    d.broadcast({ t: "hall_changed" });
  };
  const overlap = (hall, s, e) => upcoming().some((x) => x.hall === hall && x.start < e && x.end > s);
  function finish(e) {
    e.status = "done";
    const gross = e.price * e.tickets.length;
    if (gross > 0) {
      const host = Math.round(gross * HOST_SHARE);
      bank2.transfer("escrow", e.host, host, `Ticket sales: ${e.title}`);
      if (gross - host > 0) bank2.transfer("escrow", "treasury", gross - host, `Event fee 10%: ${e.title}`);
      note(e.host, `"${e.title}" ended. ${host.toLocaleString("en-US")} FYC from ${e.tickets.length} tickets is in your account.`);
    }
    changed();
  }
  function cancel(e, why) {
    e.status = "cancelled";
    if (e.price > 0) e.tickets.forEach((t) => bank2.transfer("escrow", t, e.price, `Ticket refunded: ${e.title}`));
    e.tickets.forEach((t) => note(t, `"${e.title}" was cancelled (${why}).${e.price ? " Your ticket is refunded." : ""}`));
    changed();
  }
  setInterval(() => {
    const now = Date.now();
    for (const e of upcoming()) {
      if (!e.started && e.start <= now) {
        e.started = true;
        d.save();
        const h = hallById(e.hall);
        [e.host, ...e.tickets].forEach((t) => note(t, `"${e.title}" is starting now in the ${h?.name}. Open Events to go in.`));
        d.news?.("events", `Now live: "${e.title}" in the ${h?.name}, hosted by ${e.hostName}`);
        d.broadcast({ t: "hall_changed" });
      }
      if (e.end <= now) finish(e);
    }
    const old = Object.values(K.events).filter((e) => e.status !== "scheduled" && e.end < now - 14 * 24 * 36e5);
    old.forEach((e) => delete K.events[e.id]);
    if (old.length) d.save();
  }, TICK2);
  function access(uid, hall) {
    const now = Date.now();
    const e = upcoming().find((x) => x.hall === hall && x.start <= now && x.end > now);
    if (!e) return { ok: true };
    if (e.price === 0 || e.host === uid || e.tickets.includes(uid)) return { ok: true, event: pub2(e, uid) };
    return { ok: false, event: pub2(e, uid) };
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("hall_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const ev = m.event ? K.events[String(m.event)] : void 0;
    switch (m.t) {
      case "hall_list":
        reply(list(u.id));
        return true;
      case "hall_enter": {
        const h = hallById(String(m.hall));
        if (!h) return true;
        reply({ t: "hall_access", hall: h.id, ...access(u.id, h.id) });
        return true;
      }
      case "hall_book": {
        const h = hallById(String(m.hall));
        if (!h) {
          err("No such hall.");
          return true;
        }
        if (bank2.acct(u.id).banned) {
          err("This account is suspended.");
          return true;
        }
        const title = d.filter(d.clean(m.title, 80));
        const desc = d.filter(String(m.desc || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, 800));
        if (title.length < 4) {
          err("Give the event a title.");
          return true;
        }
        const bad = sentinel(`${title} ${desc}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this event"));
          return true;
        }
        const hours = Math.max(1, Math.min(HALL_MAX_HOURS, Math.round(+m.hours || 1)));
        const price = Math.max(0, Math.min(TICKET_MAX, Math.round(+m.price || 0)));
        const start = Math.round(+m.start || 0);
        const now = Date.now();
        if (!(start >= now - 5 * 6e4) || start > now + 30 * 24 * 36e5) {
          err("Pick a start time from now up to 30 days ahead.");
          return true;
        }
        const end = Math.max(start, now) + hours * H4;
        if (overlap(h.id, start, end)) {
          err(`The ${h.name} is already booked at that time. Try another hour or hall.`);
          return true;
        }
        if (upcoming().filter((e2) => e2.host === u.id).length >= 5) {
          err("You can host up to 5 upcoming events.");
          return true;
        }
        const fee = h.hourly * hours;
        if (!bank2.transfer(u.id, "treasury", fee, `${h.name} booking \xB7 ${hours} h`)) {
          err(`Booking the ${h.name} for ${hours} h costs ${fee.toLocaleString("en-US")} FYC.`);
          return true;
        }
        const e = { id: "e" + d.rid(6), hall: h.id, host: u.id, hostName: u.name, title, desc, start: Math.max(start, now), end, price, tickets: [], fee, status: "scheduled", at: now };
        K.events[e.id] = e;
        changed();
        reply(list(u.id));
        reply({ t: "ok", text: `${h.name} booked: "${title}".` });
        d.news?.("events", `Coming up: "${title}" in the ${h.name}${price ? ` \xB7 tickets ${price.toLocaleString("en-US")} FYC` : " \xB7 free entry"}`);
        return true;
      }
      case "hall_ticket": {
        if (!ev || ev.status !== "scheduled") {
          err("This event is not open.");
          return true;
        }
        if (ev.host === u.id) {
          err("You are the host.");
          return true;
        }
        if (ev.tickets.includes(u.id)) {
          err("You already have a ticket.");
          return true;
        }
        if (ev.tickets.length >= (hallById(ev.hall)?.cap || 0)) {
          err("Sold out.");
          return true;
        }
        if (ev.price > 0 && !bank2.transfer(u.id, "escrow", ev.price, `Ticket held in escrow: ${ev.title}`)) {
          err(`A ticket costs ${ev.price.toLocaleString("en-US")} FYC.`);
          return true;
        }
        ev.tickets.push(u.id);
        changed();
        reply(list(u.id));
        reply({ t: "ok", text: ev.price ? "Ticket bought. Your FYC is held safely until the event ends." : "You are on the guest list." });
        if (ev.tickets.length % 10 === 0 || ev.tickets.length === 1) note(ev.host, `${ev.tickets.length} going to "${ev.title}".`);
        return true;
      }
      case "hall_leave": {
        if (!ev || ev.status !== "scheduled" || !ev.tickets.includes(u.id)) return true;
        if (ev.start <= Date.now()) {
          err("The event has started; tickets can no longer be returned.");
          return true;
        }
        ev.tickets = ev.tickets.filter((t) => t !== u.id);
        if (ev.price > 0) bank2.transfer("escrow", u.id, ev.price, `Ticket returned: ${ev.title}`);
        changed();
        reply(list(u.id));
        return true;
      }
      case "hall_cancel": {
        if (!ev || ev.status !== "scheduled") return true;
        if (ev.host !== u.id && !d.isAdmin(u.id)) {
          err("Only the host can cancel.");
          return true;
        }
        const early = ev.start - Date.now() > 36e5;
        if (early && ev.host === u.id) bank2.transfer("treasury", ev.host, ev.fee, `Hall booking refunded: ${ev.title}`);
        cancel(ev, ev.host === u.id ? "cancelled by the host" : "removed by a Fyrus judge");
        reply(list(u.id));
        reply({ t: "ok", text: `Event cancelled.${early && ev.host === u.id ? " Booking fee refunded." : ""}` });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, access, halls: HALLS };
}

// server/accounts.ts
import crypto2 from "node:crypto";
var GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || "";
var RESEND = process.env.RESEND_API_KEY || "";
var MAIL_FROM = process.env.MAIL_FROM || "";
var MAX_TOKENS = 10;
var hashPw = (pw) => {
  const salt = crypto2.randomBytes(16).toString("hex");
  return salt + ":" + crypto2.scryptSync(pw, salt, 32).toString("hex");
};
var checkPw = (pw, stored) => {
  if (!stored) return false;
  const [salt, h] = stored.split(":");
  const a = Buffer.from(h, "hex"), b = crypto2.scryptSync(pw, salt, 32);
  return a.length === b.length && crypto2.timingSafeEqual(a, b);
};
var normEmail = (e) => String(e || "").trim().toLowerCase().slice(0, 120);
var okEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function createAccounts(d) {
  const byEmail = (e) => Object.values(d.db.users).find((u) => u.email === e);
  const byToken = (token) => {
    if (!token) return void 0;
    const h = d.sha(String(token));
    return Object.values(d.db.users).find((u) => u.tok === h || u.toks?.includes(h));
  };
  const issue = (u) => {
    const token = d.rid(24);
    const h = d.sha(token);
    u.toks = [...(u.toks || []).filter((t) => t !== h), h].slice(-MAX_TOKENS);
    if (!u.tok) u.tok = h;
    d.save();
    return token;
  };
  const banText = (u) => u.banned && u.banned.until > Date.now() ? `This account is suspended${u.banned.until < 8e15 ? ` until ${new Date(u.banned.until).toUTCString().slice(5, 22)} UTC` : ""}: ${u.banned.reason}` : "";
  const pub2 = (u, token) => ({ ok: true, token, user: { id: u.id, name: u.name, number: u.number, email: u.email || null, google: !!u.google } });
  const hits = /* @__PURE__ */ new Map();
  const limited = (ip, max = 12) => {
    const now = Date.now();
    const a = (hits.get(ip) || []).filter((t) => now - t < 6e4);
    a.push(now);
    hits.set(ip, a);
    if (hits.size > 5e3) hits.clear();
    return a.length > max;
  };
  async function sendMail(to, subject, text) {
    if (!RESEND || !MAIL_FROM) return false;
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${RESEND}`, "content-type": "application/json" }, body: JSON.stringify({ from: MAIL_FROM, to, subject, text }) });
      if (!r.ok) console.error("mail", r.status, (await r.text()).slice(0, 200));
      return r.ok;
    } catch (e) {
      console.error("mail failed", e);
      return false;
    }
  }
  async function handle(path3, body, ip) {
    if (path3 === "/api/auth/config") return { status: 200, json: { google: GOOGLE_ID || null, reset: !!(RESEND && MAIL_FROM) } };
    if (!path3.startsWith("/api/auth/")) return null;
    if (limited(ip)) return { status: 429, json: { error: "Too many tries. Wait a minute and try again." } };
    const fail = (error, status = 400) => ({ status, json: { error } });
    switch (path3) {
      case "/api/auth/register": {
        const email = normEmail(body.email);
        const pw = String(body.password || "");
        const name = d.clean(body.name, 24);
        if (!okEmail(email)) return fail("Enter a valid email, like you@example.com");
        if (pw.length < 8) return fail("Use at least 8 characters for your password.");
        if (body.age13 !== true) return fail("You must be 13 or older to use Fyrus.");
        if (byEmail(email)) return fail("An account with this email already exists. Log in instead.");
        let u = body.token ? byToken(String(body.token)) : void 0;
        if (u && (u.email || u.google)) u = void 0;
        let token = "";
        if (!u) {
          const c = d.createUser(name || email.split("@")[0], "en");
          u = c.u;
          token = c.token;
          u.toks = [u.tok];
        } else token = String(body.token);
        if (banText(u)) return fail(banText(u), 403);
        u.email = email;
        u.pw = hashPw(pw);
        u.age13 = true;
        if (name) u.name = name;
        d.save();
        return { status: 200, json: pub2(u, token) };
      }
      case "/api/auth/login": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        if (!u || !checkPw(String(body.password || ""), u.pw)) return fail("Wrong email or password.", 401);
        if (banText(u)) return fail(banText(u), 403);
        return { status: 200, json: pub2(u, issue(u)) };
      }
      case "/api/auth/google": {
        if (!GOOGLE_ID) return fail("Google sign-in is not set up on this server yet.", 501);
        let info;
        try {
          const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(String(body.credential || "")));
          info = await r.json();
          if (!r.ok) throw new Error();
        } catch {
          return fail("Google could not confirm this sign-in. Try again.", 401);
        }
        if (info.aud !== GOOGLE_ID || !["accounts.google.com", "https://accounts.google.com"].includes(info.iss) || String(info.email_verified) !== "true") return fail("Google sign-in was not valid.", 401);
        const email = normEmail(info.email);
        let u = Object.values(d.db.users).find((x) => x.google === info.sub) || byEmail(email);
        let token = "";
        if (!u) {
          const guest = body.token ? byToken(String(body.token)) : void 0;
          if (guest && !guest.email && !guest.google) {
            u = guest;
            token = String(body.token);
          } else {
            const c = d.createUser(d.clean(info.given_name || info.name, 24) || email.split("@")[0], "en");
            u = c.u;
            token = c.token;
            u.toks = [u.tok];
          }
        }
        if (banText(u)) return fail(banText(u), 403);
        if (body.age13 !== true && !u.age13) return fail("Please confirm you are 13 or older.", 400);
        u.google = info.sub;
        u.email = u.email || email;
        u.age13 = true;
        d.save();
        return { status: 200, json: pub2(u, token || issue(u)) };
      }
      case "/api/auth/reset-request": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        if (!RESEND || !MAIL_FROM) return fail("Password reset by email is not set up yet. Contact support from the Help page.", 501);
        if (u && u.pw) {
          const code = String(crypto2.randomInt(1e5, 1e6));
          u.reset = { code: d.sha(code), until: Date.now() + 15 * 6e4, tries: 0 };
          d.save();
          await sendMail(email, "Your Fyrus reset code", `Your Fyrus password reset code is ${code}. It works for 15 minutes. If you did not ask for it, ignore this email.`);
        }
        return { status: 200, json: { ok: true } };
      }
      case "/api/auth/reset": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        const pw = String(body.password || "");
        if (!u || !u.reset || u.reset.until < Date.now() || u.reset.tries >= 5) return fail("That code has expired. Ask for a new one.");
        if (u.reset.code !== d.sha(String(body.code || "").trim())) {
          u.reset.tries++;
          d.save();
          return fail("That code does not match.");
        }
        if (pw.length < 8) return fail("Use at least 8 characters for your new password.");
        u.pw = hashPw(pw);
        u.reset = void 0;
        u.toks = [];
        u.tok = "";
        d.save();
        return { status: 200, json: pub2(u, issue(u)) };
      }
      case "/api/auth/logout": {
        const u = byToken(String(body.token || ""));
        if (u) {
          const h = d.sha(String(body.token));
          u.toks = (u.toks || []).filter((t) => t !== h);
          if (u.tok === h) u.tok = u.toks[0] || "";
          d.save();
        }
        return { status: 200, json: { ok: true } };
      }
    }
    return fail("Not found", 404);
  }
  function http2(req, res, path3, ip) {
    if (!path3.startsWith("/api/auth/")) return false;
    const done = (r) => {
      res.writeHead(r?.status || 404, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(r?.json || { error: "Not found" }));
    };
    if (req.method === "GET") {
      handle(path3, {}, ip).then(done);
      return true;
    }
    if (req.method !== "POST") {
      done({ status: 405, json: { error: "POST only" } });
      return true;
    }
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 16384) req.destroy();
    });
    req.on("end", () => {
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        return done({ status: 400, json: { error: "Bad request" } });
      }
      handle(path3, body, ip).then(done).catch((e) => {
        console.error("auth", e);
        done({ status: 500, json: { error: "Server error" } });
      });
    });
    return true;
  }
  return { http: http2, handle, byToken, banText, issue };
}

// server/ops.ts
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
var XP_DAILY = +(process.env.XP_DAILY_CAP || 3e3);
var XP_IMPORT_CAP = 2e4;
var KEEP_BACKUPS = 14;
var day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var EVENTS = /^(goal:[a-z]+|tour|now_open|ride:[a-z]+|drive|fly|signup_prompt|lite_on)$/;
function createOps(d) {
  if (!d.db.ops) {
    d.db.ops = { errors: [], stats: {} };
    d.save();
  }
  const O = d.db.ops;
  const today = () => O.stats[day()] ||= { visits: 0, newUsers: 0, signups: 0, peak: 0, events: {} };
  const bump = (k) => {
    today()[k]++;
    const t = today();
    t.peak = Math.max(t.peak, d.liveCount());
    d.save();
  };
  const track = (ev) => {
    if (!EVENTS.test(ev)) return;
    const t = today();
    t.events[ev] = (t.events[ev] || 0) + 1;
    d.save();
  };
  const bdir = path.join(d.dataDir, "backups");
  function backupNow() {
    try {
      fs.mkdirSync(bdir, { recursive: true });
      const f = path.join(bdir, `fyrus-${day()}.json.gz`);
      fs.writeFileSync(f, zlib.gzipSync(fs.readFileSync(d.dbFile())));
      const all = fs.readdirSync(bdir).filter((x) => x.startsWith("fyrus-")).sort();
      all.slice(0, Math.max(0, all.length - KEEP_BACKUPS)).forEach((x) => fs.unlinkSync(path.join(bdir, x)));
      return f;
    } catch (e) {
      console.error("backup failed", e);
      return null;
    }
  }
  const backups = () => {
    try {
      return fs.readdirSync(bdir).filter((x) => x.startsWith("fyrus-")).sort().reverse().map((f) => ({ file: f, size: fs.statSync(path.join(bdir, f)).size }));
    } catch {
      return [];
    }
  };
  setTimeout(() => {
    if (!backups().some((b) => b.file.includes(day()))) backupNow();
  }, 2e4);
  setInterval(() => {
    if (!backups().some((b) => b.file.includes(day()))) backupNow();
  }, 60 * 6e4);
  if (O.stats) {
    const keys = Object.keys(O.stats).sort();
    keys.slice(0, Math.max(0, keys.length - 90)).forEach((k) => delete O.stats[k]);
  }
  const errHits = /* @__PURE__ */ new Map();
  function http2(req, res, p, ip, auth) {
    if (p === "/api/err" && req.method === "POST") {
      const now = Date.now();
      const a = (errHits.get(ip) || []).filter((t) => now - t < 6e4);
      a.push(now);
      errHits.set(ip, a);
      if (errHits.size > 5e3) errHits.clear();
      let raw = "";
      req.on("data", (c) => {
        raw += c;
        if (raw.length > 8192) req.destroy();
      });
      req.on("end", () => {
        if (a.length <= 20) {
          try {
            const b = JSON.parse(raw || "{}");
            O.errors.push({ at: now, msg: d.clean(b.msg, 300), stack: d.clean(b.stack, 1200), url: d.clean(b.url, 120), ua: d.clean(req.headers["user-agent"], 160) });
            if (O.errors.length > 300) O.errors.splice(0, O.errors.length - 300);
            d.save();
          } catch {
          }
        }
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    if (p.startsWith("/api/admin/backup")) {
      const tok = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const u = auth(tok);
      if (!u || !d.isAdmin(u.id)) {
        res.writeHead(403);
        res.end("Forbidden");
        return true;
      }
      const f = backupNow() || backups()[0] && path.join(bdir, backups()[0].file);
      if (!f) {
        res.writeHead(500);
        res.end("No backup");
        return true;
      }
      res.writeHead(200, { "content-type": "application/gzip", "content-disposition": `attachment; filename="${path.basename(f)}"`, "cache-control": "no-store" });
      fs.createReadStream(f).pipe(res);
      return true;
    }
    return false;
  }
  function xpMsg(u) {
    return { t: "xp", xp: u.xp || 0, today: u.xpDay === day() ? u.xpToday || 0 : 0, cap: XP_DAILY };
  }
  const userInfo = (u) => ({ id: u.id, name: u.name, number: u.number, email: u.email || null, google: !!u.google, joined: u.joined, seen: u.seen, online: !!d.liveOf(u.id), bal: d.db.bank?.acct?.[u.id]?.bal ?? null, xp: u.xp || 0, muteUntil: u.muteUntil || 0, banned: u.banned && u.banned.until > Date.now() ? u.banned : null, reports: d.db.reports.filter((r) => r.against === u.id).length });
  function kick(u, text) {
    const l = d.liveOf(u.id);
    if (l) {
      d.send(l.ws, { t: "err", text });
      try {
        l.ws.close();
      } catch {
      }
    }
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string") return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    if (m.t === "xp_hello") {
      if (u.xp === void 0) {
        u.xp = Math.max(0, Math.min(XP_IMPORT_CAP, Math.round(+m.local || 0)));
        d.save();
      }
      reply(xpMsg(u));
      return true;
    }
    if (m.t === "xp_add") {
      const n = Math.max(0, Math.min(250, Math.round(+m.n || 0)));
      if (u.xpDay !== day()) {
        u.xpDay = day();
        u.xpToday = 0;
      }
      const ok = Math.min(n, XP_DAILY - (u.xpToday || 0));
      if (ok > 0) {
        u.xp = (u.xp || 0) + ok;
        u.xpToday = (u.xpToday || 0) + ok;
        d.save();
      }
      reply(xpMsg(u));
      return true;
    }
    if (m.t === "track") {
      track(String(m.ev || ""));
      return true;
    }
    if (!m.t.startsWith("admin_")) return false;
    if (!d.isAdmin(u.id)) {
      reply({ t: "err", text: "Admins only." });
      return true;
    }
    const target = m.id ? d.db.users[String(m.id)] : void 0;
    switch (m.t) {
      case "admin_stats": {
        const days = Object.entries(O.stats).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14).map(([k, v]) => ({ day: k, ...v }));
        const users = Object.values(d.db.users);
        reply({ t: "admin_stats", users: users.length, withEmail: users.filter((x) => x.email || x.google).length, online: d.liveCount(), days, treasury: d.db.bank?.acct?.treasury?.bal ?? 0, adRevenue: d.db.ads?.revenue ?? 0, openReports: d.db.reports.filter((r) => !r.done).length, errors: O.errors.length, backups: backups(), banned: users.filter((x) => x.banned && x.banned.until > Date.now()).length });
        return true;
      }
      case "admin_reports":
        reply({ t: "admin_reports", list: d.db.reports.map((r, i) => ({ i, ...r, byName: d.shown(r.by), againstName: d.shown(r.against), againstNumber: d.db.users[r.against]?.number })).filter((r) => !r.done).slice(-100).reverse() });
        return true;
      case "admin_report_done": {
        const r = d.db.reports[+m.i];
        if (r) {
          r.done = d.clean(m.note, 80) || "reviewed";
          r.doneBy = u.id;
          r.doneAt = Date.now();
          d.save();
        }
        reply({ t: "ok", text: "Report closed." });
        return true;
      }
      case "admin_find": {
        const q = d.clean(m.q, 60).toLowerCase();
        const byNum = d.findByNumber(q);
        const list = byNum ? [byNum] : Object.values(d.db.users).filter((x) => x.name.toLowerCase().includes(q) || (x.email || "").includes(q) || x.id === q).slice(0, 20);
        reply({ t: "admin_users", list: list.map(userInfo) });
        return true;
      }
      case "admin_mute": {
        if (!target) return true;
        const h = Math.max(1, Math.min(24 * 30, +m.hours || 24));
        target.muteUntil = Date.now() + h * 36e5;
        d.save();
        const l = d.liveOf(target.id);
        if (l) d.send(l.ws, { t: "note", text: `You are muted in chat for ${h} hour${h > 1 ? "s" : ""} by a moderator.` });
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_unmute": {
        if (!target) return true;
        target.muteUntil = 0;
        d.save();
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_ban": {
        if (!target || d.isAdmin(target.id)) return true;
        const h = +m.hours || 0;
        target.banned = { until: h > 0 ? Date.now() + h * 36e5 : 9e15, reason: d.clean(m.reason, 200) || "Breaking the Fyrus rules" };
        d.save();
        kick(target, `This account is suspended: ${target.banned.reason}`);
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_unban": {
        if (!target) return true;
        target.banned = void 0;
        d.save();
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_errors":
        reply({ t: "admin_errors", list: O.errors.slice(-60).reverse() });
        return true;
      case "admin_backup": {
        const f = backupNow();
        reply({ t: "ok", text: f ? `Backup saved: ${path.basename(f)}` : "Backup failed \u2014 check the server log." });
        reply({ t: "admin_stats_backups", backups: backups() });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, http: http2, bump, track, backupNow, xpMsg };
}

// server/legal.ts
var UPDATED = "20 October 2026";
var shell = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} \xB7 Fyrus</title>
<style>body{margin:0;background:#040a1c;color:#e6ecf7;font:16px/1.65 system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:760px;margin:0 auto;padding:40px 18px 80px}h1{font-size:30px;margin:0 0 4px}h2{font-size:19px;margin:30px 0 6px;color:#ffc27a}p,li{color:#c5cee0}a{color:#7fb8ff}.note{background:#0b1430;border:1px solid #1d2c55;border-radius:12px;padding:12px 14px;font-size:14px}small{color:#8a96ad}</style></head>
<body><main><a href="/">\u2190 Back to Fyrus</a><h1>${title}</h1><small>Last updated ${UPDATED} \xB7 Beta</small>${body}</main></body></html>`;
var TERMS = `
<p class="note">Fyrus is in beta. These terms are a plain-language draft and may change before the public launch. We will show a notice in the city when they do.</p>
<h2>1. Who can use Fyrus</h2><p>You must be at least 13 years old. Voice chat is for people 18 and older. If you are under 18, use Fyrus with a parent or guardian's permission.</p>
<h2>2. Your account</h2><p>Keep your password private. You are responsible for what happens on your account. Guest accounts live on one device until you add an email or sign in with Google.</p>
<h2>3. Fyrus Coin (FYC) is play money</h2><p>FYC is an in-city credit for use inside Fyrus only. It is not real money, not a cryptocurrency and not an investment. It cannot be exchanged for cash, and its supply and prices can change. Virtual land, homes, passports and items are game features with no real-world value. Nothing in Fyrus promises profit.</p>
<h2>4. Rules of the city</h2><ul><li>No harassment, hate, threats, sexual content involving minors, or content that sexualises anyone without consent.</li><li>No scams, fake listings, asking for payment or contact outside Fyrus, or selling prohibited goods.</li><li>No impersonating real people, brands or officials; no real-world political parties or politicians in Fyrus elections.</li><li>No cheating, bots, exploiting bugs or making several accounts to vote or farm rewards.</li><li>Respect other people's work: upload only content you own or may use.</li></ul>
<h2>5. Marketplace, escrow and the Fyrus Court</h2><p>Purchases go through Central Bank escrow and can be disputed. Fyrus judges decide disputes based on the evidence in Fyrus. Their decisions inside Fyrus are final for FYC, items and accounts.</p>
<h2>6. Moderation</h2><p>We may remove content, mute, suspend or ban accounts that break these rules, and refund FYC where it is fair. You can report people and content from the city; we review reports as fast as we can.</p>
<h2>7. AI in Fyrus</h2><p>AI residents, shopkeepers and translations are generated by AI and are labelled. They can be wrong. Do not rely on them for medical, legal or financial decisions.</p>
<h2>8. News and links</h2><p>World headlines come from public news feeds and link to the publisher. Citizen reports are written by users and are not verified by Fyrus.</p>
<h2>9. Changes and ending</h2><p>Fyrus is provided as it is during the beta. Features may change or stop. You can stop using Fyrus at any time and ask us to delete your account.</p>
<h2>10. Contact</h2><p>Questions or problems: use Report in the city or the Help page.</p>`;
var PRIVACY = `
<p class="note">This explains what Fyrus stores, why, and your choices. Fyrus servers are in Germany (EU).</p>
<h2>What we store</h2><ul><li><b>Account:</b> your display name, Fyrus number, email (if you add one), a scrambled (hashed) password, or your Google account id if you sign in with Google.</li><li><b>City data:</b> your FYC statement, properties, listings and orders, courses and certificates, events, messages you send (city chat, groups and DMs), reports, and your avatar settings and optional face photo.</li><li><b>Technical:</b> error reports from your browser (to fix bugs), simple daily counts of visits, and your IP address in short-lived rate limits and server logs.</li></ul>
<h2>What we do not do</h2><ul><li>We do not sell your data.</li><li>We do not show third-party ads based on your data.</li><li>We do not ask for ID cards, bank or card numbers in the beta.</li></ul>
<h2>Who else processes data</h2><ul><li><b>Anthropic</b> translates chat messages when translation is on (the message text only).</li><li><b>Google</b> confirms your sign-in if you use "Sign in with Google".</li><li><b>Email provider</b> sends password reset codes.</li><li>Our hosting provider stores the server and its backups.</li></ul>
<h2>Visibility</h2><p>Your name, colour, Fyrus number and avatar are visible to other people in the city. Stealth mode hides your name and photo behind an alias. Blocked people cannot message you.</p>
<h2>How long</h2><p>Account and city data are kept while your account exists. Daily backups are kept for 14 days. Error reports are kept for the most recent 300.</p>
<h2>Your rights</h2><p>You can ask to see, correct, export or delete your data, and you can withdraw consent at any time. If you are in the EU you can also complain to your data protection authority. To ask, use the Help page or Report in the city.</p>
<h2>Children</h2><p>Fyrus is not for children under 13. If you believe a child under 13 has an account, report it and we will remove it.</p>`;
var legalPage = (kind) => kind === "terms" ? shell("Terms of Use", TERMS) : shell("Privacy Policy", PRIVACY);

// server/index.ts
var PORT = Number(process.env.PORT || 80);
var PUBLIC = process.env.PUBLIC_DIR || path2.join(process.cwd(), "public");
var DATA_DIR = process.env.DATA_DIR || "/data";
var AI_KEY = process.env.ANTHROPIC_API_KEY || "";
var AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
var NEAR = 40;
var MAX_TEXT = 500;
var db = { users: {}, threads: {}, groups: {}, plots: {}, reports: [] };
var dbFile = path2.join(DATA_DIR, "fyrus.json");
try {
  fs2.mkdirSync(DATA_DIR, { recursive: true });
  db = { ...db, ...JSON.parse(fs2.readFileSync(dbFile, "utf8")) };
  console.log("loaded", Object.keys(db.users).length, "users");
} catch {
  console.log("fresh database at", dbFile);
}
var saveT = null;
function save() {
  if (saveT) return;
  saveT = setTimeout(() => {
    saveT = null;
    try {
      fs2.writeFileSync(dbFile + ".tmp", JSON.stringify(db));
      fs2.renameSync(dbFile + ".tmp", dbFile);
    } catch (e) {
      console.error("save failed", e);
    }
  }, 1500);
}
function flush() {
  if (saveT) {
    clearTimeout(saveT);
    saveT = null;
  }
  try {
    fs2.writeFileSync(dbFile + ".tmp", JSON.stringify(db));
    fs2.renameSync(dbFile + ".tmp", dbFile);
  } catch (e) {
    console.error("flush failed", e);
  }
}
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => {
  flush();
  process.exit(0);
});
var sha = (s) => crypto3.createHash("sha256").update(s).digest("hex");
var rid = (n = 12) => crypto3.randomBytes(n).toString("base64url");
function newNumber() {
  for (; ; ) {
    const n = `+2040-${crypto3.randomInt(200, 1e3)}-${String(crypto3.randomInt(0, 1e4)).padStart(4, "0")}`;
    if (!Object.values(db.users).some((u) => u.number === n)) return n;
  }
}
var digits = (s) => String(s || "").replace(/\D/g, "");
var findByNumber = (n) => {
  const d = digits(n);
  if (d.length < 7) return void 0;
  return Object.values(db.users).find((u) => {
    const ud = digits(u.number);
    return ud === d || ud.slice(-7) === d.slice(-7);
  });
};
{
  let moved = 0;
  for (const u of Object.values(db.users)) if (!u.number.startsWith("+2040")) {
    const d = digits(u.number).slice(-7);
    const n = `+2040-${d.slice(0, 3)}-${d.slice(3)}`;
    u.number = Object.values(db.users).some((x) => x.number === n) ? newNumber() : n;
    moved++;
  }
  if (moved) {
    console.log("moved", moved, "numbers to +2040");
    try {
      fs2.writeFileSync(dbFile, JSON.stringify(db));
    } catch {
    }
  }
}
var alias = (u) => "Citizen #X" + String(parseInt(sha(u.id).slice(0, 6), 16) % 1e3).padStart(3, "0");
var shown = (u) => u.stealth ? alias(u) : u.name;
var clean = (s, n) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
var BAD = ["fuck", "shit", "bitch", "bastard", "cunt", "dick", "asshole", "slut", "whore", "nigger", "faggot", "retard", "madarchod", "behenchod", "bhenchod", "chutiya", "chutia", "harami", "haramzada", "kutta", "kutiya", "gandu", "randi", "bhosdi", "lund", "kanjar"];
var badRe = new RegExp(`\\b(${BAD.join("|")})\\w*`, "gi");
var filter = (t) => t.replace(badRe, (m) => "*".repeat(m.length));
var tcache = /* @__PURE__ */ new Map();
async function translate(text, lang) {
  if (!AI_KEY || !text.trim()) return null;
  const key = lang + "|" + text;
  const hit = tcache.get(key);
  if (hit !== void 0) return hit;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": AI_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: AI_MODEL, max_tokens: 600, system: `You translate chat messages in a game city. Translate the user's message into ${langName(lang)}. If it is already in ${langName(lang)}, return it unchanged. Romanized Urdu/Hindi counts as Urdu/Hindi. Keep names, emojis and numbers. Output only the translated message, nothing else.`, messages: [{ role: "user", content: text }] })
    });
    if (!r.ok) {
      console.error("translate", r.status, (await r.text()).slice(0, 200));
      return null;
    }
    const j = await r.json();
    const out = String(j?.content?.[0]?.text || "").trim();
    if (tcache.size > 5e3) tcache.clear();
    tcache.set(key, out);
    return out;
  } catch (e) {
    console.error("translate failed", e);
    return null;
  }
}
var live = /* @__PURE__ */ new Map();
var send = (ws, m) => {
  if (ws.readyState === import_websocket.default.OPEN) ws.send(JSON.stringify(m));
};
var pub = (u) => ({ id: u.id, name: shown(u), color: u.stealth ? "#8a8f98" : u.color, number: u.number, stealth: !!u.stealth });
var blocked = (a, b) => a.blocks.includes(b.id) || b.blocks.includes(a.id);
var threadId = (a, b) => "dm:" + [a, b].sort().join(":");
async function deliver(from, to, m) {
  const byLang = /* @__PURE__ */ new Map();
  to.forEach((l) => {
    if (blocked(from, l.u)) return;
    const k = l.u.lang || "en";
    byLang.set(k, [...byLang.get(k) || [], l]);
  });
  await Promise.all([...byLang].map(async ([lang, ls]) => {
    const tr = await translate(m.text, lang);
    ls.forEach((l) => send(l.ws, { t: "msg", ...m, from: from.id, fromName: shown(from), color: from.stealth ? "#8a8f98" : from.color, number: from.number, text: tr && tr !== m.text ? tr : m.text, orig: tr && tr !== m.text ? m.text : void 0, lang }));
  }));
}
function onMessage(me, raw) {
  let m;
  try {
    m = JSON.parse(raw);
  } catch {
    return;
  }
  const u = me.u;
  if (edu.onMessage(me, m) || bank.onMessage(me, m) || market.onMessage(me, m) || estate.onMessage(me, m) || news.onMessage(me, m) || ads.onMessage(me, m) || halls.onMessage(me, m) || ops.onMessage(me, m)) return;
  switch (m.t) {
    case "pos": {
      me.x = +m.x || 0;
      me.z = +m.z || 0;
      me.y = +m.y || 0;
      me.ry = +m.ry || 0;
      me.scene = clean(m.scene, 40) || "plaza";
      me.o = m.o;
      me.v = m.v ?? null;
      if (typeof m.photo === "string" && m.photo.startsWith("data:image/") && m.photo.length < 4e3 && m.photo !== u.photo) {
        u.photo = m.photo;
        save();
      }
      return;
    }
    case "say": {
      const now = Date.now();
      me.rate = me.rate.filter((t) => now - t < 5e3);
      if (me.rate.length >= 8) return send(me.ws, { t: "err", text: "Slow down a little." });
      me.rate.push(now);
      if (u.muteUntil && u.muteUntil > now) return send(me.ws, { t: "err", text: `You are muted until ${new Date(u.muteUntil).toUTCString().slice(17, 22)} UTC.` });
      const text = filter(clean(m.text, MAX_TEXT));
      if (!text) return;
      const id = rid(8);
      if (m.channel === "near") {
        const to = [...live.values()].filter((l) => l !== me && l.scene === me.scene && Math.hypot(l.x - me.x, l.z - me.z) < NEAR);
        deliver(u, [me, ...to], { channel: "near", text, id, at: now });
        return;
      }
      if (m.channel === "city") {
        deliver(u, [...live.values()], { channel: "city", text, id, at: now });
        return;
      }
      if (m.channel === "dm") {
        const target = db.users[m.to] || findByNumber(String(m.to || ""));
        if (!target) return send(me.ws, { t: "err", text: "No citizen has that number." });
        if (blocked(u, target)) return send(me.ws, { t: "err", text: "You cannot message this person." });
        const th = threadId(u.id, target.id);
        const rec = { id, from: u.id, fromName: shown(u), text, at: now };
        db.threads[th] = [...db.threads[th] || [], rec].slice(-200);
        save();
        const tl = live.get(target.id);
        deliver(u, [me, ...tl ? [tl] : []], { channel: "dm", text, thread: th, id, at: now });
        return;
      }
      if (m.channel === "group") {
        const g = db.groups[m.group];
        if (!g || !g.members.includes(u.id)) return;
        const th = "group:" + g.id;
        db.threads[th] = [...db.threads[th] || [], { id, from: u.id, fromName: shown(u), text, at: now }].slice(-300);
        save();
        deliver(u, g.members.map((id2) => live.get(id2)).filter(Boolean), { channel: "group", group: g.id, thread: th, text, id, at: now });
        return;
      }
      return;
    }
    case "history": {
      const th = clean(m.thread, 120);
      if (!th.includes(u.id) && !(th.startsWith("group:") && db.groups[th.slice(6)]?.members.includes(u.id))) return;
      send(me.ws, { t: "history", thread: th, msgs: (db.threads[th] || []).filter((x) => {
        const f = db.users[x.from];
        return !f || !blocked(u, f);
      }) });
      return;
    }
    case "threads": {
      const mine = Object.keys(db.threads).filter((k) => k.startsWith("dm:") && k.split(":").includes(u.id) || k.startsWith("group:") && db.groups[k.slice(6)]?.members.includes(u.id));
      send(me.ws, { t: "threads", list: mine.map((k) => {
        const last = db.threads[k].at(-1);
        const other = k.startsWith("dm:") ? db.users[k.split(":").slice(1).find((x) => x !== u.id) || ""] : null;
        return { thread: k, last, with: other ? pub(other) : null, group: k.startsWith("group:") ? db.groups[k.slice(6)] : null };
      }) });
      return;
    }
    case "lookup": {
      const n = clean(m.number, 24);
      const x = findByNumber(n);
      send(me.ws, { t: "lookup", number: n, user: x ? { ...pub(x), online: live.has(x.id) } : null });
      return;
    }
    case "profile": {
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.color) u.color = clean(m.color, 9);
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      if (typeof m.stealth === "boolean") u.stealth = m.stealth;
      if (m.passport) {
        const want = m.passport.kind === "visa" ? "visa" : "passport";
        const had = u.passport?.kind === "passport";
        let kind = want;
        if (want === "passport" && !had) {
          const v = passportCheck(u.id, +m.passport.level || 0);
          if (!v.ok) {
            kind = "visa";
            send(me.ws, { t: "passport_denied", text: v.why });
          }
        }
        u.passport = { no: +m.passport.no || 0, interest: clean(m.passport.interest, 20), kind, verified: kind === "passport" ? true : void 0, at: u.passport?.at || Date.now() };
      }
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "block": {
      const id = clean(m.id, 40);
      if (!u.blocks.includes(id) && db.users[id]) u.blocks.push(id);
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "unblock": {
      u.blocks = u.blocks.filter((b) => b !== m.id);
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "report": {
      db.reports.push({ by: u.id, against: clean(m.id, 40), reason: clean(m.reason, 400), msg: clean(m.msg, 600), at: Date.now() });
      save();
      send(me.ws, { t: "ok", text: "Report sent to the Justice ministry." });
      return;
    }
    case "group_create": {
      const members = [u.id, ...(m.numbers || []).map((n) => findByNumber(String(n))?.id).filter(Boolean)];
      const g = { id: rid(6), name: clean(m.name, 40) || "Group", owner: u.id, members: [...new Set(members)], at: Date.now() };
      db.groups[g.id] = g;
      save();
      g.members.forEach((id) => {
        const l = live.get(id);
        if (l) send(l.ws, { t: "group", group: g });
      });
      return;
    }
    case "group_add": {
      const g = db.groups[m.group];
      if (!g || !g.members.includes(u.id)) return;
      const x = findByNumber(String(m.number));
      if (x && !g.members.includes(x.id)) {
        g.members.push(x.id);
        save();
      }
      g.members.forEach((id) => {
        const l = live.get(id);
        if (l) send(l.ws, { t: "group", group: g });
      });
      return;
    }
    case "voice": {
      if (m.on && !u.age18) {
        me.voice = false;
        return send(me.ws, { t: "need_age18" });
      }
      me.voice = !!m.on;
      return;
    }
    case "acct_age18": {
      u.age18 = true;
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "rtc": {
      const to = live.get(clean(m.to, 40));
      if (!to || blocked(u, to.u)) return;
      send(to.ws, { t: "rtc", from: u.id, fromName: shown(u), number: u.number, kind: clean(m.kind, 20), data: m.data });
      return;
    }
    case "plot": {
      const id = clean(m.id, 12);
      const cur = db.plots[id];
      if (m.release) {
        if (cur?.owner === u.id) {
          delete db.plots[id];
          save();
          broadcast({ t: "plots", plots: { [id]: null } });
        }
        return;
      }
      if (cur && cur.owner !== u.id && !(cur.forSale && m.buy)) return send(me.ws, { t: "plot_taken", id, owner: cur });
      db.plots[id] = { owner: u.id, ownerName: shown(u), use: clean(m.use, 30) || void 0, sign: clean(m.sign, 28) || void 0, forSale: m.forSale ? Math.max(1, Math.round(+m.forSale)) : void 0, at: Date.now() };
      save();
      broadcast({ t: "plots", plots: { [id]: db.plots[id] } });
      return;
    }
  }
}
var broadcast = (m) => live.forEach((l) => send(l.ws, m));
setInterval(() => {
  if (!live.size) return;
  const list = [...live.values()].map((l) => ({ id: l.u.id, name: shown(l.u), color: l.u.stealth ? "#8a8f98" : l.u.color, x: l.x, z: l.z, y: l.y, ry: l.ry, sc: l.scene, o: l.o, v: l.v, vc: l.voice, ph: l.u.stealth ? void 0 : l.u.photo, mk: l.u.stealth ? 1 : void 0 }));
  const withPhoto = Date.now() % 4e3 < 130;
  live.forEach((l) => send(l.ws, { t: "peers", list: list.filter((p) => p.id !== l.u.id).map((p) => withPhoto ? p : { ...p, ph: void 0 }) }));
}, 125);
var ADMINS = String(process.env.FYRUS_ADMINS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (ADMINS.length) console.log("court judges:", ADMINS.length);
var isAdmin = (id) => {
  const u = db.users[id];
  return !!u && ADMINS.some((a) => a === id || digits(a).length >= 7 && digits(a).slice(-7) === digits(u.number).slice(-7));
};
var nameOf = (id) => ({ mint: "Central Bank of Fyrus", treasury: "National Treasury", escrow: "Central Bank escrow", burn: "Central Bank" })[id] || (db.users[id] ? shown(db.users[id]) : "Citizen");
var news = createNews({ db, save, send, broadcast, clean, filter, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var report = news.report;
function passportCheck(id, level) {
  const land = Object.values(db.plots).some((p) => p.owner === id) || Object.values(db.estate?.plots || {}).some((p) => p.owner === id);
  const seller = Object.values(db.market?.listings || {}).some((l) => l.seller === id) || Object.values(db.edu?.courses || {}).some((c) => c.teacher === id) || (db.bank?.acct?.[id]?.sales || 0) > 0;
  const banned = !!db.bank?.acct?.[id]?.banned;
  const issued = Object.values(db.users).filter((x) => x.passport?.kind === "passport").length;
  if (banned) return { ok: false, why: "Passport refused: this account has a court ban." };
  if (issued >= 1e4) return { ok: false, why: "All 10,000 passports for this year are issued. You are on the waiting list." };
  const n = (land ? 1 : 0) + (seller ? 1 : 0) + (level >= 5 ? 1 : 0);
  if (n >= 2 && (land || seller)) return { ok: true, why: "" };
  return { ok: false, why: `The Citizen Center could not verify two milestones yet (${land ? "land \u2713" : "no land"}, ${seller ? "selling \u2713" : "nothing listed in Fyrus Market or Education City"}). Own land or list something on the live city, then apply again.` };
}
var bank = createBank({ db, save, send, liveOf: (id) => live.get(id), findByNumber, nameOf, clean });
var market = createMarket({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, rid, isAdmin, nameOf, news: report });
var estate = createEstate({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, findByNumber, news: report });
var edu = createEdu({ db, save, send, broadcast, clean, rid, findByNumber, liveOf: (id) => live.get(id), pay: bank.transfer, news: report });
var ads = createAds({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
var halls = createHalls({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
function createUser(name, lang) {
  const token = rid(24);
  const u = { id: "u" + rid(8), tok: sha(token), name: clean(name, 24) || "Citizen", color: "#4da3ff", number: newNumber(), lang: LANGS.some((l) => l.code === lang) ? lang : "en", blocks: [], joined: Date.now(), seen: Date.now() };
  db.users[u.id] = u;
  save();
  ops.bump("newUsers");
  return { u, token };
}
var accounts = createAccounts({ db, save, sha, rid, clean, createUser: (n, l) => {
  const c = createUser(n, l);
  ops.bump("signups");
  return c;
} });
var ops = createOps({ db, dataDir: DATA_DIR, dbFile: () => dbFile, save, send, liveOf: (id) => live.get(id), liveCount: () => live.size, isAdmin, findByNumber, clean, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var meOf = (u) => ({ ...pub(u), lang: u.lang, blocks: u.blocks, email: u.email || null, google: !!u.google, age18: !!u.age18, admin: isAdmin(u.id), guest: !u.email && !u.google });
var SEC = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Permissions-Policy": "camera=(self), microphone=(self), geolocation=()" };
var TYPES3 = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
var gzCache = /* @__PURE__ */ new Map();
var server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, online: live.size, users: Object.keys(db.users).length, translate: !!AI_KEY, news: db.news?.items.length || 0 }));
  }
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (accounts.http(req, res, url.pathname, ip)) return;
  if (ops.http(req, res, url.pathname, ip, accounts.byToken)) return;
  if (url.pathname === "/terms" || url.pathname === "/privacy") {
    res.writeHead(200, { ...SEC, "content-type": "text/html; charset=utf-8" });
    return res.end(legalPage(url.pathname.slice(1)));
  }
  if (edu.http(url.pathname, res)) return;
  let p = path2.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = path2.join(PUBLIC, p);
  if (!file.startsWith(PUBLIC) || !fs2.existsSync(file) || fs2.statSync(file).isDirectory()) file = path2.join(PUBLIC, "index.html");
  try {
    const st = fs2.statSync(file);
    let c = gzCache.get(file);
    if (!c || c.mtime !== st.mtimeMs) {
      const raw = fs2.readFileSync(file);
      c = { raw, gz: zlib2.gzipSync(raw, { level: 9 }), mtime: st.mtimeMs };
      gzCache.set(file, c);
    }
    const ext = path2.extname(file);
    const gz = /\bgzip\b/.test(String(req.headers["accept-encoding"] || "")) && /html|js|css|svg|json|xml|txt/.test(ext);
    res.writeHead(200, { ...SEC, "content-type": TYPES3[ext] || "application/octet-stream", "cache-control": ext === ".html" ? "no-cache" : "public, max-age=86400", ...gz ? { "content-encoding": "gzip", vary: "Accept-Encoding" } : {} });
    res.end(gz ? c.gz : c.raw);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
var wss = new import_websocket_server.default({ server, path: "/ws", maxPayload: 64 * 1024 });
wss.on("connection", (ws, req) => {
  let me = null;
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0];
  const hello = setTimeout(() => ws.close(), 1e4);
  ws.on("message", (buf) => {
    const raw = buf.toString();
    if (raw.length > 64 * 1024) return;
    if (!me) {
      let m;
      try {
        m = JSON.parse(raw);
      } catch {
        return;
      }
      if (m.t !== "hello") return;
      clearTimeout(hello);
      let u = m.token ? accounts.byToken(String(m.token)) : void 0;
      let token = m.token;
      if (u && accounts.banText(u)) {
        send(ws, { t: "banned", text: accounts.banText(u) });
        ws.close();
        return;
      }
      if (!u) {
        const c = createUser(clean(m.name, 24) || "Citizen", m.lang);
        u = c.u;
        token = c.token;
        u.toks = [u.tok];
        u.color = clean(m.color, 9) || "#4da3ff";
        save();
        console.log("new citizen", u.number, ip);
        const pop = Object.keys(db.users).length;
        if (pop <= 50 || pop % 25 === 0) report("nation", `A new citizen arrived in Fyrus. Population: ${pop.toLocaleString("en-US")}`);
      }
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      u.seen = Date.now();
      const old = live.get(u.id);
      if (old) {
        send(old.ws, { t: "err", text: "You opened Fyrus in another tab." });
        old.ws.close();
      }
      me = { ws, u, x: 0, z: 36, y: 0, ry: 0, scene: "plaza", voice: false, rate: [] };
      live.set(u.id, me);
      ops.bump("visits");
      send(ws, { t: "welcome", token, me: meOf(u), plots: db.plots, groups: Object.values(db.groups).filter((g) => g.members.includes(u.id)), online: live.size, translate: !!AI_KEY });
      broadcast({ t: "online", n: live.size });
      return;
    }
    try {
      onMessage(me, raw);
    } catch (e) {
      console.error("message failed", e);
    }
  });
  ws.on("close", () => {
    clearTimeout(hello);
    if (me && live.get(me.u.id) === me) {
      live.delete(me.u.id);
      me.u.seen = Date.now();
      save();
      broadcast({ t: "left", id: me.u.id });
      broadcast({ t: "online", n: live.size });
    }
  });
  ws.on("error", () => {
  });
});
setInterval(() => wss.clients.forEach((c) => {
  if (c.isAlive === false) return c.terminate();
  c.isAlive = false;
  c.ping();
}), 3e4);
wss.on("connection", (c) => {
  c.isAlive = true;
  c.on("pong", () => c.isAlive = true);
});
server.listen(PORT, () => console.log(`Fyrus server on :${PORT} \xB7 translate ${AI_KEY ? "on (" + AI_MODEL + ")" : "off (set ANTHROPIC_API_KEY)"}`));
