import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';

const agent = request.agent(app);

describe('comment routes', () => {
  let user;


  beforeEach(async () => {
    await setup(pool);

    user = await UserService.create({
      username: 'spob',
      password: 'password',
      profilePhotoUrl: 'photo'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'spob',
        password: 'password',
        profilePhotoUrl: 'photoURL'
      });
  });

  it('creates a comment via POST', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'photo',
      caption: 'look at this',
      tags: ['look']
    });
    const res = await agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        postId: post.id,
        comment: 'Yo yo yo look at this!'
      });
    expect(res.body).toEqual({
      id: '1',
      commentBy: user.id,
      postId: post.id,
      comment: 'Yo yo yo look at this!'
    });
  });
});
