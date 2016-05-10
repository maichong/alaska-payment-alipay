/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';
import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';

const GATEWAY = 'https://mapi.alipay.com/gateway.do?';

export default class AlipayPlugin {
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
    this.rsa_private_key = fs.readFileSync(rsa_private_key);
    let alipay_public_key = this._config.alipay_public_key || service.panic('alipay_public_key not found');
    this.alipay_public_key = fs.readFileSync(alipay_public_key);
    delete this._config.alipay_public_key;
  }

  /**
   * 创建支付参数
   * @param {Context} ctx
   * @param {Payment} payment
   * @param {Object} [data]
   * @returns {string}
   */
  async createParams(ctx, payment, data) {
    let params = Object.assign({}, this._config, {
      subject: payment.title,
      out_trade_no: payment.id,
      total_fee: payment.amount
    }, data);
    if (!params.notify_url && ctx) {
      params.notify_url = ctx.protocol + '://' + ctx.host + this.service.config('prefix') + '/api/notify/alipay';
    }
    let link = this.createQueryString(this.paramsFilter(params));

    let signer = crypto.createSign('RSA-SHA1');
    signer.update(link, 'utf8');
    params.sign = signer.sign(this.rsa_private_key, "base64");

    return GATEWAY + this.createQueryStringUrlencode(params);
  }

  async verify(data) {
    let filtered = this.paramsFilter(data);
    let link = this.createQueryString(filtered);
    let verify = crypto.createVerify('RSA-SHA1');
    verify.update(link, 'utf8');
    return verify.verify(this.alipay_public_key, data.sign, 'base64');
  }

  /**
   * 除去数组中的空值和签名参数
   * @param params 签名参数组
   * @return {object} 去掉空值与签名参数后的新签名参数组
   */
  paramsFilter(params) {
    return _.reduce(params, function (result, value, key) {
      if (value && key != 'sign' && key != 'sign_type') {
        result[key] = value;
      }
      return result;
    }, {});
  }

  /**
   * 把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
   * @param params
   * @returns {string}
   */
  createQueryString(params) {
    return Object.keys(params).sort().map(key => key + '=' + params[key]).join('&');
  }

  createQueryStringUrlencode(params) {
    return Object.keys(params).sort().map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  };
}
