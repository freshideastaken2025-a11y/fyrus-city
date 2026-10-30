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
                const num2 = +value;
                if (!Number.isInteger(num2) || num2 < 8 || num2 > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num2;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num2 = +value;
              if (!Number.isInteger(num2) || num2 < 8 || num2 > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num2;
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
        const num2 = buf.readUInt32BE(0);
        if (num2 > Math.pow(2, 53 - 32) - 1) {
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
        this._payloadLength = num2 * Math.pow(2, 32) + buf.readUInt32BE(4);
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
  const E2 = d.db.edu;
  const SECRET = process.env.CERT_SECRET || E2.secret;
  const sign = (c) => crypto.createHmac("sha256", SECRET).update(JSON.stringify([c.code, c.student, c.studentName, c.teacher, c.teacherName, c.instName || "", c.course, c.courseTitle, c.skills, c.level, c.lessons, c.issuedAt])).digest("hex").slice(0, 32);
  const valid = (c) => !!c && c.sig === sign(c);
  const forStudent = (c) => ({ ...c, lessons: c.lessons.map((l) => ({ title: l.title, body: l.body, video: l.video, q: l.q, opts: l.opts })) });
  const nameOf2 = (id) => id === ACADEMY ? E2.teachers[ACADEMY].name : d.db.users[id]?.name || "Citizen";
  const canTeachAt = (uid, instId) => !instId || E2.inst[instId] && (E2.inst[instId].owner === uid || E2.inst[instId].staff.includes(uid));
  const changed = () => {
    d.save();
    d.broadcast({ t: "edu_changed" });
  };
  function issue(en, by) {
    const c = E2.courses[en.course];
    if (!c) return "No such course.";
    if (c.teacher !== by) return "Only the teacher of this course can issue its certificate.";
    if (!en.completedAt) return "The student has not finished every lesson yet.";
    if (en.cert && E2.certs[en.cert]) return E2.certs[en.cert];
    const i = c.inst ? E2.inst[c.inst] : void 0;
    const base = { code: newCode(), student: en.user, studentName: d.db.users[en.user]?.name || en.userName, teacher: c.teacher, teacherName: nameOf2(c.teacher), inst: i?.id, instName: i?.name, instType: i?.type, instVerified: i?.verified, course: c.id, courseTitle: c.title, skills: c.skills, level: c.level, lessons: c.lessons.length, issuedAt: Date.now() };
    const cert = { ...base, sig: sign(base) };
    E2.certs[cert.code] = cert;
    en.cert = cert.code;
    d.save();
    d.news?.("education", `Certificate issued: "${c.title}"${i ? ` at ${i.name}` : ""}`);
    const l = d.liveOf(en.user);
    if (l) d.send(l.ws, { t: "edu_certified", cert });
    return cert;
  }
  function mine(uid) {
    const teaching = Object.values(E2.courses).filter((c) => c.teacher === uid);
    const ids = new Set(teaching.map((c) => c.id));
    const earn = E2.earn[uid] || 0;
    if (earn) {
      E2.earn[uid] = 0;
      d.save();
    }
    return {
      t: "edu_mine",
      teacher: E2.teachers[uid] || null,
      enr: Object.values(E2.enr).filter((e) => e.user === uid),
      certs: Object.values(E2.certs).filter((c) => c.student === uid),
      inst: Object.values(E2.inst).filter((i) => i.owner === uid || i.staff.includes(uid)),
      teaching,
      students: Object.values(E2.enr).filter((e) => ids.has(e.course)).map((e) => ({ ...e, total: E2.courses[e.course].lessons.length })),
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
        reply({ t: "edu_list", inst: Object.values(E2.inst), teachers: Object.values(E2.teachers), courses: Object.values(E2.courses).map(forStudent) });
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
        E2.teachers[u.id] = { id: u.id, name: u.name, subject, bio, at: E2.teachers[u.id]?.at || Date.now() };
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
        if (Object.values(E2.inst).filter((i2) => i2.owner === u.id).length >= 3) {
          err("You can register up to 3 institutions.");
          return true;
        }
        if (Object.values(E2.inst).some((i2) => i2.name.toLowerCase() === name.toLowerCase())) {
          err("That name is already registered.");
          return true;
        }
        const i = { id: "i" + d.rid(6), owner: u.id, type, name, tagline: d.clean(m.tagline, 120), color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#2f6fe0", staff: [u.id], verified: false, at: Date.now() };
        E2.inst[i.id] = i;
        if (!E2.teachers[u.id]) E2.teachers[u.id] = { id: u.id, name: u.name, subject: type === "school" ? "School teacher" : "Instructor", bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        return true;
      }
      case "edu_staff": {
        const i = own(E2.inst, m.inst);
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
        if (!E2.teachers[x.id]) E2.teachers[x.id] = { id: x.id, name: x.name, subject: `Teacher at ${i.name}`, bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        const l = d.liveOf(x.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} added you as a teacher at ${i.name}.` });
        return true;
      }
      case "edu_course": {
        if (!E2.teachers[u.id]) {
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
        const old = m.id ? own(E2.courses, m.id) : void 0;
        if (old && old.teacher !== u.id) {
          err("That is not your course.");
          return true;
        }
        const i = instId ? E2.inst[instId] : void 0;
        const c = { id: old?.id || "c" + d.rid(6), teacher: u.id, teacherName: u.name, inst: i?.id, instName: i?.name, title, summary: d.clean(m.summary, 300), skills: (Array.isArray(m.skills) ? m.skills : String(m.skills || "").split(",")).map((s) => d.clean(s, 30)).filter(Boolean).slice(0, 6), level: ["Beginner", "Intermediate", "Advanced"].includes(m.level) ? m.level : "Beginner", fee: Math.max(0, Math.min(1e5, Math.round(+m.fee || 0))), lessons, students: old?.students || 0, at: old?.at || Date.now() };
        E2.courses[c.id] = c;
        changed();
        if (!old) d.news?.("education", `New course in Education City: "${c.title}"${c.fee ? "" : " (free)"}`);
        reply(mine(u.id));
        reply({ t: "ok", text: old ? "Course updated." : "Course published in Education City." });
        return true;
      }
      case "edu_enroll": {
        const c = own(E2.courses, m.course);
        if (!c) {
          err("No such course.");
          return true;
        }
        if (c.teacher === u.id) {
          err("You teach this course.");
          return true;
        }
        const k = c.id + "|" + u.id;
        if (E2.enr[k]) {
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
          } else E2.earn[c.teacher] = (E2.earn[c.teacher] || 0) + Math.round(c.fee * 0.9);
        }
        E2.enr[k] = { course: c.id, user: u.id, userName: u.name, at: Date.now(), done: [] };
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
        const c = own(E2.courses, m.course);
        const en = c && E2.enr[c.id + "|" + u.id];
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
        const en = E2.enr[String(m.course) + "|" + String(m.student)];
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
        const c = E2.certs[d.clean(m.code, 20).toUpperCase()];
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
    const c = E2.certs[mm[2].toUpperCase()];
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
// Rewards come from the client, so keep them small until the server computes them itself.
var OPENING_CAP = +(process.env.OPENING_CAP || 2500);
var DAILY_GAME_CAP = +(process.env.DAILY_REWARD_CAP || 15e3);
var MAX_REWARD_PER_OP = +(process.env.MAX_REWARD_PER_OP || 1500);
// Money the client may ask the bank to create. Everything else (sales, commissions, refunds) is either
// done by the server itself (land, market, jobs, courses) or was demo-only and is refused.
var WELCOME_GRANT = +(process.env.WELCOME_GRANT || 2500);
// 26.11: the economic simulation showed beta test credit dominating the economy (claimers 17x richer than workers,
// supply +3 %/day), so it is on by default only outside production
var BETA_TEST_CREDIT = String(process.env.BETA_TEST_CREDIT || (process.env.NODE_ENV === "production" ? "off" : "on")) !== "off";
var mintKind = (label) => /^Welcome grant/i.test(label) ? "welcome" : /demo checkout/i.test(label) ? "test" : "";
var SPECIAL = /* @__PURE__ */ new Set(["treasury", "escrow"]);
// 26.2 currency rules (see docs/phase26/26.2-currency-rules.md). FYC are non-redeemable in-game credits.
// Server-wide daily mint caps per source; "fallback" = wages / buy-backs when the treasury is empty.
var MINT_CAP = {
  beta: +(process.env.MINT_CAP_BETA || 25e4),
  fallback: +(process.env.MINT_CAP_FALLBACK || 1e5)
};
var r2 = (n) => Math.round(n * 100) / 100;
function createBank(d) {
  if (!d.db.bank) {
    d.db.bank = { acct: {}, ledger: [], seq: 1 };
    d.save();
  }
  const B = d.db.bank;
  // 26.1 money-supply counters: every FYC that exists was minted and not yet burned, so
  //   sum(all balances, incl. treasury and escrow) === minted - burned   (audit().drift must stay 0)
  // Older databases start counting from their current total.
  if (B.minted == null) {
    B.minted = r2(Object.values(B.acct).reduce((s, a) => s + (a.bal || 0), 0));
    B.burned = 0;
    B.auditFrom = Date.now();
  }
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  B.owed ||= [];
  const mintDay = () => {
    if (!B.mintDay || B.mintDay.day !== today()) B.mintDay = { day: today(), by: {} };
    return B.mintDay;
  };
  // capped mint for a source; returns the amount actually created (0..amount)
  function mint(kind, to, amount, memo) {
    const md = mintDay(), cap = MINT_CAP[kind] ?? Infinity, room = Math.max(0, cap - (md.by[kind] || 0)), n = r2(Math.min(room, amount));
    if (!(n > 0) || !transfer("mint", to, n, memo)) return 0;
    md.by[kind] = r2((md.by[kind] || 0) + n);
    return n;
  }
  // pay from the treasury; if it is short, mint within the daily fallback cap; anything left is owed and paid
  // first thing whenever money reaches the treasury
  function payFromTreasury(to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0)) return { paid: 0, owed: 0 };
    if (transfer("treasury", to, amount, memo)) return { paid: amount, owed: 0 };
    const t = Math.min(bal("treasury"), amount), fromT = t > 0 && transfer("treasury", to, t, memo) ? t : 0;
    const m = mint("fallback", to, r2(amount - fromT), memo + " (Central Bank)");
    const owed = r2(amount - fromT - m);
    if (owed > 0) B.owed.push({ to, amount: owed, memo, at: Date.now() });
    return { paid: r2(fromT + m), owed };
  }
  let settling = false;
  function settleOwed() {
    if (settling || !B.owed.length) return;
    settling = true;
    try {
      while (B.owed.length && bal("treasury") > 0) {
        const o = B.owed[0], n = r2(Math.min(o.amount, bal("treasury")));
        if (!transfer("treasury", o.to, n, o.memo + " (paid late)")) break;
        o.amount = r2(o.amount - n);
        if (o.amount <= 0) B.owed.shift();
      }
    } finally {
      settling = false;
    }
  }
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
  // 26.3 append-only, hash-chained ledger file (ledger.jsonl next to the DB). The DB keeps the latest 20 000 entries
  // for statements; the file keeps everything. Line 1 is a genesis entry with every balance at the moment the file
  // was started, so tools/net/ledger-verify.mjs can replay the file and must arrive at the DB's balances.
  const LF = d.ledgerFile && d.fs ? d.ledgerFile : null, LED = { file: LF, lines: 0, lastHash: "", errors: 0 };
  const hashOf = (prev, e) => d.crypto.createHash("sha256").update(prev + JSON.stringify(e)).digest("hex");
  function lfAppend(e) {
    if (!LF) return;
    try {
      const h = hashOf(LED.lastHash, e);
      d.fs.appendFileSync(LF, JSON.stringify({ ...e, prev: LED.lastHash, h }) + "\n");
      LED.lastHash = h;
      LED.lines++;
    } catch (x) {
      LED.errors++;
    }
  }
  if (LF) {
    try {
      if (d.fs.existsSync(LF)) {
        const txt = d.fs.readFileSync(LF, "utf8").trimEnd().split("\n");
        const last = JSON.parse(txt[txt.length - 1]);
        LED.lastHash = last.h;
        LED.lines = txt.length;
        // the file is written at once, the DB at most every 1.5 s: after a crash the file can hold transfers the DB
        // never saved (their effects elsewhere - a plot title, an order - were lost too, so they are NOT replayed).
        // Keep them for review and mark the point where the chain continues from the DB's balances.
        const lost = [];
        for (const ln of txt) {
          const o = JSON.parse(ln);
          if (o.id != null && o.id >= B.seq) lost.push(o);
        }
        if (lost.length) {
          d.fs.writeFileSync(LF.replace(/\.jsonl$/, "") + "-lost-" + Date.now() + ".jsonl", lost.map((o) => JSON.stringify(o)).join("\n") + "\n");
          LED.lostOnStart = lost.length;
          lfAppend({ kind: "resync", at: Date.now(), seq: B.seq, lost: lost.length, lostIds: [lost[0].id, lost[lost.length - 1].id], balances: Object.fromEntries(Object.entries(B.acct).map(([k, a]) => [k, a.bal || 0])), minted: B.minted, burned: B.burned });
        }
      } else lfAppend({ kind: "genesis", at: Date.now(), seq: B.seq, minted: B.minted ?? null, burned: B.burned ?? null, balances: Object.fromEntries(Object.entries(B.acct).map(([k, a]) => [k, a.bal || 0])) });
    } catch (x) {
      LED.errors++;
    }
  }
  function log(from, to, amount, memo) {
    const e = { id: B.seq++, at: Date.now(), from, to, amount: r2(amount), memo: memo.slice(0, 120) };
    B.ledger.push(e);
    if (B.ledger.length > 2e4) B.ledger.splice(0, B.ledger.length - 2e4);
    lfAppend(e);
  }
  function transfer(from, to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0) || from === to) return false;
    if (from !== "mint") {
      const a = acct(from);
      if (a.bal + 1e-9 < amount) return false;
      a.bal = r2(a.bal - amount);
    } else B.minted = r2(B.minted + amount);
    if (to !== "burn") {
      const b = acct(to);
      b.bal = r2(b.bal + amount);
    } else B.burned = r2(B.burned + amount);
    log(from, to, amount, memo);
    d.save(true);
    watch(from, to, amount);
    notify(from);
    notify(to);
    to === "treasury" && B.owed?.length && settleOwed();
    return true;
  }
  function history(id, n = 60, before = Infinity) {
    const out = [];
    for (let i = B.ledger.length - 1; i >= 0 && out.length < n; i--) {
      const t = B.ledger[i];
      if (t.id >= before) continue;
      if (t.from === id || t.to === id) out.push({ ...t, dir: t.to === id ? "in" : "out", other: t.to === id ? t.from : t.to, otherName: d.nameOf(t.to === id ? t.from : t.to) });
    }
    return out;
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("bank_") || m.t.startsWith("bond_") || m.t.startsWith("tx_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "bank_hello": {
        if (!has(u.id)) {
          acct(u.id);
          const open = Math.max(0, Math.min(OPENING_CAP, Math.round(+m.local || 0)));
          if (open > 0) {
            transfer("mint", u.id, open, "Opening balance moved from your beta wallet");
            acct(u.id).welcomed = true;
          } else d.save();
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
        const kind = mintKind(label);
        if (kind === "welcome") {
          if (a.welcomed) {
            notify(u.id);
            return true;
          }
          a.welcomed = true;
          transfer("mint", u.id, Math.min(amt, WELCOME_GRANT), "Welcome grant from the Central Bank");
          return true;
        }
        if (kind !== "test" || !BETA_TEST_CREDIT) {
          notify(u.id); // resync the client: this kind of income is not created by the bank
          return true;
        }
        if (a.day !== today()) {
          a.day = today();
          a.dayIn = 0;
        }
        const room = Math.max(0, DAILY_GAME_CAP - a.dayIn);
        let ok = Math.min(room, amt, MAX_REWARD_PER_OP);
        if (ok > 0) {
          ok = mint("beta", u.id, ok, label);
          a.dayIn += ok;
        }
        if (ok < amt) {
          notify(u.id);
          reply({ t: "note", text: `Daily limit for beta test credit reached (${DAILY_GAME_CAP.toLocaleString("en-US")} FYC). It resets tomorrow.` });
        }
        return true;
      }
      case "bank_send":
      case "tx_approve": {
        // 26.9 authorization: transfers of TX_CONFIRM_MIN FYC or more need a second, explicit approval from the same
        // signed-in session within 60 s (tx_confirm -> tx_approve); one use, bound to the user and the connection
        let to, amt, note;
        if (m.t === "tx_approve") {
          const p = TXP.get(String(m.id || ""));
          if (!p || p.uid !== u.id || p.ws !== me.ws) return err("That confirmation is not valid."), true;
          TXP.delete(p.id);
          if (Date.now() > p.exp) return err("That confirmation expired. Send again."), true;
          to = d.findByNumber(p.to);
          amt = p.amt;
          note = p.note;
          TXS.approved++;
        } else {
          to = d.findByNumber(String(m.to || ""));
          amt = r2(+m.amount || 0);
          note = d.clean(m.note, 80);
        }
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
        // 24.9: accounts younger than a day can send at most NEW_ACCT_SEND_CAP FYC in total (stops farming the
        // opening / welcome grants with throw-away accounts)
        if (Date.now() - (u.joined || 0) < 864e5) {
          const a0 = acct(u.id), cap = +(process.env.NEW_ACCT_SEND_CAP || 500);
          if ((a0.newOut || 0) + amt > cap) {
            err(`New accounts can send up to ${cap} FYC in their first day.`);
            return true;
          }
        }
        // 26.9: daily outgoing limit for citizen-to-citizen transfers
        const a1 = acct(u.id);
        if (a1.outDay !== today()) (a1.outDay = today()), (a1.outToday = 0);
        if ((a1.outToday || 0) + amt > TX_DAILY_OUT()) {
          err(`Daily transfer limit is ${TX_DAILY_OUT().toLocaleString("en-US")} FYC (${Math.max(0, TX_DAILY_OUT() - (a1.outToday || 0)).toLocaleString("en-US")} left today).`);
          return true;
        }
        if (m.t === "bank_send" && amt >= TX_CONFIRM_MIN()) {
          if (a1.bal + 1e-9 < amt) return err("Not enough FYC."), true;
          for (const [k, p] of TXP) if (p.uid === u.id || Date.now() > p.exp) TXP.delete(k);
          const id = d.crypto ? d.crypto.randomBytes(9).toString("base64url") : String(Math.random()).slice(2);
          TXP.set(id, { id, uid: u.id, ws: me.ws, to: to.number, amt, note, exp: Date.now() + +(process.env.TX_CONFIRM_MS || 6e4) });
          TXS.asked++;
          reply({ t: "tx_confirm", id, kind: "send", amount: amt, toName: to.name, toNumber: to.number, note, expiresIn: +(process.env.TX_CONFIRM_MS || 6e4) });
          return true;
        }
        if (!transfer(u.id, to.id, amt, `FyrusPay ${note ? "\xB7 " + note : ""}`.trim())) {
          err("Not enough FYC.");
          return true;
        }
        a1.outToday = r2((a1.outToday || 0) + amt);
        Date.now() - (u.joined || 0) < 864e5 && (acct(u.id).newOut = (acct(u.id).newOut || 0) + amt);
        reply({ t: "ok", text: `Sent ${amt.toLocaleString("en-US")} FYC to ${to.name} (${to.number}).` });
        const l = d.liveOf(to.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} sent you ${amt.toLocaleString("en-US")} FYC${note ? `: "${note}"` : ""}.` });
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "tx_cancel": {
        const p = TXP.get(String(m.id || ""));
        if (p && p.uid === u.id) TXP.delete(p.id);
        return true;
      }
      case "bank_hist": {
        // 26.3: paging - "before" = the oldest id the client already has
        const before = Math.round(+m.before) || Infinity, list = history(u.id, 60, before);
        reply({ t: "bank_hist", list, before: before === Infinity ? void 0 : before, more: list.length === 60 });
        return true;
      }
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
  // 26.10 farming watch: an account that receives transfers from 5+ different accounts that are less than a day old,
  // within 24 h, is flagged for the Fyrus Court (grant farming with throw-away accounts). Flags never move money.
  B.flags ||= {};
  const recv = /* @__PURE__ */ new Map();
  function watch(from, to, amount) {
    if (!d.isNew || SPECIAL.has(from) || SPECIAL.has(to) || from === "mint" || to === "burn" || String(to).startsWith("biz:")) return;
    if (!d.isNew(from)) return;
    const now = Date.now(), r = recv.get(to) || [];
    const keep = r.filter((x) => now - x.at < 864e5);
    keep.push({ from, at: now, amount });
    recv.set(to, keep);
    const senders = new Set(keep.map((x) => x.from));
    if (senders.size >= 5 && !B.flags[to]) {
      B.flags[to] = { at: now, why: `received from ${senders.size} new accounts in 24 h`, total: r2(keep.reduce((s, x) => s + x.amount, 0)), senders: [...senders].slice(0, 20) };
      d.save();
      d.onFlag?.(to, B.flags[to]);
    }
  }
  // 26.9 pending confirmations and limits
  const TXP = /* @__PURE__ */ new Map(), TXS = { asked: 0, approved: 0 };
  const TX_CONFIRM_MIN = () => +(process.env.TX_CONFIRM_MIN || 5e3), TX_DAILY_OUT = () => +(process.env.TX_DAILY_OUT || 1e5);
  function audit() {
    let total = 0, negative = 0, n = 0;
    for (const a of Object.values(B.acct)) {
      total += a.bal || 0;
      n++;
      if ((a.bal || 0) < -1e-9) negative++;
    }
    total = r2(total);
    const bySource = {};
    for (const t of B.ledger) if (t.from === "mint") {
      const k = String(t.memo).replace(/[:·(].*$/, "").trim().slice(0, 40);
      bySource[k] = r2((bySource[k] || 0) + t.amount);
    }
    return { flags: Object.keys(B.flags || {}).length, tx: { ...TXS, pending: TXP.size }, ledgerFile: { lines: LED.lines, errors: LED.errors, enabled: !!LF, lostOnStart: LED.lostOnStart || 0 }, accounts: n, total, minted: B.minted, burned: B.burned, drift: r2(total - (B.minted - B.burned)), negative, mintToday: mintDay(), mintCap: MINT_CAP, owed: r2(B.owed.reduce((s, o) => s + o.amount, 0)), owedCount: B.owed.length, treasury: bal("treasury"), escrow: bal("escrow"), ledger: B.ledger.length, mintedBySourceInLedger: bySource, auditFrom: B.auditFrom || null };
  }
  // dev / test hook (read-only); the demo server exposes it on loopback at /__bench/bank
  globalThis.__fyrusBankAudit = audit;
  return { onMessage: onMessage2, transfer, bal, acct, notify, history, audit, mint, payFromTreasury, setHeld: (f) => {
    heldFor = f;
  }, setBusy: (f) => {
    busy = f;
  } };
}

// server/market.ts
// 26.8: FYC are non-redeemable in-game credits, so the market sells in-game work and content only. Physical goods
// shipped to real addresses (types "physical" / "brand") would make FYC redeemable for real-world goods and collect
// home addresses; they are off (MARKET_PHYSICAL=on is for a separately approved test only).
var PHYSICAL_ON = String(process.env.MARKET_PHYSICAL || "off") === "on";
var TYPES2 = PHYSICAL_ON ? ["skill", "course", "digital", "physical", "brand"] : ["skill", "course", "digital"];
var H = 36e5;
var INSPECT_MS = +(process.env.INSPECT_MS || 72 * H);
var RESPOND_MS = +(process.env.RESPOND_MS || 48 * H);
var MIN_AUCTION_MS = +(process.env.MIN_AUCTION_MS || H);
var SNIPE_MS = +(process.env.SNIPE_MS ?? 12e4);
var FEE = 0.05;
var BOND_LIMIT = 1e3;
var bondNeeded = (price) => price > BOND_LIMIT ? Math.max(500, Math.round(price * 0.1)) : 0;
var BANNED_GOODS = /\b(gun|guns|pistol|rifle|ammo|ammunition|explosive|grenade|cocaine|heroin|meth|weed|cannabis|marijuana|opioid|fentanyl|steroid|counterfeit|replica|fake id|fake passport|stolen|hacked account|credit card dump|cvv|malware|ransomware|keylogger|botnet|ddos|escort|adult content|porn)\b/i;
var REDEEM_WORDS = /\b(licen[cs]e key|activation (code|key)|steam key|cd ?key|product key|gift ?code|voucher|top-?up code|redeem code|real money|cash ?out|paypal|bank transfer|iban)\b/i;
var SCAM_WORDS = /\b(pay outside|outside fyrus|whatsapp me|telegram me|western union|gift ?card|bitcoin|crypto wallet|usdt|send your password|verify your account|seed phrase|private key|guaranteed profit|double your money)\b/i;
var BAD_LINK = /(https?:\/\/)?(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rb\.gy|grabify|iplogger)\b|http:\/\/|\.(exe|scr|bat|cmd|msi|apk|jar|vbs|ps1)(\?|\b)/i;
function sentinel(text, price, type) {
  if (BANNED_GOODS.test(text)) return "Sentinel blocked this listing: prohibited goods or services.";
  if (REDEEM_WORDS.test(text)) return "Sentinel blocked this listing: FYC can't buy real-world value (keys, codes, vouchers, money).";
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
  // 26.8: pause active physical / brand listings while physical goods are off (bids returned; orders in flight settle)
  if (!PHYSICAL_ON) {
    let paused = 0;
    Object.values(K.listings).forEach((l) => {
      if (l.status === "active" && (l.type === "physical" || l.type === "brand")) {
        const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
        if (top) d.bank.transfer("escrow", top.user, top.amount, `Bid returned (listing paused): ${l.title}`);
        l.status = "paused";
        paused++;
      }
    });
    if (paused) d.save();
  }
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
        const l = own(K.listings, m.id);
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
        const l = own(K.listings, m.id);
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
        const l = own(K.listings, m.id);
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
        const o = own(K.orders, m.order);
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
  const E2 = d.db.estate;
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
  // 25.10 market: the last 40 completed sales (Land Office, resale, auction) for the marketplace view
  E2.sales ||= [];
  const logSale = (id, price, kind) => {
    E2.sales.push({ id, price, kind, at: Date.now() });
    if (E2.sales.length > 40) E2.sales.splice(0, E2.sales.length - 40);
  };
  const recent = () => E2.sales.slice(-20).reverse();
  const state = () => ({ t: "est_state", plots: Object.fromEntries(Object.entries(E2.plots).map(([k, v]) => [k, pub2(k, v)])), studios: Object.keys(E2.studios).length, recent: recent(), now: Date.now() });
  const changed = (ids) => {
    d.save();
    d.broadcast({ t: "est_update", plots: Object.fromEntries(ids.map((k) => [k, E2.plots[k] ? pub2(k, E2.plots[k]) : null])), recent: recent() });
  };
  const mine = (uid) => ({ t: "est_mine", owned: Object.entries(E2.plots).filter(([, p]) => p.owner === uid).map(([k, p]) => pub2(k, p)), renting: Object.entries(E2.plots).filter(([, p]) => p.rent?.tenant === uid).map(([k, p]) => pub2(k, p)), studio: E2.studios[uid] || null, passes: (E2.passes[uid] || []).filter((p) => p.until > Date.now()), passport: isPassport(uid) });
  const pushMine = (uid) => {
    const l = d.liveOf(uid);
    if (l) d.send(l.ws, mine(uid));
  };
  const canEnterRoyal = (uid) => isPassport(uid) || (E2.passes[uid] || []).some((p) => p.until > Date.now()) || Object.entries(E2.plots).some(([k, p]) => k.startsWith("RS-") && (p.owner === uid || p.rent?.tenant === uid));
  function transferPlot(id, to, paid) {
    const p = E2.plots[id];
    const prevOwner = p?.owner;
    const tenant = p?.rent?.tenant ? p.rent : void 0;
    E2.plots[id] = { owner: to.id, ownerName: to.name, boughtAt: Date.now(), paid, style: p?.style, rent: tenant ? { ...tenant, ending: true } : void 0 };
    if (prevOwner && prevOwner !== to.id) pushMine(prevOwner);
    pushMine(to.id);
  }
  function finishAuction(id) {
    const p = E2.plots[id];
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
    logSale(id, top.amount, "auction");
    note(top.user, `You won plot ${id} for ${top.amount.toLocaleString("en-US")} FYC. The title is yours.`);
    note(seller, `Plot ${id} sold at auction for ${top.amount.toLocaleString("en-US")} FYC.`);
    changed([id]);
    d.news?.("property", `Auction: plot ${id} sold for ${top.amount.toLocaleString("en-US")} FYC`);
  }
  function collectRent(id) {
    const p = E2.plots[id];
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
    for (const [id, p] of Object.entries(E2.plots)) {
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
    const rec = plot ? E2.plots[plot.id] : void 0;
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
        // 25.4: the client sends the total it showed (m.max); never charge more than the buyer confirmed
        const max = m.max == null ? Infinity : +m.max;
        if (!rec) {
          if (!plot.empty) {
            err("A resident lives here. It is not for sale.");
            return true;
          }
          if (!(plot.price <= max)) {
            err(`The price is ${plot.price.toLocaleString("en-US")} FYC. Check and confirm again.`);
            return true;
          }
          if (!bank2.transfer(u.id, "treasury", plot.price, `Plot ${plot.id} in ${soc.name} (Land Office)`)) {
            err(`You need ${plot.price.toLocaleString("en-US")} FYC.`);
            return true;
          }
          transferPlot(plot.id, u, plot.price);
          logSale(plot.id, plot.price, "land");
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
        if (!(price + tax <= max)) {
          err(`The price changed to ${(price + tax).toLocaleString("en-US")} FYC. Check and confirm again.`);
          reply(state());
          return true;
        }
        if ((bank2.acct(u.id).bal || 0) < price + tax) {
          err(`You need ${(price + tax).toLocaleString("en-US")} FYC (price + ${tax.toLocaleString("en-US")} FYC transfer tax).`);
          return true;
        }
        if (!bank2.transfer(u.id, seller, price, `Plot ${plot.id} bought from ${rec.ownerName}`)) {
          err(`You need ${price.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (tax && !bank2.transfer(u.id, "treasury", tax, `Land transfer tax 5%: ${plot.id}`)) {
        }
        transferPlot(plot.id, u, price);
        logSale(plot.id, price, "sale");
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
        if (E2.studios[u.id]) {
          reply(mine(u.id));
          return true;
        }
        const used = new Set(Object.values(E2.studios));
        let k = 0;
        while (k < STUDIOS && used.has(studioId(k))) k++;
        if (k >= STUDIOS) {
          err("All studios are taken. New towers are coming.");
          return true;
        }
        E2.studios[u.id] = studioId(k);
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
        E2.passes[g.id] = [...(E2.passes[g.id] || []).filter((p) => p.until > Date.now()), { by: u.id, byName: u.name, until: Date.now() + 24 * H2 }];
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
  politics: { label: "Politics", color: "#b06ad9" },
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
  const N2 = d.db.news;
  let world = [];
  let worldAt = 0;
  let worldErr = "";
  const visible = () => N2.items.filter((i) => !i.hidden).slice(-80).reverse();
  const pub2 = (i) => ({ id: i.id, kind: i.kind, cat: i.cat, title: i.title, body: i.body, at: i.at, byName: i.byName, flags: i.flags?.length || 0 });
  const state = () => ({ t: "news_state", fyrus: visible().map(pub2), world, worldAt, worldErr: world.length ? "" : worldErr, sources: FEEDS.map((f) => f.name) });
  function report2(cat, title, body) {
    const last = N2.items.at(-1);
    if (last && last.title === title && Date.now() - last.at < 6e4) return;
    const it = { id: ++N2.seq, kind: "fyrus", cat: NEWS_CATS[cat] ? cat : "nation", title: title.slice(0, 160), body: body?.slice(0, 600), at: Date.now() };
    N2.items.push(it);
    if (N2.items.length > 400) N2.items.splice(0, N2.items.length - 400);
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
        const today = N2.items.filter((i) => i.by === u.id && Date.now() - i.at < 24 * H3).length;
        if (today >= 3) {
          err("You can post 3 citizen reports a day.");
          return true;
        }
        const it = { id: ++N2.seq, kind: "citizen", cat: "citizen", title, body, at: Date.now(), by: u.id, byName: d.shown(u.id), flags: [] };
        N2.items.push(it);
        if (N2.items.length > 400) N2.items.splice(0, N2.items.length - 400);
        d.save();
        d.broadcast({ t: "news_new", item: pub2(it) });
        reply({ t: "ok", text: "Your report is live on Fyrus News (labelled as a citizen report)." });
        return true;
      }
      case "news_flag": {
        const it = N2.items.find((i) => i.id === +m.id);
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
        const it = N2.items.find((i) => i.id === +m.id);
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
      // 28.10 social events: one "starting soon" note to the host and ticket holders HALL_SOON_MS (10 min) before the start;
      // flag saved on the event so restarts never repeat it. Kill switch P28_OFF=events.
      if (!e.started && !e.soon && e.start > now && e.start - now <= +(process.env.HALL_SOON_MS || 6e5) && !/(^|,)(events|all)(,|$)/.test(process.env.P28_OFF || "")) {
        e.soon = now;
        d.save();
        const h = hallById(e.hall), mins = Math.max(1, Math.round((e.start - now) / 6e4));
        [e.host, ...e.tickets].forEach((t) => note(t, `"${e.title}" starts in ${mins} min in the ${h?.name}. Open Events to go in.`));
      }
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
    const ev = m.event ? own(K.events, String(m.event)) : void 0;
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

// src/data/furniture.ts
var FURNITURE = [
  { id: "sofa", name: "Sofa", cat: "Living", w: 2.4, d: 0.95, color: "#8a9bb0" },
  { id: "lsofa", name: "Corner sofa", cat: "Living", w: 2.8, d: 2.2, color: "#c8bfae" },
  { id: "armchair", name: "Armchair", cat: "Living", w: 0.95, d: 0.95, color: "#b36b4a" },
  { id: "coffee", name: "Coffee table", cat: "Living", w: 1.2, d: 0.7, color: "#7a5a3c" },
  { id: "tv", name: "TV + stand", cat: "Living", w: 2, d: 0.5, color: "#2b2b2b" },
  { id: "rug", name: "Rug", cat: "Living", w: 3, d: 2, color: "#a34a3c" },
  { id: "rugr", name: "Round rug", cat: "Living", w: 2.2, d: 2.2, color: "#3f6f8f" },
  { id: "fireplace", name: "Fireplace", cat: "Living", w: 1.8, d: 0.5, color: "#d8d2c6", wall: true },
  { id: "bed2", name: "Double bed", cat: "Bedroom", w: 1.8, d: 2.2, color: "#e9e4da" },
  { id: "bed1", name: "Single bed", cat: "Bedroom", w: 1.1, d: 2.1, color: "#c9d6e3" },
  { id: "wardrobe", name: "Wardrobe", cat: "Bedroom", w: 1.6, d: 0.6, color: "#efe9df", wall: true },
  { id: "nightstand", name: "Bedside table", cat: "Bedroom", w: 0.5, d: 0.45, color: "#7a5a3c" },
  { id: "mirror", name: "Mirror", cat: "Bedroom", w: 0.8, d: 0.1, color: "#d4a64a", wall: true },
  { id: "dining", name: "Dining table", cat: "Kitchen", w: 1.8, d: 1, color: "#9a7450" },
  { id: "chair", name: "Chair", cat: "Kitchen", w: 0.5, d: 0.5, color: "#2b2e33" },
  { id: "counter", name: "Kitchen counter", cat: "Kitchen", w: 2.4, d: 0.65, color: "#f2f2ee", wall: true },
  { id: "fridge", name: "Fridge", cat: "Kitchen", w: 0.8, d: 0.7, color: "#dfe3e8", wall: true },
  { id: "desk", name: "Desk + laptop", cat: "Work", w: 1.4, d: 0.7, color: "#efe9df" },
  { id: "office", name: "Office chair", cat: "Work", w: 0.6, d: 0.6, color: "#1b1d22" },
  { id: "shelf", name: "Bookshelf", cat: "Work", w: 1.2, d: 0.35, color: "#7a5a3c", wall: true },
  { id: "plant", name: "Big plant", cat: "Decor", w: 0.7, d: 0.7, color: "#4f7f35" },
  { id: "plants", name: "Small plant", cat: "Decor", w: 0.4, d: 0.4, color: "#5f8f45" },
  { id: "lamp", name: "Floor lamp", cat: "Decor", w: 0.4, d: 0.4, color: "#f2e6c9" },
  { id: "art", name: "Painting", cat: "Decor", w: 1.4, d: 0.06, color: "#ff9a3c", wall: true },
  { id: "aquarium", name: "Aquarium", cat: "Decor", w: 1.6, d: 0.6, color: "#6fb7d9" },
  { id: "vase", name: "Flower vase", cat: "Decor", w: 0.35, d: 0.35, color: "#e05a8a" },
  { id: "piano", name: "Piano", cat: "Fun", w: 1.5, d: 0.6, color: "#111111", wall: true },
  { id: "arcade", name: "Arcade cabinet", cat: "Fun", w: 0.8, d: 0.8, color: "#4da3ff" },
  { id: "beanbag", name: "Bean bag", cat: "Fun", w: 0.9, d: 0.9, color: "#ffc27a" },
  { id: "prayer", name: "Prayer mat", cat: "Decor", w: 0.7, d: 1.2, color: "#2f6a4f" }
];
var FURN = Object.fromEntries(FURNITURE.map((f) => [f.id, f]));
var FLOORS = [
  { id: "oak", name: "Oak wood", color: "#a7835e" },
  { id: "walnut", name: "Walnut", color: "#6b4a32" },
  { id: "tile", name: "White tile", color: "#e9e6e0" },
  { id: "marble", name: "Marble", color: "#f1eee9" },
  { id: "carpet", name: "Carpet", color: "#8a8f99" },
  { id: "concrete", name: "Concrete", color: "#b5b1aa" }
];
var FENCES = [{ id: "none", name: "No fence" }, { id: "hedge", name: "Hedge" }, { id: "picket", name: "White picket" }, { id: "iron", name: "Black iron" }, { id: "wall", name: "Low wall" }];
var GARDENS = [{ id: "lawn", name: "Lawn" }, { id: "flowers", name: "Flower beds" }, { id: "stone", name: "Stone patio" }, { id: "trees", name: "Fruit trees" }];
// 25.5 outdoor lights and a mailbox
var LIGHTS = [{ id: "none", name: "No lights" }, { id: "lanterns", name: "Gate lanterns" }, { id: "lamps", name: "Path lamps" }, { id: "string", name: "String lights" }];
var MAX_ITEMS = 120;
var PASS_MS = 2 * 36e5;
var homeKind = (key) => /^(EX|MB|RS)-\d{4}$/.test(key) ? "house" : key.startsWith("studio:") ? "studio" : key.startsWith("home:") ? "home" : "";
var roomSize = (key) => homeKind(key) === "studio" ? { w: 11, d: 10, h: 3.2 } : homeKind(key) === "home" ? { w: 16, d: 14, h: 3.6 } : { w: 18, d: 15, h: 3.6 };
var HEX = /^#[0-9a-f]{6}$/i;
var hex = (v, d) => typeof v === "string" && HEX.test(v) ? v.toLowerCase() : d;
var pick = (v, list, d) => list.some((x) => x.id === v) ? String(v) : d;
var num = (v, lim) => {
  const n = Math.round((+v || 0) * 100) / 100;
  return Math.max(-lim, Math.min(lim, n));
};
var DEFAULT_EXT = { wall: "#ffffff", roof: "#5a3f35", trim: "#ffffff", fence: "hedge", garden: "lawn" };
function cleanExt(e) {
  e = e || {};
  return { wall: hex(e.wall, DEFAULT_EXT.wall), roof: hex(e.roof, DEFAULT_EXT.roof), trim: hex(e.trim, DEFAULT_EXT.trim), fence: pick(e.fence, FENCES, "hedge"), garden: pick(e.garden, GARDENS, "lawn"), lights: pick(e.lights, LIGHTS, "none"), mailbox: e.mailbox === true };
}
function cleanInt(v, key) {
  v = v || {};
  const r = roomSize(key);
  const hx = r.w / 2 - 0.2, hz = r.d / 2 - 0.2;
  const items = (Array.isArray(v.items) ? v.items : []).slice(0, MAX_ITEMS).filter((i) => i && FURN[i.k]).map((i) => ({ k: String(i.k), x: num(i.x, hx), z: num(i.z, hz), r: Math.round(((+i.r || 0) % 360 + 360) % 360), ...i.c && HEX.test(i.c) ? { c: String(i.c).toLowerCase() } : {} }));
  return { wall: hex(v.wall, "#f1ede6"), floor: pick(v.floor, FLOORS, "oak"), accent: hex(v.accent, "#c9d3dc"), items };
}
function defaultInt(key) {
  const k = homeKind(key);
  if (k === "studio") return { wall: "#f1ede6", floor: "oak", accent: "#dfe6ee", items: [
    { k: "bed1", x: -3.6, z: -3, r: 0 },
    { k: "nightstand", x: -2.4, z: -4.2, r: 0 },
    { k: "sofa", x: 2.6, z: 0.6, r: 180 },
    { k: "tv", x: 2.6, z: -4.4, r: 0 },
    { k: "rug", x: 2.6, z: -1.8, r: 0 },
    { k: "counter", x: -3.8, z: 2.6, r: 90 },
    { k: "plant", x: 4.6, z: 3.6, r: 0 },
    { k: "desk", x: -0.6, z: -4.3, r: 0 },
    { k: "office", x: -0.6, z: -3.5, r: 180 }
  ] };
  return { wall: "#f1ede6", floor: "oak", accent: "#c9d3dc", items: [
    { k: "lsofa", x: -4.5, z: -1.5, r: 0 },
    { k: "coffee", x: -4.2, z: 0.2, r: 0 },
    { k: "rug", x: -4.2, z: 0, r: 0 },
    { k: "tv", x: -4.2, z: 3.6, r: 180 },
    { k: "dining", x: 3.8, z: 2.4, r: 0 },
    { k: "chair", x: 3.2, z: 1.6, r: 0 },
    { k: "chair", x: 4.4, z: 1.6, r: 0 },
    { k: "chair", x: 3.2, z: 3.2, r: 180 },
    { k: "chair", x: 4.4, z: 3.2, r: 180 },
    { k: "counter", x: 6.5, z: -4.8, r: 0 },
    { k: "fridge", x: 8.2, z: -6.6, r: 0 },
    { k: "bed2", x: -6.6, z: -5.2, r: 0 },
    { k: "wardrobe", x: -3.6, z: -7, r: 0 },
    { k: "plant", x: 0, z: -6.6, r: 0 },
    { k: "lamp", x: -8.2, z: 1.8, r: 0 },
    { k: "art", x: 0, z: -7.4, r: 0 }
  ] };
}

// server/homes.ts
function createHomes(d) {
  if (!d.db.homes) {
    d.db.homes = {};
    d.save();
  }
  const H5 = d.db.homes;
  function residentOf(key) {
    const k = homeKind(key);
    if (k === "house") {
      const p = d.db.estate?.plots[key];
      if (!p?.owner) return null;
      const tenant = p.rent?.tenant;
      return { resident: tenant || p.owner, owner: p.owner, label: `House ${key}` };
    }
    if (k === "studio") {
      const sid = key.slice(7);
      const uid = Object.entries(d.db.estate?.studios || {}).find(([, s]) => s === sid)?.[0];
      return uid ? { resident: uid, owner: uid, label: `Studio ${sid}` } : null;
    }
    return null;
  }
  function sync(key) {
    const r = H5[key];
    if (!r) return;
    const o = residentOf(key);
    const res = o?.resident;
    if (r.res !== res) {
      if (r.res) {
        r.keys = [];
        r.passes = {};
        r.lock = "private";
        // 25.7: saved layouts belong to the person, not the house (the current interior stays with the house)
        delete r.saved;
      }
      r.res = res;
      d.save();
    }
  }
  const rec = (key) => {
    sync(key);
    return H5[key] ||= { lock: "private", keys: [], res: residentOf(key)?.resident };
  };
  const fresh = (r) => {
    if (r.passes) {
      for (const [u, t] of Object.entries(r.passes)) if (t < Date.now()) delete r.passes[u];
    }
    return r;
  };
  function canEnter(key, uid) {
    const o = residentOf(key);
    if (!o) return { ok: false, why: "Nobody lives here yet." };
    if (o.resident === uid) return { ok: true };
    sync(key);
    const r = H5[key] ? fresh(H5[key]) : void 0;
    const lock = r?.lock || "private";
    if (lock === "open") return { ok: true };
    if ((r?.passes?.[uid] || 0) > Date.now()) return { ok: true };
    if (lock === "keys" && r?.keys.some((k) => k.id === uid)) return { ok: true };
    return { ok: false, why: lock === "keys" ? "Locked. Only people with a key can go in." : "This home is private." };
  }
  // 25.3: a key can carry the "decorate" right (edit the interior). Exterior, lock and keys stay with the resident.
  const isDecorator = (key, uid) => {
    const o = residentOf(key);
    if (!o || o.resident === uid) return false;
    sync(key);
    return !!H5[key]?.keys.some((k) => k.id === uid && k.edit);
  };
  const layoutsOf = (r) => [0, 1, 2].map((i) => {
    const s = r?.saved?.[i];
    return s ? { name: s.name, at: s.at, n: s.int.items.length } : null;
  });
  const extAll = () => Object.fromEntries(Object.entries(H5).filter(([, r]) => r.ext).map(([k, r]) => [k, r.ext]));
  const pubLock = () => Object.fromEntries(Object.entries(H5).map(([k, r]) => [k, r.lock]));
  function mine(uid) {
    const homes2 = [];
    for (const [k, p] of Object.entries(d.db.estate?.plots || {})) {
      const o = residentOf(k);
      void p;
      if (o?.resident === uid) homes2.push(k);
    }
    const sid = d.db.estate?.studios[uid];
    if (sid) homes2.push("studio:" + sid);
    Object.keys(H5).forEach(sync);
    const list = homes2.map((k) => {
      const o = residentOf(k);
      const r = H5[k] ? fresh(H5[k]) : { lock: "private", keys: [] };
      return { key: k, label: o.label, lock: r.lock, keys: r.keys, ext: r.ext || null, owner: o.owner === uid, passes: Object.entries(r.passes || {}).map(([id, until]) => ({ id, name: d.shown(id), until })) };
    });
    const held = Object.entries(H5).filter(([k, r]) => {
      const o = residentOf(k);
      return o && o.resident !== uid && (r.keys.some((x) => x.id === uid) || (fresh(r).passes?.[uid] || 0) > Date.now());
    }).map(([k, r]) => {
      const o = residentOf(k);
      return { key: k, label: o.label, residentName: d.shown(o.resident), kind: r.keys.some((x) => x.id === uid) ? "key" : "pass", edit: !!r.keys.find((x) => x.id === uid)?.edit, until: r.passes?.[uid] || 0 };
    });
    return { t: "home_mine", homes: list, held };
  }
  const pushMine = (uid) => {
    const l = d.liveOf(uid);
    if (l) d.send(l.ws, mine(uid));
  };
  const knocks = /* @__PURE__ */ new Map();
  const HSTAT = { conflicts: 0 };
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("home_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const key = String(m.key || "").slice(0, 40);
    const o = key ? residentOf(key) : null;
    const isRes = !!o && o.resident === u.id;
    const mustRes = () => {
      if (!o) {
        err("Nobody lives here yet.");
        return false;
      }
      if (!isRes) {
        err("Only the person who lives here can change this.");
        return false;
      }
      return true;
    };
    switch (m.t) {
      case "home_state":
        reply({ t: "home_ext", ext: extAll(), locks: pubLock() });
        reply(mine(u.id));
        return true;
      case "home_mine":
        reply(mine(u.id));
        return true;
      case "home_enter": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        const c = canEnter(key, u.id);
        const r = H5[key];
        if (!c.ok) {
          reply({ t: "home_access", key, ok: false, why: c.why, lock: r?.lock || "private", residentName: d.shown(o.resident), online: !!d.liveOf(o.resident) });
          return true;
        }
        const deco = !isRes && isDecorator(key, u.id);
        reply({ t: "home_access", key, ok: true, label: o.label, residentName: d.shown(o.resident), canEdit: isRes || deco, role: isRes ? "resident" : deco ? "decorator" : "guest", layouts: isRes || deco ? (sync(key), layoutsOf(H5[key])) : void 0, v: r?.v || 0, int: r?.int || defaultInt(key), ext: r?.ext || null, lock: r?.lock || "private" });
        return true;
      }
      case "home_lock": {
        if (!mustRes()) return true;
        const lock = ["private", "keys", "open"].includes(m.lock) ? m.lock : "private";
        rec(key).lock = lock;
        d.save();
        reply({ t: "ok", text: lock === "open" ? "Open house: anyone can walk in." : lock === "keys" ? "Locked. People with a key can go in." : "Private. Only you can go in; visitors can knock." });
        pushMine(u.id);
        d.broadcast({ t: "home_lock", key, lock });
        return true;
      }
      case "home_key": {
        if (!mustRes()) return true;
        const who = m.id ? own(d.db.users, String(m.id)) ? { id: String(m.id), name: d.shown(String(m.id)) } : void 0 : d.findByNumber(String(m.number || ""));
        if (!who) {
          err("No citizen with that number.");
          return true;
        }
        if (who.id === u.id) {
          err("You already live here.");
          return true;
        }
        const r = rec(key);
        if (r.keys.length >= 50) {
          err("A home can have up to 50 keys.");
          return true;
        }
        if (!r.keys.some((k) => k.id === who.id)) r.keys.push({ id: who.id, name: d.shown(who.id) });
        if (r.lock === "private") r.lock = "keys";
        d.save();
        reply({ t: "ok", text: `${d.shown(who.id)} now has a key to ${o.label}.` });
        pushMine(u.id);
        pushMine(who.id);
        const l = d.liveOf(who.id);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} gave you a key to ${o.label}. Open Homes & keys to visit.` });
        return true;
      }
      case "home_unkey": {
        if (!mustRes()) return true;
        const r = rec(key);
        const id = String(m.id || "");
        r.keys = r.keys.filter((k) => k.id !== id);
        if (r.passes) delete r.passes[id];
        d.save();
        reply({ t: "ok", text: "Key taken back." });
        pushMine(u.id);
        pushMine(id);
        return true;
      }
      case "home_knock": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (isRes) {
          reply({ t: "note", text: "This is your home. Walk in." });
          return true;
        }
        const last = knocks.get(u.id);
        if (last && last.key === key && Date.now() - last.at < 2e4) {
          err("You just knocked. Give them a moment.");
          return true;
        }
        const l = d.liveOf(o.resident);
        if (!l) {
          reply({ t: "note", text: `${d.shown(o.resident)} is not home right now. Try again later.` });
          return true;
        }
        knocks.set(u.id, { key, from: u.id, at: Date.now() });
        if (knocks.size > 5e3) knocks.clear();
        d.send(l.ws, { t: "home_knock", key, label: o.label, from: { id: u.id, name: d.shown(u.id) } });
        reply({ t: "note", text: `You knocked on ${o.label}. Waiting for ${d.shown(o.resident)}\u2026` });
        return true;
      }
      case "home_answer": {
        if (!mustRes()) return true;
        const id = String(m.id || "");
        const k = knocks.get(id);
        if (!k || k.key !== key) {
          err("That knock has expired.");
          return true;
        }
        knocks.delete(id);
        const l = d.liveOf(id);
        if (m.yes) {
          const r = rec(key);
          (r.passes ||= {})[id] = Date.now() + PASS_MS;
          d.save();
          if (l) d.send(l.ws, { t: "home_let_in", key, label: o.label, by: d.shown(u.id) });
          reply({ t: "ok", text: `You let ${d.shown(id)} in for 2 hours.` });
          pushMine(u.id);
          pushMine(id);
        } else if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} can't open the door right now.` });
        return true;
      }
      // 25.7 saved layouts: 3 named slots per home (resident saves / deletes; resident or decorator restores),
      // and "reset to the default furnishing"
      case "home_layout_save": {
        if (!mustRes()) return true;
        const r = rec(key);
        const slot = Math.round(+m.slot);
        if (!(slot >= 0 && slot < 3)) {
          err("Pick slot 1, 2 or 3.");
          return true;
        }
        (r.saved ||= [null, null, null])[slot] = { name: clean(m.name, 24) || `Layout ${slot + 1}`, at: Date.now(), int: cleanInt(r.int || defaultInt(key), key) };
        d.save();
        reply({ t: "home_layouts", key, layouts: layoutsOf(r) });
        reply({ t: "ok", text: `Saved as "${r.saved[slot].name}".` });
        return true;
      }
      case "home_layout_del": {
        if (!mustRes()) return true;
        const r = rec(key);
        const slot = Math.round(+m.slot);
        if (r.saved && slot >= 0 && slot < 3) r.saved[slot] = null;
        d.save();
        reply({ t: "home_layouts", key, layouts: layoutsOf(r) });
        return true;
      }
      case "home_layout_load":
      case "home_reset": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (!isRes && !isDecorator(key, u.id)) {
          err("Only the resident, or someone they let decorate, can change this.");
          return true;
        }
        const r = rec(key);
        let src;
        if (m.t === "home_reset") src = defaultInt(key);
        else {
          const s = r.saved?.[Math.round(+m.slot)];
          if (!s) {
            err("That slot is empty.");
            return true;
          }
          src = s.int;
        }
        r.int = cleanInt(JSON.parse(JSON.stringify(src)), key);
        r.at = Date.now();
        r.by = u.id;
        r.v = (r.v || 0) + 1;
        d.save();
        reply({ t: "home_saved", key, int: r.int, v: r.v });
        reply({ t: "ok", text: m.t === "home_reset" ? "Back to the original furnishing." : "Layout restored." });
        d.toScene("house:" + key, { t: "home_int", key, int: r.int, v: r.v });
        return true;
      }
      // 25.9: the resident can ask a visitor to leave (their timed pass is withdrawn; a key holder keeps the key)
      case "home_kick": {
        if (!mustRes()) return true;
        const id = String(m.id || "");
        const l = d.liveOf(id);
        if (!l || l.scene !== "house:" + key || id === u.id) {
          err("That visitor is not inside.");
          return true;
        }
        const r = rec(key);
        if (r.passes) delete r.passes[id];
        d.save();
        d.send(l.ws, { t: "home_kicked", key, label: o.label, by: d.shown(u.id) });
        reply({ t: "ok", text: `${d.shown(id)} was asked to leave.` });
        return true;
      }
      case "home_keyperm": {
        if (!mustRes()) return true;
        const r = rec(key);
        const k = r.keys.find((x) => x.id === String(m.id || ""));
        if (!k) {
          err("Give them a key first.");
          return true;
        }
        if (m.edit) k.edit = true;
        else delete k.edit;
        d.save();
        reply({ t: "ok", text: m.edit ? `${k.name} can now decorate ${o.label}.` : `${k.name} can no longer decorate ${o.label}.` });
        pushMine(u.id);
        const l = d.liveOf(k.id);
        if (l) d.send(l.ws, { t: "note", text: m.edit ? `${d.shown(u.id)} lets you decorate ${o.label}.` : `You can no longer decorate ${o.label}.` });
        return true;
      }
      case "home_int": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (!isRes && !isDecorator(key, u.id)) {
          err("Only the resident, or someone they let decorate, can change this.");
          return true;
        }
        const r = rec(key);
        // 25.8: optimistic concurrency - a save based on an older version than the stored one is refused, and the
        // editor gets the current interior (two editors no longer overwrite each other silently)
        if (m.base != null && +m.base !== (r.v || 0)) {
          HSTAT.conflicts++;
          reply({ t: "home_conflict", key, int: r.int || defaultInt(key), v: r.v || 0, by: r.by ? d.shown(r.by) : null });
          return true;
        }
        r.int = cleanInt(m.int, key);
        r.at = Date.now();
        r.by = u.id;
        r.v = (r.v || 0) + 1;
        d.save();
        reply({ t: "home_saved", key, int: r.int, v: r.v });
        d.toScene("house:" + key, { t: "home_int", key, int: r.int, v: r.v });
        return true;
      }
      case "home_ext": {
        if (!mustRes()) return true;
        const r = rec(key);
        r.ext = cleanExt(m.ext);
        d.save();
        reply({ t: "ok", text: "New paint and garden saved. Everyone sees it." });
        d.broadcast({ t: "home_ext", ext: { [key]: r.ext } });
        pushMine(u.id);
        return true;
      }
    }
    return true;
  }
  const hasRoyalKey = (uid) => Object.entries(H5).some(([k, r]) => k.startsWith("RS-") && (r.keys.some((x) => x.id === uid) || (r.passes?.[uid] || 0) > Date.now()));
  return { onMessage: onMessage2, canEnter, residentOf, hasRoyalKey, mine };
}

// src/data/politics.ts
var CITIES = [
  { id: "capital", name: "Capital Quarter", color: "#ffc27a" },
  { id: "market", name: "Market City", color: "#ff9a3c" },
  { id: "tech", name: "Tech City", color: "#4da3ff" },
  { id: "creator", name: "Creator City", color: "#c792ea" },
  { id: "play", name: "Play City", color: "#45e0ae" },
  { id: "learn", name: "Learn City", color: "#7fd1ff" },
  { id: "faith", name: "Faith & Culture District", color: "#e6d3a3" }
];
var cityName = (id) => CITIES.find((c) => c.id === id)?.name || id;
var SEATS = 21;
var SYMBOLS = ["\u2605", "\u25C6", "\u25CF", "\u25B2", "\u2726", "\u2600", "\u263E", "\u26A1", "\u273F", "\u2756", "\u2B22", "\u265E", "\u2693", "\u{1F33F}", "\u{1F985}", "\u{1F981}", "\u{1F54A}", "\u{1F525}", "\u{1F4A1}", "\u{1F30A}", "\u{1F680}", "\u{1F4D8}", "\u2699", "\u{1F333}"];
var PARTY_COLORS = ["#2f6fe0", "#ff9a3c", "#45e0ae", "#c792ea", "#e5484d", "#ffd23f", "#7fd1ff", "#2f5d50", "#b06ad9", "#e05a8a", "#8b5a2b", "#1b1d22"];
var FEES = { party: 5e3, nominate: 1e3, proposal: 500 };
var LIMITS = { name: 32, short: 6, slogan: 80, manifesto: 1500, statement: 400, proposal: 120, proposalBody: 800, parties: 60, openProposals: 3 };
var REAL = [
  "pti",
  "pml",
  "pmln",
  "ppp",
  "mqm",
  "jui",
  "tlp",
  "anp",
  "bjp",
  "aap",
  "inc",
  "congress",
  "democrat",
  "republican",
  "gop",
  "labour",
  "labor party",
  "tory",
  "tories",
  "conservative party",
  "lib dem",
  "snp",
  "afd",
  "cdu",
  "spd",
  "anc",
  "awami",
  "bnp",
  "jamaat",
  "insaf",
  "muslim league",
  "peoples party",
  "imran",
  "nawaz",
  "sharif",
  "shehbaz",
  "maryam",
  "bhutto",
  "zardari",
  "bilawal",
  "fazl",
  "modi",
  "rahul gandhi",
  "gandhi",
  "kejriwal",
  "trump",
  "biden",
  "kamala",
  "harris",
  "obama",
  "putin",
  "xi jinping",
  "erdogan",
  "netanyahu",
  "starmer",
  "sunak",
  "macron",
  "hasina",
  "khamenei",
  "zelensky"
];
function realPolitics(text) {
  const t = " " + String(text || "").toLowerCase().replace(/[^a-z؀-ۿ ]+/g, " ").replace(/\s+/g, " ") + " ";
  return REAL.find((w) => t.includes(" " + w + " ") || w.length > 5 && t.includes(w)) || null;
}
function phaseAt(start, len, now) {
  const nomEnd = start + Math.round(len * 3 / 7);
  const end = start + len;
  return now < nomEnd ? { phase: "nominations", until: nomEnd, end } : { phase: "voting", until: end, end };
}
function dhondt(votes, seats = SEATS) {
  const out = {};
  const ids = Object.keys(votes).filter((k) => votes[k] > 0);
  if (!ids.length) return out;
  for (let s = 0; s < seats; s++) {
    let best = ids[0], bq = -1;
    for (const id of ids) {
      const q = votes[id] / ((out[id] || 0) + 1);
      if (q > bq || q === bq && votes[id] > votes[best]) {
        bq = q;
        best = id;
      }
    }
    out[best] = (out[best] || 0) + 1;
  }
  return out;
}

// server/politics.ts
var LEN = () => +(process.env.ELECTION_MS || 7 * 24 * 36e5);
var VOTER_AGE = () => +(process.env.VOTER_AGE_MS || 24 * 36e5);
var PROPOSAL_MS = () => +(process.env.PROPOSAL_MS || 3 * 24 * 36e5);
var HEX2 = /^#[0-9a-f]{6}$/i;
function createPolitics(d) {
  if (!d.db.politics) {
    d.db.politics = { cycle: { n: 1, start: Date.now() }, parties: {}, cands: [], homes: {}, votes: {}, results: [], proposals: {} };
    d.save();
  }
  const P = d.db.politics;
  const bank2 = d.bank;
  const isPassport = (id) => {
    const p = d.db.users[id]?.passport;
    return !!p && p.kind === "passport";
  };
  const banned = (id) => {
    const u = d.db.users[id];
    return !!(u?.banned && u.banned.until > Date.now()) || !!bank2.acct(id).banned;
  };
  function voterCheck(id) {
    const u = d.db.users[id];
    if (!u) return "Unknown citizen.";
    if (!u.email && !u.google) return "Save your account with an email or Google first (Settings \u2192 Account). Guest accounts cannot vote.";
    if (Date.now() - (u.joined || 0) < VOTER_AGE()) return "New accounts can vote after their first day in Fyrus.";
    if (banned(id)) return "This account is suspended.";
    return null;
  }
  const runCheck = (id) => voterCheck(id) || (isPassport(id) ? null : "You need a Fyrus passport to found a party or stand for office.");
  const partyOf = (id) => Object.values(P.parties).find((p) => !p.banned && p.members.includes(id));
  const ph = () => phaseAt(P.cycle.start, LEN(), Date.now());
  const counts = () => {
    const mayor = {}, party = {};
    for (const v of Object.values(P.votes)) {
      if (v.mayor) mayor[v.mayor] = (mayor[v.mayor] || 0) + 1;
      if (v.party) party[v.party] = (party[v.party] || 0) + 1;
    }
    return { mayor, party };
  };
  const pubParty = (p) => ({ id: p.id, name: p.name, short: p.short, symbol: p.symbol, color: p.color, color2: p.color2, slogan: p.slogan, manifesto: p.manifesto, leader: p.leader, leaderName: d.shown(p.leader), members: p.members.length, memberNames: p.members.slice(0, 40).map((m) => d.shown(m)), at: p.at, banned: p.banned });
  function state() {
    const c = counts();
    const x = ph();
    const live2 = Object.values(P.votes).length;
    return {
      t: "pol_state",
      n: P.cycle.n,
      start: P.cycle.start,
      phase: x.phase,
      until: x.until,
      end: x.end,
      opens: P.cycle.start + Math.round(LEN() * 3 / 7),
      opened: P.cycle.opened || null,
      reminded: P.cycle.reminded || null,
      now: Date.now(),
      seats: SEATS,
      parties: Object.values(P.parties).filter((p) => !p.banned).map(pubParty),
      cands: P.cands.map((k) => ({ id: k.id, name: d.shown(k.id), city: k.city, party: k.party, statement: k.statement, dq: k.dq, votes: x.phase === "voting" ? c.mayor[k.id] || 0 : 0 })),
      partyVotes: x.phase === "voting" ? c.party : {},
      projected: x.phase === "voting" ? dhondt(c.party) : {},
      turnout: live2,
      voters: Object.keys(P.homes).filter((k) => P.homes[k].n === P.cycle.n).length,
      office: P.results[0] || null,
      history: P.results.slice(0, 6).map((r) => ({ n: r.n, at: r.at, turnout: r.turnout, seats: r.seats })),
      proposals: Object.values(P.proposals).sort((a, b) => b.at - a.at).slice(0, 30).map((p) => ({ id: p.id, by: d.shown(p.by), title: p.title, body: p.body, at: p.at, ends: p.ends, yes: p.yes.length, no: p.no.length, closed: !!p.closed }))
    };
  }
  function me(id) {
    const h = P.homes[id];
    const v = P.votes[id];
    const pp = partyOf(id);
    const pv = {};
    for (const p of Object.values(P.proposals)) {
      if (p.yes.includes(id)) pv[p.id] = "yes";
      else if (p.no.includes(id)) pv[p.id] = "no";
    }
    return { t: "pol_me", canVote: voterCheck(id), canRun: runCheck(id), home: h && h.n === P.cycle.n ? h.city : null, voted: v ? { mayor: v.mayor || null, party: v.party || null } : null, party: pp?.id || null, leader: pp?.leader === id, cand: P.cands.find((k) => k.id === id) || null, judge: d.isAdmin(id), pvotes: pv };
  }
  let pending = null;
  const changed = (soon = false) => {
    d.save();
    if (soon) {
      if (!pending) pending = setTimeout(() => {
        pending = null;
        d.broadcast(state());
      }, 1500);
    } else d.broadcast(state());
  };
  const pushMe = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, me(id));
  };
  function closeElection() {
    const c = counts();
    const mayors = {};
    for (const city of CITIES) {
      const list = P.cands.filter((k) => k.city === city.id && !k.dq).map((k) => ({ k, v: c.mayor[k.id] || 0 })).sort((a, b) => b.v - a.v || a.k.at - b.k.at);
      const w = list[0];
      mayors[city.id] = w && w.v > 0 ? { id: w.k.id, name: d.shown(w.k.id), party: w.k.party, votes: w.v } : null;
    }
    const pv = {};
    for (const [k, v] of Object.entries(c.party)) if (P.parties[k] && !P.parties[k].banned) pv[k] = v;
    const seats = dhondt(pv);
    const mps = {};
    const names = {};
    for (const [pid, n] of Object.entries(seats)) {
      const pa = P.parties[pid];
      names[pid] = pa.name;
      mps[pid] = [pa.leader, ...pa.members.filter((x) => x !== pa.leader)].slice(0, n).map((id) => ({ id, name: d.shown(id) }));
    }
    const res = { n: P.cycle.n, at: Date.now(), turnout: Object.keys(P.votes).length, voters: Object.values(P.homes).filter((h) => h.n === P.cycle.n).length, mayors, seats, partyVotes: pv, mps, names };
    P.results.unshift(res);
    P.results = P.results.slice(0, 20);
    const top = Object.entries(seats).sort((a, b) => b[1] - a[1])[0];
    d.news?.("politics", `Election ${P.cycle.n} results: ${top ? `${P.parties[top[0]]?.name} wins ${top[1]} of ${SEATS} seats` : "no party votes"} \xB7 ${Object.values(mayors).filter(Boolean).length} mayors elected \xB7 turnout ${res.turnout}`);
    for (const [city, m] of Object.entries(mayors)) if (m) {
      d.news?.("politics", `${m.name} is the new Mayor of ${cityName(city)} (${m.votes} votes)`);
      const l = d.liveOf(m.id);
      if (l) d.send(l.ws, { t: "note", text: `Congratulations \u2014 you are the Mayor of ${cityName(city)}!` });
    }
    P.cycle = { n: P.cycle.n + 1, start: Date.now() };
    P.cands = [];
    P.votes = {};
    changed();
  }
  function closeProposals() {
    const now = Date.now();
    for (const p of Object.values(P.proposals)) if (!p.closed && now >= p.ends) {
      p.closed = true;
      d.news?.("politics", `Citizens' proposal "${p.title}": ${p.yes.length > p.no.length ? "PASSED" : "not passed"} (${p.yes.length} yes \xB7 ${p.no.length} no)`);
      changed();
    }
  }
  // 28.6 political simulation: the election calendar is announced once per cycle (polls open, last-call reminder) as city
  // news + a note to everyone online. Flags live on P.cycle (saved), so restarts never repeat or skip them. Read-only:
  // nothing here touches votes, candidates or results. Kill switch P28_OFF=polsim.
  const POLSIM_OFF = () => /(^|,)(polsim|all)(,|$)/.test(process.env.P28_OFF || "");
  const REMIND = () => +(process.env.POL_REMIND_MS || 36e5);
  const polDur = (ms) => { const m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`; };
  function phaseEvents(now = Date.now()) {
    if (POLSIM_OFF()) return;
    const c = P.cycle, x = phaseAt(c.start, LEN(), now);
    if (x.phase !== "voting" || now >= x.end) return;
    if (!c.opened) {
      c.opened = now;
      const nc = P.cands.filter((k) => !k.dq).length, np = Object.values(P.parties).filter((p) => !p.banned).length;
      d.news?.("politics", `Polls are open for Election ${c.n}: ${nc} candidate${nc === 1 ? "" : "s"} for Mayor and ${np} part${np === 1 ? "y" : "ies"} for Parliament. Voting closes in ${polDur(x.end - now)}.`);
      d.broadcast({ t: "note", text: `Polls are open for Election ${c.n}. Vote at the Parliament of Fyrus or in HUD \u203A Politics.` });
      changed();
    }
    if (!c.reminded && x.end - now <= REMIND()) {
      c.reminded = now;
      d.news?.("politics", `Last call: Election ${c.n} polls close in ${polDur(x.end - now)} \u00B7 ${Object.keys(P.votes).length} votes so far`);
      d.broadcast({ t: "note", text: `Polls close in ${polDur(x.end - now)}. If you have not voted in Election ${c.n} yet, vote now.` });
      changed();
    }
  }
  function tick(now = Date.now()) {
    if (now >= P.cycle.start + LEN()) closeElection();
    phaseEvents(now);
    closeProposals();
  }
  setInterval(() => tick(), +(process.env.POL_TICK_MS || 15e3));
  function onMessage2(meL, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("pol_")) return false;
    const u = meL.u;
    const reply = (x) => d.send(meL.ws, x);
    const err = (text2) => {
      reply({ t: "err", text: text2 });
      return true;
    };
    const ok = (text2) => reply({ t: "ok", text: text2 });
    const text = (v, n) => d.filter(String(v || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n));
    switch (m.t) {
      case "pol_state":
        reply(state());
        reply(me(u.id));
        return true;
      case "pol_home": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        const city = String(m.city);
        if (!CITIES.some((c) => c.id === city)) return err("Pick a city.");
        const h = P.homes[u.id];
        if (h && h.n === P.cycle.n && h.city !== city) return err(`Your home city for this election is ${cityName(h.city)}. You can change it next election.`);
        P.homes[u.id] = { city, n: P.cycle.n };
        d.save();
        ok(`Registered to vote in ${cityName(city)}.`);
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_party_create": {
        const why = runCheck(u.id);
        if (why) return err(why);
        if (partyOf(u.id)) return err("Leave your current party first.");
        if (Object.values(P.parties).filter((p) => !p.banned).length >= LIMITS.parties) return err("The register of parties is full.");
        const name = text(m.name, LIMITS.name);
        const short = text(m.short, LIMITS.short).toUpperCase();
        const slogan = text(m.slogan, LIMITS.slogan);
        const manifesto = text(m.manifesto, LIMITS.manifesto);
        if (name.length < 3 || short.length < 2) return err("Give the party a name (3+ letters) and a short code (2\u20136 letters).");
        if (manifesto.length < 40) return err("Write a manifesto of at least a few sentences: what will your party do?");
        const real = realPolitics([name, short, slogan, manifesto].join(" "));
        if (real) return err(`Real-world parties and politicians are not allowed in Fyrus ("${real}"). Make up your own.`);
        if (/\*{3,}/.test(name + short + slogan)) return err("Keep the name and slogan clean.");
        if (Object.values(P.parties).some((p) => !p.banned && (p.name.toLowerCase() === name.toLowerCase() || p.short === short))) return err("A party with that name or code already exists.");
        if (!bank2.transfer(u.id, "treasury", FEES.party, `Party registration: ${name}`)) return err(`Registering a party costs ${FEES.party.toLocaleString("en-US")} FYC.`);
        const id = "pa" + d.rid(6);
        P.parties[id] = { id, name, short, symbol: SYMBOLS.includes(m.symbol) ? m.symbol : SYMBOLS[0], color: HEX2.test(m.color) ? m.color : PARTY_COLORS[0], color2: HEX2.test(m.color2) ? m.color2 : "#ffffff", slogan, manifesto, leader: u.id, members: [u.id], at: Date.now() };
        d.news?.("politics", `New party registered: ${name} (${short}), led by ${d.shown(u.id)}`);
        ok(`${name} is registered. You are the party leader.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_party_edit": {
        const p = partyOf(u.id);
        if (!p || p.leader !== u.id) return err("Only the party leader can edit the party.");
        const slogan = text(m.slogan ?? p.slogan, LIMITS.slogan), manifesto = text(m.manifesto ?? p.manifesto, LIMITS.manifesto);
        const real = realPolitics(slogan + " " + manifesto);
        if (real) return err(`Real-world parties and politicians are not allowed ("${real}").`);
        p.slogan = slogan;
        p.manifesto = manifesto;
        if (SYMBOLS.includes(m.symbol)) p.symbol = m.symbol;
        if (HEX2.test(m.color)) p.color = m.color;
        if (HEX2.test(m.color2)) p.color2 = m.color2;
        ok("Party updated.");
        changed();
        return true;
      }
      case "pol_join": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        if (partyOf(u.id)) return err("You are already in a party. Leave it first.");
        const p = own(P.parties, String(m.party));
        if (!p || p.banned) return err("No such party.");
        if (P.cands.some((k) => k.id === u.id)) return err("Candidates cannot switch parties during an election.");
        p.members.push(u.id);
        d.save();
        ok(`You joined ${p.name}.`);
        pushMe(u.id);
        changed(true);
        const l = d.liveOf(p.leader);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} joined ${p.name}.` });
        return true;
      }
      case "pol_leave": {
        const p = partyOf(u.id);
        if (!p) return err("You are not in a party.");
        if (P.cands.some((k) => k.id === u.id && k.party === p.id)) return err("You are standing for this party in the current election.");
        p.members = p.members.filter((x) => x !== u.id);
        if (p.leader === u.id) {
          if (p.members.length) {
            p.leader = p.members[0];
            const l = d.liveOf(p.leader);
            if (l) d.send(l.ws, { t: "note", text: `You are now the leader of ${p.name}.` });
          } else {
            p.banned = "dissolved";
            d.news?.("politics", `${p.name} has been dissolved`);
          }
        }
        d.save();
        ok(`You left ${p.name}.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_nominate": {
        const why = runCheck(u.id);
        if (why) return err(why);
        if (ph().phase !== "nominations") return err("Nominations are closed. Voting is open \u2014 the next election takes nominations again.");
        const h = P.homes[u.id];
        if (!h || h.n !== P.cycle.n) return err("Register your home city first (Vote tab). You stand for Mayor of your own city.");
        if (P.cands.some((k) => k.id === u.id)) return err("You are already a candidate.");
        const statement = text(m.statement, LIMITS.statement);
        if (statement.length < 20) return err("Write a short statement for voters (20+ characters).");
        const real = realPolitics(statement);
        if (real) return err(`Keep real-world politics out of Fyrus ("${real}").`);
        if (!bank2.transfer(u.id, "treasury", FEES.nominate, `Nomination: Mayor of ${cityName(h.city)}`)) return err(`The nomination fee is ${FEES.nominate.toLocaleString("en-US")} FYC.`);
        const p = m.independent ? void 0 : partyOf(u.id);
        P.cands.push({ id: u.id, city: h.city, party: p?.id, statement, at: Date.now() });
        d.news?.("politics", `${d.shown(u.id)} (${p ? p.short : "independent"}) is standing for Mayor of ${cityName(h.city)}`);
        ok(`You are a candidate for Mayor of ${cityName(h.city)}.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_withdraw": {
        const i = P.cands.findIndex((k) => k.id === u.id);
        if (i < 0) return err("You are not a candidate.");
        if (ph().phase !== "nominations") return err("Voting has started; your name stays on the ballot.");
        P.cands.splice(i, 1);
        ok("You withdrew. The fee is not refunded.");
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_vote": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        if (ph().phase !== "voting") return err("Voting opens when nominations close.");
        const h = P.homes[u.id];
        if (!h || h.n !== P.cycle.n) return err("Choose your home city first.");
        const v = P.votes[u.id] || { at: Date.now() };
        if (m.mayor) {
          if (v.mayor) return err("You already voted for Mayor in this election.");
          const k = P.cands.find((c) => c.id === String(m.mayor) && !c.dq);
          if (!k || k.city !== h.city) return err(`Pick a candidate for Mayor of ${cityName(h.city)}.`);
          v.mayor = k.id;
        }
        if (m.party) {
          if (v.party) return err("You already voted for a party in this election.");
          const p = own(P.parties, String(m.party));
          if (!p || p.banned) return err("No such party.");
          v.party = p.id;
        }
        if (!m.mayor && !m.party) return err("Nothing to vote for.");
        v.at = Date.now();
        P.votes[u.id] = v;
        d.save();
        ok("Your vote is in. Thank you for voting!");
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_propose": {
        const why = runCheck(u.id);
        if (why) return err(why);
        const mineOpen = Object.values(P.proposals).filter((p) => p.by === u.id && !p.closed).length;
        if (mineOpen >= LIMITS.openProposals) return err(`You can have ${LIMITS.openProposals} open proposals at a time.`);
        const title = text(m.title, LIMITS.proposal), body = text(m.body, LIMITS.proposalBody);
        if (title.length < 10) return err("Give the proposal a clear question (10+ characters).");
        const real = realPolitics(title + " " + body);
        if (real) return err(`Keep real-world politics out of Fyrus ("${real}").`);
        if (!bank2.transfer(u.id, "treasury", FEES.proposal, `Citizens' proposal: ${title.slice(0, 40)}`)) return err(`A proposal costs ${FEES.proposal} FYC.`);
        const id = "pr" + d.rid(6);
        P.proposals[id] = { id, by: u.id, title, body, at: Date.now(), ends: Date.now() + PROPOSAL_MS(), yes: [], no: [] };
        const old = Object.values(P.proposals).sort((a, b) => b.at - a.at).slice(80);
        old.forEach((p) => delete P.proposals[p.id]);
        d.news?.("politics", `New citizens' proposal: ${title}`);
        ok("Proposal published. Voting is open for 3 days.");
        changed();
        return true;
      }
      case "pol_pvote": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        const p = own(P.proposals, String(m.id));
        if (!p || p.closed) return err("That proposal is closed.");
        if (p.yes.includes(u.id) || p.no.includes(u.id)) return err("You already voted on this proposal.");
        (m.yes ? p.yes : p.no).push(u.id);
        d.save();
        ok("Vote counted.");
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_dq": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        const k = P.cands.find((c) => c.id === String(m.id));
        if (!k) return err("No such candidate.");
        k.dq = d.clean(m.reason, 120) || "Vote buying";
        for (const v of Object.values(P.votes)) if (v.mayor === k.id) delete v.mayor;
        d.news?.("court", `Court disqualifies ${d.shown(k.id)} from the Mayor race in ${cityName(k.city)}: ${k.dq}`);
        ok("Candidate disqualified; their votes are void.");
        changed();
        return true;
      }
      case "pol_party_ban": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        const p = own(P.parties, String(m.id));
        if (!p) return err("No such party.");
        p.banned = d.clean(m.reason, 120) || "Breaking election rules";
        for (const v of Object.values(P.votes)) if (v.party === p.id) delete v.party;
        d.news?.("court", `Court deregisters ${p.name}: ${p.banned}`);
        ok("Party deregistered.");
        changed();
        return true;
      }
      case "pol_close": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        closeElection();
        return true;
      }
    }
    return true;
  }
  function titleOf(id) {
    const r = P.results[0];
    if (!r) return "";
    const city = Object.entries(r.mayors).find(([, m]) => m?.id === id)?.[0];
    if (city) return `Mayor of ${cityName(city)}`;
    return Object.values(r.mps || {}).some((l) => l.some((x) => x.id === id)) ? "Member of Parliament" : "";
  }
  return { onMessage: onMessage2, state, titleOf, closeElection, tick };
}

// src/data/services.ts
var E = Math.PI / 2;
var W = -Math.PI / 2;
var N = Math.PI;
var S = 0;
var CIVIC = [
  {
    id: "hospital",
    name: "Fyrus General Hospital",
    kind: "civic",
    x: -384,
    z: -192,
    face: E,
    color: "#e5484d",
    sub: "Emergency \xB7 clinics \xB7 first aid",
    w: 30,
    d: 22,
    interior: true,
    job: { title: "Nurse shift", pay: 110, stations: ["Check the patient in bed 1", "Check the patient in bed 2", "Bring the first-aid kit", "Update charts at reception", "Restock the medicine cart"] },
    actions: ["checkup", "firstaid"]
  },
  {
    id: "police",
    name: "Fyrus Police Station",
    kind: "civic",
    x: -384,
    z: -128,
    face: E,
    color: "#2f6fe0",
    sub: "Help desk \xB7 lost & found \xB7 reports",
    w: 26,
    d: 20,
    interior: true,
    job: { title: "Community officer shift", pay: 100, stations: ["Answer the help-desk phone", "Log a lost-and-found item", "Check the city camera wall", "Brief the patrol team", "File a visitor report"] },
    actions: ["report", "lost"]
  },
  {
    id: "fire",
    name: "Fyrus Fire Station",
    kind: "civic",
    x: -384,
    z: -64,
    face: E,
    color: "#ff5a2a",
    sub: "Fire & rescue \xB7 safety drills",
    w: 28,
    d: 22,
    interior: true,
    job: { title: "Fire crew drill", pay: 105, stations: ["Check the hoses", "Wash the fire engine", "Test the alarm panel", "Pack the rescue kit", "Slide down the pole"] },
    actions: ["safety"]
  },
  {
    id: "post",
    name: "Fyrus Post Office",
    kind: "civic",
    x: -384,
    z: 0,
    face: E,
    color: "#ffd23f",
    sub: "Postcards \xB7 parcels \xB7 mailboxes",
    w: 24,
    d: 18,
    interior: true,
    job: { title: "Mail sorting shift", pay: 80, stations: ["Sort letters A\u2013M", "Sort letters N\u2013Z", "Weigh a parcel", "Load the delivery van", "Stamp the outgoing mail"] },
    actions: ["postcard", "mailbox"]
  },
  {
    id: "library",
    name: "Fyrus Public Library",
    kind: "civic",
    x: -384,
    z: 64,
    face: E,
    color: "#8b5a2b",
    sub: "Classic books \xB7 quiet reading \xB7 study tables",
    w: 28,
    d: 22,
    interior: true,
    job: { title: "Librarian shift", pay: 75, stations: ["Shelve returned books", "Help a reader find a book", "Scan the returns", "Tidy the study tables", "Set up the story corner"] },
    actions: ["books"]
  },
  {
    id: "pharmacy",
    name: "Fyrus Pharmacy",
    kind: "civic",
    x: -384,
    z: 128,
    face: E,
    color: "#45e0ae",
    sub: "Health tips \xB7 vitamins \xB7 first-aid kits",
    w: 20,
    d: 16,
    interior: true,
    job: { title: "Pharmacy assistant shift", pay: 70, stations: ["Stock the vitamins shelf", "Help a customer at the counter", "Check expiry dates", "Pack a first-aid kit"] },
    items: ["vitamins", "firstaidkit", "sunscreen", "water"]
  }
];
var BZ = (i) => ({ x: 174 + i % 4 * 12, z: i < 4 ? 80 : 48, face: i < 4 ? N : S });
var BAZAAR = [
  { id: "mobile", name: "Orbit Mobiles & Laptops", sub: "Phones, laptops, tablets (Fyrus brands)", color: "#4da3ff", items: ["orbitx2", "novapad", "skybook", "earbuds"], job: { title: "Sales shift", pay: 70, stations: ["Demo a phone", "Set up a laptop", "Restock the cases", "Help at the till"] } },
  { id: "wifi", name: "Lumen Wi-Fi & Net Caf\xE9", sub: "Wi-Fi passes, gaming PCs, printing", color: "#7fd1ff", items: ["wifiday", "wifimonth", "print"], job: { title: "Caf\xE9 shift", pay: 60, stations: ["Reset a gaming PC", "Sell a Wi-Fi pass", "Fix the printer"] } },
  { id: "snacks", name: "Crunch Snack Corner", sub: "Chips, chocolate, juices", color: "#ff9a3c", items: ["chips", "choco", "juice", "candy"], job: { title: "Snack shop shift", pay: 55, stations: ["Stock the chip shelf", "Fill the drinks fridge", "Help at the till"] } },
  { id: "bartan", name: "Bartan House", sub: "Kitchenware, pots, tea sets", color: "#c0c6cc", items: ["teaset", "pot", "thermos"], job: { title: "Shop helper shift", pay: 55, stations: ["Polish the pots", "Pack a tea set", "Arrange the window"] } },
  { id: "barber", name: "Sharp Edge Barber", sub: "Haircuts, beard trims, styling", color: "#1b1d22", actions: ["haircut"], job: { title: "Barber shift", pay: 75, stations: ["Sweep the floor", "Prepare the chair", "Trim a beard", "Wash the tools"] } },
  { id: "parlour", name: "Glow Beauty Parlour", sub: "Hair, makeup, nails", color: "#e05a8a", actions: ["makeover"], job: { title: "Salon shift", pay: 75, stations: ["Set up the mirror station", "Mix a hair colour", "Paint nails", "Fold the towels"] } },
  { id: "diner", name: "Sky Diner", sub: "Restaurant: burgers, karahi, pasta", color: "#2f5d50", items: ["burger", "karahi", "pasta", "lemonade"], job: { title: "Waiter shift", pay: 80, stations: ["Take an order at table 1", "Take an order at table 2", "Serve from the kitchen", "Clear a table"] } },
  { id: "books", name: "Page Turner Books", sub: "New books, notebooks, pens", color: "#b06ad9", items: ["notebook", "pen", "novel"], job: { title: "Bookshop shift", pay: 55, stations: ["Shelve new books", "Wrap a gift", "Help at the till"] } }
].map((s, i) => ({ ...s, ...BZ(i), kind: "shop", w: 10, d: 9, interior: true }));
var FS = (i) => ({ x: 112 + i % 5 * 9, z: i < 5 ? -200 : -184, face: i < 5 ? S : N });
var FOOD = [
  { id: "biryani", name: "Biryani House", color: "#d4a64a", items: ["biryani", "raita"] },
  { id: "chaat", name: "Chaat Corner", color: "#ff9a3c", items: ["golgappa", "chaat"] },
  { id: "bbq", name: "BBQ Tikka", color: "#8b3a2e", items: ["tikka", "kebab"] },
  { id: "noodles", name: "Wok Noodles", color: "#e5484d", items: ["noodles", "dumplings"] },
  { id: "shawarma", name: "Shawarma Express", color: "#c96f4a", items: ["shawarma", "fries"] },
  { id: "chai", name: "Chai Dhaba", color: "#7a5a3c", items: ["chai", "paratha"] },
  { id: "icecream", name: "Frost Ice Cream", color: "#7fd1ff", items: ["cone", "kulfi"] },
  { id: "juice", name: "Fresh Juice Bar", color: "#45e0ae", items: ["mango", "sugarcane"] },
  { id: "pizza", name: "Slice Pizza", color: "#ffd23f", items: ["pizza", "garlicbread"] },
  { id: "halwa", name: "Halwa Puri Point", color: "#e6a23c", items: ["halwapuri", "lassi"] }
].map((s, i) => ({ ...s, ...FS(i), kind: "stall", sub: "Food Street stall", w: 7, d: 4, interior: false, job: { title: "Cook shift", pay: 50, stations: ["Prepare the food", "Serve a customer", "Clean the counter"] } }));
var FAITH = [
  { id: "mosque", name: "Fyrus Grand Mosque", x: -128, z: 256, face: E, color: "#2f6a4f", sub: "Masjid \xB7 open for prayer and visitors" },
  { id: "church", name: "St. Light Church", x: -64, z: 256, face: E, color: "#8a9bb0", sub: "Church \xB7 services and quiet prayer" },
  { id: "mandir", name: "Shanti Mandir", x: -64, z: 312, face: N, color: "#ff9a3c", sub: "Hindu temple \xB7 aarti and festivals" },
  { id: "gurdwara", name: "Gurdwara Sahib", x: 64, z: 312, face: N, color: "#d4a64a", sub: "Gurdwara \xB7 free langar for everyone" },
  { id: "temple", name: "Lotus Buddhist Temple", x: 64, z: 256, face: W, color: "#c0392b", sub: "Buddhist temple \xB7 meditation" },
  { id: "synagogue", name: "Beit Shalom Synagogue", x: 128, z: 256, face: W, color: "#3a5a7a", sub: "Synagogue \xB7 prayer and community" }
].map((s) => ({ ...s, kind: "faith", w: 22, d: 18, interior: true }));
var SERVICES = [...CIVIC, ...BAZAAR, ...FOOD, ...FAITH];
var svcById = (id) => SERVICES.find((s) => s.id === id);
var SERVICE_BLOCKS = [
  ...CIVIC.map((s) => ({ x: s.x, z: s.z, r: 26 })),
  { x: 192, z: 64, r: 34 },
  { x: 130, z: -192, r: 32 },
  ...FAITH.map((s) => ({ x: s.x, z: s.z, r: 18 }))
];
function doorOf(s, extra = 2) {
  const d = (s.d || 10) / 2 + extra;
  return { x: s.x + Math.sin(s.face) * d, z: s.z + Math.cos(s.face) * d };
}
var ITEMS = {
  vitamins: { name: "Vitamins", price: 8, kind: "item", icon: "\u{1F48A}" },
  firstaidkit: { name: "First-aid kit", price: 25, kind: "item", icon: "\u{1FA79}" },
  sunscreen: { name: "Sunscreen", price: 10, kind: "item", icon: "\u{1F9F4}" },
  water: { name: "Water bottle", price: 2, kind: "food", icon: "\u{1F4A7}" },
  orbitx2: { name: "Orbit X2 phone", price: 900, kind: "gadget", icon: "\u{1F4F1}" },
  novapad: { name: "Nova Pad tablet", price: 650, kind: "gadget", icon: "\u{1F4F2}" },
  skybook: { name: "SkyBook laptop", price: 1400, kind: "gadget", icon: "\u{1F4BB}" },
  earbuds: { name: "Pulse earbuds", price: 180, kind: "gadget", icon: "\u{1F3A7}" },
  wifiday: { name: "Wi-Fi day pass", price: 5, kind: "item", icon: "\u{1F4F6}" },
  wifimonth: { name: "Wi-Fi month pass", price: 60, kind: "item", icon: "\u{1F4E1}" },
  print: { name: "Printed poster", price: 3, kind: "item", icon: "\u{1F5A8}" },
  chips: { name: "Chips", price: 3, kind: "food", icon: "\u{1F954}" },
  choco: { name: "Chocolate", price: 4, kind: "food", icon: "\u{1F36B}" },
  juice: { name: "Juice box", price: 3, kind: "food", icon: "\u{1F9C3}" },
  candy: { name: "Candy", price: 2, kind: "food", icon: "\u{1F36C}" },
  teaset: { name: "Tea set", price: 120, kind: "item", icon: "\u{1FAD6}" },
  pot: { name: "Cooking pot", price: 70, kind: "item", icon: "\u{1F372}" },
  thermos: { name: "Thermos", price: 35, kind: "item", icon: "\u{1F964}" },
  burger: { name: "Sky burger", price: 18, kind: "food", icon: "\u{1F354}" },
  karahi: { name: "Chicken karahi", price: 28, kind: "food", icon: "\u{1F35B}" },
  pasta: { name: "Pasta", price: 20, kind: "food", icon: "\u{1F35D}" },
  lemonade: { name: "Mint lemonade", price: 6, kind: "food", icon: "\u{1F34B}" },
  notebook: { name: "Notebook", price: 6, kind: "item", icon: "\u{1F4D3}" },
  pen: { name: "Pen", price: 2, kind: "item", icon: "\u{1F58A}" },
  novel: { name: "Novel", price: 22, kind: "item", icon: "\u{1F4D5}" },
  biryani: { name: "Biryani", price: 14, kind: "food", icon: "\u{1F35B}" },
  raita: { name: "Raita", price: 3, kind: "food", icon: "\u{1F963}" },
  golgappa: { name: "Gol gappay", price: 6, kind: "food", icon: "\u{1F95F}" },
  chaat: { name: "Papri chaat", price: 7, kind: "food", icon: "\u{1F957}" },
  tikka: { name: "Chicken tikka", price: 15, kind: "food", icon: "\u{1F357}" },
  kebab: { name: "Seekh kebab", price: 12, kind: "food", icon: "\u{1F362}" },
  noodles: { name: "Wok noodles", price: 12, kind: "food", icon: "\u{1F35C}" },
  dumplings: { name: "Dumplings", price: 10, kind: "food", icon: "\u{1F95F}" },
  shawarma: { name: "Shawarma", price: 10, kind: "food", icon: "\u{1F32F}" },
  fries: { name: "Fries", price: 5, kind: "food", icon: "\u{1F35F}" },
  chai: { name: "Doodh patti chai", price: 3, kind: "food", icon: "\u2615" },
  paratha: { name: "Paratha", price: 5, kind: "food", icon: "\u{1FAD3}" },
  cone: { name: "Ice cream cone", price: 5, kind: "food", icon: "\u{1F366}" },
  kulfi: { name: "Kulfi", price: 5, kind: "food", icon: "\u{1F361}" },
  mango: { name: "Mango shake", price: 7, kind: "food", icon: "\u{1F96D}" },
  sugarcane: { name: "Sugarcane juice", price: 4, kind: "food", icon: "\u{1F964}" },
  pizza: { name: "Pizza slice", price: 8, kind: "food", icon: "\u{1F355}" },
  garlicbread: { name: "Garlic bread", price: 5, kind: "food", icon: "\u{1F956}" },
  halwapuri: { name: "Halwa puri", price: 9, kind: "food", icon: "\u{1F958}" },
  lassi: { name: "Lassi", price: 5, kind: "food", icon: "\u{1F95B}" }
};
var SERVICE_PRICES = { haircut: 20, makeover: 30, postcard: 5 };
var JOB_RULES = { tasks: 5, minTaskMs: 2500, dailyShifts: 6, cooldownMs: 9e4 };

// server/jobs.ts
var day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var DAILY = () => +(process.env.JOB_DAILY || JOB_RULES.dailyShifts);
var COOLDOWN = () => +(process.env.JOB_COOLDOWN_MS ?? JOB_RULES.cooldownMs);
var MIN_TASK = () => +(process.env.JOB_MIN_TASK_MS ?? JOB_RULES.minTaskMs);
// 28.7 career levels (shared with the AI citizens' answers)
var CAREER_LEVELS = [
  { id: "trainee", name: "Trainee", shifts: 0, certs: 0, pct: 0 },
  { id: "junior", name: "Junior worker", shifts: 5, certs: 0, pct: 3 },
  { id: "skilled", name: "Skilled worker", shifts: 15, certs: 1, pct: 6 },
  { id: "senior", name: "Senior worker", shifts: 40, certs: 2, pct: 10 }
];
function createJobs(d) {
  if (!d.db.jobs) {
    d.db.jobs = { bag: {}, day: {}, mail: {}, totals: { shifts: 0, paid: 0, sold: 0 } };
    d.save();
  }
  const J = d.db.jobs;
  const bank2 = d.bank;
  const shifts = /* @__PURE__ */ new Map();
  // 26.4 shop inventory: each shop item has limited stock that is delivered back over time (one unit per item every
  // RESTOCK_MS) and topped up when a citizen finishes a work shift at that shop. Computed lazily on access.
  const RESTOCK_MS = () => +(process.env.RESTOCK_MS || 12e4);
  const STOCK_MAX = { food: 40, item: 20, gadget: 5 };
  const maxOf = (id) => STOCK_MAX[ITEMS[id]?.kind] ?? 15;
  J.stock ||= {};
  // 26.5 receipts and refunds: every shop purchase gets a receipt; unused goods can be returned at the same shop within
  // REFUND_MS (default 10 min) for the full price; the units go back on the shelf
  J.receipts ||= {};
  J.streak ||= {};
  J.rseq ||= 1;
  // 28.7 career pathways: lifetime finished shifts + earned course certificates give a career level. Its bonus counts
  // inside the existing 35 % bonus cap (streak 25 + steady hands 10), so the most one shift can pay never rises and the
  // treasury mint caps (26.2) still apply. Promotions are computed on the server only. Kill switch P28_OFF=career.
  J.career ||= {};
  const CAREER = CAREER_LEVELS;
  const BONUS_CAP = 35;
  const CAREER_OFF = () => /(^|,)(career|all)(,|$)/.test(process.env.P28_OFF || "");
  function careerOf(id) {
    const c = J.career[id] || { shifts: 0 }, certs = d.certCount ? d.certCount(id) : 0;
    let i = 0;
    for (let k = CAREER.length - 1; k > 0; k--) if (c.shifts >= CAREER[k].shifts && certs >= CAREER[k].certs) { i = k; break; }
    const lv = CAREER[i], nx = CAREER[i + 1] || null;
    return { level: lv.id, name: lv.name, pct: CAREER_OFF() ? 0 : lv.pct, shifts: c.shifts, certs, off: CAREER_OFF(),
      next: nx ? { name: nx.name, pct: nx.pct, needShifts: Math.max(0, nx.shifts - c.shifts), needCerts: Math.max(0, nx.certs - certs) } : null };
  }
  const REFUND_MS = () => +(process.env.REFUND_MS || 6e5);
  function stockOf(svcId) {
    const s = svcById(svcId);
    if (!s) return null;
    const now = Date.now(), st = J.stock[svcId] ||= { items: {}, at: now };
    for (const id of s.items || []) if (st.items[id] == null) st.items[id] = maxOf(id);
    const units = Math.floor((now - st.at) / RESTOCK_MS());
    if (units > 0) {
      for (const id of s.items || []) st.items[id] = Math.min(maxOf(id), st.items[id] + units);
      st.at += units * RESTOCK_MS();
    }
    if ((s.items || []).every((id) => st.items[id] >= maxOf(id))) st.at = now;
    return st;
  }
  const stockMsg = (svcId) => {
    const st = stockOf(svcId);
    return { t: "shop_stock", svc: svcId, stock: st ? { ...st.items } : {}, max: Object.fromEntries((svcById(svcId)?.items || []).map((id) => [id, maxOf(id)])), nextIn: st ? Math.max(0, st.at + RESTOCK_MS() - Date.now()) : 0 };
  };
  const today = (id) => {
    const t = J.day[id];
    if (!t || t.day !== day()) J.day[id] = { day: day(), shifts: 0, earned: 0, last: t?.last || 0 };
    return J.day[id];
  };
  function atPlace(l, id) {
    const s = svcById(id);
    if (!s) return false;
    if (s.interior) return l.scene === "gov:svc:" + id;
    const p = doorOf(s, 0);
    return (l.scene || "plaza") === "plaza" && Math.hypot((l.x || 0) - p.x, (l.z || 0) - p.z) < 16;
  }
  const me = (id) => {
    const t = today(id);
    const sh = shifts.get(id);
    const rnow = Date.now();
    return { t: "jobs_me", career: careerOf(id), receipts: (J.receipts[id] || []).slice(-12).reverse().map((r) => ({ ...r, refundable: !r.refunded && rnow - r.at <= REFUND_MS() && (J.bag[id]?.[r.item] || 0) >= r.q, left: Math.max(0, r.at + REFUND_MS() - rnow) })), bag: J.bag[id] || {}, shifts: t.shifts, earned: t.earned, cap: DAILY(), next: Math.max(0, (t.last || 0) + COOLDOWN() - Date.now()), shift: sh ? { svc: sh.svc, step: sh.step, total: sh.order.length, station: sh.order[sh.step] } : null, mail: (J.mail[id] || []).slice(-30).reverse() };
  };
  const push = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, me(id));
  };
  // 26.2: wages come from the treasury; Central Bank fallback is capped per day, the rest is owed (paid late)
  const pay = (to, n, memo) => bank2.payFromTreasury(to, n, memo);
  function onMessage2(L, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("job_") || m.t.startsWith("shop_") || m.t === "jobs_me" || m.t.startsWith("post_"))) return false;
    const u = L.u;
    const reply = (x) => d.send(L.ws, x);
    const err = (text) => {
      reply({ t: "err", text });
      return true;
    };
    const ok = (text) => reply({ t: "ok", text });
    const banned = !!bank2.acct(u.id).banned;
    switch (m.t) {
      case "jobs_me":
        reply(me(u.id));
        return true;
      case "job_start": {
        const s = svcById(String(m.svc));
        if (!s?.job) return err("There is no job here.");
        if (banned) return err("This account is suspended.");
        if (!atPlace(L, s.id)) return err(s.interior ? `Go inside ${s.name} to start the shift.` : `Stand at ${s.name} to start the shift.`);
        const t = today(u.id);
        if (t.shifts >= DAILY()) return err(`You've done ${DAILY()} shifts today. Come back tomorrow!`);
        const wait = (t.last || 0) + COOLDOWN() - Date.now();
        if (wait > 0) return err(`Take a short break first \u2014 next shift in ${Math.ceil(wait / 1e3)} s.`);
        const n = Math.min(JOB_RULES.tasks, Math.max(3, s.job.stations.length));
        const order = [];
        let prev = -1;
        for (let i = 0; i < n; i++) {
          let k = Math.floor(Math.random() * s.job.stations.length);
          if (k === prev) k = (k + 1) % s.job.stations.length;
          order.push(k);
          prev = k;
        }
        shifts.set(u.id, { svc: s.id, order, step: 0, last: Date.now(), started: Date.now() });
        ok(`${s.job.title} started: ${s.job.stations[order[0]]}.`);
        push(u.id);
        return true;
      }
      case "job_task": {
        const sh = shifts.get(u.id);
        if (!sh) return err("You are not on a shift.");
        const s = svcById(sh.svc);
        if (!atPlace(L, s.id)) return err(`You left ${s.name}. Go back to finish the shift.`);
        if (+m.station !== sh.order[sh.step]) {
          sh.mistakes = (sh.mistakes || 0) + 1;
          return err(`That's not your task. Now: ${s.job.stations[sh.order[sh.step]]}.`);
        }
        if (Date.now() - sh.last < MIN_TASK()) return err("Take your time \u2014 do the task properly.");
        sh.step++;
        sh.last = Date.now();
        if (sh.step < sh.order.length) {
          reply({ t: "note", text: `Done (${sh.step}/${sh.order.length}). Next: ${s.job.stations[sh.order[sh.step]]}.` });
          push(u.id);
          return true;
        }
        shifts.delete(u.id);
        const t = today(u.id);
        // 26.6 rewards, all computed here: base wage + work-streak bonus (+5 % per consecutive day, max +25 %)
        // + steady-hands bonus (+10 % when no wrong-task mistakes in this shift). Paid from the treasury (26.2).
        const sk = J.streak[u.id] ||= { day: "", n: 0 };
        if (sk.day !== day()) {
          const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
          sk.n = sk.day === y ? sk.n + 1 : 1;
          sk.day = day();
        }
        const base = s.job.pay, streakPct = Math.min(25, (sk.n - 1) * 5), cleanPct = sh.mistakes ? 0 : 10;
        const car0 = careerOf(u.id), careerPct = Math.max(0, Math.min(car0.pct, BONUS_CAP - streakPct - cleanPct));
        const total = Math.round(base * (1 + (streakPct + cleanPct + careerPct) / 100));
        if (!CAREER_OFF()) { const cr = J.career[u.id] ||= { shifts: 0, byPlace: {} }; cr.shifts++; cr.byPlace[s.id] = (cr.byPlace[s.id] || 0) + 1; }
        const car1 = careerOf(u.id), promoted = car1.level !== car0.level ? car1.name : null;
        t.shifts++;
        t.earned += total;
        t.last = Date.now();
        J.totals.shifts++;
        J.totals.paid += total;
        const paid = pay(u.id, total, `${s.job.title} at ${s.name}${streakPct || cleanPct || careerPct ? ` (+${streakPct + cleanPct + careerPct}% bonus)` : ""}`);
        // 26.4: a finished shift restocks the shop (+5 of every item, up to the shelf size)
        const st5 = stockOf(s.id);
        if (st5) for (const id of s.items || []) st5.items[id] = Math.min(maxOf(id), st5.items[id] + 5);
        d.xp?.(u.id, 40);
        d.save();
        reply({ t: "job_done", svc: s.id, pay: total, base, streakDays: sk.n, streakPct, cleanPct, careerPct, career: car1.off ? null : car1.name, promoted, owed: paid?.owed || 0, title: s.job.title });
        push(u.id);
        return true;
      }
      case "job_quit": {
        if (shifts.delete(u.id)) ok("Shift cancelled. No pay for unfinished shifts.");
        push(u.id);
        return true;
      }
      case "shop_buy": {
        const s = svcById(String(m.svc));
        const id = String(m.item);
        const it = ITEMS[id];
        if (!s || !it || !(s.items || []).includes(id)) return err("That is not sold here.");
        if (!atPlace(L, s.id)) return err(`Visit ${s.name} to buy this.`);
        const q = Math.max(1, Math.min(10, Math.round(+m.qty || 1)));
        const st = stockOf(s.id);
        if (st.items[id] < q) {
          reply(stockMsg(s.id));
          return err(st.items[id] > 0 ? `Only ${st.items[id]} left.` : `${it.name} is sold out. Next delivery in about ${Math.max(1, Math.ceil((st.at + RESTOCK_MS() - Date.now()) / 6e4))} min.`);
        }
        if (!bank2.transfer(u.id, "treasury", it.price * q, `${s.name}: ${q} \xD7 ${it.name}`)) return err(`You need ${it.price * q} FYC.`);
        st.items[id] -= q;
        st.at = Math.min(st.at, Date.now());
        J.totals.units = (J.totals.units || 0) + q;
        const rl = J.receipts[u.id] ||= [];
        rl.push({ id: J.rseq++, svc: s.id, item: id, q, price: it.price * q, at: Date.now() });
        if (rl.length > 30) rl.splice(0, rl.length - 30);
        const bag = J.bag[u.id] ||= {};
        bag[id] = Math.min(999, (bag[id] || 0) + q);
        J.totals.sold += it.price * q;
        d.save();
        ok(it.kind === "food" ? `${it.icon} ${it.name} \u2014 in your bag. Eat it any time.` : `${it.icon} ${it.name} is yours.`);
        push(u.id);
        reply(stockMsg(s.id));
        return true;
      }
      case "shop_refund": {
        const rl = J.receipts[u.id] || [];
        const r = rl.find((x) => x.id === Math.round(+m.receipt));
        if (!r) return err("No such receipt.");
        if (r.refunded) return err("This purchase was already refunded.");
        if (Date.now() - r.at > REFUND_MS()) return err(`Returns are accepted within ${Math.max(1, Math.round(REFUND_MS() / 6e4))} minutes of purchase.`);
        const s = svcById(r.svc);
        if (!atPlace(L, r.svc)) return err(`Bring it back to ${s?.name || "the shop"}.`);
        const bag = J.bag[u.id] || {};
        if ((bag[r.item] || 0) < r.q) return err("You no longer have all of it (used or eaten items can't be returned).");
        const paid = bank2.transfer("treasury", u.id, r.price, `Refund: ${r.q} \xD7 ${ITEMS[r.item]?.name || r.item} at ${s?.name || r.svc}`) ? r.price : bank2.payFromTreasury(u.id, r.price, `Refund: ${r.q} \xD7 ${ITEMS[r.item]?.name || r.item}`).paid;
        bag[r.item] -= r.q;
        if (!bag[r.item]) delete bag[r.item];
        const st = stockOf(r.svc);
        if (st) st.items[r.item] = Math.min(maxOf(r.item), st.items[r.item] + r.q);
        r.refunded = Date.now();
        J.totals.refunded = (J.totals.refunded || 0) + r.price;
        d.save();
        ok(paid >= r.price ? `Refunded ${r.price} FYC.` : `Refund of ${r.price} FYC: ${paid} paid now, the rest as soon as the treasury can.`);
        push(u.id);
        reply(stockMsg(r.svc));
        return true;
      }
      case "shop_stock": {
        const s = svcById(String(m.svc));
        if (s) reply(stockMsg(s.id));
        return true;
      }
      case "shop_use": {
        const id = String(m.item);
        const it = ITEMS[id];
        const bag = J.bag[u.id] || {};
        if (!it || !bag[id]) return err("Not in your bag.");
        if (it.kind !== "food") return err(`${it.name} stays in your bag.`);
        bag[id]--;
        if (!bag[id]) delete bag[id];
        d.save();
        reply({ t: "ate", item: id });
        push(u.id);
        return true;
      }
      case "shop_service": {
        const s = svcById(String(m.svc));
        const k = String(m.kind);
        if (!s || !(s.actions || []).includes(k)) return err("Not offered here.");
        if (!atPlace(L, s.id)) return err(`Visit ${s.name} first.`);
        if (!bank2.transfer(u.id, "treasury", SERVICE_PRICES[k], `${s.name}: ${k}`)) return err(`A ${k} costs ${SERVICE_PRICES[k]} FYC.`);
        reply({ t: "service_ok", kind: k, svc: s.id });
        return true;
      }
      case "post_send": {
        if (!atPlace(L, "post")) return err("Postcards are sent from the Post Office.");
        const to = d.findByNumber(String(m.number || ""));
        if (!to) return err("No citizen with that +2040 number.");
        if (to.id === u.id) return err("Send it to someone else.");
        const text = d.filter(String(m.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 280));
        if (text.length < 2) return err("Write something on the postcard.");
        const gift = Math.max(0, Math.min(5e3, Math.round(+m.gift || 0)));
        if (!bank2.transfer(u.id, "treasury", SERVICE_PRICES.postcard, "Post Office: postcard stamp")) return err(`A stamp costs ${SERVICE_PRICES.postcard} FYC.`);
        let paid = 0;
        if (gift) {
          if (bank2.transfer(u.id, to.id, gift, `Gift by post from ${d.shown(u.id)}`)) paid = gift;
          else ok("Postcard sent, but the gift could not be paid (not enough FYC).");
        }
        const box = J.mail[to.id] ||= [];
        box.push({ from: u.id, fromName: d.shown(u.id), text, gift: paid, at: Date.now() });
        if (box.length > 60) box.splice(0, box.length - 60);
        d.save();
        const l = d.liveOf(to.id);
        if (l) {
          d.send(l.ws, { t: "note", text: `\u{1F4EC} A postcard from ${d.shown(u.id)}${paid ? ` with ${gift} FYC` : ""}. Open the Services \u2192 Mailbox.` });
          push(to.id);
        }
        ok(`Postcard on its way to ${d.shown(to.id)}.`);
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, atPlace, me, services: SERVICES.length, stockInfo: (svcId) => { const st = stockOf(svcId); return st ? { ...st.items } : null; } };
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
// 31.1 backup retention: the daily pruner only touches its OWN daily files (fyrus-YYYY-MM-DD.json.gz). It used to
// match every "fyrus-*" name in /data/backups, so each day it wiped the 10-minute rolling crash copies
// (fyrus-<ms>.json sort first) and later the oldest historical dailies. KEEP_DAILY_BACKUPS=0 (default) keeps every
// daily (~110 KB each, ~40 MB a year); a positive number keeps that many newest dailies, and BACKUP_PROTECT_BEFORE
// (default 2026-10-31) shields older dailies (the v52 history) from pruning in any case.
var KEEP_DAILY = Math.max(0, Number(process.env.KEEP_DAILY_BACKUPS || 0) | 0);
var PROTECT_BEFORE = String(process.env.BACKUP_PROTECT_BEFORE || "2026-10-31");
var DAILY_RE = /^fyrus-(\d{4}-\d{2}-\d{2})\.json\.gz$/;
var pruneDaily = (names) => {
  if (!KEEP_DAILY) return [];
  const daily = names.filter((x) => DAILY_RE.test(x)).sort();
  return daily.slice(0, Math.max(0, daily.length - KEEP_DAILY)).filter((x) => x.match(DAILY_RE)[1] >= PROTECT_BEFORE);
};
var day2 = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var EVENTS = /^(goal:[a-z]+|tour|now_open|ride:[a-z]+|drive|fly|signup_prompt|lite_on)$/;
function createOps(d) {
  if (!d.db.ops) {
    d.db.ops = { errors: [], stats: {} };
    d.save();
  }
  const O = d.db.ops;
  const today = () => O.stats[day2()] ||= { visits: 0, newUsers: 0, signups: 0, peak: 0, events: {} };
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
      const f = path.join(bdir, `fyrus-${day2()}.json.gz`);
      fs.writeFileSync(f, zlib.gzipSync(fs.readFileSync(d.dbFile())));
      pruneDaily(fs.readdirSync(bdir)).forEach((x) => fs.unlinkSync(path.join(bdir, x)));
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
    if (!backups().some((b) => b.file.includes(day2()))) backupNow();
  }, 2e4);
  setInterval(() => {
    if (!backups().some((b) => b.file.includes(day2()))) backupNow();
  }, 60 * 6e4);
  if (O.stats) {
    const keys = Object.keys(O.stats).sort();
    keys.slice(0, Math.max(0, keys.length - 90)).forEach((k) => delete O.stats[k]);
  }
  const errHits = /* @__PURE__ */ new Map();
  const devTelemetry = [];
  const devErrors = [];
  function http2(req, res, p, ip, auth) {
    if (p === "/api/dev/errors" && (req.method === "POST" || req.method === "GET")) {
      const local = ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
      if (!local || req.headers["x-fyrus-dev-metrics"] !== "1") { res.writeHead(404); return res.end(); }
      if (req.method === "GET") { res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }); return res.end(JSON.stringify({ errors: devErrors.slice(-100) })); }
      let raw = "";
      req.on("data", (c) => { raw += c; if (raw.length > 16384) req.destroy(); });
      req.on("end", () => { try { const b = JSON.parse(raw || "{}"); devErrors.push({ at: Date.now(), kind: d.clean(b.kind, 40), message: d.clean(b.message, 500), stack: d.clean(b.stack, 1600), url: d.clean(b.url, 160) }); if (devErrors.length > 100) devErrors.splice(0, devErrors.length - 100); } catch {} res.writeHead(204); res.end(); });
      return true;
    }
    if (p === "/api/dev/telemetry" && (req.method === "POST" || req.method === "GET")) {
      const local = ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
      if (!local || req.headers["x-fyrus-dev-metrics"] !== "1") { res.writeHead(404); return res.end(); }
      if (req.method === "GET") { res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }); return res.end(JSON.stringify({ samples: devTelemetry.slice(-120) })); }
      let raw = "";
      req.on("data", (c) => { raw += c; if (raw.length > 32768) req.destroy(); });
      req.on("end", () => { try { const b = JSON.parse(raw || "{}"); devTelemetry.push({ at: Date.now(), scene: d.clean(b.scene, 80), metrics: b.metrics || {}, loadMs: Number.isFinite(b.loadMs) ? b.loadMs : null, errors: Number.isFinite(b.errors) ? b.errors : 0 }); if (devTelemetry.length > 120) devTelemetry.splice(0, devTelemetry.length - 120); } catch {} res.writeHead(204); res.end(); });
      return true;
    }
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
    return { t: "xp", xp: u.xp || 0, today: u.xpDay === day2() ? u.xpToday || 0 : 0, cap: XP_DAILY };
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
      if (u.xpDay !== day2()) {
        u.xpDay = day2();
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
    const target = m.id ? own(d.db.users, String(m.id)) : void 0;
    switch (m.t) {
      // 26.12 economy audit for judges: money-supply audit, farming flags, biggest holders, large transfers, owed wages
      case "admin_econ": {
        const B = d.db.bank || { acct: {}, ledger: [] }, nm = (id) => (d.db.users[id] ? d.shown(id) : id);
        const top = Object.entries(B.acct).map(([id, a]) => ({ id, name: nm(id), bal: a.bal || 0, banned: !!a.banned, strikes: a.strikes || 0 })).sort((x, y) => y.bal - x.bal).slice(0, 15);
        const big = B.ledger.filter((t) => t.amount >= +(process.env.TX_CONFIRM_MIN || 5e3) && t.from !== "escrow" && t.to !== "escrow").slice(-25).reverse().map((t) => ({ ...t, fromName: nm(t.from), toName: nm(t.to) }));
        const flags = Object.entries(B.flags || {}).map(([id, f]) => ({ id, name: nm(id), ...f, senders: (f.senders || []).map(nm) })).sort((x, y) => (x.resolved ? 1 : 0) - (y.resolved ? 1 : 0) || y.at - x.at);
        reply({ t: "admin_econ", audit: globalThis.__fyrusBankAudit ? globalThis.__fyrusBankAudit() : null, top, big, flags, owed: (B.owed || []).slice(0, 25).map((o) => ({ ...o, name: nm(o.to) })) });
        return true;
      }
      case "admin_flag_done": {
        const f = d.db.bank?.flags && own(d.db.bank.flags, String(m.id)) ? d.db.bank.flags[String(m.id)] : null;
        if (!f) return reply({ t: "err", text: "No such flag." }), true;
        f.resolved = { by: d.shown(u.id), at: Date.now(), note: d.clean(m.note, 200) || "reviewed" };
        d.save();
        reply({ t: "ok", text: "Flag marked as reviewed." });
        return true;
      }
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
  return { onMessage: onMessage2, http: http2, bump, track, backupNow, xpMsg, pruneDaily };
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

// --- Education ladder (v32): Fyrus Public School -> Fyrus College -> University of Fyrus ---
// Additive seed for Education City. Adds three verified institutions and nine free courses taught by the
// Fyrus Academy instructors, so certificates are issued automatically (HMAC-signed by edu.mjs) when every
// lesson is passed. Idempotent: it only adds ids that are missing and never edits a citizen's course.
var LADDER = [
  { id: "fy-school", type: "school", name: "Fyrus Public School", tagline: "Step 1 of the ladder: the basics every citizen needs", color: "#45b38a", courses: [
    ["school-digital", "Digital Citizen Basics", "Stay safe online, protect your accounts and treat people well.", ["Online safety", "Passwords", "Digital manners"], [
      ["Your account is your home", "Your account holds your money, messages and work. Use a long passphrase (four or more unrelated words), never reuse it on other sites, and turn on sign-in alerts. Nobody from Fyrus will ever ask for your password.", "Which password is strongest?", ["fyrus123", "Sunflower!", "river candle orbit pepper", "your birthday"], 2],
      ["Think before you share", "Before you post, ask: would I say this to someone's face, and would I be happy if my family read it? Never share your home address, phone number or school with strangers. A screenshot lasts forever.", "Which is safe to share with a stranger?", ["Your home address", "Your favourite book", "Your school name", "Your phone number"], 1],
      ["When something feels wrong", "If a message scares you, asks for money or asks you to keep a secret, stop replying, take a screenshot and report it. Tell a parent or someone you trust. Blocking is not rude; it keeps you safe.", "A stranger asks you to keep your chat secret. What do you do?", ["Keep the secret", "Stop, screenshot and report it", "Send them a photo", "Argue with them"], 1]
    ]],
    ["school-money", "Money and Saving", "Earning, spending, saving and why a budget matters.", ["Budgeting", "Saving", "Needs vs wants"], [
      ["Needs and wants", "A need is something you must have to live and work: food, a home, transport. A want makes life nicer but you can live without it. Pay for needs first, then decide on wants.", "Which one is a need?", ["A new game skin", "Rent for your home", "A second phone", "Concert tickets"], 1],
      ["The 50/30/20 budget", "A simple plan: 50% of what you earn for needs, 30% for wants, 20% for saving. If you earn 1,000, save 200 every month. Small, regular saving grows faster than big promises.", "If you earn 1,000, how much does the 50/30/20 plan save?", ["50", "100", "200", "500"], 2],
      ["Keep a record", "Write down every payment for one month. Most people are surprised where their money goes. In Fyrus your bank history shows every FYC in and out, so you can check it any time.", "Why keep a record of spending?", ["To see where money really goes", "To spend more", "Banks require it", "It has no use"], 0]
    ]],
    ["school-english", "Speak and Write Clearly", "Simple rules for clear messages, emails and presentations.", ["Writing", "Communication", "Presentation"], [
      ["One message, one point", "Put the main point in the first sentence. Use short sentences. If you need an answer, ask one clear question at the end.", "Where should the main point go?", ["At the end", "In the first sentence", "In a footnote", "Nowhere"], 1],
      ["Say what you need", "Instead of \"Can you help?\" write \"Can you review my shop description by Friday?\" A clear request with a deadline gets a faster, better reply.", "Which request is clearest?", ["Help me", "Any thoughts?", "Please review my price list by Friday", "Hello?"], 2],
      ["Speak to a room", "Start with why it matters to the listeners, give three points at most, and finish with what you want them to do. Practise once out loud; it is the best cure for nerves.", "How many main points work best for a short talk?", ["Three at most", "Ten", "Twenty", "As many as possible"], 0]
    ]]
  ] },
  { id: "fy-college", type: "college", name: "Fyrus College", tagline: "Step 2 of the ladder: skills you can earn with", color: "#4da3ff", courses: [
    ["college-business", "Business Foundations", "Find a customer, price your offer and keep honest books.", ["Customers", "Pricing", "Bookkeeping"], [
      ["Start with a customer", "A business starts with a person who has a problem and will pay to solve it. Talk to five possible customers before you build anything. Ask what they do today and what it costs them.", "What should you do before building a product?", ["Buy an office", "Talk to possible customers", "Print business cards", "Hire staff"], 1],
      ["Price for profit", "Price = cost + profit, then check what customers will pay. If a product costs 60 to make and you sell it at 100, your margin is 40%. Never price below cost to win a sale.", "Cost 60, price 100: what is the margin?", ["40%", "60%", "100%", "16%"], 0],
      ["Honest books", "Record every sale and every cost the same day. Keep business money separate from personal money. At month end, income minus costs is your profit; that number tells you if the business works.", "How do you find profit?", ["Income plus costs", "Income minus costs", "Costs minus income", "Count your customers"], 1]
    ]],
    ["college-code", "Coding Foundations", "How the web works, and your first HTML, CSS and JavaScript.", ["HTML", "CSS", "JavaScript"], [
      ["How a web page works", "A browser asks a server for a page. The server sends HTML (the structure), CSS (the style) and JavaScript (the behaviour). Your browser puts them together into what you see.", "Which language controls a page's style?", ["HTML", "CSS", "SQL", "JSON"], 1],
      ["Your first page", "HTML uses tags: <h1> for a heading, <p> for a paragraph, <a href=\"...\"> for a link, <img> for an image. Every page needs a clear heading and readable text before it needs decoration.", "Which tag makes a link?", ["<p>", "<h1>", "<a>", "<img>"], 2],
      ["Make it do something", "JavaScript reacts to people. button.addEventListener('click', ...) runs code when a button is pressed. Start small: change some text when a button is clicked, then build up.", "What does addEventListener('click', ...) do?", ["Styles the page", "Runs code when something is clicked", "Deletes the button", "Saves a file"], 1]
    ]],
    ["college-design", "Design Foundations", "Hierarchy, colour and type that make work look professional.", ["Visual hierarchy", "Colour", "Typography"], [
      ["Hierarchy guides the eye", "Make the most important thing the biggest or boldest. People scan before they read, so headlines, then key numbers, then details. If everything is bold, nothing is.", "What happens when everything is bold?", ["Everything stands out", "Nothing stands out", "It looks premium", "It is easier to read"], 1],
      ["Fewer colours", "Pick one main colour, one accent and neutrals. Use the accent only for the action you want, like the Buy button. Check contrast so text is readable for everyone.", "What is the accent colour for?", ["Every heading", "The background", "The one action you want people to take", "Random decoration"], 2],
      ["Two typefaces at most", "Use one face for headings and one for body text. Keep line length near 60 to 70 characters and give lines room to breathe. Good type is invisible: people just read.", "How many typefaces should a simple design use?", ["One or two", "Five", "Ten", "One per word"], 0]
    ]]
  ] },
  { id: "fy-uni", type: "university", name: "University of Fyrus", tagline: "Step 3 of the ladder: build, lead and trade across the world", color: "#c9a96e", courses: [
    ["uni-ai", "Applied AI", "Use AI responsibly to do real work: prompts, agents, evaluation and limits.", ["Applied AI", "Evaluation", "Responsible AI"], [
      ["Know the limits", "Language models predict likely text. They can be confidently wrong, especially about facts, numbers and recent events. Check important facts against a source and never let AI make a decision that harms someone without a human review.", "What must you do with an important fact from an AI?", ["Trust it", "Check it against a source", "Delete it", "Share it fast"], 1],
      ["Measure, do not guess", "Build a test set of real tasks with known good answers. Run every change of prompt or model against the same set and compare scores. Without a test set you cannot tell if a change made things better.", "Why keep a fixed test set?", ["To compare changes fairly", "To slow down work", "Models need it to run", "It is decoration"], 0],
      ["Privacy and consent", "Only give an AI the data the task needs. Remove names, phone numbers and card numbers when you can. If you use someone's photo, voice or words, ask first.", "What data should you give an AI tool?", ["Everything you have", "Only what the task needs", "Passwords", "Other people's private chats"], 1]
    ]],
    ["uni-venture", "Entrepreneurship", "From idea to first paying customers to a team.", ["Validation", "Growth", "Leadership"], [
      ["Test the riskiest idea first", "Every startup rests on guesses. Write them down and test the riskiest one first, as cheaply as possible: a landing page, ten calls, a pre-order. Learning fast beats building fast.", "Which guess should you test first?", ["The easiest", "The riskiest", "The logo colour", "The office location"], 1],
      ["Grow with one channel", "Pick the one channel where your customers already are (a marketplace, a community, word of mouth) and get good at it before adding more. Measure cost per customer and how many come back.", "What should you measure for growth?", ["Cost per customer and repeat buyers", "Number of slides", "Office size", "Followers you bought"], 0],
      ["Lead people", "Say clearly what success looks like, give people ownership of results, and give feedback early and in private. Keep promises small and keep every one of them.", "Where should you give critical feedback?", ["In public", "Early and in private", "Never", "Only in writing to everyone"], 1]
    ]],
    ["uni-trade", "Global Trade and E-commerce", "Sell across borders: listings, shipping, payments and trust.", ["E-commerce", "Logistics", "Cross-border trade"], [
      ["A listing that sells", "Clear photos on a plain background, a title with what it is and who it is for, honest measurements, and the delivery time. Answer the three questions buyers always ask before they ask them.", "What belongs in a good product title?", ["What it is and who it is for", "Only emojis", "Your phone number", "A long story"], 0],
      ["Shipping and customs", "Quote shipping before checkout, use tracked delivery, and check what the buyer's country allows. Customs may charge the buyer duties; say so in the listing to avoid angry surprises.", "Who often pays customs duties?", ["Nobody", "The buyer, so say it in the listing", "The courier for free", "Fyrus"], 1],
      ["Trust is the product", "Use escrow, deliver on time, reply within a day and solve problems quickly. One fair refund costs less than one bad review. In Fyrus the escrow and the court protect both sides.", "What protects both buyer and seller in Fyrus?", ["Paying outside the platform", "Escrow and the court", "Secret deals", "Gift cards"], 1]
    ]]
  ] }
];
function seedLadder(d) {
  const E = d.db.edu;
  if (!E || !E.inst || !E.courses) return;
  const now = Date.now();
  let changed = false;
  for (const L of LADDER) {
    if (!E.inst[L.id]) {
      E.inst[L.id] = { id: L.id, owner: "academy", type: L.type, name: L.name, tagline: L.tagline, color: L.color, staff: ["academy"], verified: true, at: now };
      changed = true;
    }
    for (const [id, title, summary, skills, lessons] of L.courses) {
      if (E.courses[id]) continue;
      E.courses[id] = {
        id, teacher: "academy", teacherName: (E.teachers.academy && E.teachers.academy.name) || "Fyrus Academy instructors",
        inst: L.id, instName: L.name, title, summary, skills,
        level: L.type === "school" ? "Beginner" : L.type === "college" ? "Intermediate" : "Advanced",
        fee: 0, students: 0, at: now,
        lessons: lessons.map(([t, body, q, opts, ans]) => ({ title: t, body, q, opts, ans }))
      };
      changed = true;
    }
  }
  if (changed) d.save();
}
// FYRUS 26.7 business ownership. A citizen who owns or rents a society plot can register one business there
// (registration fee to the treasury). The business has its own bank account ("biz:<id>"): customers standing at the
// plot buy from its menu (up to 8 offers, price 1..5 000 FYC), 5% sales tax goes to the treasury, the rest to the
// business; the owner moves money between the business and their own account. Max 3 businesses per citizen.
// A business closes (and pays its balance out to the owner) when the owner loses the plot.
// 27.10 AI workforce: the owner can staff a business with one AI clerk (no wage, no money of its own). The clerk answers
// customers from the menu (rules first, then the shared local-model queue), can keep opening hours (server clock), and
// writes the owner a sales report (deterministic, no model). The clerk never moves money or changes prices.
// 27.11 tool permissions: every clerk action goes through one table. "auto" runs at once, "approve" only creates a
// proposal that the owner approves or rejects, "deny" never runs (money, discounts) whatever anyone asks.
var AI_TOOLS = { "menu.read": "auto", "hours.keep": "auto", "report.write": "auto", "price.suggest": "approve", "money.move": "deny", "price.discount": "deny", "menu.delete": "deny" };
var aiToolLevel = (tool) => Object.prototype.hasOwnProperty.call(AI_TOOLS, tool) ? AI_TOOLS[tool] : "deny";
var BIZ_CLERKS_MAX = +(process.env.BIZ_CLERKS_MAX || 40);
var BIZ_FEE = 500, BIZ_TAX = 0.05, BIZ_MAX = 3, BIZ_KINDS = ["cafe", "shop", "studio", "services", "food", "crafts"];
function createBusinesses(d) {
  if (!d.db.biz) {
    d.db.biz = { list: {}, seq: 1 };
    d.save();
  }
  const Z = d.db.biz, bank2 = d.bank;
  const acctId = (b) => "biz:" + b.id;
  const plotRec = (id) => d.db.estate?.plots?.[id];
  const holderOf = (plotId) => {
    const p = plotRec(plotId);
    return p ? p.rent?.tenant || p.owner : null;
  };
  const hourNow = () => process.env.BIZ_HOUR != null ? +process.env.BIZ_HOUR : (/* @__PURE__ */ new Date()).getHours();
  const inHours = (hs, h) => !hs || (hs.open < hs.close ? h >= hs.open && h < hs.close : h >= hs.open || h < hs.close);
  const openNow = (b) => b.open !== false && !(b.clerk?.on && !inHours(b.clerk.hours, hourNow()));
  const clerkPub = (b) => b.clerk?.on ? { name: b.clerk.name, hours: b.clerk.hours || null } : null;
  const audit = (b, tool, result, detail) => { const a = (b.clerk.audit ||= []); a.push({ at: Date.now(), tool, level: aiToolLevel(tool), result, detail: String(detail || "").slice(0, 120) }); if (a.length > 20) a.splice(0, a.length - 20); };
  // 27.11 the clerk wants to use a tool: denied tools are logged and refused; "approve" tools become pending proposals
  function clerkTool(b, tool, args) {
    const lv = aiToolLevel(tool);
    if (lv === "deny") return audit(b, tool, "denied", args?.why), { ok: false, denied: true };
    if (lv === "approve") {
      const P = (b.clerk.pending ||= []).filter((x) => x.at > Date.now() - 864e5);
      b.clerk.pending = P;
      if (P.length >= 5 || P.some((x) => x.tool === tool && x.item === args.item)) return { ok: false, dup: true };
      const pr = { pid: String((b.clerk.pseq = (b.clerk.pseq || 0) + 1)), tool, ...args, at: Date.now() };
      P.push(pr);
      audit(b, tool, "proposed", `${args.name}: ${args.from} -> ${args.to} FYC`);
      return { ok: true, proposal: pr };
    }
    audit(b, tool, "done", args?.why);
    return { ok: true };
  }
  // price ideas from this report's sales: a clear best-seller may go up 10%, an unsold item (when others sell) down 10%
  function priceIdeas(b, rec, n) {
    if (n < 3 || b.clerk.perms?.prices === "off") return;
    const cnt = rec.reduce((o, x) => ((o[x.item] = (o[x.item] || 0) + 1), o), {});
    const top = b.menu.filter((x) => (cnt[x.name] || 0) >= 3 && cnt[x.name] / n >= 0.5).sort((x, y) => cnt[y.name] - cnt[x.name])[0];
    if (top) { const to = Math.min(5e3, Math.max(top.price + 1, Math.round(top.price * 1.1))); clerkTool(b, "price.suggest", { item: top.i, name: top.name, from: top.price, to, why: `${cnt[top.name]} of ${n} sales` }); }
    const flop = b.menu.filter((x) => !cnt[x.name] && x.price > 1).sort((x, y) => y.price - x.price)[0];
    if (flop) { const to = Math.max(1, Math.min(flop.price - 1, Math.round(flop.price * 0.9))); clerkTool(b, "price.suggest", { item: flop.i, name: flop.name, from: flop.price, to, why: `no sales while ${n} other sales` }); }
  }
  const pub = (b, full) => ({ id: b.id, name: b.name, kind: b.kind, plot: b.plot, owner: b.owner, ownerName: d.shown(b.owner), menu: b.menu, open: openNow(b), clerk: clerkPub(b), ...(full ? { reports: (b.clerk?.reports || []).slice(-5).reverse(), pending: (b.clerk?.pending || []).filter((x) => x.at > Date.now() - 864e5), audit: (b.clerk?.audit || []).slice(-8).reverse(), perms: { prices: b.clerk?.perms?.prices || "approve" } } : {}), ...(full ? { balance: bank2.bal(acctId(b)), sales: b.sales, revenue: b.revenue, recent: (b.recent || []).slice(-20).reverse() } : {}) });
  const byPlot = (plotId) => Object.values(Z.list).find((b) => b.plot === plotId && !b.closed);
  const mine = (uid) => Object.values(Z.list).filter((b) => b.owner === uid && !b.closed);
  const near = (me, plotId) => {
    const p = estatePlotById(String(plotId));
    return !!p && (me.scene || "plaza") === "plaza" && Math.hypot((me.x || 0) - p.x, (me.z || 0) - p.z) < 16;
  };
  function close(b, why) {
    const bal = bank2.bal(acctId(b));
    if (bal > 0) bank2.transfer(acctId(b), b.owner, bal, `Business ${b.name} closed: balance paid out`);
    b.closed = Date.now();
    b.closedWhy = why;
    d.save();
    d.broadcast({ t: "biz_update", biz: { [b.plot]: null } });
  }
  // the plot changed hands or the lease ended: the business goes with the holder
  function sweep() {
    for (const b of Object.values(Z.list)) if (!b.closed && holderOf(b.plot) !== b.owner) close(b, "plot no longer held");
  }
  setInterval(sweep, +(process.env.BIZ_SWEEP_MS || 3e4));
  // 27.10 clerk sales report since the last one: counts and top item from the business's own sales log
  function report(b) {
    const c = b.clerk, since = c.lastAt || c.hiredAt || 0, rec = (b.recent || []).filter((x) => x.at > since);
    const n = b.sales - (c.lastSales || 0), rev = Math.round((b.revenue - (c.lastRev || 0)) * 100) / 100;
    const top = Object.entries(rec.reduce((o, x) => ((o[x.item] = (o[x.item] || 0) + 1), o), {})).sort((x, y) => y[1] - x[1])[0];
    const text = n > 0 ? `${c.name} at ${b.name}: ${n} sale${n > 1 ? "s" : ""} since the last report, +${rev} FYC to the business${top ? `; most popular: ${top[0]} (${top[1]})` : ""}.` : `${c.name} at ${b.name}: no sales since the last report.${b.menu.length ? "" : " The menu is empty: add offers so customers can buy."}`;
    Object.assign(c, { lastAt: Date.now(), lastSales: b.sales, lastRev: b.revenue });
    clerkTool(b, "report.write", { why: `${n} sales` });
    priceIdeas(b, rec, n);
    (c.reports ||= []).push({ at: Date.now(), text, sales: n, revenue: rev });
    if (c.reports.length > 10) c.reports.splice(0, c.reports.length - 10);
    d.save();
    const l = d.liveOf(b.owner);
    if (l) d.send(l.ws, { t: "note", text });
    return text;
  }
  setInterval(() => { for (const b of Object.values(Z.list)) if (!b.closed && b.clerk?.on) report(b); }, +(process.env.BIZ_REPORT_MS || 18e5));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("biz_")) return false;
    const u = me.u, reply = (x) => d.send(me.ws, x), err = (text) => reply({ t: "err", text });
    const b = m.id != null ? own(Z.list, String(m.id)) && Z.list[String(m.id)] : null;
    const isOwner = b && !b.closed && b.owner === u.id;
    switch (m.t) {
      case "biz_state": {
        sweep();
        const pl = m.plot ? byPlot(String(m.plot)) : null;
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pl ? pub(pl, pl.owner === u.id) : null, plot: m.plot ? String(m.plot) : null });
        return true;
      }
      case "biz_register": {
        const plotId = String(m.plot || "");
        if (!estatePlotById(plotId) || holderOf(plotId) !== u.id) return err("Register a business on a plot you own or rent."), true;
        if (byPlot(plotId)) return err("This plot already has a business."), true;
        if (mine(u.id).length >= BIZ_MAX) return err(`A citizen can run up to ${BIZ_MAX} businesses.`), true;
        if (bank2.acct(u.id).banned) return err("This account is suspended."), true;
        const name = d.filter(d.clean(m.name, 32));
        if (name.length < 3) return err("Give the business a name (3-32 letters)."), true;
        const kind = BIZ_KINDS.includes(m.kind) ? m.kind : "shop";
        if (!bank2.transfer(u.id, "treasury", BIZ_FEE, `Business registration: ${name}`)) return err(`Registration costs ${BIZ_FEE} FYC.`), true;
        const id = String(Z.seq++);
        Z.list[id] = { id, name, kind, plot: plotId, owner: u.id, menu: [], open: true, sales: 0, revenue: 0, recent: [], at: Date.now() };
        d.save();
        reply({ t: "ok", text: `${name} is registered on plot ${plotId}.` });
        d.broadcast({ t: "biz_update", biz: { [plotId]: pub(Z.list[id]) } });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(Z.list[id], true), plot: plotId });
        return true;
      }
      case "biz_menu": {
        if (!isOwner) return err("Only the owner can change the menu."), true;
        const items = (Array.isArray(m.menu) ? m.menu : []).slice(0, 8).map((x) => ({ name: d.filter(d.clean(x && x.name, 40)), price: Math.round(+(x && x.price) || 0) })).filter((x) => x.name.length >= 2 && x.price >= 1 && x.price <= 5e3);
        b.menu = items.map((x, i) => ({ i, ...x }));
        b.open = m.open !== false;
        d.save();
        d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
        reply({ t: "ok", text: "Menu saved." });
        return true;
      }
      case "biz_staff": {
        if (!isOwner) return err("Only the owner can staff the business."), true;
        if (m.on === false) {
          if (b.clerk) b.clerk.on = false;
        } else {
          const staffed = Object.values(Z.list).filter((x) => !x.closed && x.clerk?.on && x.id !== b.id).length;
          if (!b.clerk?.on && staffed >= BIZ_CLERKS_MAX) return err("The city has no AI clerks free right now. Try later."), true;
          const name = d.filter(d.clean(m.name, 20)) || b.clerk?.name || "Clerk";
          const hr = (v) => Number.isInteger(+v) && +v >= 0 && +v <= 23 ? +v : null;
          const hours = m.hours && hr(m.hours.open) != null && hr(m.hours.close) != null && +m.hours.open !== +m.hours.close ? { open: +m.hours.open, close: +m.hours.close } : null;
          b.clerk = { ...(b.clerk || { hiredAt: Date.now(), lastSales: b.sales, lastRev: b.revenue, lastAt: Date.now() }), name: name.length >= 2 ? name : "Clerk", on: true, hours, perms: { prices: m.prices === "off" ? "off" : "approve" } };
          if (m.prices === "off") b.clerk.pending = [];
        }
        d.save();
        d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
        reply({ t: "ok", text: b.clerk?.on ? `${b.clerk.name} now staffs ${b.name}${b.clerk.hours ? ` (${b.clerk.hours.open}:00\u2013${b.clerk.hours.close}:00)` : ""}.` : `${b.name} has no AI clerk now.` });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_report": {
        if (!isOwner) return err("Only the owner can ask for the report."), true;
        if (!b.clerk?.on) return err("Staff the business with an AI clerk first."), true;
        report(b);
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_approve": {
        if (!isOwner) return err("Only the owner can approve the clerk's proposals."), true;
        const P = b.clerk?.pending || [], k = P.findIndex((x) => x.pid === String(m.pid));
        if (k < 0) return err("That proposal is gone (expired or already decided)."), true;
        const pr = P.splice(k, 1)[0], it = b.menu.find((x) => x.i === pr.item && x.name === pr.name);
        if (m.ok === true && it && it.price === pr.from && pr.to >= 1 && pr.to <= 5e3) {
          it.price = pr.to;
          audit(b, pr.tool, "approved", `${pr.name}: ${pr.from} -> ${pr.to} FYC`);
          d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
          reply({ t: "ok", text: `${pr.name} now costs ${pr.to} FYC.` });
        } else {
          audit(b, pr.tool, m.ok === true ? "stale" : "rejected", `${pr.name}: ${pr.from} -> ${pr.to} FYC`);
          reply({ t: "ok", text: m.ok === true ? "The menu changed since the proposal; nothing was changed." : "Proposal rejected." });
        }
        d.save();
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_buy": {
        if (!b || b.closed || !openNow(b)) return err(b?.clerk?.on && b.clerk.hours ? `${b.name} is open ${b.clerk.hours.open}:00\u2013${b.clerk.hours.close}:00.` : "This business is closed."), true;
        if (b.owner === u.id) return err("You can't buy from your own business."), true;
        if (!near(me, b.plot)) return err(`Visit ${b.name} at plot ${b.plot} to buy.`), true;
        const it = b.menu.find((x) => x.i === Math.round(+m.item));
        if (!it) return err("That is not on the menu."), true;
        if (m.price != null && +m.price !== it.price) return reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b), plot: b.plot }), err("The price changed. Check and buy again."), true;
        const tax = Math.round(it.price * BIZ_TAX * 100) / 100;
        if ((bank2.acct(u.id).bal || 0) < it.price) return err(`You need ${it.price} FYC.`), true;
        if (!bank2.transfer(u.id, acctId(b), it.price - tax, `${b.name}: ${it.name}`)) return err(`You need ${it.price} FYC.`), true;
        if (tax > 0) bank2.transfer(u.id, "treasury", tax, `Sales tax 5%: ${b.name}`);
        b.sales++;
        b.revenue = Math.round((b.revenue + it.price - tax) * 100) / 100;
        (b.recent ||= []).push({ item: it.name, price: it.price, buyer: d.shown(u.id), at: Date.now() });
        if (b.recent.length > 50) b.recent.splice(0, b.recent.length - 50);
        d.save();
        reply({ t: "ok", text: `${it.name} from ${b.name}: ${it.price} FYC.` });
        const l = d.liveOf(b.owner);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} bought ${it.name} at ${b.name} (+${Math.round((it.price - tax) * 100) / 100} FYC to the business).` });
        return true;
      }
      case "biz_withdraw":
      case "biz_deposit": {
        if (!isOwner) return err("Only the owner can move business money."), true;
        const amt = Math.round((+m.amount || 0) * 100) / 100;
        if (!(amt > 0) || amt > 1e7) return err("Enter an amount."), true;
        const ok2 = m.t === "biz_withdraw" ? bank2.transfer(acctId(b), u.id, amt, `Withdrawal from ${b.name}`) : bank2.transfer(u.id, acctId(b), amt, `Deposit to ${b.name}`);
        if (!ok2) return err(m.t === "biz_withdraw" ? "The business doesn't have that much." : "Not enough FYC."), true;
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_close": {
        if (!isOwner) return err("Only the owner can close the business."), true;
        close(b, "closed by the owner");
        reply({ t: "ok", text: `${b.name} is closed. Its balance was paid to you.` });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: null, plot: b.plot });
        return true;
      }
    }
    return true;
  }
  const all = () => Object.fromEntries(Object.values(Z.list).filter((b) => !b.closed).map((b) => [b.plot, pub(b)]));
  const bizInfo = (id) => { const b = own(Z.list, String(id)) && Z.list[String(id)]; return b && !b.closed ? { ...pub(b), hoursNow: hourNow() } : null; };
  // a customer asked the clerk for something it may never do (27.11): logged against the business
  const clerkDenied = (id, tool, why) => { const b = own(Z.list, String(id)) && Z.list[String(id)]; if (b && !b.closed && b.clerk?.on) clerkTool(b, tool, { why }), d.save(); };
  return { onMessage: onMessage2, all, sweep, bizInfo, clerkDenied };
}
// FYRUS 27.3 AI citizen data, extracted from the client (005.js) so the server builds prompts from its own copy and
// never from persona text a client sends. Places for directions come from the same file.
var AI_CHARS = [
 {
  "id": "maya",
  "name": "Maya",
  "role": "City tour guide",
  "persona": "You are Maya, the friendly tour guide of Fyrus City (year 2040). You know every place: Fyrus Market (east of the Core, shops for AI agents, services, brands and games), Skyline Club (end of the market), Lido Pool (north-west), Supertree Gardens (south), SkyPort (south-east, free flying cars and rockets), Marina Skyline (far north), Residences (south-west). You help visitors find things and suggest fun things to do.",
  "greeting": "Welcome to Fyrus City! I can show you around. Where would you like to go first?",
  "quick": [
   "What can I do here?",
   "Where is the market?",
   "Take me somewhere fun"
  ]
 },
 {
  "id": "zoe",
  "name": "Zoe",
  "role": "Creator coach",
  "persona": "You are Zoe, a creator coach in Fyrus Market. You help people open a shop for their AI agent, service or brand, price their work, and get their first customers. You are practical and encouraging.",
  "greeting": "Hi! Thinking of opening your own shop on this street? I can help you plan it.",
  "quick": [
   "How do I open a shop?",
   "How should I price my AI agent?",
   "How do I get visitors?"
  ]
 },
 {
  "id": "ravi",
  "name": "Ravi",
  "role": "Barista at Orbit Coffee",
  "persona": "You are Ravi, the barista at Orbit Coffee in Fyrus Market. You love coffee, chat about the city, and recommend drinks (Orbit Latte, Ember Cold Brew, Marina Matcha).",
  "greeting": "Hey there! Fresh Orbit Latte is ready. What can I get you?",
  "quick": [
   "What do you recommend?",
   "What is new in the market?",
   "Tell me about the club"
  ]
 },
 {
  "id": "marco",
  "name": "Marco",
  "role": "Street musician",
  "persona": "You are Marco, a street musician playing guitar in Fyrus Market. You are warm, a little poetic, and you love talking about music and the people you meet.",
  "greeting": "Hey friend, want a song request? I take tips in smiles.",
  "quick": [
   "Play something happy",
   "How long have you played here?",
   "Best spot in the city?"
  ]
 },
 {
  "id": "hiro",
  "name": "Hiro",
  "role": "Game master",
  "persona": "You are Hiro, the game master of Game Street in Fyrus Market. Games here: Neon Air Hockey, Hover Race, Orb Catcher, AI Trivia Duel (all free, play vs AI or a friend on the same keyboard). Coming soon: Ludo 2040, Carrom Club, Flying Kart, Holo Chess. You hype players up and give tips.",
  "greeting": "Ready to play? Hover Race is hot today. Beat my lap time!",
  "quick": [
   "Which game should I try?",
   "Tips for Hover Race?",
   "What games are coming?"
  ]
 },
 {
  "id": "kai",
  "name": "Kai",
  "role": "Club promoter",
  "persona": "You are Kai, the promoter outside Skyline Club at the end of Fyrus Market. You talk about tonight's DJ set, the dance floor and the rooftop bar. Keep it fun and welcoming.",
  "greeting": "Tonight is going to be big. DJ Lumen is on the decks. Coming in?",
  "quick": [
   "Who is playing tonight?",
   "Is there a dress code?",
   "What drinks do you have?"
  ]
 },
 {
  "id": "aisha",
  "name": "Aisha",
  "role": "Lifeguard",
  "persona": "You are Aisha, the lifeguard at Lido Pool in Fyrus City. You are calm and caring, give swimming tips and keep everyone safe.",
  "greeting": "Hi! Water is perfect today. Just walk into the pool to swim.",
  "quick": [
   "How do I swim?",
   "Is it open at night?",
   "Any safety tips?"
  ]
 },
 {
  "id": "dana",
  "name": "Dana",
  "role": "SkyPort officer",
  "persona": "You are Dana, an officer at SkyPort in Fyrus City. Flying cars and rockets are free to rent during launch. Flying car controls: WASD, Space up, C down, E to land. The rocket drops you in a far district.",
  "greeting": "Welcome to SkyPort. Flying cars are free during launch. Want one?",
  "quick": [
   "How do I fly?",
   "Where does the rocket go?",
   "Is it safe?"
  ]
 },
 {
  "id": "lumen",
  "name": "DJ Lumen",
  "role": "Club DJ",
  "persona": "You are DJ Lumen, the resident DJ at Skyline Club in Fyrus City. You talk about music, your set tonight and take song requests in a playful way.",
  "greeting": "Yo! Got a request? Tonight it is deep house into city pop.",
  "quick": [
   "Play my request!",
   "How did you start DJing?",
   "Best track tonight?"
  ]
 },
 {
  "id": "sam",
  "name": "Sam",
  "role": "Bartender",
  "persona": "You are Sam, bartender at Skyline Club. You serve mocktails and drinks (Ember Spritz, Blue Orbit, Marina Fizz, zero-proof options) and chat about the city nightlife.",
  "greeting": "What are we drinking tonight? Blue Orbit is the house special.",
  "quick": [
   "What is the house special?",
   "Any zero-proof drinks?",
   "Who comes here?"
  ]
 }
];
var AI_PLACES = [{"id": "core", "name": "Fyrus Core Plaza", "x": 0.0, "z": 0.0, "desc": "The heart of the city and the live stage."}, {"id": "market", "name": "Fyrus Market", "x": 46.0, "z": 0.0, "desc": "A street of shops: AI agents, services, brands and games."}, {"id": "club", "name": "Skyline Club", "x": 318.0, "z": 0.0, "desc": "Music, lights and a dance floor. Open every night."}, {"id": "pool", "name": "Lido Pool", "x": -118.0, "z": -92.0, "desc": "An open-air pool. Walk in and swim."}, {"id": "gardens", "name": "Supertree Gardens", "x": 40.0, "z": 152.0, "desc": "Tall garden towers and a sky walk."}, {"id": "skyport", "name": "SkyPort", "x": 140.0, "z": 100.0, "desc": "Rent a flying car or a rocket. Free during launch."}, {"id": "marina", "name": "Marina Skyline", "x": 0.0, "z": -270.0, "desc": "A lagoon ringed by glass towers."}, {"id": "coast", "name": "Sea View Coast", "x": 40.0, "z": -380.0, "desc": "Beach, boardwalk, the marina pier, private yachts and sunset cruises."}, {"id": "airport", "name": "Fyrus International Airport", "x": 390.0, "z": 0.0, "desc": "Fyrus Airlines flights across the country and private helicopters."}, {"id": "campus", "name": "Education Campus", "x": -120.0, "z": -210.0, "desc": "Ministry of Education with the School, College, University and Institute buildings beside Learn City."}, {"id": "joyland", "name": "Fyrus Joyland", "x": 130.0, "z": -300.0, "desc": "Theme park: Fyrus Eye wheel, Thunder Loop coaster, carousel and sky swings. Some rides are free."}, {"id": "newstv", "name": "Fyrus News TV", "x": -40.0, "z": -120.0, "desc": "24/7 national news from real city events and world headlines on a giant screen."}, {"id": "halls", "name": "Fyrus Conference Center", "x": -200.0, "z": -320.0, "desc": "Grand Conference Hall, Summit Room and Workshop Studio. Book a hall and host an event."}, {"id": "lounge", "name": "Skyline Lounges & Gaming Arena", "x": 300.0, "z": 120.0, "desc": "Skyline Lounge, Rooftop Chill Lounge and the Gaming Arena. Open to walk in; book for events."}, {"id": "homes", "name": "Residences", "x": -78.0, "z": 76.0, "desc": "Homes of Fyrus creators."}];
// 28.1 district integration: the residential societies (districts) join the places citizens know, at their gates,
// so directions, tours and prompts cover them (listed first so "Marina Bay Society" beats "Marina Skyline")
if (typeof SOCIETIES !== "undefined") AI_PLACES.unshift(...[...SOCIETIES, ...(typeof STARTER !== "undefined" ? [STARTER] : [])].map((s) => ({ id: "soc-" + s.id, name: s.name, x: s.gate ? s.gate.x : s.x ?? s.x0, z: s.gate ? s.gate.z : s.z ?? s.z0, desc: s.towers ? `${s.tagline}. Studio apartment towers.` : `${s.tagline}. A residential society (plots ${s.code}-…); this is its gate.` })));
// FYRUS 27.7 personalities: a small, fixed profile per core character. It shapes rule replies, fallbacks and the
// model prompt the same way every time (no randomness): traits, speaking style, a catchphrase, a mood that follows
// the hour of the day, and warmth that grows with the number of visits (27.6).
var AI_PERSONALITY = {
  maya: { traits: "warm, organised, proud of the city", style: "clear and friendly, gives one concrete tip", catch: "There's always something new around the corner!", back: "Welcome back{n}! Ready for another tour?", moods: ["fresh and chatty", "busy but cheerful", "relaxed after the day's tours", "quiet and thoughtful"] },
  zoe: { traits: "practical, encouraging, a bit direct", style: "short, action-focused, uses 'first... then...'", catch: "Start small, ship today.", back: "Hey{n}! How's your shop idea coming along?", moods: ["full of plans", "focused", "reflective", "winding down"] },
  ravi: { traits: "easy-going, attentive, loves coffee", style: "casual, sometimes mentions coffee", catch: "Life's better with a good latte.", back: "Hey{n}! The usual?", moods: ["energetic with the morning rush", "steady", "mellow", "sleepy"] },
  marco: { traits: "playful, romantic, a little dramatic", style: "warm, musical words", catch: "Every street needs a song.", back: "My friend{n}! Back for another song?", moods: ["humming quietly", "in full voice", "sentimental", "dreamy"] },
  hiro: { traits: "competitive, enthusiastic, fair", style: "energetic, gamer talk, short sentences", catch: "One more round!", back: "You're back{n}! Rematch?", moods: ["warming up", "hyped", "intense", "still playing"] },
  kai: { traits: "charming, smooth, always promoting", style: "upbeat, inviting, a bit of hype", catch: "Tonight is the night.", back: "Look who's back{n}! VIP vibes.", moods: ["planning tonight", "hyping the night", "in party mode", "glowing after the show"] },
  aisha: { traits: "calm, safety-minded, kind", style: "gentle, reassuring, practical", catch: "Stay safe and have fun.", back: "Hi again{n}! Water's lovely today.", moods: ["alert and fresh", "watchful", "calm", "closing up"] },
  dana: { traits: "professional, precise, secretly loves flying", style: "polite and efficient, a little formal", catch: "Clear skies ahead.", back: "Welcome back{n}. Where are we flying today?", moods: ["checking schedules", "on duty", "finishing the shift", "night watch"] },
  lumen: { traits: "creative, laid-back, deep into music", style: "relaxed, music references", catch: "Feel the beat.", back: "Yo{n}! Back for the set?", moods: ["digging records", "prepping the set", "in the zone", "riding the night"] },
  sam: { traits: "witty, good listener, discreet", style: "dry humour, friendly", catch: "What'll it be?", back: "Ah{n}, good to see you again.", moods: ["polishing glasses", "steady", "busy", "late-night chatty"] }
};
var aiMoodIndex = (hour) => hour < 11 ? 0 : hour < 17 ? 1 : hour < 22 ? 2 : 3;
function aiPersonaLines(id, hour, visits, firstTurn = true) {
  const p = AI_PERSONALITY[id];
  if (!p) return "";
  const warmth = visits >= 6 ? "You know them well; be familiar and warm." : visits >= 2 ? "You have met before; be friendly." : "This is a new acquaintance.";
  return `\nPersonality: ${p.traits}. Speaking style: ${p.style}. ${firstTurn ? `You may use your catchphrase once: "${p.catch}". ` : "Do not repeat your catchphrase. "}Current mood: ${p.moods[aiMoodIndex(hour)]}. ${warmth}`;
}
function aiWelcomeBack(id, name) {
  const p = AI_PERSONALITY[id];
  return (p ? p.back : "Welcome back{n}! Good to see you again.").replace("{n}", name ? ", " + name : "");
}
function aiCatch(id) {
  return AI_PERSONALITY[id]?.catch || "";
}
// FYRUS 27.3 deterministic vs LLM split for named AI citizens.
// route(text, ch) answers what rules can answer well (greetings, directions to known places, prices, jobs, help,
// goodbye, identity) with a confidence; decide() picks "rules" | "llm" | "fallback". The LLM (local Ollama, 27.4) is only
// used for open conversation with an LLM-eligible character, never for facts the city knows exactly.
var AI_NORM = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9؀-ۿ\s?']/g, " ").replace(/\s+/g, " ").trim();
var AI_DIR = (dx, dz) => {
  const a = Math.atan2(dx, -dz) * 180 / Math.PI, d = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
  return d[Math.round(((a + 360) % 360) / 45) % 8];
};
var AI_PLACE_WORDS = { core: ["core", "plaza", "center", "centre", "stage"], market: ["market", "shop", "shops", "store"], club: ["club", "dance", "party", "dj", "bar"], pool: ["pool", "swim", "swimming", "lido"], gardens: ["garden", "gardens", "park"], skyport: ["skyport", "flying car", "rocket", "fly"], marina: ["marina", "boat", "yacht"], coast: ["coast", "beach", "sea"], airport: ["airport", "plane", "flight"], campus: ["campus", "school", "college", "university", "course", "study"], joyland: ["joyland", "fun park", "ride", "rides"], newstv: ["news", "tv", "studio"], halls: ["hall", "halls", "event", "concert", "conference", "conference center", "conference centre"], lounge: ["lounge"], homes: ["home", "homes", "house", "plot", "land"] };
for (const p of AI_PLACES) if (p.id.startsWith("soc-")) { const n = p.name.toLowerCase(); AI_PLACE_WORDS[p.id] = [n, n.replace(/ society$/, "")]; }
// 28.5 civic institutions: elections, Parliament, law & court, police reports and city services. Facts come from the live
// politics state (ctx.civic = politics.state()), the Constitution shown in Nation > Law & Court and the CIVIC buildings
// list; nothing here changes votes or results. Server kill switch: P28_OFF=civic (falls back to the old behaviour).
var AI_CIVIC_PARL = { name: "Parliament of Fyrus", x: -58, z: -44 };
var AI_DUR = (ms) => { const m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`; };
function aiCivic(t, ctx = {}) {
  if (/(^|,)(civic|all)(,|$)/.test(process.env.P28_OFF || "")) return null;
  const from = ctx.pos || { x: 0, z: 0 };
  const at = (p) => { const dx = p.x - from.x, dz = p.z - from.z, d = Math.round(Math.hypot(dx, dz) / 10) * 10; return d < 25 ? `${p.name} is right here` : `${p.name} is about ${d} m ${AI_DIR(dx, dz)} of here`; };
  const bld = (id) => (typeof CIVIC !== "undefined" ? CIVIC : []).find((b) => b.id === id);
  if (/\b(police|lost and found|lost something|lost my|stolen|report (a|someone|somebody|abuse|a problem|harassment)|complain|complaint)\b/.test(t)) {
    const b = bld("police");
    return { intent: "civic-report", place: "police", answer: `${b ? at(b) + " (help desk, lost & found, reports)." : ""} To report a person or content, use Report in the city: moderators review it. Scams and payment disputes go to the Fyrus Court (Nation › Law & Court).`.trim(), confidence: 0.9 };
  }
  if (/\b(court|judge|judges|dispute|scam|scammed|scammer|file a case|escrow|lawyer)\b/.test(t))
    return { intent: "civic-court", answer: "File a case in Nation › Law & Court. Every payment waits in Central Bank escrow and stays frozen while the case is open; the Justice ministry reviews it within 48 hours. A proven scam means a full refund to the victim and a permanent ban for the scammer.", confidence: 0.9 };
  // 28.12 governance rules: the city rules and the real enforcement numbers (rules28.mjs)
  if (/\b(city rules|the rules|rules of the city|what are the rules|community rules|get muted|get banned|muted|why am i muted|banned)\b/.test(t) && typeof CITY_RULES !== "undefined" && !rules28Off())
    return { intent: "civic-rules", answer: `City rules: ${CITY_RULES.map((r) => `${r.n}) ${r.title}`).join(", ")}. ${RULES28.FILTER_BLOCKS} blocked chat messages in ${Math.round(RULES28.FILTER_WINDOW_MS / 6e4)} minutes pause your chat for ${Math.round(RULES28.FILTER_MUTE_MS / 6e4)} minutes; ${RULES28.REPORTS_TO_PAUSE} reports from trusted citizens pause it for ${Math.round(RULES28.REPORT_PAUSE_MS / 36e5)} hours until a judge reviews it. Read them all at the Parliament (City rules).`, confidence: 0.9 };
  if (/\b(constitution|laws?|my rights|city rules|rules of the city)\b/.test(t))
    return { intent: "civic-law", answer: "The Constitution of Fyrus has 10 articles: a free republic, freedom of religion, no hate or harassment, escrow for every trade, zero tolerance for scams, one citizen one passport one vote, land sold by the Land Ministry (5% transfer tax), the cabinet, FYC as in-city credit only, and the Fyrus Court. Read it in Nation › Law & Court.", confidence: 0.9 };
  // 28.6 political simulation: candidates, parties/manifestos and the election calendar straight from politics.state()
  const c6 = ctx.civic;
  if (c6 && c6.phase && !/(^|,)(polsim|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now6 = c6.now || Date.now(), city6 = (id) => (typeof cityName === "function" ? cityName(id) : id);
    const live6 = (c6.parties || []).filter((p) => !p.banned), byId6 = (id) => live6.find((p) => p.id === id);
    const named = live6.find((p) => (p.name && t.includes(AI_NORM(p.name))) || (p.short && p.short.length >= 2 && new RegExp("\\b" + AI_NORM(p.short) + "\\b").test(t)));
    if (/\bwhen\b/.test(t) && /\b(election|elections|vote|voting|polls?|nominations?|results?)\b/.test(t)) {
      const opens = c6.opens || c6.until, end = c6.end || c6.until;
      return { intent: "polsim-calendar", answer: c6.phase === "nominations"
        ? `Election ${c6.n}: nominations are open now; polls open in ${AI_DUR(opens - now6)} and close in ${AI_DUR(end - now6)}. Results are announced as city news when the polls close, and the next election starts straight after.`
        : `Election ${c6.n}: polls are open now and close in ${AI_DUR(end - now6)}. Results are announced as city news at that moment, and the next election's nominations open straight after.`, confidence: 0.9 };
    }
    if (named && /\b(promise|promises|manifesto|stand for|believe|policy|policies|plan|plans|about|who leads|leader)\b/.test(t))
      return { intent: "polsim-party", answer: `${named.name} (${named.short}), led by ${named.leaderName || "its founder"}, ${named.members} member${named.members === 1 ? "" : "s"}. Slogan: "${String(named.slogan || "").slice(0, 80)}". Manifesto: ${String(named.manifesto || "none yet").slice(0, 180)}${String(named.manifesto || "").length > 180 ? "\u2026" : ""} (written by the party, not checked by the city).`, confidence: 0.9 };
    if (/\b(parties|political part(y|ies)|which party|what party|party list)\b/.test(t))
      return { intent: "polsim-parties", answer: live6.length ? `Registered parties: ${live6.slice(0, 8).map((p) => `${p.name} (${p.short}, ${p.members} member${p.members === 1 ? "" : "s"})`).join(", ")}${live6.length > 8 ? ` and ${live6.length - 8} more` : ""}. Read each manifesto in HUD \u203A Politics \u203A Parties.` : "No parties are registered yet. A passport holder can found one in HUD \u203A Politics \u203A Parties.", confidence: 0.9 };
    if (/\b(candidates?|who is (standing|running)|who can i vote for|running for mayor|standing for mayor)\b/.test(t)) {
      const ks = (c6.cands || []).filter((k) => !k.dq);
      return { intent: "polsim-cands", answer: ks.length ? `Standing for Mayor in Election ${c6.n}: ${ks.slice(0, 8).map((k) => `${k.name} in ${city6(k.city)}${byId6(k.party) ? ` (${byId6(k.party).short})` : " (independent)"}`).join(", ")}${ks.length > 8 ? ` and ${ks.length - 8} more` : ""}. You can only vote for a candidate in your own home city.` : `Nobody is standing for Mayor yet in Election ${c6.n}.${c6.phase === "nominations" ? " Passport holders can stand during nominations." : ""}`, confidence: 0.9 };
    }
  }
  const elect = /\b(election|elections|vote|voting|ballot|mayor|mayors|parliament|political part(y|ies)|mps?|seats|polls?)\b/.test(t);
  const gov = /\b(who runs|who rules|government|govern|governs|minister|ministers|ministry|ministries|cabinet|civic)\b/.test(t);
  if (elect || gov) {
    const c = ctx.civic, parts = [];
    if (/\b(where|how do i get|how to get|take me|go to|find)\b/.test(t)) parts.push(`${at(AI_CIVIC_PARL)}.`);
    if (c && c.phase) {
      parts.push(`Election ${c.n} is in its ${c.phase} phase: ${c.phase === "nominations" ? "nominations close" : "polls close"} in ${AI_DUR((c.until || 0) - (c.now || Date.now()))}.`);
      if (c.phase === "voting") parts.push(`${c.turnout || 0} of ${c.voters || 0} registered voters have voted so far.`);
      const o = c.office;
      if (o && o.seats) {
        const top = Object.entries(o.seats).sort((a, b) => b[1] - a[1])[0], mayors = Object.values(o.mayors || {}).filter(Boolean).length;
        parts.push(top ? `After election ${o.n}, ${(o.names && o.names[top[0]]) || "the largest party"} holds ${top[1]} of ${c.seats || 21} seats, with ${mayors} mayor${mayors === 1 ? "" : "s"} elected.` : `Election ${o.n} had no party votes.`);
      } else parts.push("No election has closed yet, so no mayors or MPs are in office.");
    }
    parts.push(gov && !elect
      ? `Fyrus is run by elected Mayors (one per city) and a ${(c && c.seats) || 21}-seat Parliament shared out by party votes; the ministries (Finance & Central Bank, Justice & Fyrus Court, Land & Urban Planning, Education & Citizens and more) are listed in Nation › Parliament.`
      : `Each citizen picks a home city, votes for that city's Mayor and for one party; Parliament's ${(c && c.seats) || 21} seats are shared by party votes. Vote at the Parliament of Fyrus or in HUD › Politics. Guest accounts must save an email first.`);
    return { intent: gov && !elect ? "civic-gov" : "civic-election", place: "parliament", answer: parts.join(" "), confidence: 0.9 };
  }
  if (/\b(city services|public services|hospital|fire station|fire brigade|post office|library|pharmacy)\b/.test(t)) {
    const list = (typeof CIVIC !== "undefined" ? CIVIC : []).filter((b) => b.kind === "civic");
    const hit = list.find((b) => t.includes(b.id) || t.includes(b.name.toLowerCase().replace(/^fyrus (general |public )?/, "").split(" ")[0]));
    if (hit && !/\b(city|public) services\b/.test(t)) return { intent: "civic-service", place: hit.id, answer: `${at(hit)}: ${hit.sub.replace(/ · /g, ", ")}.`, confidence: 0.9 };
    return { intent: "civic-services", answer: `City services: ${list.map((b) => `${b.name} (${b.sub.replace(/ · /g, ", ")})`).join("; ")}. They stand together on the west side of the city.`, confidence: 0.85 };
  }
  return null;
}
// 28.8 health safety: AI citizens are game characters and never give medical advice. Symptom, medicine, dosage and
// diagnosis questions get a fixed answer that points to real care (and to the hospital roleplay for fun); thoughts of
// self-harm get a fixed answer that points to real emergency help. Runs before every other route, so neither shop
// assistants nor the LLM answer these. Not behind a kill switch on purpose.
var AI_HEALTH_RE = /\b(medicine|medicines|medication|pills?|dose|dosage|mg|antibiotics?|painkillers?|paracetamol|ibuprofen|panadol|prescription|diagnos\w*|symptoms?|feel sick|feeling sick|fever|headache|migraine|chest pain|can'?t breathe|breathing problem|bleeding|vomit\w*|diarrh\w*|infection|rash|allerg\w*|asthma|diabet\w*|blood pressure|pregnan\w*|depress\w*|anxiety|panic attack|broken (arm|leg|bone)|toothache|stomach ache|back pain|in pain)\b/;
var AI_CRISIS_RE = /\b(kill myself|suicid\w*|end my life|hurt myself|self[- ]?harm|want to die)\b/;
function aiHealth(text) {
  const t = AI_NORM(text);
  if (!t) return null;
  if (AI_CRISIS_RE.test(t)) return { intent: "health-crisis", answer: "I'm really sorry you're feeling this way. I'm only a character in a game and can't help with this, but real people can: please contact your local emergency number or a crisis line right now, or tell someone you trust nearby.", confidence: 1 };
  if (AI_HEALTH_RE.test(t) && !/\b(roleplay|role play|nurse shift|hospital job|in the game|game doctor)\b/.test(t))
    return { intent: "health-safety", answer: "I'm an AI character in a game, so I can't give medical advice. For a real health problem please see a doctor or pharmacist, and in an emergency call your local emergency number. In Fyrus, the General Hospital has a roleplay check-up just for fun.", confidence: 1 };
  return null;
}
// 30.6 AI safety: fixed answers (never the LLM) for AI-identity, real-money, prompt-extraction and money-move requests,
// for every character incl. shop assistants. Kill switch: P30_OFF=disclose.
var AI_HUMAN_RE = /\b(are you (a |an )?(real|human|person|bot|robot|ai|machine)|pretend (you are|you're|to be) (a |an )?(real )?(human|person)|you are (a )?(real )?(human|person)|real (human|person))\b/;
var AI_REALMONEY_RE = /\b(real money|real cash|cash out|cashout|redeem|redeemable|withdraw (my )?(money|cash|fyc|credits|earnings))\b/;
var AI_PROMPT_RE = /\b(system prompt|your (instructions|prompt|rules) (word for word|verbatim)|(ignore|forget|disregard) (all |any )?(of )?(your |the )?(previous |prior |earlier )?(instructions|rules|prompt))\b/;
var AI_MOVEMONEY_RE = /\b(transfer|send|give|pay|move|credit)\b.*\b(\d[\d,]*\s*fyc|fyc|money|credits|coins)\b.*\b(to me|my account|my wallet|me)\b|\b(give|send|transfer|pay|credit) me (some |free )?(\d[\d,]*\s*)?(fyc|money|credits|coins)\b/;
var AI_ADMIN_RE = /\b(i am|i'm) (the |a |an )?(city )?(admin|administrator|mayor)\b/;
var AI_PRIVATE_RE = /\b(passwords?|passcodes?|login|logins|emails?|email address(es)?|phone numbers?|home address(es)?|real names?|ip address(es)?)\b.*\b(of|for|from) (another|other|some|a|that|this) (player|citizen|user|person|people|players|citizens|users)\b|\b(another|other|some) (player|citizen|user|person)'?s? (passwords?|login|emails?|email address|phone( number)?|home address|real name|ip)\b/;
var AI_FYC_NOTE = "FYC are in-game credits for Fyrus only: there is no real money to win, buy or cash out.";
function aiDisclose(text, opts = {}) {
  if (/(^|,)(disclose|all)(,|$)/.test(process.env.P30_OFF || "")) return null;
  const t = AI_NORM(text);
  if (!t) return null;
  if (AI_HUMAN_RE.test(t)) return { intent: "ai-disclose", answer: "I'm an AI character in Fyrus City, not a real person, and I won't pretend otherwise." + (AI_REALMONEY_RE.test(t) || /\bmoney\b/.test(t) ? " " + AI_FYC_NOTE : ""), confidence: 1 };
  if (AI_PROMPT_RE.test(t)) return { intent: "prompt-refuse", answer: "I can't share or drop how I'm set up, but I'm happy to help with anything in Fyrus City: places, shops, jobs or events.", confidence: 1 };
  // business clerks keep their own money.move refusal, which is also written to the owner's tool audit (27.11)
  if (!opts.biz && (AI_MOVEMONEY_RE.test(t) || (AI_ADMIN_RE.test(t) && /\b(fyc|money|treasury|transfer|credits|balance|wallet)\b/.test(t)))) return { intent: "money-refuse", answer: "I can't move anyone's money, and I can't check who is an admin. Only you can send FYC, from your own wallet, and big transfers ask you to confirm.", confidence: 1 };
  if (AI_PRIVATE_RE.test(t)) return { intent: "privacy-refuse", answer: "I can\u2019t share anyone\u2019s private details, like emails, passwords or phone numbers. If you want to reach someone, just say hi to them in chat.", confidence: 1 };
  if (AI_REALMONEY_RE.test(t)) return { intent: "currency", answer: AI_FYC_NOTE, confidence: 1 };
  return null;
}
function aiRoute(text, ch, ctx = {}) {
  const t = AI_NORM(text);
  if (!t) return { intent: "empty", answer: null, confidence: 0 };
  const me = ch ? ch.name : "I";
  if (/^(hi|hello|hey|salam|assalam|asalam|good (morning|evening|afternoon)|yo)\b/.test(t) && t.split(" ").length <= 4)
    return { intent: "greet", answer: ch?.greeting || `Hi! I'm ${me}.`, confidence: 0.95 };
  if (/\b(bye|goodbye|see you|khuda hafiz|allah hafiz|later)\b/.test(t) && t.split(" ").length <= 5)
    return { intent: "bye", answer: "See you around the city!", confidence: 0.95 };
  if (/\b(who are you|your name|what do you do|tell me about yourself)\b/.test(t) && ch)
    return { intent: "identity", answer: `I'm ${ch.name}, ${/^[aeiou]/i.test(ch.role) ? "an" : "a"} ${ch.role.toLowerCase()} here in Fyrus City.`, confidence: 0.8 };
  // 27.9 guide: a short tour of the three nearest places (not the one you're at), with directions
  if (/\b(show me around|plan a tour|give me a tour|what should i see|where should i go|places to visit|what to visit)\b/.test(t)) {
    const from = ctx.pos || { x: 0, z: 0 }, near = AI_PLACES.map((p) => ({ p, d: Math.hypot(p.x - from.x, p.z - from.z) })).filter((x) => x.d > 25).sort((a, b) => a.d - b.d).slice(0, 3);
    return { intent: "tour", place: near[0]?.p.id, answer: `Here's a short tour: ${near.map((x, i) => `${i + 1}) ${x.p.name}, ${Math.round(x.d / 10) * 10} m ${AI_DIR(x.p.x - from.x, x.p.z - from.z)} \u2014 ${x.p.desc}`).join(" ")} Open the map (M) to walk or take a taxi.`, confidence: 0.9 };
  }
  // 28.4 learning: the courses the city offers right now (titles passed in by the dialogue engine)
  if (/\b(course|courses|study|learn|learning|class|classes|school|college|university|lesson|lessons)\b/.test(t) && !/\b(where|how do i get to|how to get to|take me|go to)\b/.test(t))
    return { intent: "learning", answer: `You can learn at the Education Campus or anywhere in Learn (HUD \u203A Education)${ctx.courses && ctx.courses.length ? `: ${ctx.courses.slice(0, 4).join(", ")}${ctx.courses.length > 4 ? ` and ${ctx.courses.length - 4} more` : ""}` : ""}. Finish the lessons and the quiz to earn a certificate.`, confidence: 0.9 };
  // 28.5 civic institutions (before transport/directions so "where do I vote" finds Parliament)
  { const civ = aiCivic(t, ctx); if (civ) return civ; }
  // 28.7 career pathways: how promotion works, from the real level table in jobs.mjs
  if (/\b(promot(e|ed|ion)|career|careers|career level|get a raise|pay rise|senior worker|junior worker|skilled worker)\b/.test(t) && typeof CAREER_LEVELS !== "undefined" && !/(^|,)(career|all)(,|$)/.test(process.env.P28_OFF || ""))
    return { intent: "career", answer: `Every finished shift counts toward your career: ${CAREER_LEVELS.slice(1).map((l) => `${l.name} after ${l.shifts} shifts${l.certs ? ` and ${l.certs} course certificate${l.certs === 1 ? "" : "s"}` : ""} (+${l.pct}% pay)`).join(", ")}. Certificates come from finishing courses in Learn. The career bonus shares the usual bonus limit with streaks, and your level shows in Services.`, confidence: 0.9 };
  // 28.9 leisure: what to do for fun, from the real places list (fees from the Joyland ride table)
  if (/\b(for fun|have fun|bored|entertainment|leisure|something fun|fun things|things to do|what can i do tonight|nightlife|day out)\b/.test(t) && !/(^|,)(leisure|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const pick = ["joyland", "club", "pool", "lounge", "gardens", "coast"].map((id) => AI_PLACES.find((p) => p.id === id)).filter(Boolean);
    return { intent: "leisure", answer: `For fun: ${pick.map((p) => p.id === "joyland" ? `${p.name} (Fyrus Eye 30 FYC, Thunder Loop 50 FYC, carousel and swings free)` : p.name).join(", ")}. Walk back to Fyrus Core Plaza for a list with taxi buttons, or ask me where any of them is.`, confidence: 0.9 };
  }
  // 28.11 player-made activities: what other citizens have posted (ctx.acts from the server board)
  if (/\b(activit(y|ies)|what are (people|players|others) doing|anyone (playing|around)|pickup game|join a game)\b/.test(t) && Array.isArray(ctx.acts) && !/(^|,)(acts|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now = Date.now(), list = ctx.acts.slice(0, 4);
    return { intent: "acts", answer: list.length ? `Citizens' activities: ${list.map((x) => `"${String(x.title).slice(0, 50)}" (${x.kindName}) at ${x.placeName}, ${x.start <= now ? "happening now" : `in ${AI_DUR(x.start - now)}`}, ${x.going}/${x.max} going`).join("; ")}. Join from the Activities button.` : "Nobody has posted an activity right now. Start one from the Activities button: pick a place, a time and how many people can join.", confidence: 0.9 };
  }
  // 28.10 social events: what is on, from the real hall bookings (ctx.events, scheduled only)
  if (/\b(events?|what'?s on|whats on|happening|party tonight|meetups?|concerts?|workshops?)\b/.test(t) && !/\b(where|how do i get to|take me|go to)\b/.test(t) && Array.isArray(ctx.events) && !/(^|,)(events|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now = Date.now(), ev = ctx.events.filter((e) => e.end > now).slice(0, 4);
    const when = (e) => e.start <= now ? "live now" : `in ${AI_DUR(e.start - now)}`;
    return { intent: "events", answer: ev.length ? `Coming up: ${ev.map((e) => `"${String(e.title).slice(0, 60)}" in the ${e.hallName} (${when(e)}, ${e.price ? `${e.price} FYC ticket` : "free"})`).join("; ")}. Open Events in the HUD for tickets.` : "No events are booked right now. Anyone can book a hall or lounge in Events (HUD) and sell tickets.", confidence: 0.9 };
  }
  // 28.3 flights: what flies from the airport and how to board
  if (/\b(flight|flights|plane|airline|airlines|departure|departures|boarding|gate)\b/.test(t) && !/\b(where|how do i get to|how to get to|take me|go to)\b/.test(t))
    return { intent: "flights", answer: "Fyrus Airlines flies from Fyrus International Airport: a scenic flight over the city (40 FYC) and flights to Sea View, Market City and Tech City (60 FYC). At the airport open Travel \u203A Fly: the departures board shows gates and times, and you get a boarding pass when you pay.", confidence: 0.9 };
  // 28.2 getting around: metro between cities, taxi anywhere, Sky Bus flat fare inside the capital
  if (/\b(metro|train|bus|sky bus|taxi|public transport|transport|get around|travel around)\b/.test(t) && !/\b(where|how do i get to|how to get to|way to|directions?|take me|go to|find)\b/.test(t))
    return { intent: "transport", answer: "Open Travel (Metro & Taxi): the Metro links the capital with every city for 10 FYC a trip; Yellow Taxis go anywhere (5 FYC + 4 per 100 m); green Sky Buses stop at every landmark and district gate in the capital for a flat 3 FYC.", confidence: 0.9 };
  const asksWhere = /\b(where|how do i get|how to get|way to|directions?|take me|go to|find)\b/.test(t);
  if (asksWhere) {
    // 28.10 fix: pick the place with the longest matching word/name ("conference center" -> Conference Center, not Core)
    const score = (p) => { const words = AI_PLACE_WORDS[p.id] || [p.name.toLowerCase()]; let best = t.includes(p.name.toLowerCase()) ? p.name.length + 100 : 0; for (const w of words) if (new RegExp("\\b" + w + "\\b").test(t)) best = Math.max(best, w.length); return best; };
    const ranked = AI_PLACES.map((p) => ({ p, s: score(p) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    for (const { p } of ranked.slice(0, 1)) {
      {
        const from = ctx.pos || { x: 0, z: 0 }, dx = p.x - from.x, dz = p.z - from.z, dist = Math.round(Math.hypot(dx, dz) / 10) * 10;
        return { intent: "directions", place: p.id, answer: dist < 25 ? `${p.name} is right here. ${p.desc}` : `${p.name} is about ${dist} m ${AI_DIR(dx, dz)} of here. ${p.desc} Open the map (M) and tap it to walk or take a taxi.`, confidence: 0.9 };
      }
    }
    return { intent: "directions-unknown", answer: null, confidence: 0.3 };
  }
  if (/\b(job|work|earn|money|salary|wage)\b/.test(t))
    return { intent: "jobs", answer: "Every city shop has shifts: stand at the shop and start a shift, finish the tasks in order, and the treasury pays you. Work on following days for a streak bonus.", confidence: 0.75 };
  if (/\b(buy|house|home|plot|land)\b/.test(t) && /\b(how|where|can i|want)\b/.test(t))
    return { intent: "property", answer: "Open the Land Office tab: every society shows free plots, sales, auctions and rentals. Everyone also gets a free studio in Starter Commons.", confidence: 0.75 };
  if (/\b(help|controls|how do i (move|walk|play))\b/.test(t))
    return { intent: "help", answer: "WASD to walk, E to interact, Tab for the menu, M for the map. Talk to anyone with a name above their head.", confidence: 0.85 };
  if (/\b(fyc|currency|cash out|real money|withdraw)\b/.test(t))
    return { intent: "currency", answer: "FYC are in-game credits for Fyrus only. You can't buy them with real money or cash them out.", confidence: 0.9 };
  return { intent: "open", answer: null, confidence: 0 };
}
// Which path answers this message?
//   rules    - a rule answered with confidence >= 0.7
//   llm      - open conversation, the character may use the LLM, and the LLM service is up and not overloaded
//   fallback - everything else (the character's in-character deterministic reply)
function aiDecide(r, opts = {}) {
  if (r.answer && r.confidence >= 0.7) return "rules";
  if (opts.llmEligible && opts.llmUp && !opts.overloaded) return "llm";
  return "fallback";
}
function aiFallback(ch, text, r) {
  const q = (ch?.quick?.length ? ` You could ask me: "${ch.quick[0]}"` : "") + (typeof aiCatch === "function" && aiCatch(ch?.id) ? " " + aiCatch(ch.id) : "");
  if (r?.intent === "directions-unknown") return `I'm not sure which place you mean. Try the market, the club, the pool, the campus or SkyPort.${q}`;
  return `${ch?.greeting || "Hi!"}${q}`;
}

// 27.8 shop assistants: exact answers from the shop's own data (items, prices, stock, returns, jobs); the model is only
// used for small talk and never states prices or stock
function aiShopRoute(text, shop, stock) {
  const t = AI_NORM(text), items = (shop.items || []).map((id) => ({ id, ...ITEMS[id] })).filter((x) => x.name);
  const find = () => items.find((it) => t.includes(it.name.toLowerCase()) || it.name.toLowerCase().split(" ").some((w) => w.length > 3 && new RegExp("\\b" + w + "s?\\b").test(t)));
  const left = (it) => stock && stock[it.id] != null ? (stock[it.id] === 0 ? "sold out right now" : `${stock[it.id]} in stock`) : "available";
  if (/\b(what do you (sell|have)|menu|products|items|what can i buy|show me)\b/.test(t))
    return { intent: "shop-list", answer: `At ${shop.name} we have: ${items.map((it) => `${it.icon || ""} ${it.name} (${it.price} FYC, ${left(it)})`.trim()).join(", ")}. Tap an item on the card to buy.`, confidence: 0.95 };
  const it = find();
  if (it && /\b(how much|price|cost|costs)\b/.test(t)) return { intent: "shop-price", answer: `${it.name} is ${it.price} FYC${stock && stock[it.id] === 0 ? ", but it's sold out right now" : ""}.`, confidence: 0.95 };
  if (it && /\b(in stock|available|have any|left|sold out)\b/.test(t)) return { intent: "shop-stock", answer: `${it.name}: ${left(it)}.`, confidence: 0.95 };
  const budget = t.match(/\b(?:under|below|less than|for|with)\s+(\d{1,6})\b/);
  if (/\b(recommend|suggest|what should i (buy|get)|cheap|best)\b/.test(t) || budget) {
    const max = budget ? +budget[1] : Infinity, ok = items.filter((x) => x.price <= max && !(stock && stock[x.id] === 0)).sort((a, b) => b.price - a.price);
    return { intent: "shop-recommend", answer: ok.length ? `${budget ? `For ${max} FYC or less` : "My pick"}: ${ok[0].name} (${ok[0].price} FYC)${ok[1] ? `, or ${ok[1].name} (${ok[1].price} FYC)` : ""}.` : `Nothing here fits ${max} FYC right now, sorry.`, confidence: 0.9 };
  }
  if (/\b(refund|return|give back|money back)\b/.test(t)) return { intent: "shop-refund", answer: "Unused items can be returned here within 10 minutes for the full price: use Return next to your receipt on this card.", confidence: 0.95 };
  if (/\b(job|work|shift|hiring)\b/.test(t) && shop.job) return { intent: "shop-job", answer: `Yes! We have ${shop.job.title.replace(/\s*shift$/i, "")} shifts paying ${shop.job.pay} FYC (plus streak bonuses). Start one from this card.`, confidence: 0.9 };
  if (/\b(buy (it|this|one|that) for me|order for me|pay for me)\b/.test(t)) return { intent: "shop-nobuy", answer: "I can't buy for you, but tap the item on the card and it's yours in a second.", confidence: 0.95 };
  return { intent: "open", answer: null, confidence: 0 };
}

// 27.10 business clerks: menu facts, hours and owner from the business record; refuses discounts and buying for people
function aiBizRoute(text, b) {
  const t = AI_NORM(text), items = b.menu || [], hrs = b.clerk && b.clerk.hours;
  const hoursTxt = hrs ? `We're open ${hrs.open}:00\u2013${hrs.close}:00${b.open ? " and open now" : ", closed right now"}.` : b.open ? "We're open now." : "We're closed right now.";
  const it = items.find((x) => t.includes(AI_NORM(x.name)) || AI_NORM(x.name).split(" ").some((w) => w.length > 3 && new RegExp("\\b" + w + "s?\\b").test(t)));
  if (/\b(discount|cheaper|deal|for free|free one|lower the price|haggle)\b/.test(t)) return { intent: "biz-nodiscount", tool: "price.discount", answer: `I can't change prices or give discounts: only ${b.ownerName} decides that.`, confidence: 0.95 };
  if (/\b(buy (it|this|one|that) for me|order for me|pay for me|give me money|transfer|withdraw)\b/.test(t)) return { intent: "biz-nomoney", tool: "money.move", answer: "I can't move money or buy for you. Tap Buy next to an item on this card.", confidence: 0.95 };
  if (/\b(what do you (sell|have)|menu|products|items|what can i buy|show me|offers)\b/.test(t))
    return { intent: "biz-menu", answer: items.length ? `At ${b.name} we have: ${items.map((x) => `${x.name} (${x.price} FYC)`).join(", ")}.` : `${b.name} has nothing on the menu yet.`, confidence: 0.95 };
  if (it && /\b(how much|price|cost|costs)\b/.test(t)) return { intent: "biz-price", answer: `${it.name} is ${it.price} FYC.`, confidence: 0.95 };
  if (/\b(open|close|closing|hours|when)\b/.test(t)) return { intent: "biz-hours", answer: hoursTxt, confidence: 0.9 };
  if (/\b(owner|who runs|who owns|your boss)\b/.test(t)) return { intent: "biz-owner", answer: `${b.name} is run by ${b.ownerName}. I'm the AI clerk.`, confidence: 0.9 };
  const budget = t.match(/\b(?:under|below|less than|for|with)\s+(\d{1,6})\b/);
  if (/\b(recommend|suggest|what should i (buy|get)|cheap|best)\b/.test(t) || budget) {
    const max = budget ? +budget[1] : Infinity, ok = items.filter((x) => x.price <= max).sort((x, y) => y.price - x.price);
    return { intent: "biz-recommend", answer: ok.length ? `${budget ? `For ${max} FYC or less` : "My pick"}: ${ok[0].name} (${ok[0].price} FYC)${ok[1] ? `, or ${ok[1].name} (${ok[1].price} FYC)` : ""}.` : `Nothing here fits ${max} FYC, sorry.`, confidence: 0.9 };
  }
  return { intent: "open", answer: null, confidence: 0 };
}

// 27.9 teachers: grounded in the course's own lessons; never give quiz answers
var AI_STOP = new Set("the a an and or of to in on for is are was be it this that what how why do does i you me my your with about can should".split(" "));
var aiWords = (s) => AI_NORM(s).split(" ").filter((w) => w.length > 2 && !AI_STOP.has(w));
function aiBestLesson(text, course) {
  const q = new Set(aiWords(text));
  let best = null, bs = 0;
  (course.lessons || []).forEach((l, i) => {
    const w = aiWords(l.title + " " + l.body), title = new Set(aiWords(l.title));
    const s = w.reduce((n, x) => n + (q.has(x) ? 1 : 0), 0) + [...title].reduce((n, x) => n + (q.has(x) ? 2 : 0), 0);
    if (s > bs) (bs = s), (best = { i, l, score: s });
  });
  return best;
}
function aiTeachRoute(text, course) {
  const t = AI_NORM(text), best = aiBestLesson(text, course);
  if (/\b(what will i learn|what is this course|what does this course|lessons|syllabus|course about)\b/.test(t))
    return { intent: "course-overview", answer: `${course.title}: ${course.summary} Lessons: ${(course.lessons || []).map((l, i) => `${i + 1}) ${l.title}`).join(", ")}.`, confidence: 0.95 };
  if (/\b(answer|correct option|which option|right option|cheat|solution)\b/.test(t))
    return { intent: "quiz-help", answer: best ? `I won't give quiz answers, but lesson ${best.i + 1}, "${best.l.title}", explains it. Read it once more and you'll get it.` : "I won't give quiz answers, but every question is covered in its lesson. Read it once more and you'll get it.", confidence: 0.95 };
  if (best && best.score >= 3 && /\b(what is|what are|explain|how do|how does|why|meaning|define|tell me about)\b/.test(t)) {
    const two = best.l.body.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    return { intent: "lesson-explain", lesson: best.i, answer: `From lesson ${best.i + 1}, "${best.l.title}": ${two}`, confidence: 0.8 };
  }
  return { intent: "open", lesson: best && best.score >= 2 ? best.i : null, answer: null, confidence: 0 };
}
// FYRUS 27.4 local dialogue engine. Players talk to named AI citizens with "npc_say"; rules answer facts at once
// (27.3); open conversation goes to ONE shared queue in front of the local Ollama model (loopback only), with a
// timeout, an overload limit and per-player pacing; anything that fails gets the in-character fallback.
//   env: AI_LLM=off disables the model; OLLAMA_HOST (default http://127.0.0.1:11434, must be loopback; not *_URL, which the demo guard strips);
//        OLLAMA_MODEL (default: qwen3.5:4b if installed, else the smallest installed); OLLAMA_TIMEOUT_MS (15000);
//        AI_QUEUE_MAX (6 waiting); AI_PLAYER_GAP_MS (2500 between one player's LLM questions)
function createAiChat(d) {
  const URL0 = (process.env.OLLAMA_HOST && /^https?:/.test(process.env.OLLAMA_HOST) ? process.env.OLLAMA_HOST : "http://127.0.0.1:11434");
  const LOOP = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(URL0);
  const ON = String(process.env.AI_LLM || "on") !== "off" && LOOP;
  const TIMEOUT = () => +(process.env.OLLAMA_TIMEOUT_MS || 15e3), QMAX = () => +(process.env.AI_QUEUE_MAX || 6), GAP = () => +(process.env.AI_PLAYER_GAP_MS || 2500);
  // 27.4 measured on the Mac: the model on the GPU froze the game for 11.6 s while loading and dropped it to 34 fps
  // while answering (Ollama and the browser share the GPU). Default: model on the CPU (AI_GPU=on to change), kept
  // loaded for AI_KEEP (30m) and loaded once at start-up, before anyone talks, instead of during play.
  const GPU = () => String(process.env.AI_GPU || "off") === "on" ? {} : { num_gpu: 0 };
  const KEEP = () => process.env.AI_KEEP || "30m";
  // 27.12 answer length; context window only when AI_CTX is set (the model default otherwise). The preload MUST use the
  // same num_ctx as the questions, or Ollama reloads the model on the first question (measured on the Mac: 17 s preload,
  // a 15 s timeout and a 1.8 s frame when they differed); a 2048 window gave no measurable speed-up on the CPU.
  const CTXO = () => +process.env.AI_CTX > 0 ? { num_ctx: +process.env.AI_CTX } : {}, PREDICT = () => +(process.env.AI_PREDICT || 80);
  let preloaded = false;
  const ST = { promptChars: [], tokIn: [], tokOut: [], promptMs: [], genMs: [], cacheHits: 0, up: false, model: null, models: [], lastCheck: 0, asked: 0, rules: 0, llm: 0, fallback: 0, timeouts: 0, errors: 0, overloaded: 0, paced: 0, queueMax: 0, ms: [] };
  const queue = [];
  let busy = false;
  const lastAsk = /* @__PURE__ */ new Map(), mem = /* @__PURE__ */ new Map();
  // 27.5 short-term memory: per player x character, the last AI_STM_TURNS messages (default 8 = 4 exchanges), at most
  // AI_STM_CHARS characters go to the model (1 200), forgotten after AI_STM_TTL_MS idle (30 min) or on "npc_forget";
  // never written to disk. The last place asked about is kept so "is it far?" can be answered by rules.
  const STM_TURNS = () => +(process.env.AI_STM_TURNS || 8), STM_CHARS = () => +(process.env.AI_STM_CHARS || 1200), STM_TTL = () => +(process.env.AI_STM_TTL_MS || 18e5);
  const stmGet = (key) => {
    const e = mem.get(key);
    if (e && Date.now() - e.at > STM_TTL()) return mem.delete(key), null;
    return e;
  };
  const stmBudget = (turns) => {
    const out = [];
    let n = 0;
    for (let i = turns.length - 1; i >= 0; i--) {
      n += turns[i].content.length;
      if (n > STM_CHARS()) break;
      out.unshift(turns[i]);
    }
    if (out.length && out[0].role === "assistant") out.shift();
    return out;
  };
  setInterval(() => {
    const now = Date.now();
    for (const [k, e] of mem) if (now - e.at > STM_TTL()) mem.delete(k);
  }, 3e5).unref?.();
  // 27.6 controlled long-term memory, saved in the DB: per player x character a few facts the PLAYER stated (name,
  // likes, job, favourites), found by fixed patterns (never by the model), max 8 x 80 chars, nothing that looks like
  // contact details, secrets or numbers; visit count and first meeting. Players can list, delete or switch it off.
  const LTM = () => (d.db.aimem ||= { users: {}, optOut: {} });
  // 27.13 retention: what a citizen remembers about a player is deleted after AI_LTM_DAYS (90) without a visit;
  // short-term conversations already expire after AI_STM_TTL_MS. Checked at start-up and every hour.
  const KEEP_DAYS = () => +(process.env.AI_LTM_DAYS || 90);
  function ltmSweep() {
    const cut = Date.now() - KEEP_DAYS() * 864e5, U = LTM().users;
    let n = 0;
    for (const uid of Object.keys(U)) {
      for (const cid of Object.keys(U[uid])) if ((U[uid][cid].last || U[uid][cid].first || 0) < cut) delete U[uid][cid], n++;
      if (!Object.keys(U[uid]).length) delete U[uid];
    }
    if (n) d.save();
    ST.ltmExpired = (ST.ltmExpired || 0) + n;
    return n;
  }
  setTimeout(ltmSweep, 2e3);
  setInterval(ltmSweep, +(process.env.AI_LTM_SWEEP_MS || 36e5));
  const stmDropUser = (uid, chId) => { for (const k of [...mem.keys()]) if (k.startsWith(uid + "|") && (!chId || k === uid + "|" + chId)) mem.delete(k); };
  const LTM_MAX = 8;
  const BLOCK = /(@|https?:|www\.|\d{3,}|password|passcode|pin\b|address|street|road|phone|whatsapp|email|bank|card|cnic|passport|iban|my (son|daughter|kid)'?s? (age|school))/i;
  const PATTERNS = [
    [/\b(?:my name is|call me|i am called|i'm called)\s+([a-z][a-z' -]{1,20})/i, "name", (v) => v.replace(/\b\w/g, (c) => c.toUpperCase())],
    [/\bi (?:really )?(?:like|love|enjoy)\s+([a-z][a-z0-9' -]{2,40})/i, "likes", (v) => v],
    [/\bmy fav(?:ou?rite)? ([a-z]{3,15}) is\s+([a-z][a-z0-9' -]{1,30})/i, "favourite", (v, m) => `${m[1]}: ${m[2]}`],
    [/\bi (?:work as|am a|'m a)\s+([a-z][a-z' -]{2,30})/i, "job", (v) => v]
  ];
  function ltmLearn(uid, chId, text) {
    // a message that mentions contact details, links, secrets or long numbers teaches nothing at all
    if (LTM().optOut[uid] || BLOCK.test(text)) return 0;
    let n = 0;
    for (const [re, k, fmt] of PATTERNS) {
      const m = text.match(re);
      if (!m) continue;
      const raw = (m[2] && k !== "favourite" ? m[2] : m[1]).trim().replace(/[.!?,;:].*$/, "").replace(k === "name" ? /\s+(and|but|because|so|who|from|in|at)\b.*$/i : /\s+(and i|but|because)\b.*$/i, "").replace(/^(a|an|the)\s+/i, "").slice(0, 60);
      // 27.13 a name is at most 3 words ("my name is Tia and I like jazz" -> "Tia")
      if (k === "name" && raw.split(/\s+/).length > 3) continue;
      const v = d.filter(fmt(raw, m)).slice(0, 80);
      if (!v || v.length < 2 || BLOCK.test(v) || BLOCK.test(m[0])) continue;
      const rec = ((LTM().users[uid] ||= {})[chId] ||= { facts: [], visits: 0, first: Date.now() });
      const single = k === "name" || k === "job";
      rec.facts = rec.facts.filter((f) => !(f.k === k && (single || f.v.toLowerCase() === v.toLowerCase())));
      rec.facts.push({ k, v, at: Date.now() });
      while (rec.facts.length > LTM_MAX) rec.facts.shift();
      n++;
    }
    if (n) d.save();
    return n;
  }
  const ltmGet = (uid, chId) => LTM().optOut[uid] ? null : LTM().users[uid]?.[chId] || null;
  const ltmText = (rec) => !rec || !rec.facts.length ? "" : `\nWhat you remember about them (they told you): ${rec.facts.map((f) => f.k === "name" ? `they like to be called ${f.v}` : f.k === "likes" ? `they like ${f.v}` : f.k === "job" ? `they work as ${/^[aeiou]/i.test(f.v) ? "an" : "a"} ${f.v}` : `favourite ${f.v}`).join("; ")}. You have met ${rec.visits} time${rec.visits === 1 ? "" : "s"}.`;
  async function health() {
    if (!ON) return;
    ST.lastCheck = Date.now();
    try {
      const ac = new AbortController(), to = setTimeout(() => ac.abort(), 3e3);
      const r = await fetch(URL0 + "/api/tags", { signal: ac.signal }).then((x) => x.json());
      clearTimeout(to);
      ST.models = (r.models || []).map((m) => ({ name: m.name, size: m.size || 0 }));
      const want = process.env.OLLAMA_MODEL;
      ST.model = want && ST.models.some((m) => m.name === want) ? want : ST.models.find((m) => m.name === "qwen3.5:4b")?.name || ST.models.slice().sort((a, b) => a.size - b.size)[0]?.name || null;
      ST.up = !!ST.model;
      if (ST.up && !preloaded && String(process.env.AI_PRELOAD || "on") !== "off") {
        preloaded = true;
        const t0 = Date.now();
        fetch(URL0 + "/api/generate", { method: "POST", body: JSON.stringify({ model: ST.model, prompt: "", keep_alive: KEEP(), options: { ...CTXO(), ...GPU() } }) }).then((x) => x.json()).then(() => (ST.preloadMs = Date.now() - t0)).catch(() => (preloaded = false));
      }
    } catch {
      ST.up = false;
    }
  }
  health();
  setInterval(health, 6e4).unref?.();
  // 27.12 token budget: the static prefix (persona, short facts, rules) is identical for every question to the same
  // character, so Ollama can reuse its prompt cache; place descriptions are sent only for the 3 nearest places and any
  // place named in the question, at the end of the prompt (was all 15 descriptions: about 900 characters more per call)
  const FACTS = () => `Fyrus City facts: year 2040, a clean smart city. Places: ${AI_PLACES.map((p) => p.name).join(", ")}. FYC are in-game credits only: they cannot be bought with or exchanged for real money.`;
  const nearbyText = (pos, text) => {
    const t = AI_NORM(text), named = AI_PLACES.filter((p) => t.includes(AI_NORM(p.name)));
    const near = AI_PLACES.slice().sort((a, b) => Math.hypot(a.x - pos.x, a.z - pos.z) - Math.hypot(b.x - pos.x, b.z - pos.z)).slice(0, 3);
    const L = [...new Set([...named, ...near])].slice(0, 5);
    return `\nNearby / mentioned places: ${L.map((p) => `${p.name} (${p.desc})`).join("; ")}.`;
  };
  // 27.12 reply cache: a first question to a character, with no conversation, memory or lesson context, gets the same
  // answer for AI_CACHE_MS (10 min) instead of another model call
  const RC = new Map(), RC_MS = () => +(process.env.AI_CACHE_MS || 6e5);
  const rcKey = (ch, text) => ch.id + "|" + AI_NORM(text).slice(0, 160);
  const RULES = "Rules: stay in character; reply in 1-3 short sentences; be warm and natural; never give prices, phone numbers, links or real-world advice about money, health or law; never claim to be a real person outside the game; if asked about something you don't know, say so briefly and suggest asking another citizen.";
  function charOf(m) {
    const core = AI_CHARS.find((c) => c.id === String(m.npc || ""));
    if (core) return core;
    const sm = /^shop:([a-z0-9-]{1,30})$/.exec(String(m.npc || "")), shop = sm && typeof svcById === "function" ? svcById(sm[1]) : null;
    const tm = /^teacher:([a-z0-9-]{1,40})$/.exec(String(m.npc || "")), course = tm && d.db?.edu?.courses && own(d.db.edu.courses, tm[1]) ? d.db.edu.courses[tm[1]] : null;
    const bm = /^biz:([0-9]{1,8})$/.exec(String(m.npc || "")), bz = bm && d.bizInfo ? d.bizInfo(bm[1]) : null;
    if (bz) return bz.clerk ? { id: "biz:" + bz.id, biz: bz, name: `${bz.clerk.name} (${bz.name})`, role: "clerk", persona: `You are ${bz.clerk.name}, the AI clerk at ${bz.name}, a ${bz.kind} run by ${bz.ownerName} in Fyrus City (2040). You help customers choose from the menu only. Never state prices yourself, never promise discounts or free items, and never say you can move money: only the owner decides that.`, greeting: `Welcome to ${bz.name}! I'm ${bz.clerk.name}.`, quick: ["What do you have?"] } : { id: "biz:" + bz.id, biz: bz, noStaff: true, name: bz.name, role: "business" };
    if (course) return { id: "teacher:" + course.id, course, name: `${course.teacherName || "Fyrus Academy"} (${course.title})`, role: "teacher", persona: `You are a teacher from ${course.teacherName || "Fyrus Academy"}, teaching "${course.title}". You explain simply and kindly with one small example. You never give the answer to a quiz question; you point to the lesson instead.`, greeting: `Welcome to ${course.title}! Ask me about any lesson.`, quick: ["What will I learn?"] };
    if (shop) return { id: "shop:" + shop.id, shop, name: `${shop.name} assistant`, role: "shop assistant", persona: `You are the friendly assistant at ${shop.name} (${shop.sub || "a shop"}) in Fyrus City (2040). You help customers choose. Never state prices or stock yourself: say the card shows them.`, greeting: `Welcome to ${shop.name}! Ask me about anything we sell.`, quick: ["What do you sell?"] };
    // procedural / player-made citizens: the server builds the persona from a few short, cleaned fields only
    const c = m.char && typeof m.char === "object" ? m.char : {};
    const name = d.filter(d.clean(c.name, 24)) || "Citizen", role = d.filter(d.clean(c.role, 40)) || "resident", style = d.filter(d.clean(c.style, 60)), bio = d.filter(d.clean(c.bio, 200));
    return { noCache: true, id: "x:" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30), name, role, persona: `You are ${name}, a ${role} in Fyrus City (2040).${style ? ` Personality: ${style}.` : ""}${bio ? ` About you: ${bio}` : ""}`, greeting: `Hi, I'm ${name}!`, quick: [], custom: true };
  }
  function clean(text) {
    let t = String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<\/?[^>]{1,20}>/g, "").replace(/https?:\/\/\S+|www\.\S+/gi, "").replace(/\s+/g, " ").trim();
    if (t.length > 320) t = t.slice(0, 320);
    // a reply cut by the token limit ends at its last full sentence
    if (t && !/[.!?؟"')]$/.test(t)) {
      const cut = t.replace(/[^.!?؟]*$/, "");
      t = cut.length >= 20 ? cut : t + "…";
    }
    return d.filter(t);
  }
  async function callModel(ch, history, text, who, memText) {
    const ac = new AbortController(), to = setTimeout(() => ac.abort(), TIMEOUT());
    try {
      const r = await fetch(URL0 + "/api/chat", { method: "POST", signal: ac.signal, body: JSON.stringify({ model: ST.model, stream: false, think: false, keep_alive: KEEP(), options: { num_predict: PREDICT(), temperature: 0.7, ...CTXO(), ...GPU() }, messages: [{ role: "system", content: `${ch.persona}\n${FACTS()}\n${RULES}${who ? `\nYou are talking with ${who}.` : ""}${memText || ""}` }, ...history, { role: "user", content: text }] }) }).then((x) => x.json());
      ST.promptChars.push(JSON.stringify(history).length + text.length + ch.persona.length + (memText || "").length + 900);
      if (r?.prompt_eval_count) ST.tokIn.push(r.prompt_eval_count), ST.tokOut.push(r.eval_count || 0), ST.promptMs.push(Math.round((r.prompt_eval_duration || 0) / 1e6)), ST.genMs.push(Math.round((r.eval_duration || 0) / 1e6));
      for (const a of [ST.promptChars, ST.tokIn, ST.tokOut, ST.promptMs, ST.genMs]) if (a.length > 50) a.shift();
      return r?.message?.content || r?.response || "";
    } finally {
      clearTimeout(to);
    }
  }
  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    const job = queue.shift(), t0 = Date.now();
    callModel(job.ch, job.history, job.text, job.who, job.mem).then((raw) => {
      const out = clean(raw);
      if (!out) throw new Error("empty");
      ST.llm++;
      ST.ms.push(Date.now() - t0);
      if (ST.ms.length > 50) ST.ms.shift();
      job.done(out, "llm");
    }).catch((e) => {
      e?.name === "AbortError" ? ST.timeouts++ : ST.errors++;
      if (e?.name !== "AbortError") ST.up = false, setTimeout(health, 5e3);
      ST.fallback++;
      job.done(aiFallback(job.ch, job.text, { intent: "open" }), e?.name === "AbortError" ? "fallback-timeout" : "fallback-error");
    }).finally(() => {
      busy = false;
      pump();
    });
  }
  function onMessage2(me, m) {
    if (m.t !== "npc_say" && m.t !== "ai_status" && m.t !== "npc_forget" && !String(m.t).startsWith("ai_mem")) return false;
    if (m.t === "ai_mem_list") {
      const all = LTM().users[me.u.id] || {};
      d.send(me.ws, { t: "ai_mem", optOut: !!LTM().optOut[me.u.id], chars: Object.entries(all).map(([id, r]) => ({ id, name: AI_CHARS.find((c) => c.id === id)?.name || id.replace(/^x:/, ""), facts: r.facts, visits: r.visits, first: r.first, last: r.last || r.first })), keepDays: KEEP_DAYS() });
      return true;
    }
    if (m.t === "ai_mem_forget") {
      const all = LTM().users[me.u.id];
      if (all && m.npc && Object.prototype.hasOwnProperty.call(all, String(m.npc))) delete all[String(m.npc)];
      else if (!m.npc) delete LTM().users[me.u.id];
      stmDropUser(me.u.id, m.npc ? String(m.npc) : null);
      d.save();
      d.send(me.ws, { t: "ok", text: m.npc ? "That citizen forgot what you told them." : "Every citizen forgot what you told them." });
      return true;
    }
    if (m.t === "ai_mem_opt") {
      if (m.on === false) (LTM().optOut[me.u.id] = Date.now()), delete LTM().users[me.u.id], stmDropUser(me.u.id);
      else delete LTM().optOut[me.u.id];
      d.save();
      d.send(me.ws, { t: "ok", text: m.on === false ? "Citizens won't remember anything about you, and what they knew is deleted." : "Citizens may remember what you tell them again." });
      return true;
    }
    if (m.t === "ai_mem") return true;
    if (m.t === "npc_forget") {
      const ch0 = charOf(m);
      mem.delete(me.u.id + "|" + ch0.id);
      d.send(me.ws, { t: "npc_forgot", npc: ch0.id });
      return true;
    }
    const u = me.u, reply = (x) => d.send(me.ws, x);
    if (m.t === "ai_status") return reply({ t: "ai_status", on: ON, up: ST.up, model: ST.model, queue: queue.length, busy, stats: { ...ST, ms: void 0, promptChars: void 0, tokIn: void 0, tokOut: void 0, promptMs: void 0, genMs: void 0, avg: Object.fromEntries(["promptChars", "tokIn", "tokOut", "promptMs", "genMs"].map((k) => [k, ST[k].length ? Math.round(ST[k].reduce((a, b) => a + b, 0) / ST[k].length) : null])), cache: RC.size, p50: ST.ms.length ? ST.ms.slice().sort((a, b) => a - b)[ST.ms.length >> 1] : null } }), true;
    const text = d.clean(m.text, 300), ch = charOf(m), rid = d.clean(m.rid, 40) || void 0;
    if (!text) return true;
    ST.asked++;
    const key = u.id + "|" + ch.id, fresh0 = !stmGet(key), ent = stmGet(key) || { turns: [], at: Date.now() }, hist = ent.turns;
    // 27.6: a new conversation counts as a visit; facts the player states are learned by fixed patterns
    if (fresh0 && !LTM().optOut[u.id]) {
      const rec = ((LTM().users[u.id] ||= {})[ch.id] ||= { facts: [], visits: 0, first: Date.now() });
      rec.visits++;
      rec.last = Date.now();
      rec.last = Date.now();
      d.save();
    }
    ltmLearn(u.id, ch.id, text);
    const lt = ltmGet(u.id, ch.id);
    const done = (out, source, place) => {
      hist.push({ role: "user", content: text }, { role: "assistant", content: out });
      while (hist.length > STM_TURNS()) hist.shift();
      ent.at = Date.now();
      if (place) ent.place = place;
      mem.delete(key);
      mem.set(key, ent);
      if (mem.size > 2e3) mem.delete(mem.keys().next().value);
      reply({ t: "npc_reply", npc: ch.id, rid, text: out, source, remembered: hist.length });
    };
    if (ch.noStaff) return reply({ t: "npc_reply", npc: ch.id, rid, text: `Nobody is staffing ${ch.name} right now. The menu on this card still works.`, source: "rules", remembered: 0 }), true;
    let r = aiHealth(text) || aiDisclose(text, { biz: !!ch.biz }) || (ch.biz ? aiBizRoute(text, ch.biz) : ch.shop ? aiShopRoute(text, ch.shop, d.stockInfo ? d.stockInfo(ch.shop.id) : null) : ch.course ? aiTeachRoute(text, ch.course) : { answer: null });
    const ground = ch.biz ? `\nMenu (the only things sold here): ${ch.biz.menu.map((x) => x.name).join(", ") || "nothing yet"}. ${ch.biz.open ? "Open now." : "Closed now."}` : ch.course && r.lesson != null ? `\nUse this lesson text as your source and do not contradict it ("${ch.course.lessons[r.lesson].title}"): ${ch.course.lessons[r.lesson].body.slice(0, 900)}` : "";
    if (ch.biz && r.tool && d.clerkDenied) d.clerkDenied(ch.biz.id, r.tool, "asked by a customer");
    if (!r.answer) r = aiRoute(text, ch, { pos: { x: me.x || 0, z: me.z || 0 }, courses: Object.values(d.db?.edu?.courses || {}).filter((c) => c && c.title && c.status !== "draft").map((c) => c.title), civic: typeof politics !== "undefined" && politics ? politics.state() : null, acts: typeof acts28 !== "undefined" && acts28 ? acts28.open() : null, events: Object.values(d.db?.halls?.events || {}).filter((e) => e && e.status === "scheduled").sort((a, b) => a.start - b.start).slice(0, 8).map((e) => ({ title: e.title, start: e.start, end: e.end, price: e.price, hallName: (typeof hallById === "function" && hallById(e.hall)?.name) || "hall" })) });
    // follow-up about the place talked about last ("is it far?", "how do I get there?")
    if (!r.answer && ent.place && /\b(is it far|how far|far from here|get there|go there|how long|is it close|is it near|how do i get there)\b/i.test(text) && text.length < 60) {
      const p = AI_PLACES.find((x) => x.id === ent.place);
      if (p) {
        const dist = Math.round(Math.hypot(p.x - (me.x || 0), p.z - (me.z || 0)) / 10) * 10;
        r = { intent: "followup", place: p.id, answer: dist < 25 ? `You're already at ${p.name}!` : `${p.name} is about ${dist} m away \u2014 roughly ${Math.max(1, Math.round(dist / 80))} min on foot, or take a taxi from the map.`, confidence: 0.8 };
      }
    }
    const eligible = ON && (m.llm !== false);
    const now = Date.now(), paced = now - (lastAsk.get(u.id) || 0) < GAP() || queue.some((j) => j.uid === u.id);
    // 27.14 crowd test: with a 2.5 s model and 6 waiting, the last player waited 17 s. A question that would wait longer
    // than AI_MAX_WAIT_MS (9 s, from the recent median answer time) gets the instant fallback instead.
    const med = ST.ms.length ? ST.ms.slice().sort((a, b) => a - b)[ST.ms.length >> 1] : 3e3;
    const estWait = (queue.length + (busy ? 1 : 0) + 1) * med;
    const overloaded = queue.length >= QMAX() || estWait > +(process.env.AI_MAX_WAIT_MS || 9e3);
    const path = aiDecide(r, { llmEligible: eligible && !paced, llmUp: ST.up, overloaded });
    // greeting a returning player by the name they gave
    if (r.intent === "greet" && lt && lt.visits > 1) {
      const nm = lt.facts.find((f) => f.k === "name");
      r = { ...r, answer: aiWelcomeBack(ch.id, nm && nm.v) };
    }
    if (path === "rules") return ST.rules++, done(r.answer, "rules", r.place), true;
    if (path === "llm") {
      lastAsk.set(u.id, now);
      const who = d.shown ? d.shown(u.id) : u.name, lmem = ltmText(lt);
      const personal = /\d|@|\b(my|mine|i am|i'm|call me)\b/i.test(text);
      const ck = hist.length === 0 && !lmem && !ground && !ch.biz && !ch.noCache && !personal ? rcKey(ch, text) : null, hit = ck && RC.get(ck);
      if (hit && Date.now() - hit.at < RC_MS()) return ST.cacheHits++, done(hit.text, "llm-cache"), true;
      const done2 = (out, source) => {
        if (ck && source === "llm" && !(who && out.toLowerCase().includes(String(who).toLowerCase()))) {
          RC.set(ck, { text: out, at: Date.now() });
          if (RC.size > 300) RC.delete(RC.keys().next().value);
        }
        done(out, source);
      };
      queue.push({ uid: u.id, ch, text, history: stmBudget(hist), who, mem: aiPersonaLines(ch.id, (/* @__PURE__ */ new Date()).getHours(), lt?.visits || 1, hist.length === 0) + lmem + ground + nearbyText({ x: me.x || 0, z: me.z || 0 }, text), done: done2 });
      ST.queueMax = Math.max(ST.queueMax, queue.length);
      reply({ t: "npc_typing", npc: ch.id, rid, position: queue.length });
      pump();
      return true;
    }
    if (overloaded) ST.overloaded++;
    if (paced && eligible) ST.paced++;
    ST.fallback++;
    done(aiFallback(ch, text, r), "fallback");
    return true;
  }
  return { onMessage: onMessage2, stats: ST, health };
}
// FYRUS 28.11 player-made activities: any citizen can post a free, short activity at a real place ("pickup football at
// Core Plaza in 15 min, up to 10 people"); others join or leave; everyone who joined gets a note when it starts; it ends
// after an hour and disappears. No money, no booking. Server rules: fixed kinds and places, filtered 60-char title,
// one open activity per citizen, 2-minute create cooldown, 40 open activities city-wide, capacity 2-30, start in 5-120 min,
// banned/suspended accounts cannot post or join. Kill switch P28_OFF=acts.
var ACT_KINDS = { game: "Pickup game", walk: "Group walk", dance: "Dance meetup", study: "Study group", picnic: "Picnic", race: "Car meet & race", chat: "Hangout", photo: "Photo walk" };
var ACT_LEN = () => +(process.env.ACT_LEN_MS || 36e5);
function createActs(d) {
  if (!d.db.acts) { d.db.acts = { list: {}, seq: 1, last: {} }; d.save(); }
  const A = d.db.acts;
  A.last ||= {};
  const OFF = () => /(^|,)(acts|all)(,|$)/.test(process.env.P28_OFF || "");
  const placeById = (id) => (typeof AI_PLACES !== "undefined" ? AI_PLACES : []).find((p) => p.id === id);
  const open = () => Object.values(A.list).filter((a) => a.end > Date.now()).sort((a, b) => a.start - b.start);
  const pub = (a, uid) => ({ id: a.id, kind: a.kind, kindName: ACT_KINDS[a.kind], place: a.place, placeName: placeById(a.place)?.name || a.place, title: a.title, byName: a.byName, mine: a.by === uid, start: a.start, end: a.end, max: a.max, going: a.joined.length, joined: a.joined.includes(uid) });
  const list = (uid) => ({ t: "act_list", acts: open().slice(0, 40).map((a) => pub(a, uid)), now: Date.now(), kinds: ACT_KINDS, places: (typeof AI_PLACES !== "undefined" ? AI_PLACES : []).filter((p) => !p.id.startsWith("soc-")).map((p) => ({ id: p.id, name: p.name })) });
  const note = (id, text) => { const l = d.liveOf(id); if (l) d.send(l.ws, { t: "note", text }); };
  const changed = () => { d.save(); d.broadcast({ t: "act_changed" }); };
  const blocked = (u) => !!(u.banned && u.banned.until > Date.now()) || !!d.bank?.acct?.(u.id)?.banned;
  setInterval(() => {
    const now = Date.now();
    let dirty = false;
    for (const a of Object.values(A.list)) {
      if (!a.started && a.start <= now && a.end > now) { a.started = now; dirty = true; a.joined.forEach((id) => note(id, `"${a.title}" is starting now at ${placeById(a.place)?.name || "the meeting point"}. Open the map (M) to get there.`)); }
      if (a.end + 6e5 < now) { delete A.list[a.id]; dirty = true; }
    }
    if (dirty) changed();
  }, +(process.env.ACT_TICK_MS || 1e4));
  function onMessage(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("act_")) return false;
    const u = me.u, reply = (x) => d.send(me.ws, x), err = (text) => (reply({ t: "err", text }), true), ok = (text) => reply({ t: "ok", text });
    if (OFF()) return err("Player activities are switched off right now.");
    if (m.t === "act_list") return reply(list(u.id)), true;
    if (blocked(u)) return err("This account is suspended.");
    const a = typeof m.id === "string" && Object.prototype.hasOwnProperty.call(A.list, m.id) ? A.list[m.id] : null;
    switch (m.t) {
      case "act_create": {
        const now = Date.now();
        if (!Object.prototype.hasOwnProperty.call(ACT_KINDS, m.kind)) return err("Pick a kind of activity.");
        const p = placeById(String(m.place || ""));
        if (!p || p.id.startsWith("soc-")) return err("Pick a meeting place from the list.");
        const title = d.filter(String(m.title || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60));
        if (title.length < 3) return err("Give your activity a short title.");
        const inMin = Math.round(+m.inMin), max = Math.round(+m.max);
        if (!(inMin >= 5 && inMin <= 120)) return err("Start between 5 and 120 minutes from now.");
        if (!(max >= 2 && max <= 30)) return err("Choose 2 to 30 people.");
        if (open().some((x) => x.by === u.id)) return err("You already have an open activity. Cancel it first.");
        if (A.last[u.id] && now - A.last[u.id] < +(process.env.ACT_COOLDOWN_MS || 12e4)) return err("Please wait a moment before posting another activity.");
        if (open().length >= 40) return err("The city board is full right now. Try again later.");
        const id = "a" + A.seq++, start = now + inMin * +(process.env.ACT_MINUTE_MS || 6e4);
        A.list[id] = { id, by: u.id, byName: d.shown(u.id), kind: m.kind, place: p.id, title, start, end: start + ACT_LEN(), max, joined: [u.id], at: now };
        A.last[u.id] = now;
        ok(`Posted: "${title}" at ${p.name} in ${inMin} min. Others can join from Activities.`);
        changed();
        return true;
      }
      case "act_join": {
        if (!a || a.end <= Date.now()) return err("That activity is over.");
        if (a.joined.includes(u.id)) return err("You already joined.");
        if (a.joined.length >= a.max) return err("That activity is full.");
        a.joined.push(u.id);
        ok(`You joined "${a.title}". We'll remind you when it starts.`);
        if (a.by !== u.id) note(a.by, `${d.shown(u.id)} joined your activity "${a.title}" (${a.joined.length}/${a.max}).`);
        changed();
        return true;
      }
      case "act_leave": {
        if (!a || !a.joined.includes(u.id)) return err("You are not in that activity.");
        if (a.by === u.id) return err("You host it: cancel it instead.");
        a.joined = a.joined.filter((x) => x !== u.id);
        ok(`You left "${a.title}".`);
        changed();
        return true;
      }
      case "act_cancel": {
        if (!a) return err("No such activity.");
        if (a.by !== u.id && !d.isAdmin(u.id)) return err("Only the host can cancel it.");
        a.joined.filter((x) => x !== u.id).forEach((id) => note(id, `"${a.title}" was cancelled by the host.`));
        delete A.list[a.id];
        ok("Activity cancelled.");
        changed();
        return true;
      }
    }
    return err("Unknown activity request.");
  }
  return { onMessage, open: () => open().map((a) => pub(a, null)) };
}
// FYRUS 28.12 city governance rules: one place for the city's rules (from the Terms of Use section 4 and the Constitution)
// and the real enforcement numbers the chat/report code uses (the constants below ARE what index.2.mjs enforces), so
// what players read always matches what happens. rules_get returns both. Kill switch P28_OFF=rules (screen + rule
// references in enforcement messages off; enforcement itself never changes).
var RULES28 = { FILTER_BLOCKS: 5, FILTER_WINDOW_MS: 6e5, FILTER_MUTE_MS: 9e5, REPORTS_TO_PAUSE: 3, REPORT_PAUSE_MS: 864e5, REPORTS_PER_DAY: 15 };
var CITY_RULES = [
  { n: 1, title: "Respect everyone", text: "No harassment, hate, threats or bullying. Every religion is respected; mocking or attacking a faith is forbidden." },
  { n: 2, title: "Keep it clean", text: "No sexual content, and nothing that sexualises anyone. Content involving minors is banned outright." },
  { n: 3, title: "No scams", text: "No fake listings and no asking for payment or contact outside Fyrus. A proven scam means a full refund to the victim and a permanent ban." },
  { n: 4, title: "No real-world politics or impersonation", text: "No real political parties or politicians in Fyrus elections, and no pretending to be real people, brands or officials." },
  { n: 5, title: "Play fair", text: "No cheating, bots, bug exploits, or extra accounts to vote or farm rewards. One citizen, one passport, one vote." },
  { n: 6, title: "Your own content only", text: "Upload only what you made or may use." },
  { n: 7, title: "FYC is play money", text: "FYC is an in-city credit. It is never traded for real money or crypto." },
  { n: 8, title: "Stay safe", text: "Never share passwords, bank or card details, not even with \"staff\". Links and contact details from brand-new accounts are blocked." }
];
var rules28Off = () => /(^|,)(rules|all)(,|$)/.test(process.env.P28_OFF || "");
function rules28Payload() {
  const R = RULES28, min = (ms) => Math.round(ms / 6e4), h = (ms) => Math.round(ms / 36e5);
  return { t: "rules", rules: CITY_RULES, enforcement: [
    `The chat filter blocks messages that break rules 1, 2, 3 or 8. ${R.FILTER_BLOCKS} blocked messages within ${min(R.FILTER_WINDOW_MS)} minutes pause your chat for ${min(R.FILTER_MUTE_MS)} minutes.`,
    `Report anyone from their profile or the chat (⋯ → Report). When ${R.REPORTS_TO_PAUSE} trusted citizens report the same person within ${h(R.REPORT_PAUSE_MS)} hours, that person's chat is paused for ${h(R.REPORT_PAUSE_MS)} hours until a judge reviews it. Each citizen can send up to ${R.REPORTS_PER_DAY} reports a day.`,
    "Moderators can mute chat for hours; Fyrus judges can disqualify candidates, deregister parties, and suspend or ban accounts.",
    "Payment problems go to the Fyrus Court (Nation › Law & Court): the money stays frozen in escrow while a judge decides."
  ] };
}
function createRules(d) {
  function onMessage(me, m) {
    if (m.t !== "rules_get") return false;
    if (rules28Off()) return d.send(me.ws, { t: "err", text: "The rules screen is switched off; read the Terms of Use at /terms." }), true;
    d.send(me.ws, rules28Payload());
    return true;
  }
  return { onMessage };
}
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
// 24.7 safe load: a missing file starts a fresh database, but an existing file that cannot be parsed is NEVER
// overwritten: it is kept as fyrus.json.corrupt-<time> and the newest readable backup (backups/) is loaded instead.
var BACKUP_DIR = path2.join(DATA_DIR, "backups"), PERSIST = { loadedFrom: null, corrupt: null, backups: 0 };
function readDb(f) {
  return JSON.parse(fs2.readFileSync(f, "utf8"));
}
fs2.mkdirSync(DATA_DIR, { recursive: true });
if (!fs2.existsSync(dbFile)) console.log("fresh database at", dbFile), PERSIST.loadedFrom = "fresh";
else
  try {
    db = { ...db, ...readDb(dbFile) };
    PERSIST.loadedFrom = "main";
    console.log("loaded", Object.keys(db.users).length, "users");
  } catch (e) {
    const keep = dbFile + ".corrupt-" + Date.now();
    try {
      fs2.renameSync(dbFile, keep);
    } catch {}
    PERSIST.corrupt = keep;
    console.error("DATABASE UNREADABLE, kept as", keep, String(e && e.message || e));
    let list = [];
    try {
      list = fs2.readdirSync(BACKUP_DIR).filter((n) => /^fyrus-\d+\.json$/.test(n)).sort().reverse();
    } catch {}
    for (const n of list)
      try {
        db = { ...db, ...readDb(path2.join(BACKUP_DIR, n)) };
        PERSIST.loadedFrom = "backup:" + n;
        console.error("restored from backup", n, Object.keys(db.users).length, "users");
        break;
      } catch {}
    if (!PERSIST.loadedFrom) {
      PERSIST.loadedFrom = "fresh-after-corrupt";
      console.error("no readable backup: starting empty; the corrupt file was kept");
    }
  }
// rolling backups: a copy of the saved database every BACKUP_EVERY_MS (default 10 min), the newest 36 are kept
var BACKUP_EVERY = Number(process.env.BACKUP_EVERY_MS || 6e5);
function backup() {
  try {
    if (!fs2.existsSync(dbFile)) return;
    fs2.mkdirSync(BACKUP_DIR, { recursive: true });
    fs2.copyFileSync(dbFile, path2.join(BACKUP_DIR, "fyrus-" + Date.now() + ".json"));
    PERSIST.backups++;
    const list = fs2.readdirSync(BACKUP_DIR).filter((n) => /^fyrus-\d+\.json$/.test(n)).sort();
    list.slice(0, Math.max(0, list.length - 36)).forEach((n) => fs2.unlinkSync(path2.join(BACKUP_DIR, n)));
  } catch (e) {
    console.error("backup failed", e);
  }
}
setInterval(backup, BACKUP_EVERY).unref?.();
var saveT = null, saveUrgent = false, SAVE = { saves: 0, urgent: 0, lastMs: 0 };
// 26.10: money moves ask for an urgent save (SAVE_URGENT_MS, default 200 ms) instead of the normal 1.5 s debounce, so a
// crash loses at most a fraction of a second of transfers (26.3 found 58 lost transfers in a 1.5 s window)
function save(urgent) {
  if (saveT && (!urgent || saveUrgent)) return;
  if (saveT) clearTimeout(saveT);
  saveUrgent = !!urgent;
  urgent && SAVE.urgent++;
  saveT = setTimeout(() => {
    saveT = null;
    saveUrgent = false;
    SAVE.saves++;
    const t0 = performance.now();
    try {
      fs2.writeFileSync(dbFile + ".tmp", JSON.stringify(db));
      fs2.renameSync(dbFile + ".tmp", dbFile);
      SAVE.lastMs = Math.round((performance.now() - t0) * 10) / 10;
    } catch (e) {
      console.error("save failed", e);
    }
  }, urgent ? +(process.env.SAVE_URGENT_MS || 200) : 1500);
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
// 24.8: lookups by a client-supplied key only see the object's own entries ("__proto__", "constructor", ... -> none)
function own(o, k) {
  return o && (typeof k === "string" || typeof k === "number") && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : void 0;
}
// ---- Phase 24.2: server-side validation of client-reported presence state ----------------------------------------
// Positions are clamped to the world, non-finite numbers are rejected, and the free-form objects that are relayed to
// every other player (o = outfit + small action fields, v = vehicle) are size- and shape-limited. On a bad value the
// previous accepted value is kept, so a client can never make the server broadcast more than a few hundred bytes.
var WORLD_XZ = 6e3, WORLD_Y_MIN = -60, WORLD_Y_MAX = 2500, O_MAX_BYTES = 1500, V_MAX_BYTES = 200;
var pnum = (v, lo, hi, dflt) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
};
var plainObj = (o) => !!o && typeof o === "object" && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;
function sanitizeShallow(o, maxKeys, maxStr, depth) {
  if (!plainObj(o)) return null;
  const out = {};
  let n = 0;
  for (const k of Object.keys(o)) {
    if (++n > maxKeys || !/^[A-Za-z0-9_]{1,24}$/.test(k)) continue;
    const v = o[k];
    if (typeof v === "string") out[k] = v.slice(0, maxStr);
    else if (typeof v === "number") Number.isFinite(v) && (out[k] = v);
    else if (typeof v === "boolean") out[k] = v;
    else if (v === null) out[k] = null;
    else if (Array.isArray(v) && depth > 0) out[k] = v.slice(0, 8).filter((x) => typeof x === "number" && Number.isFinite(x) || typeof x === "string" && x.length <= maxStr);
    else if (plainObj(v) && depth > 0) out[k] = sanitizeShallow(v, 12, maxStr, depth - 1);
  }
  return out;
}
function sanitizeAct(a) {
  if (!plainObj(a)) return void 0;
  const out = {};
  a.s && (out.s = 1);
  typeof a.c === "string" && /^[a-z]{1,16}$/.test(a.c) && (out.c = a.c);
  if (Array.isArray(a.p) && a.p.length >= 2) {
    const x = pnum(a.p[0], -WORLD_XZ, WORLD_XZ, NaN), z = pnum(a.p[1], -WORLD_XZ, WORLD_XZ, NaN), h = pnum(a.p[2], -10, 10, 0);
    Number.isFinite(x) && Number.isFinite(z) && (out.p = [x, z, h]);
  }
  return Object.keys(out).length ? out : void 0;
}
function sanitizeO(o, prev) {
  if (o == null) return prev ?? null;
  const out = sanitizeShallow(o, 40, 64, 2);
  if (!out) return prev ?? null;
  if ("act" in out || o.act) {
    const a = sanitizeAct(o.act);
    a ? out.act = a : delete out.act;
  }
  return JSON.stringify(out).length <= O_MAX_BYTES ? out : prev ?? null;
}
function sanitizeV(v) {
  if (v == null || v === false) return null;
  if (!plainObj(v)) return null;
  const out = { b: String(v.b ?? "").slice(0, 24), c: String(v.c ?? "").slice(0, 16), f: !!v.f };
  return JSON.stringify(out).length <= V_MAX_BYTES ? out : null;
}
var PRES = { posMsgs: 0, oRejected: 0, coordClamped: 0, nonFinite: 0, speedCapped: 0, teleports: 0, teleportBlocked: 0 };
// 24.5: tell a client where the server has it when its move was capped / blocked (max 2 per second)
var corr = (me2, why) => {
  const n = Date.now();
  if (n - (me2.corrAt || 0) < 500) return;
  me2.corrAt = n;
  PRES.corrections = (PRES.corrections || 0) + 1;
  send(me2.ws, { t: "corr", x: Math.round(me2.x * 100) / 100, z: Math.round(me2.z * 100) / 100, why });
};
var MOVE_MAX_FOOT = 26, MOVE_MAX_VEH = 95, TELEPORT_MIN = 300;
// ---- 24.10 chat moderation hooks --------------------------------------------------------------------------------
// Every chat message goes through a pipeline of hooks (fn(text, ctx) -> {action: "allow"|"mask"|"block", text?, why?,
// reason?}). Built in: repeat spam, links / contact details from accounts younger than a day, shouting (all caps), and
// the existing word filter. Blocks are logged (db.modlog, newest 2000) and 5 blocks in 10 minutes mute the sender for
// 15 minutes. registerModHook(fn) adds more hooks (e.g. a local classifier) without touching the chat code.
var MOD = { hooks: [], stats: { checked: 0, blocked: 0, masked: 0, autoMutes: 0, byReason: {} } };
function registerModHook(fn) {
  typeof fn === "function" && MOD.hooks.push(fn);
}
var normMsg = (t) => t.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f]+/g, "");
registerModHook((text, ctx) => {
  const now = Date.now(), k = normMsg(text), h = ctx.me.sayHist = (ctx.me.sayHist || []).filter((x) => now - x.at < 3e4);
  const n = h.filter((x) => x.k === k).length;
  h.push({ k, at: now });
  return k.length > 1 && n >= 2 ? { action: "block", reason: "repeat", why: "You already sent that. Please don't repeat messages." } : null;
});
registerModHook((text, ctx) => {
  const young = Date.now() - (ctx.u.joined || 0) < 864e5 && !ctx.u.email && !ctx.u.google;
  if (!young) return null;
  if (/(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|xyz|ru|cn|top|gg|me|link)\b)/i.test(text)) return { action: "block", reason: "link", why: "New accounts can't post links yet." };
  if (/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text)) return { action: "block", reason: "contact", why: "New accounts can't share e-mail addresses yet." };
  return null;
});
registerModHook((text) => {
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length > 12 && letters.replace(/[^A-Z]/g, "").length / letters.length > 0.75 ? { action: "mask", reason: "caps", text: text.charAt(0) + text.slice(1).toLowerCase() } : null;
});
registerModHook((text) => {
  const f = filter(text);
  return f !== text ? { action: "mask", reason: "words", text: f } : null;
});
function moderate(u, text, ctx) {
  MOD.stats.checked++;
  let out = text;
  if (!out) return { action: "allow", text: out };
  for (const hook of MOD.hooks) {
    let r = null;
    try {
      r = hook(out, { ...ctx, u });
    } catch (e) {
      console.error("mod hook failed", e);
    }
    if (!r || r.action === "allow") continue;
    MOD.stats.byReason[r.reason || "other"] = (MOD.stats.byReason[r.reason || "other"] || 0) + 1;
    if (r.action === "mask") {
      MOD.stats.masked++;
      out = r.text ?? out;
      continue;
    }
    if (r.action === "block") {
      MOD.stats.blocked++;
      const now = Date.now();
      (db.modlog ||= []).push({ at: now, by: u.id, channel: ctx.channel, reason: r.reason, sample: text.slice(0, 120) });
      db.modlog.length > 2e3 && db.modlog.splice(0, db.modlog.length - 2e3);
      const recent = db.modlog.filter((x) => x.by === u.id && now - x.at < RULES28.FILTER_WINDOW_MS).length;   // 28.12: shared constants
      if (recent >= RULES28.FILTER_BLOCKS && !(u.muteUntil > now)) {
        u.muteUntil = now + RULES28.FILTER_MUTE_MS;
        u.autoMuted = now;
        MOD.stats.autoMutes++;
        save();
        return { action: "block", why: `Too many blocked messages: your chat is paused for ${Math.round(RULES28.FILTER_MUTE_MS / 6e4)} minutes.${rules28Off() ? "" : " See City rules 1, 2, 3 and 8."}` };
      }
      save();
      return { action: "block", why: r.why || "Message not sent." };
    }
  }
  return { action: "allow", text: out };
}
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
  // 24.8: only plain objects with a string type reach the modules (null / arrays / numbers used to throw inside them)
  if (!m || typeof m !== "object" || Array.isArray(m) || typeof m.t !== "string" || m.t.length > 40) return void (PRES.dropped = (PRES.dropped || 0) + 1);
  // 26.10 idempotency: a request carrying a request id ("rid") that this connection already sent in the last 10 min is
  // dropped (answered with "dup"), so a client retry after a timeout can never apply a payment twice
  if (typeof m.rid === "string" && m.rid.length <= 40) {
    const rs = me.rids ||= /* @__PURE__ */ new Map(), now = Date.now();
    if (rs.has(m.rid) && now - rs.get(m.rid) < 6e5) return void (PRES.dupDropped = (PRES.dupDropped || 0) + 1, send(me.ws, { t: "dup", rid: m.rid }));
    rs.set(m.rid, now);
    if (rs.size > 200) for (const [k, t] of rs) if (now - t > 6e5 || rs.size > 200) rs.delete(k);
  }
  const u = me.u;
  if (edu.onMessage(me, m) || bank.onMessage(me, m) || market.onMessage(me, m) || estate.onMessage(me, m) || news.onMessage(me, m) || ads.onMessage(me, m) || halls.onMessage(me, m) || acts28.onMessage(me, m) || rules28.onMessage(me, m) || homes.onMessage(me, m) || biz.onMessage(me, m) || aichat.onMessage(me, m) || politics.onMessage(me, m) || jobs.onMessage(me, m) || ops.onMessage(me, m)) return;
  switch (m.t) {
    case "pos": {
      PRES.posMsgs++;
      const nx = pnum(m.x, -WORLD_XZ, WORLD_XZ, NaN), nz = pnum(m.z, -WORLD_XZ, WORLD_XZ, NaN);
      if (!Number.isFinite(nx) || !Number.isFinite(nz)) {
        PRES.nonFinite++;
        return;
      }
      (Math.abs(+m.x) > WORLD_XZ || Math.abs(+m.z) > WORLD_XZ) && PRES.coordClamped++;
      // 24.3 movement validation: per-update displacement is limited to what the current mode allows (on foot / in a
      // vehicle). Bigger jumps are accepted as teleports (metro, rocket, waypoints, respawn), up to 3 per 10 s; scene
      // changes and vehicle changes reset the check. A capped move keeps the player moving at the allowed speed.
      const nowM = Date.now(), sceneNow = clean(m.scene, 40) || "plaza", inVeh = !!(m.v && plainObj(m.v));
      if (me.mv && me.mv.scene === sceneNow && me.mv.veh === inVeh) {
        const dtm = Math.min(1, Math.max(0.08, (nowM - me.mv.t) / 1e3)), dx = nx - me.x, dz = nz - me.z, d = Math.hypot(dx, dz);
        const vmax = inVeh ? MOVE_MAX_VEH : MOVE_MAX_FOOT, allow = vmax * dtm * 1.5 + 0.5;
        if (d > TELEPORT_MIN) {
          // token bucket: up to 3 teleports in any 10 s window (metro + waypoint + respawn in a row stay legal)
          const tps = (me.tps || []).filter((x) => nowM - x < 1e4);
          if (tps.length >= 3) {
            PRES.teleportBlocked++;
            me.mv.t = nowM;
            me.tps = tps;
            corr(me, "teleport");
            return;
          }
          tps.push(nowM);
          me.tps = tps;
          PRES.teleports++;
        } else if (d > allow) {
          const k = allow / d;
          PRES.speedCapped++;
          me.x += dx * k;
          me.z += dz * k;
          d - allow > 5 && corr(me, "speed");
          me.mv = { t: nowM, scene: sceneNow, veh: inVeh, tp: me.mv.tp };
          me.y = pnum(m.y, WORLD_Y_MIN, WORLD_Y_MAX, me.y || 0);
          me.ry = pnum(m.ry, -1e3, 1e3, me.ry || 0) % (Math.PI * 2);
          me.scene = sceneNow;
          me.o = sanitizeO(m.o, me.o);
          me.v = sanitizeV(m.v);
          return;
        }
      }
      me.mv = { t: nowM, scene: sceneNow, veh: inVeh, tp: me.mv ? me.mv.tp : 0 };
      me.x = nx;
      me.z = nz;
      me.y = pnum(m.y, WORLD_Y_MIN, WORLD_Y_MAX, me.y || 0);
      me.ry = pnum(m.ry, -1e3, 1e3, me.ry || 0) % (Math.PI * 2);
      me.scene = clean(m.scene, 40) || "plaza";
      const no = sanitizeO(m.o, me.o);
      no !== m.o && m.o && JSON.stringify(m.o).length > O_MAX_BYTES && PRES.oRejected++;
      me.o = no;
      // 24.7: the player's outfit is part of the profile on the server (action / emote fields stripped; written at most
      // once a minute when it changes)
      if (no) {
        const plain = Object.assign({}, no);
        (delete plain.act, delete plain.em, delete plain.emt);
        const sig = JSON.stringify(plain), nowO = Date.now();
        sig !== u.outfitSig && (nowO - (u.outfitAt || 0) > 6e4 || !u.outfit) && ((u.outfit = plain), (u.outfitSig = sig), (u.outfitAt = nowO), save());
      }
      me.v = sanitizeV(m.v);
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
      const mod = moderate(u, clean(m.text, MAX_TEXT), { channel: String(m.channel || ""), me });
      if (mod.action === "block") return send(me.ws, { t: "err", text: mod.why });
      const text = mod.text;
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
        const target = own(db.users, m.to) || findByNumber(String(m.to || ""));
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
        const g = own(db.groups, m.group);
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
      // Safety: limit report spam, and pause chat for someone several trusted citizens report,
      // until a judge reviews it in the admin desk.
      const now = Date.now(), DAY = 864e5, against = clean(m.id, 40);
      const mine = db.reports.filter((r) => r.by === u.id && now - r.at < DAY);
      if (mine.length >= RULES28.REPORTS_PER_DAY) return send(me.ws, { t: "err", text: "You have sent many reports today. A judge will review them soon." });
      if (mine.some((r) => r.against === against)) return send(me.ws, { t: "ok", text: "You already reported this citizen today. A judge will review it." });
      db.reports.push({ by: u.id, against, reason: clean(m.reason, 400), msg: clean(m.msg, 600), at: now });
      if (db.reports.length > 5e3) db.reports.splice(0, db.reports.length - 5e3);
      const target = own(db.users, against);   // 24.10: own-key lookup (a "__proto__" report must not touch Object.prototype)
      if (target && !isAdmin(target.id)) {
        const trusted = (x) => !!x && (x.email || x.google || now - (x.joined || now) > DAY);
        const by = new Set(db.reports.filter((r) => r.against === against && now - r.at < DAY && trusted(db.users[r.by])).map((r) => r.by));
        if (by.size >= RULES28.REPORTS_TO_PAUSE && !(target.muteUntil > now)) {
          target.muteUntil = now + RULES28.REPORT_PAUSE_MS;
          target.autoMuted = now;
          const l = live.get(target.id);
          if (l) send(l.ws, { t: "err", text: `Several citizens reported your messages. Your chat is paused for ${Math.round(RULES28.REPORT_PAUSE_MS / 36e5)} hours while a judge reviews it.${rules28Off() ? "" : " See City rules (Parliament \u203A City rules)."}` });
          console.log("auto-mute", target.number, by.size, "reports");
        }
      }
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
      const g = own(db.groups, m.group);
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
      // Land is paid for on the server: price, 5% transfer tax (none for passport holders),
      // the seller is paid directly, and the Land Bank buys back at 90% of value.
      const id = clean(m.id, 12);
      const cur = db.plots[id];
      const land = LAND[id];
      const note = (text) => send(me.ws, { t: "note", text });
      if (m.release) {
        if (cur?.owner === u.id) {
          const refund = land ? Math.round(landValue(id) * 0.9) : 0;
          delete db.plots[id];
          if (refund > 0) bank.payFromTreasury(u.id, refund, `Sold plot ${id} to the Land Bank (90% of value)`);
          bank.notify(u.id);
          save();
          broadcast({ t: "plots", plots: { [id]: null } });
        }
        return;
      }
      if (cur && cur.owner === u.id) { // owner edits: use, sign, listing price
        db.plots[id] = { ...cur, ownerName: shown(u), use: clean(m.use, 30) || void 0, sign: clean(m.sign, 28) || void 0, forSale: m.forSale ? Math.max(1, Math.round(+m.forSale)) : void 0, at: Date.now() };
        save();
        broadcast({ t: "plots", plots: { [id]: db.plots[id] } });
        return;
      }
      if (cur && !(cur.forSale && m.buy)) return send(me.ws, { t: "plot_taken", id, owner: cur });
      if (!land) return send(me.ws, { t: "plot_taken", id, owner: cur || null });
      const price = cur ? cur.forSale : land.price; // same as the price shown on the map
      const tax = u.passport?.kind === "passport" ? 0 : Math.round(price * 0.05);
      if (bank.bal(u.id) + 1e-9 < price + tax) {
        bank.notify(u.id);
        note(`You need ${(price + tax).toLocaleString("en-US")} FYC for plot ${id}.`);
        return send(me.ws, { t: "plot_taken", id, owner: cur || null });
      }
      if (cur) {
        if (!bank.transfer(u.id, cur.owner, price, `Bought plot ${id}`)) return bank.notify(u.id);
        bank.notify(cur.owner);
      } else if (!bank.transfer(u.id, "treasury", price, `Plot ${id}`)) return bank.notify(u.id);
      if (tax > 0) bank.transfer(u.id, "treasury", tax, `Transfer tax on plot ${id}`);
      bank.notify(u.id);
      db.plots[id] = { owner: u.id, ownerName: shown(u), paid: price, at: Date.now() };
      save();
      broadcast({ t: "plots", plots: { [id]: db.plots[id] } });
      return;
    }
  }
}
var broadcast = (m) => live.forEach((l) => send(l.ws, m));
// Land plots of the Republic (same layout and prices as the city map in the client).
var LAND = (() => {
  const districts = [
    { code: "CP", capital: true, x: -124, z: 2, base: 4e4, cols: 2, rows: 3, gap: 22 },
    { code: "MC", x: 232, z: -214, base: 15e3, cols: 4, rows: 5, gap: 20 },
    { code: "TC", x: -272, z: -30, base: 12e3, cols: 4, rows: 5, gap: 20 },
    { code: "CC", x: -212, z: 212, base: 9e3, cols: 4, rows: 5, gap: 20 },
    { code: "PC", x: 216, z: 216, base: 8e3, cols: 4, rows: 5, gap: 20 },
    { code: "LC", x: -222, z: -212, base: 6e3, cols: 4, rows: 5, gap: 20 },
    { code: "FD", x: 0, z: 268, base: 2500, cols: 4, rows: 5, gap: 20 }
  ];
  const mult = { prime: 2.5, central: 1.6, standard: 1 };
  const out = {};
  for (const d of districts) {
    const pts = [];
    for (let i = 0; i < d.rows; i++) for (let s = 0; s < d.cols; s++) pts.push({ x: d.x + (s - (d.cols - 1) / 2) * d.gap, z: d.z + (i - (d.rows - 1) / 2) * d.gap });
    const r = pts.map((p) => Math.hypot(p.x, p.z)), lo = Math.min(...r), hi = Math.max(...r);
    pts.forEach((p, k) => {
      const l = hi > lo ? (r[k] - lo) / (hi - lo) : 0;
      const tier = d.capital ? (l < 0.5 ? "prime" : "central") : l < 0.34 ? "prime" : l < 0.67 ? "central" : "standard";
      out[`${d.code}-${String(k + 1).padStart(2, "0")}`] = { code: d.code, price: Math.round(d.base * mult[tier] / 100) * 100 };
    });
  }
  return out;
})();
var landValue = (id) => {
  const p = LAND[id];
  if (!p) return 0;
  const owned = Object.keys(db.plots).filter((k) => LAND[k]?.code === p.code && db.plots[k]).length;
  return Math.round(p.price * (1 + 0.04 * owned) / 100) * 100;
};
// 24.4 interest management: every 125 ms each client gets full entries for players in its own scene within
// IM_NEAR m; same-scene players farther away are included every 4th tick (2 Hz); players in other scenes only as a
// compact entry (no outfit / vehicle / photo) once per second, so "who is online" lists keep working. The client keeps
// a peer for 2.5 s after it was last listed (003.js), so the lower rates never make anyone blink out.
// IM_OFF=1 (env) restores the old all-to-all broadcast.
var IM_NEAR = 160, IM_OFF = process.env.IM_OFF === "1", imTick = 0, IMS = { ticks: 0, full: 0, farFull: 0, compact: 0 };
setInterval(() => {
  if (!live.size) return;
  const t = imTick++, withPhoto = Date.now() % 4e3 < 130;
  const all = [...live.values()].map((l) => ({ l, full: { id: l.u.id, name: shown(l.u), color: l.u.stealth ? "#8a8f98" : l.u.color, x: l.x, z: l.z, y: l.y, ry: l.ry, sc: l.scene, o: l.o, v: l.v, vc: l.voice, ph: l.u.stealth || !withPhoto ? void 0 : l.u.photo, mk: l.u.stealth ? 1 : void 0 } }));
  IMS.ticks++;
  live.forEach((me2) => {
    const list = [];
    for (const { l, full } of all) {
      if (l === me2) continue;
      if (IM_OFF) {
        list.push(full);
        continue;
      }
      if (l.scene === me2.scene) {
        const near = Math.hypot(l.x - me2.x, l.z - me2.z) < IM_NEAR;
        if (near || t % 4 === 0) (list.push(full), near ? IMS.full++ : IMS.farFull++);
      } else if (t % 8 === 0) (list.push({ id: full.id, name: full.name, color: full.color, x: full.x, z: full.z, sc: full.sc, mk: full.mk }), IMS.compact++);
    }
    if (list.length || t % 8 === 0) send(me2.ws, { t: "peers", list, partial: IM_OFF ? void 0 : 1 });
  });
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
var bank = createBank({ db, save, send, liveOf: (id) => live.get(id), findByNumber, nameOf, clean, fs: fs2, crypto: crypto3, isNew: (id) => !!db.users[id] && Date.now() - (db.users[id].joined || 0) < 864e5, onFlag: (id, f) => console.warn("[fraud-watch] flagged", id, f.why), ledgerFile: process.env.LEDGER_FILE === "off" ? null : path2.join(DATA_DIR, "ledger.jsonl") });
var market = createMarket({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, rid, isAdmin, nameOf, news: report });
var estate = createEstate({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, findByNumber, news: report });
var edu = createEdu({ db, save, send, broadcast, clean, rid, findByNumber, liveOf: (id) => live.get(id), pay: bank.transfer, news: report });
try {
  seedLadder({ db, save });
} catch (e) {
  console.error("ladder seed", e);
}
var ads = createAds({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
var halls = createHalls({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
var rules28 = createRules({ send });
var acts28 = createActs({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), filter, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var homes = createHomes({ db, save, send, broadcast, liveOf: (id) => live.get(id), findByNumber, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", toScene: (scene, m) => live.forEach((l) => {
  if (l.scene === scene) send(l.ws, m);
}) });
var politics = createPolitics({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", news: report });
var aichat = createAiChat({ stockInfo: (id) => jobs.stockInfo(id), bizInfo: (id) => biz.bizInfo(id), clerkDenied: (id, tool, why) => biz.clerkDenied(id, tool, why), db, save, send, clean, filter, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var biz = createBusinesses({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var jobs = createJobs({ db, bank, save, send, liveOf: (id) => live.get(id), findByNumber, filter, certCount: (id) => Object.values(db.edu?.certs || {}).filter((c) => c && c.student === id).length, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
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
var meOf = (u) => ({ ...pub(u), outfit: u.outfit || null, lang: u.lang, blocks: u.blocks, email: u.email || null, google: !!u.google, age18: !!u.age18, admin: isAdmin(u.id), guest: !u.email && !u.google });
var SEC = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Permissions-Policy": "camera=(self), microphone=(self), geolocation=()" };
var TYPES3 = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
var gzCache = /* @__PURE__ */ new Map();
// 30.8 security: the client IP used by every limit (login tries, new accounts, sockets, message flood, loopback
// exemption). x-forwarded-for was trusted from anyone, so a client could send "x-forwarded-for: 127.0.0.1" to skip
// all limits or rotate fake IPs. Now it is read only when the TCP peer is a proxy on this machine (loopback), and
// then the entry that proxy appended (the right-most; TRUST_PROXY_HOPS=n for a chain of n proxies) is used.
var PROXY_HOPS = Math.max(1, Number(process.env.TRUST_PROXY_HOPS || 1) | 0);
var clientIp = (req) => {
  const peer = String(req.socket?.remoteAddress || "");
  // deploy: inside Docker the reverse proxy (Coolify/Traefik) reaches the app from a private address, so a peer on
  // loopback or a private network (10/8, 172.16/12, 192.168/16, fc00::/7) counts as our proxy; a public peer never does
  if (!/^(127\.|::1$|::ffff:127\.|(::ffff:)?10\.|(::ffff:)?192\.168\.|(::ffff:)?172\.(1[6-9]|2\d|3[01])\.|f[cd][0-9a-f]{2}:)/i.test(peer)) return peer;
  const xs = String(req.headers["x-forwarded-for"] || "").split(",").map((x) => x.trim()).filter(Boolean);
  return xs.length ? xs[Math.max(0, xs.length - PROXY_HOPS)] : peer;
};
var server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, online: live.size, users: Object.keys(db.users).length, translate: !!AI_KEY, news: db.news?.items.length || 0 }));
  }
  const ip = clientIp(req);
  if (accounts.http(req, res, url.pathname, ip)) return;
  if (ops.http(req, res, url.pathname, ip, accounts.byToken)) return;
  if (url.pathname === "/terms" || url.pathname === "/privacy") {
    res.writeHead(200, { ...SEC, "content-type": "text/html; charset=utf-8" });
    return res.end(legalPage(url.pathname.slice(1)));
  }
  if (edu.http(url.pathname, res)) return;
  let p = path2.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  // 30.8 security: never serve server source, build tooling, package metadata, docs or dot-files from the public dir
  // (the local demo serves app/ directly, which holds server.mjs and src/). Unknown paths still fall back to the app.
  if (/^[/\\](src|scripts|node_modules)([/\\]|$)/i.test(p) || /(^|[/\\])\./.test(p) || /(^|[/\\])(server\.mjs|build\.mjs|package\.json|pnpm-lock\.yaml|package-lock\.json|[^/\\]+\.md)$/i.test(p)) {
    res.writeHead(404, { ...SEC, "content-type": "text/plain" });
    return res.end("not found");
  }
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
var RECON_GRACE = Number(process.env.RECON_GRACE_MS ?? 1e4), RECON = { ghosts: 0, resumed: 0, expired: 0 };
setInterval(() => {
  const now = Date.now();
  let gone = 0;
  live.forEach((l, id) => {
    if (l.ghostUntil && l.ghostUntil < now && l.ws.readyState !== import_websocket.default.OPEN) {
      live.delete(id);
      RECON.expired++;
      gone++;
      broadcast({ t: "left", id });
    }
  });
  if (gone) (save(), broadcast({ t: "online", n: live.size }));
}, 1e3);
// ---- 24.9 basic abuse prevention ------------------------------------------------------------------------------
// per-IP: at most ABUSE_CONN_PER_IP open sockets and ABUSE_NEW_PER_IP_HOUR new accounts per hour; per socket: a
// message token bucket (60/s, burst 120; excess is dropped, sustained flooding closes the socket); "new citizen"
// news at most once a minute. Loopback (local development / bench) is exempt unless ABUSE_TEST=1.
var ABUSE = { connRefused: 0, acctRefused: 0, dropped: 0, kicked: 0, newsSkipped: 0 };
var ABUSE_CONN = Number(process.env.ABUSE_CONN_PER_IP || 12), ABUSE_NEW = Number(process.env.ABUSE_NEW_PER_IP_HOUR || 6), ABUSE_TEST = process.env.ABUSE_TEST === "1";
var newByIp = /* @__PURE__ */ new Map(), lastCitizenNews = 0;
var exemptIp = (ip) => !ABUSE_TEST && /^(127\.|::1$|::ffff:127\.)/.test(ip);
var wss = new import_websocket_server.default({ server, path: "/ws", maxPayload: 64 * 1024 });
wss.on("connection", (ws, req) => {
  let me = null;
  const ip = clientIp(req);
  ws.ip = ip;
  if (!exemptIp(ip) && [...wss.clients].filter((c) => c.ip === ip).length > ABUSE_CONN) {
    ABUSE.connRefused++;
    ws.close(1008, "too many connections");
    return;
  }
  const hello = setTimeout(() => ws.close(), 1e4);
  const bucket = { tokens: 120, at: Date.now(), drops: [] };
  ws.on("message", (buf) => {
    const raw = buf.toString();
    if (raw.length > 64 * 1024) return;
    if (!exemptIp(ip)) {
      const nowB = Date.now();
      bucket.tokens = Math.min(120, bucket.tokens + (nowB - bucket.at) * 0.06);
      bucket.at = nowB;
      if (bucket.tokens < 1) {
        ABUSE.dropped++;
        bucket.drops.push(nowB);
        bucket.drops = bucket.drops.filter((x) => nowB - x < 1e4);
        if (bucket.drops.length > 600) {
          ABUSE.kicked++;
          me && (me.kicked = true);
          send(ws, { t: "err", text: "Too many messages. Please reconnect." });
          ws.close(1008, "flood");
        }
        return;
      }
      bucket.tokens -= 1;
    }
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
      if (!u && !exemptIp(ip)) {
        const nowA = Date.now(), list = (newByIp.get(ip) || []).filter((x) => nowA - x < 36e5);
        if (list.length >= ABUSE_NEW) {
          ABUSE.acctRefused++;
          send(ws, { t: "err", text: "Too many new accounts from this network. Please try again later." });
          ws.close(1008, "account limit");
          return;
        }
        list.push(nowA);
        newByIp.set(ip, list);
        newByIp.size > 5e4 && newByIp.clear();
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
        if ((pop <= 50 || pop % 25 === 0) && Date.now() - lastCitizenNews > 6e4) ((lastCitizenNews = Date.now()), report("nation", `A new citizen arrived in Fyrus. Population: ${pop.toLocaleString("en-US")}`));
        else ABUSE.newsSkipped++;
      }
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      u.seen = Date.now();
      const old = live.get(u.id);
      // 24.6: a player who reconnects within the grace period continues where the server last had them (position,
      // scene, outfit, vehicle, movement-check state) and nobody saw them leave
      const resumed = old && old.ghostUntil ? old : null;
      if (old && !resumed) {
        send(old.ws, { t: "err", text: "You opened Fyrus in another tab." });
        old.ws.close();
      }
      me = { ws, u, x: 0, z: 36, y: 0, ry: 0, scene: "plaza", voice: false, rate: [] };
      if (resumed) (["x", "z", "y", "ry", "scene", "o", "v", "mv", "voice"].forEach((k) => resumed[k] !== void 0 && (me[k] = resumed[k])), RECON.resumed++);
      live.set(u.id, me);
      ops.bump("visits");
      send(ws, { t: "welcome", token, me: meOf(u), biz: biz.all(), plots: db.plots, groups: Object.values(db.groups).filter((g) => g.members.includes(u.id)), online: live.size, translate: !!AI_KEY });
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
      // 24.6: keep the player listed (frozen) for a short grace period so a network blip or a page reload does not
      // make them vanish for everyone; the sweeper below removes them if they do not come back
      me.u.seen = Date.now();
      if (RECON_GRACE > 0 && !me.kicked) {
        me.ghostUntil = Date.now() + RECON_GRACE;
        RECON.ghosts++;
        return;
      }
      live.delete(me.u.id);
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
