var RestClient = require('../restclient.js').RestClient;

describe("RestClient.js - Constructor, Setters, Getters and auxiliary functions", function(){

    var rc, rc1, rc2, rc3, fixture;

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
            rc.setDataType('html');
            expect(rc.dataType).toEqual('html');
        });

        it("should accept only values: 'json', 'form', 'plain', 'html'", function(){
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
            rc.setDataType('html');
            expect(rc.contentType).toEqual('text/html');
            rc.setDataType('form');
            expect(rc.contentType).toEqual('application/x-www-form-urlencoded');
            rc.setDataType('plain');
            expect(rc.contentType).toEqual('text/plain');
        });
    });

    describe("method 'setAccessTokenExpiredMessage'", function(){

        it("should set the value of 'expiredAccessTokenMessage' property", function(){
            rc.setAccessTokenExpiredMessage('message');
            expect(rc.expiredAccessTokenMessage).toEqual('message');
        });
         
    });

    describe("method 'setRestfulBehavior'", function () {
        it ("should set the value of 'restfulBehavior' property", function () {
            rc.setRestfulBehavior(true);
            expect(rc.restfulBehavior).toBeTruthy();
            rc.setRestfulBehavior(false);
            expect(rc.restfulBehavior).toBeFalsy();
        });
    });

    describe("method 'setBackupAjaxUrl'", function () {
        it("should set the value of 'backupAJAXURL' property", function (){
            rc.setBackupAjaxUrl('http://restserver.colosa.com/');
            expect(rc.backupAJAXURL).toEqual('http://restserver.colosa.com/');
        });
    });

    describe("method 'setHeader'", function () {
        it("should return 'false' if the params are invalid", function() {
            expect(rc.setHeader()).toBeFalsy();
            expect(rc.setHeader('valid')).toBeFalsy();
            expect(rc.setHeader(null, 'valid')).toBeFalsy();
        });

        it("should return 'true' when the params are valid", function () {
            expect(rc.setHeader('valid', 'valid')).toBeTruthy();
        });

        it("should set 'headers' property with the key/value properties", function () {
            rc3 = new RestClient();
            expect(rc3.headers).toEqual({});
            rc3.setHeader('Key1', 'Value1');
            expect(rc3.headers).toEqual({Key1:'Value1'});
            rc3.setHeader('Key2', true);
            expect(rc3.headers).toEqual({Key1:'Value1',Key2: 'true'});
            rc3.setHeader('Key3', 'false');
            expect(rc3.headers).toEqual({Key1:'Value1',Key2: 'true', Key3: 'false'});
            rc3.setHeader('Key4', 56);
            expect(rc3.headers).toEqual({Key1:'Value1',Key2: 'true', Key3: 'false', Key4: '56'});
        });
    });

    describe("method 'setBasicCredentials'", function () {
        it("should set the authorization variables 'basic_user' and 'basic_password'", function () {
            fixture = {basic_user: 'Basic_User', basic_password: 'Basic_Password'};
            rc.setBasicCredentials('Basic_User','Basic_Password');
            expect(rc.authorization).toEqual(fixture);
        });
    });

    describe("method 'setAccessToken'", function () {
        it ("should set the access token object", function () {
            fixture = {a:13, b: 56, c: 'Text', d: true};
            rc.setAccessToken(fixture);
            expect(rc.accessToken).toEqual(fixture);
        });
        it ("should accept objects only", function () {
            expect(rc3.accessToken).toEqual({});
            rc3.setAccessToken(12);
            expect(rc3.accessToken).toEqual({});
            rc3.setAccessToken('AccessToken');
            expect(rc3.accessToken).toEqual({});
            rc3.setAccessToken(true);
            expect(rc3.accessToken).toEqual({});
        });

    });

    describe("method 'getVersion'", function(){
        it("should return the value of 'VERSION' property", function(){
            expect(rc.getVersion()).toEqual(rc.VERSION);
        })
    });

    describe("method 'toParams'", function () {
        it("should convert js object on key=value string", function () {
            fixture = {};
            expect(rc.toParams(fixture)).toEqual('');
            fixture = {k1:'v1'};
            expect(rc.toParams(fixture)).toEqual('k1=v1');
            fixture = {k1: true, k2: 12, k3: 'valid'};
            expect(rc.toParams(fixture)).toEqual('k1=true&k2=12&k3=valid');
        }); 
    });

    describe("method 'prepareBody'", function () {
        it ("should return an JSON string when the dataType is json or jsonp", function () {
            fixture = {k1: true, k2: 45, k3: 'valid'};
            rc.setDataType('json');
            expect(rc.prepareBody(fixture)).toEqual('{"k1":true,"k2":45,"k3":"valid"}');
        });
        it ("should return a key=value string when the dataType is not json or jsonp", function () {
            fixture = {k1: true, k2: 45, k3: 'valid'};
            rc.setDataType('plain');
            expect(rc.prepareBody(fixture)).toEqual("k1=true&k2=45&k3=valid");
            rc.setDataType('form');
            expect(rc.prepareBody(fixture)).toEqual("k1=true&k2=45&k3=valid");
            rc.setDataType('html');
            expect(rc.prepareBody(fixture)).toEqual("k1=true&k2=45&k3=valid");
        });
    });
});
