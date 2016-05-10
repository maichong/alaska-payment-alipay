'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _co = require('co');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

const GATEWAY = 'https://mapi.alipay.com/gateway.do?';

class AlipayPlugin {
  constructor(service) {
    this.init(service);
  }

  init(service) {
    this.service = service;
    service.payments['alipay'] = this;
    service.addConfigDir(__dirname);
    this.label = 'Alipay';
    this._config = service.config('alipay') || service.panic('Alipay config not found');
    this._config = Object.assign({
      partner: '',
      seller_id: '',
      notify_url: '',
      return_url: '',
      service: 'create_direct_pay_by_user',
      payment_type: '1',
      _input_charset: 'utf-8',
      it_b_pay: '1d',
      sign_type: 'RSA'
    }, this._config);
    let rsa_private_key = this._config.rsa_private_key || service.panic('rsa_private_key not found');
    delete this._config.rsa_private_key;
    this.rsa_private_key = _fs2.default.readFileSync(rsa_private_key);
    let alipay_public_key = this._config.alipay_public_key || service.panic('alipay_public_key not found');
    this.alipay_public_key = _fs2.default.readFileSync(alipay_public_key);
    delete this._config.alipay_public_key;
  }

  /**
   * 创建支付参数
   * @param {Context} ctx
   * @param {Payment} payment
   * @param {Object} [data]
   * @returns {string}
   */
  createParams(ctx, payment, data) {
    var _this = this;

    return (0, _co.wrap)(function* () {
      let params = Object.assign({}, _this._config, {
        subject: payment.title,
        out_trade_no: payment.id,
        total_fee: payment.amount
      }, data);
      if (!params.notify_url && ctx) {
        params.notify_url = ctx.protocol + '://' + ctx.host + _this.service.config('prefix') + '/api/notify/alipay';
      }
      let link = _this.createQueryString(_this.paramsSorter(_this.paramsFilter(params)));

      let signer = _crypto2.default.createSign('RSA-SHA1');
      signer.update(link, 'utf8');
      params.sign = signer.sign(_this.rsa_private_key, "base64");

      let url = GATEWAY + _this.createQueryStringUrlencode(params);
      console.log(params);
      return url;
    })();
  }

  /**
   * 除去数组中的空值和签名参数
   * @param params 签名参数组
   * @return {object} 去掉空值与签名参数后的新签名参数组
   */
  paramsFilter(params) {
    return _lodash2.default.reduce(params, function (result, value, key) {
      if (value && key != 'sign' && key != 'sign_type') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  paramsSorter(params) {
    let sorted = {};
    Object.keys(params).sort((a, b) => a > b).forEach(key => sorted[key] = params[key]);
    return sorted;
  }

  /**
   * 把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
   * @param params
   * @returns {string}
   */
  createQueryString(params) {
    let arr = [];
    for (let key in params) {
      arr.push(key + '=' + params[key]);
    }
    return arr.join('&');
  }

  createQueryStringUrlencode(params) {
    let arr = [];
    for (let key in params) {
      arr.push(key + '=' + encodeURIComponent(params[key]));
    }
    return arr.join('&');
  }
}
exports.default = AlipayPlugin;