import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AccessControll {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>, resource?: string[]) {
    const { auth } = ctx;
    console.log({ auth, resource });

    // code for middleware goes here. ABOVE THE NEXT CALL

    await next();
  }
}
