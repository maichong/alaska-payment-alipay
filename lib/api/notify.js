'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alipay = undefined;

var _co = require('co');

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

let alipay = exports.alipay = (() => {
  var ref = (0, _co.wrap)(function* (ctx) {
    if (ctx.method !== 'POST') service.error(400);
    let body = ctx.state.body || ctx.request.body;
    console.log(body);
    ctx.body = 'OK';
  });
  return function alipay(_x) {
    return ref.apply(this, arguments);
  };
})();