/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';

export const fields = {
  alipay_trade_no: {
    label: 'Alipay Trade No',
    type: String,
    private: true
  },
  alipay_buyer_email: {
    label: 'Alipay Buyer Email',
    type: String,
    private: true
  }
};

export default function (Payment) {
  if (_.find(Payment.fields.type.options, opt => opt.value === 'alipay')) return;
  Payment.fields.type.options.push({ label: 'Alipay', value: 'alipay' });
}
