import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';


describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'spob',
        password: 'password',
        profilePhotoUrl: 'photo'
      });
    expect(res.body).toEqual({
      id: '1',
      username: 'spob',
      profilePhotoUrl: 'photo'
    });
  });

  it('log in a user via POST', async () => {
    const user = await UserService.create({
      username: 'spob',
      password: 'password',
      profilePhotoUrl: 'photo'
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'spob',
        password: 'password'
      });
    expect(res.body).toEqual({
      id: user.id,
      username: 'spob',
      profilePhotoUrl: 'photo'
    });
  });

  it('verify a user is logged in', async () => {
    const agent = request.agent(app);
    const user = await UserService.create({
      username: 'spob',
      password: 'password',
      profilePhotoUrl: 'photo'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'spob',
        password: 'password',
        profilePhotoUrl: 'photo'
      });
    const res = await agent.get('/api/v1/verify');

    expect(res.body).toEqual({
      id: user.id,
      username: 'spob',
      passwordHash: expect.any(String),
      profilePhotoUrl: 'photo',
      iat: expect.any(Number),
      exp: expect.any(Number)
    });
  });
});
