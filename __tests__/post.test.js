import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';

describe('routes', () => {

  let user = {};
  let agent;

  beforeEach(async () => {
    await setup(pool);
    agent = await request.agent(app);
    user = await UserService.create({
      username: 'spob',
      password: 'password',
      profilePhotoUrl: 'photo'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'spob',
        password: 'password'
      });
  });

  it('creates a post via POST', async () => {
    const res = await agent
      .post('/api/v1/posts')
      .send({
        userId: user.id,
        photoUrl: 'photo',
        caption: 'Look at this photo',
        tags: ['#summer', '#nofilter']
      });
    expect(res.body).toEqual({
      id: '1',
      userId: user.id,
      photoUrl: 'photo',
      caption: 'Look at this photo',
      tags: ['#summer', '#nofilter']
    });
  });
});
