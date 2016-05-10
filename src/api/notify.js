/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

const Payment = service.model('Payment');

export async function alipay(ctx) {
  ctx.status = 400;
  ctx.body = 'ERR';
  if (ctx.method !== 'POST') return;
  let body = ctx.state.body || ctx.request.body;
  if (!body || body.trade_status !== 'TRADE_SUCCESS') return;
  let success = await service.payments.alipay.verify(body);
  if (!success) return;
  let paymentId = body.out_trade_no;
  let payment = await Payment.findById(paymentId);
  if (!payment) return;
  payment.alipay_trade_no = body.trade_no;
  payment.alipay_buyer_email = body.buyer_email;
  try {
    await service.run('Complete', { payment });
    ctx.body = 'OK';
    ctx.status = 200;
  } catch (error) {
    console.error(error.stack);
    ctx.status = 500;
    ctx.body = 'ERR';
  }
}
