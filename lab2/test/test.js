const assert = require('assert')
const should = require('should')
const superagent = require('superagent');
var server = require('../lib/server')

describe('getall', function() {
    it("should return all messages sorted by time posted", function(done) {
        superagent.get('http://localhost:3000/getall').set('accept', 'json').end(function(err, res) {
            console.log(res.body)
            done()
        })

    })
})