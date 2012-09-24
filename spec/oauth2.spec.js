var RestClient = require('../restclient.js');

describe("RestClient.js - OAuth2 Capabilities", function () {

    var rc;

    describe("Authorization Method: 'setClient'", function () {

        beforeEach(function () {
            rc = new RestClient();
        });

        var test_client;

        it ("should accept two params as client credentials", function(){
            test_client = {client_id:'id', client_secret: 'secret'};
            expect(rc.setClient('id','secret').authorization).toEqual(test_client);
        });

        it ("should accept three params as client credentials", function(){
            test_client = {client_id:'id', client_secret: 'secret', client_url:'url'};
            expect(rc.setClient('id','secret','url').authorization).toEqual(test_client);
        });

    });

    describe ("Authorization Method: 'setGrantType'", function(){

        beforeEach(function(){
            rc = new RestClient();
        });

        it("should accept 'code' grant type", function(){
            expect(rc.setGrantType('code').authorization.grant_type).toEqual('authorization_code');
        });
        it("should accept 'user' grant type", function(){
            expect(rc.setGrantType('user').authorization.grant_type).toEqual('password');
        });
        it("should accept 'client' grant type", function(){
            expect(rc.setGrantType('client').authorization.grant_type).toEqual('client_credentials');
        });
        it("should accept 'implicit' grant type", function(){
            expect(rc.setGrantType('implicit').authorization.grant_type).toEqual('token');
        });
        it("should accept 'refresh' grant type", function(){
            expect(rc.setGrantType('refresh').authorization.grant_type).toEqual('refresh_token');
        });
        it("should reject 'other' grant types", function(){
            expect(rc.setGrantType('abx').authorization.grant_type).toEqual(null);
        });

        it ("should not define any properties with null as second parameter", function(){
            expect(rc.setGrantType('implicit', null).authorization).toEqual({grant_type: 'token'});
        });

        it ("should not define any properties with an empty object as second parameter", function(){
            expect(rc.setGrantType('implicit', {}).authorization).toEqual({grant_type: 'token'});
        });

        it ("should define properties with a valid object as second parameter", function(){
            var fixture = {
                'username':'username',
                'password':'password',
                'code': 'code',
                'token': 'token',
                'refresh_token': 'refresh_token',
                'client_id':'client_id',
                'client_secret': 'client_secret'
            };
            var test_auth = {
                'grant_type':'token',
                'username':'username',
                'password':'password',
                'code': 'code',
                'token': 'token',
                'refresh_token': 'refresh_token',
                'client_id':'client_id',
                'client_secret': 'client_secret'
            };
            expect(rc.setGrantType('implicit', fixture).authorization).toEqual(test_auth);
        });

    });

    describe ("Authorization Method: 'setAuthorizationServer'", function(){

        beforeEach(function(){
            rc.reset();
        });

        it ("should accept url to set the authorization server", function(){
            var valid_url = 'http://rest.qennix.com:8083/oauth/token?aaa=1&yy=2#home';
            var result = rc.setAuthorizationServer(valid_url);
            expect(result).toBe(true);
            expect(rc.server).toEqual({rest_auth_uri:valid_url});
        });

        it("should return 'false' when the parameter is invalid", function(){
            var invalid_url = 'abc';
            expect(rc.setAuthorizationServer(invalid_url)).toBe(false);
            expect(rc.setAuthorizationServer(null)).toBe(false);
            expect(rc.setAuthorizationServer()).toBe(false);
        });
    });

});