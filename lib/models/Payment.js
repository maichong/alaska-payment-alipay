'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Payment) {
  if (_lodash2.default.find(Payment.fields.payment.options, opt => opt.value === 'alipay')) return;
  Payment.fields.payment.options.push({ label: 'Alipay', value: 'alipay' });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }