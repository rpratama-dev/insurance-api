import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ResponseContract } from '@ioc:Adonis/Core/Response';
import { GeneralValidator } from 'App/Validators/GeneralValidator';
import ModelFunction, { TConfigModelFunction } from 'Function/ModelFunction';
import { ParsedTypedSchema, TypedSchema, CustomMessages } from '@ioc:Adonis/Core/Validator';
import { DIController, DIParams } from 'Traits/IController';
import Hash from '@ioc:Adonis/Core/Hash';
import hashConfig from 'Config/hash';

type TParams = {
  table: TConfigModelFunction;
  schema: {
    create: {
      schema: ParsedTypedSchema<TypedSchema>;
      messages?: CustomMessages;
    };
    update: {
      schema: ParsedTypedSchema<TypedSchema>;
      messages?: CustomMessages;
    };
    patch: {
      schema: ParsedTypedSchema<TypedSchema>;
      messages?: CustomMessages;
    };
  };
  saveLog?: boolean;
};

class CustomController extends ModelFunction implements DIController {
  private schema: TParams['schema'];
  public saveLog: boolean;

  constructor(params: TParams) {
    super(params.table);
    this.schema = params.schema;
    this.saveLog = params.saveLog !== undefined ? params.saveLog : true;
  }

  public async index({ request: req, response: res }: HttpContextContract): Promise<any> {
    const query = await req.validate({ ...GeneralValidator.index, data: req['requestData'] });
    if (!query.isPagination) query.isPagination = 'true';
    const items = await this.findAll(query);
    this.responseSuccess(res, { data: items }, this.saveLog);
  }

  public async store({ request: req, response: res }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...this.schema.create,
      data: req.body()
    });
    if (payload.password !== undefined) {
      payload.password = await Hash.use(hashConfig.default).make(payload.password);
    }
    const item = await this.insertOne({
      ...payload
    });
    const message = 'Add new item success';
    this.responseSuccess(res, { data: item[0], message, httpStatusCode: 201 }, this.saveLog);
  }

  public async show({ request: req, response: res }: HttpContextContract): Promise<any> {
    const params = await req.validate({ ...GeneralValidator.params, data: req.params() });
    const item = await this.findByID(params.id);
    this.responseSuccess(res, { data: item }, this.saveLog);
  }

  public async update({ request: req, response: res }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...this.schema.update,
      data: { body: req.body(), params: req.params() }
    });
    const item = await this.findByID(payload.params.id);
    const updated = await this.updateOne(payload.params.id, {
      ...item,
      ...payload.body
    });
    const message = 'Update item success';
    this.responseSuccess(res, { data: updated, message }, this.saveLog);
  }

  public async patch({ request: req, response: res }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...this.schema.patch,
      data: { body: req.body(), params: req.params() }
    });
    const item = await this.findByID(payload.params.id);
    const updated = await this.updateOne(payload.params.id, {
      ...item,
      ...payload.body
    });
    const message = 'Update item success';
    this.responseSuccess(res, { data: updated, message }, this.saveLog);
  }

  public async destroy({ request: req, response: res, auth }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...GeneralValidator.params,
      data: { id: req.params().id }
    });
    await this.findByID(payload.id);
    const updated = await this.destroyOne(payload.id, auth.user?.uuid || null);
    const message = 'Delete item success';
    this.responseSuccess(res, { data: updated, message }, this.saveLog);
  }

  protected responseSuccess(res: ResponseContract, params: DIParams, saveLog = true): void {
    res['saveHttpLog'] = saveLog;
    const responseJSON = {
      message: params.message || 'Request Success',
      data: params.data,
      status: 'success'
    };
    return res.status(params.httpStatusCode || 200).json(responseJSON);
  }
}

export default CustomController;
