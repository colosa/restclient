/**
 * Created with JetBrains WebStorm.
 * User: qennix
 * Date: 8/22/12
 * Time: 5:23 PM
 * To change this template use File | Settings | File Templates.
 */

var RestClient = require('../restclient.js');
describe("OAuth2 Authorization Requirements", function(){
    it("should accept 'code' grant type", function(){
        expect(RestClient.setGrantType('code').authorization.grant_type).toEqual('authorization_code');
    });
    it("should accept 'user' grant type", function(){
        expect(RestClient.setGrantType('user').authorization.grant_type).toEqual('password');
    });
    it("should accept 'client' grant type", function(){
        expect(RestClient.setGrantType('client').authorization.grant_type).toEqual('client_credentials');
    });
    it("should accept 'implicit' grant type", function(){
        expect(RestClient.setGrantType('implicit').authorization.grant_type).toEqual('token');
    });
    it("should accept 'refresh' grant type", function(){
        expect(RestClient.setGrantType('refresh').authorization.grant_type).toEqual('refresh_token');
    });
    it("should reject 'other' grant types", function(){
        expect(RestClient.setGrantType('abx').authorization.grant_type).toEqual(null);
    });

});