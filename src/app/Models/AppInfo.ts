import { column } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';

export default class AppInfo extends CustomModel {
  @column()
  public name: string;

  @column()
  public slogan: string;

  @column()
  public logo: string;

  @column()
  public phone_number: string;

  @column()
  public mobile_number: string;

  @column()
  public email: string;

  @column()
  public sosmed_facebook: string;

  @column()
  public sosmed_instagram: string;

  @column()
  public sosmed_linkedin: string;

  @column()
  public sosmed_youtube: string;
}
