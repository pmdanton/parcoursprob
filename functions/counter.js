const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = async (event, context) => {
    return client.query(q.Get(q.Match(q.Index('visits'))))
        .then((response) => {
            let hits = response.data.hits + 1;
            const ref = response.ref;
            return client.query(q.Update(ref, { data: { hits: hits } }))
                .then(() => ({
                    statusCode: 200,
                    body: String(hits)
                }));
        })
        .catch(() => {
            return client.query(q.Create(q.Collection('visits'), { data: { hits: 1 } }))
                .then(() => ({
                    statusCode: 200,
                    body: '1'
                }));
        });
};
