process.env.NODE_ENV = "test";

const app = require("../app.js");
const connection = require("../connections.js");

const chai = require("chai");
const { expect } = chai;

const request = require("supertest");

const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("GET api/topics", () => {
    it("STATUS:200 responds with an object containing an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).contain.keys("description", "slug");
        });
    });
  });
  describe("GET api/users:username", () => {
    it("STATUS: 200 responds with a specified username object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.user).to.contain.keys(
            "username",
            "name",
            "avatar_url"
          );
        });
    });
  });
  describe("GET api/articles:article_id", () => {
    it("STATUS: 200 responds with a specified article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body.article).to.contain.keys(
            "article_id",
            "author",
            "title",
            "body",
            "created_at",
            "votes",
            "topic"
          );
          expect(res.body.article).to.include({
            title: "Living in the shadow of a great man",
            author: "butter_bridge"
          });
        });
    });
    describe("PATCH api/articles:article_id", () => {
      it("STATUS: 200 responds with an article object with vote count increased", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 3 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(103);
          });
      });
      it("STATUS: 200 responds with vote count decreased", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(90);
          });
      });
    });
    describe("POST api/articles:articleId/comments", () => {
      it("STATUS: 201 responds with a newly posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "I strongly object to this"
          })
          .expect(201)
          .then(res => {
            expect(res.body.comment).to.include({
              article_id: 1,
              body: "I strongly object to this"
            });
          });
      });
    });
    describe("GET api/articles:articleId/comments", () => {
      it("STATUS: 200 responds with an object containing an array of comments", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments[0]).to.have.keys(
              "body",
              "author",
              "comment_id",
              "article_id",
              "created_at",
              "votes"
            );
            expect(res.body.comments[0].article_id).to.equal(1);
          });
      });
      it("STATUS: 200 array is sorted by 'created_at' and ordered descendingly by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("STATUS: 200 array accepts a sort_by query and sorts the array correspondingly", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("STATUS: 200 array accepts an order_by query and orders the array correspondingly", () => {
        return request(app)
          .get("/api/articles/1/comments?sorted_by=votes&order_by=asc")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("created_at", {
              ascending: true
            });
          });
      });
    });
  });
});
