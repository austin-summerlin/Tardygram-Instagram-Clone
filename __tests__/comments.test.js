import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';
import Comment from '../lib/models/Comment.js';

const agent = request.agent(app);

describe('comment routes', () => {
  let user;
  let post;


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

    post = await Post.insert({
      id: '1',
      userId: user.id,
      photoUrl: 'photo',
      caption: 'HIIIIIIIIIIIIII!!!!!!!!!!!!!!',
      tags: ['cute']
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
  it('deletes a comment via DELETE', async () => {
    const comment = await Comment.insert({
      commentBy: user.id,
      postId: post.id,
      comment: 'look at this!'
    });
    const res = await agent
      .delete(`/api/v1/comments/${comment.id}`)
      .send(post);

    expect(res.body).toEqual(comment);
  });
});
