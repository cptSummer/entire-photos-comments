import bodyParser from 'body-parser';
import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';

import Comment from "../../model/comment";
import {ObjectId} from 'mongodb';
import sinon from 'sinon';
import routers from "../../routers";
import {expect} from 'chai';
import {it} from "mocha";
import connectionPromise from "../mongoSetup";
import axios from "axios";


chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();
const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use('/', routers);
describe('Comments controller', () => {

  before(async () => {
    await connectionPromise;
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should add the comment', (done) => {
    const commentIdAfterSave = new ObjectId();
    const comment = {
      text: "Tested comment text",
      author: {
        _id: 2,
        name: "testuser2",
      },
      photoId: 2,
    };

    const saveOneStub = sandbox.stub(
      Comment.prototype,
      'save',
    );
    saveOneStub.resolves({
      ...comment,
      _id: commentIdAfterSave,
    });

    const mockAxiosGet = sandbox.stub(axios, 'get');
    const mockResponse = { data: 'mock data' };
    mockAxiosGet.resolves(mockResponse);

    chai.request(app)
      .post('/api/comments')
      .send(comment)
      .end((_, res) => {
        res.should.have.status(201);
        expect(res.body.id).to.equal(commentIdAfterSave.toString());

        done();
      });
  });

  it('should return bad request if photoId is not provided', (done) => {

    chai.request(app)
      .get('/api/comments')
      .send({
        size: 2,
        from: 3,
      })
      .end((_, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should get comments by photoId sorted by date', (done) => {
    const photoId = 2;
    const size = 3;
    const from = 1;

    chai.request(app)
      .get('/api/comments')
      .send({photoId, size, from})
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body.result).to.be.an('array');
        done();
      });

  });


  it('should count the comments', (done) => {
    const result = {
      result: {
        "1": 0,
        "2": 8,
      },
    };

    const mockFind = sinon.mock(Comment);
    mockFind.expects('aggregate').resolves(result);

    chai.request(app)
      .post('/api/comments/_counts')
      .send({
        photoIds: JSON.stringify([2, 1]),
      })
      .end((_, res) => {
        res.should.have.status(200);

        done();
      });
  });


});
