/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-10
 * @author Liang <liang@maichong.it>
 */

export async function alipay(ctx) {
  if (ctx.method !== 'POST') service.error(400);
  let body = ctx.state.body || ctx.request.body;
  console.log(body);
  ctx.body = 'OK';
}
