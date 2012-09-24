var RestClient = require('../restclient.js');
describe("RestClient.js - Basic Functions", function () {

    var rc = new RestClient();

    it("Reset method should initialize object", function () {

        rc.authorization.aa = 'aa';
        rc.server.bb = 'bb';
        rc.headers.cc = 'cc';
        rc.response.dd = 'dd';
        rc.needsAuthorization = false;
        expect(rc.reset().authorization).toEqual({});
        expect(rc.reset().server).toEqual({});
        expect(rc.reset().headers).toEqual({});
        expect(rc.reset().response).toEqual({});
        expect(rc.reset().needsAuthorization).toBe(true);
        expect(rc.reset().authorizationType).toBe('none');

    });

});
