/**
 * Created with JetBrains WebStorm.
 * User: qennix
 * Date: 8/25/12
 * Time: 1:50 AM
 */

var RestClient = require('../restclient.js');
describe("RestClient.js - Basic Functions",function(){

    it ("Reset method should initialize object", function(){
        var rc = RestClient;
        rc.reset();
        rc.authorization.aa = 'aa';
        rc.server.bb = 'bb';
        rc.headers.cc = 'cc';
        rc.body.dd = 'dd';
        expect(rc.reset().authorization).toEqual({});
        expect(rc.reset().server).toEqual({});
        expect(rc.reset().headers).toEqual({});
        expect(rc.reset().body).toEqual({});

    });

});
