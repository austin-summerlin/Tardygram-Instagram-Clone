import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';

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
  it('gets all posts', async () => {
    const post1 = await Post.insert({
      userId: user.id,
      photoUrl: 'photo',
      caption: 'yo!',
      tags: ['hey', 'sup']
    });
    const post2 = await Post.insert({
      userId: user.id,
      photoUrl: 'photo2',
      caption: 'yoooooooo!',
      tags: ['hey', 'sup']
    });

    const res = await agent
      .get('/api/v1/posts');
    expect(res.body).toEqual([post1, post2]);
  });
  it('gets a post by id', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'photo',
      caption: 'hi!!!',
      tags: ['cute']
    });
    const res = await agent.get(`/api/v1/posts/${post.id}`);
    expect(res.body).toEqual(post);
  });
  it('updates a post via PATCH', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'photo',
      caption: 'hi!!!',
      tags: ['cute']
    });

    post.caption = 'HIIIIIIIIIIIIII!!!!!!!!!!!!!!';

    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send({ caption: 'HIIIIIIIIIIIIII!!!!!!!!!!!!!!' });

    expect(res.body).toEqual({
      id: '1',
      userId: user.id,
      photoUrl: 'photo',
      caption: 'HIIIIIIIIIIIIII!!!!!!!!!!!!!!',
      tags: ['cute']
    });
    expect(res.body.caption).not.toEqual('hi!!!');

  });
  it('deletes a post via DELETE', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'photo',
      caption: 'hi!!!',
      tags: ['cute']
    });
    const res = await agent
      .delete(`/api/v1/posts/${post.id}`)
      .send(post);

    expect(res.body).toEqual(post);
  });

});

