const assert = require('assert')
const superagent = require('superagent');
const {MongoClient} = require('mongodb');
let url = "mongodb://localhost:27017";


async function clearDb(database) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection(database).deleteMany({})
    //console.log(asdf)
    db.close()

}


describe('Routes', function() {
    beforeEach(function() {
        clearDb()
    })

    describe('todo', function() {
        it('empty db', function(done) {
            done()
        })
    })

})