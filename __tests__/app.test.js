import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';

describe('routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'spob',
        password: 'password',
        profilePhotoUrl: expect.any(String)
      });
    expect(res.body).toEqual({
      id: '1',
      username: 'spob',
      profilePhotoUrl: expect.any(String)
    });
  });

  it('logsin a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'spob',
        password: 'password'
      });
    expect(res.body).toEqual({
      id: '1',
      username: 'spob'
    });
  });
});
