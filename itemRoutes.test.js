process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

let candy = {name: 'candy', price: 0.99};
let soap = {name: 'soap', price: 2.50};

beforeEach( () => {
    items.push(candy);
    items.push(soap);
});
afterEach( () => {
    items.length = 0;
    candy = {name: 'candy', price: 0.99};
    soap = {name: 'soap', price: 2.50};
});

describe("GET all items", () => {
    test("Should return all objects in items", async () =>{
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([candy, soap]);
    });
});

describe("GET by name", () => {
    test("Should return object data if valid name", async () => {
        const res = await request(app).get('/items/candy');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(candy);
    });
    test("Should return 404 if no object found", async () => {
        const res = await request(app).get('/items/bacon');
        expect(res.statusCode).toBe(404);
    });
});

describe("POST new item", () => {
    test("Should append new item object to fake db", async () => {
        const res = await request(app).post('/items').send({name: 'sponge', price: 8.23});
        expect(res.statusCode).toBe(201);
        const newItem = items.find(elem => elem.name === 'sponge')
        expect(newItem).toBeTruthy();
        expect(newItem.name).toBe('sponge');
        expect(newItem.price).toBeCloseTo(8.23);
    });

    test("Should return 400 code if missing field(s)", async () => {
        const res = await request(app).post('/items').send({name: 'free stuff!'});
        expect(res.statusCode).toBe(400);
    });

    test("Should return 400 code if price is not a number", async () => {
        const res = await request(app).post('/items').send({name: 'free stuff!', price: false});
        expect(res.statusCode).toBe(400);
    });
});

describe("PATCH existing item", () => {
    test("Should update only with provided fields", async () => {
        const res1 = await request(app).patch('/items/candy').send({price: 5.00});
        expect(res1.statusCode).toBe(200);
        expect(candy.name).toBe('candy');
        expect(candy.price).toBeCloseTo(5.00);

        const res2 = await request(app).patch('/items/soap').send({name: 'airheads'});
        expect(res2.statusCode).toBe(200);
        expect(soap.name).toBe('airheads');
        expect(soap.price).toBeCloseTo(2.5);
        expect(items.find(elem => elem.name === 'soap')).toBeFalsy();
    });

    test("Should fully update", async () => {
        const res = await request(app).patch('/items/candy').send({name: 'bread', price: 3.99});
        expect(res.statusCode).toBe(200);
        expect(items).not.toContain({name: 'candy', price: 0.99});
        expect(candy).toEqual({name: 'bread', price: 3.99});
    });

    test("Should return 404 if object to patch is not found", async () => {
        const res = await request(app).patch('/items/bacon').send({name:'x',price:1});
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE existing item", () => {
    test("Should fully remove item from fakeDb", async () => {
        const res = await request(app).delete('/items/candy');
        expect(res.statusCode).toBe(200);
        expect(items.length).toBe(1);
        expect(items).not.toContain(candy);
    });

    test("Should return 404 if object to delete is not found", async() => {
        const res = await request(app).delete('/items/flarghenstow');
        expect(res.statusCode).toBe(404);
    });
});