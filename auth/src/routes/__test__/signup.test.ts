import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on succeful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@g.com',
            password: 'pass'
        })
        .expect(201)
})