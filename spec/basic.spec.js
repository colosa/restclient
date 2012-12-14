var RestClient = require('../restclient.js').RestClient;

describe("RestClient.js - Constructor, Setters and Getters", function(){

    var rc, rc1, rc2;

    beforeEach(function(){
        rc = new RestClient();
    });

    describe ("Constructor", function(){
        it("should create a new RestClient instance", function() {
            rc1 = new RestClient();
            expect(typeof rc1).toEqual('object');

        });
        it("should create an unique version of each object", function() {
            rc2 = new RestClient();
            rc1.contentType = "test";
            expect(rc1).not.toEqual(rc2);
        });
    });

    describe("method 'setUseRefreshTokenAutomatically'", function() {
        it("should set the value of autoUseRefreshToken property", function(){
            rc.setUseRefreshTokenAutomatically(true);
            expect(rc.autoUseRefreshToken).toBeTruthy();
            rc.setUseRefreshTokenAutomatically(false);
            expect(rc.autoUseRefreshToken).toBeFalsy();
        });

        it("should accept only boolean values", function(){
            rc.setUseRefreshTokenAutomatically(false);
            rc.setUseRefreshTokenAutomatically('true');
            expect(rc.autoUseRefreshToken).toBeFalsy();
            rc.setUseRefreshTokenAutomatically({a:5});
            expect(rc.autoUseRefreshToken).toBeFalsy();
            rc.setUseRefreshTokenAutomatically(null);
            expect(rc.autoUseRefreshToken).toBeFalsy();
        });
    });

    describe("method 'setStoreAccessTokenAutomatically'", function() {

        it("should set the value of 'autoStoreAccessToken' property", function(){
            rc.setStoreAccessTokenAutomatically(false);
            expect(rc.autoStoreAccessToken).toBeFalsy();
            rc.setStoreAccessTokenAutomatically(true);
            expect(rc.autoStoreAccessToken).toBeTruthy();
        });

        it("should accept only boolean values", function(){
            rc.setStoreAccessTokenAutomatically(true);
            rc.setStoreAccessTokenAutomatically(null);
            expect(rc.autoStoreAccessToken).toBeTruthy();
            rc.setStoreAccessTokenAutomatically('true');
            expect(rc.autoStoreAccessToken).toBeTruthy();
            rc.setStoreAccessTokenAutomatically({a: true});
            expect(rc.autoStoreAccessToken).toBeTruthy();
        });
    });

    describe("method 'setAuthorizationType'", function(){
        it("should set the value of 'authorizationType' property", function(){
            rc.setAuthorizationType('oauth2');
            expect(rc.authorizationType).toEqual('oauth2');
            rc.setAuthorizationType('none');
            expect(rc.authorizationType).toEqual('none');
            rc.setAuthorizationType('basic');
            expect(rc.authorizationType).toEqual('basic');
        });

        it("should accept only 'none', 'basic' and 'oauth2' values", function(){
            rc.setAuthorizationType('oauth2');
            rc.setAuthorizationType(null);
            expect(rc.authorizationType).toEqual('oauth2');
            rc.setAuthorizationType({a: 'oauth2'});
            expect(rc.authorizationType).toEqual('oauth2');
            rc.setAuthorizationType('other');
            expect(rc.authorizationType).toEqual('oauth2');
            rc.setAuthorizationType(false);
            expect(rc.authorizationType).toEqual('oauth2');
        });
    });

    describe("method 'setContentType'", function(){
        it ("should set the value of 'contentType' property", function(){
            rc.setContentType('application/json');
            expect(rc.contentType).toEqual('application/json');
            rc.setContentType('application/javascript');
            expect(rc.contentType).toEqual('application/javascript');
            rc.setContentType('application/x-www-form-urlencoded');
            expect(rc.contentType).toEqual('application/x-www-form-urlencoded');
            rc.setContentType('text/plain');
            expect(rc.contentType).toEqual('text/plain');
        });

    });

    describe("method 'setSendBearerAuthorization'", function(){
        it("should set the value of 'sendOAuthBearerAuthorization' property", function(){
            rc.setSendBearerAuthorization(false);
            expect(rc.sendOAuthBearerAuthorization).toBeFalsy();
            rc.setSendBearerAuthorization(true);
            expect(rc.sendOAuthBearerAuthorization).toBeTruthy();
        });
        it("should accept only boolean values", function(){
            rc.setSendBearerAuthorization(false);
            rc.setSendBearerAuthorization(null);
            expect(rc.sendOAuthBearerAuthorization).toBeFalsy();
            rc.setSendBearerAuthorization();
            expect(rc.sendOAuthBearerAuthorization).toBeFalsy();
            rc.setSendBearerAuthorization('true');
            expect(rc.sendOAuthBearerAuthorization).toBeFalsy();
            rc.setSendBearerAuthorization({a:true});
            expect(rc.sendOAuthBearerAuthorization).toBeFalsy();
        });
    });

    describe("method 'setOAuth2NeedsAuthorization'", function(){
        it("should set the value of the 'oauth2NeedsAuthorization' property", function(){
            rc.setOAuth2NeedsAuthorization(false);
            expect(rc.oauth2NeedsAuthorization).toBeFalsy();
            rc.setOAuth2NeedsAuthorization(true);
            expect(rc.oauth2NeedsAuthorization).toBeTruthy();
        });

        it("should accept only boolean values", function(){
            rc.setOAuth2NeedsAuthorization(true);
            rc.setOAuth2NeedsAuthorization('');
            expect(rc.oauth2NeedsAuthorization).toBeTruthy();
            rc.setOAuth2NeedsAuthorization(null);
            expect(rc.oauth2NeedsAuthorization).toBeTruthy();
            rc.setOAuth2NeedsAuthorization(15);
            expect(rc.oauth2NeedsAuthorization).toBeTruthy();
            rc.setOAuth2NeedsAuthorization({value:true});
            expect(rc.oauth2NeedsAuthorization).toBeTruthy();
        });
    });

    describe("method 'setDataType'", function() {
        it("should set the value of 'dataType' property", function(){
            rc.setDataType('json');
            expect(rc.dataType).toEqual('json');
            rc.setDataType('form');
            expect(rc.dataType).toEqual('form');
            rc.setDataType('plain');
            expect(rc.dataType).toEqual('plain');
        });

        it("should accept only values: 'json', 'form', 'plain'", function(){
            rc.setDataType('json');
            rc.setDataType(null);
            expect(rc.dataType).toEqual('json');
            rc.setDataType(5);
            expect(rc.dataType).toEqual('json');
            rc.setDataType('other');
            expect(rc.dataType).toEqual('json');
            rc.setDataType({value: 'json'});
            expect(rc.dataType).toEqual('json');
        });

        it("should update the 'contentType' property", function(){
            rc.setDataType('json');
            expect(rc.contentType).toEqual('application/json');
            rc.setDataType('jsonp');
            expect(rc.contentType).toEqual('application/json');
            rc.setDataType('form');
            expect(rc.contentType).toEqual('application/x-www-form-urlencoded');
            rc.setDataType('plain');
            expect(rc.contentType).toEqual('text/plain');
        });
    });

    describe("method 'getVersion'", function(){
        it("should return the value of 'VERSION' property", function(){
            expect(rc.getVersion()).toEqual(rc.VERSION);
        })
    });
});
