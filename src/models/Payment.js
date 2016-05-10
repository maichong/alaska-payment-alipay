/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';

export default function (Payment) {
  if (_.find(Payment.fields.payment.options, opt => opt.value === 'alipay')) return;
  Payment.fields.payment.options.push({ label: 'Alipay', value: 'alipay' });
}
