var RestClient = require('../restclient.js').RestClient;

describe("RestClient.js - Constructor, Setters and Getters", function(){

    var rc, rc2;

    describe ("Constructor", function(){
        it("should create a new RestClient with the constructor", function() {
            rc = new RestClient();
            expect(typeof rc).toEqual('object');

        });
        it("should create an unique version of each object", function() {
            rc2 = new RestClient();
            rc.contentType = "test";
            expect(rc).not.toEqual(rc2);
        });
    });

    describe("Setters", function() {
        it("method 'setUseRefreshTokenAutomatically' should set the value of autoUseRefreshToken property", function(){
            rc.setUseRefreshTokenAutomatically(true);
            expect(rc.autoUseRefreshToken).toBeTruthy();
            rc.setUseRefreshTokenAutomatically(false);
            expect(rc.autoUseRefreshToken).toBeFalsy();
        });

        it("method 'setUseRefreshTokenAutomatically' should accept only boolean values", function(){
            rc.setUseRefreshTokenAutomatically('text');
            expect(rc.autoUseRefreshToken).toBeFalsy();
            rc.setUseRefreshTokenAutomatically({a:5});
            expect(rc.autoUseRefreshToken).toBeFalsy();
            rc.setUseRefreshTokenAutomatically(null);
            expect(rc.autoUseRefreshToken).toBeFalsy();
        });
    });



});
