import request from "supertest";
import {app} from '../../app'

it("has a route handler listening to /api/tickets", async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})
    expect(response.status).not.toEqual(404)
});

it("can be accessed only if user signed in ", async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)

});

it("send a status # 401 if user signed in ", async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({})

    console.log(response.status)
    
    expect(response.status).not.toEqual(401)

});
it("returns an error if invalid title", async () => {});
it("returns an error if invalid price", async () => {});
it("creates ticket with valid inputs", async () => {});
