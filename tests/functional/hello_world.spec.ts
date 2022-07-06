import { test } from '@japa/runner';
import APP from '../../package.json';

test.group('Welcome', () => {
  test('display welcome page', async ({ client }) => {
    const response = await client.get('/');
    // await Wait(5000);
    response.assertStatus(200);
    response.assertBodyContains({
      APIName: APP.name,
      version: APP.version,
      message: 'OK'
    });
  });
});
