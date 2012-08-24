//  restclient.js 0.1.1

//  (c) 2012 Enrique Ponce de Leon, Qennix
//  RestClient.js may be distributed under the MIT license.
//  For all details and documentation:
//  http://qennix.github.com/restclient

(function (){

    // Keeps a reference of the window or global object
    var root = this;

    //Include a reference to 'underscore' function
    var _ = root._;

    //Include 'underscore' module in server mode
    if (!_ && typeof require !== 'undefined'){
        _ = require('underscore');
    }

    // Create the RestClient namespace and object;
    var RestClient;
    if (typeof exports !== 'undefined'){
        RestClient = exports;
    } else {
        RestClient = root.RestClient = {};
    }

    RestClient.VERSION = '0.1.1';

    //Define Container Objects
    RestClient.authorization = {};
    RestClient.server = {};
    RestClient.body = {};
    RestClient.headers = {};

    // Turn on 'useRelativeURL' to support relative url request
    RestClient.useRelativeURL = false;

    // Turn off 'needsAuthorization' to avoid send authorization headers
    RestClient.needsAuthorization = true;

    // Define a pointer to jQuery object
    RestClient.$ = root.jQuery;

    // Setting the REST methods accepted
    RestClient.RESTMethods = {
        'create' : 'POST',
        'read' : 'GET',
        'update' : 'PUT',
        'delete' : 'DELETE'
    };

    // Setting the OAUTH2 Grant Types
    RestClient.OAUTH2GrantTypes = {
        'code' : 'authorization_code',
        'implicit' : 'token',
        'user' : 'password',
        'client' : 'client_credentials',
        'refresh' : 'refresh_token'
    };

    // Setting the client authorization credentials
    RestClient.setClient = function (client_id, client_secret, client_url) {
        this.authorization.client_id = client_id;
        this.authorization.client_secret = client_secret;
        this.authorization.client_url = (client_url !== 'undefined') ? client_url
            : null;
        return this;
    };

    // Setting the OAuth2 Grant Type and Data
    RestClient.setGrantType = function (type, data) {
        //return 'works!';
        this.authorization.grant_type = (this.OAUTH2GrantTypes[type] !== 'undefined') ? this.OAUTH2GrantTypes[type]
            : null;
        //this.authorization.apply(this, data);
        return this;
    };

    // Setting the Server URL to consume REST
    RestClient.setServerUrl = function(url){
        this.server.rest_url = (url !== 'undefined') ? url : null;
        this.useRelativeURL = true;
    };

    /**
     *  Include Base64 object
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    RestClient.Base64 = {

        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = this._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = 0, c2 = 0, c3 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    };

    // Set the authorization mode true=needs authorization, false=don't need authorization 
    RestClient.setAuthorizationMode = function(value){
        this.needsAuthorization = (value) ? value : true;
        return this;
    };

    // Implement proxy to jQuery ajax functions
    RestClient.proxy = function () {
        return RestClient.$.ajax.apply(RestClient.$, arguments);
    };

    // Execute the REST request
    RestClient.consume = function (method, options, callback, authorize) {

        var needsAuthorization = (authorize !== 'undefined')? authorize : true;
        var type = this.RESTMethods[method];

        var params = {type: type, dataType: 'json'};

        params.url = (options.url) ? options.url : this.server.rest_url;

        if (needsAuthorization) {
            var basicHash = this.Base64.encode(this.authorization.client_id + ':' + this.authorization.client_secrect);
            this.headers.Authorization = 'Basic ' + basicHash;
        }

        var data = {};
        if (this.authorization.grant_type){
            data.grant_type = this.authorization.grant_type;
            switch(this.authorization.grant_type){
                case 'authorization_code':
                    data.code = this.authorization.code;
                    break;
                case 'token':
                    data.token = this.authorization.token;
                    break;
                case 'password':
                    data.username = this.authorization.username;
                    data.password = this.authorization.password;
                    break;
                case 'client_credentials':
                    data.client_id = this.authorization.client_id;
                    data.client_id = this.authorization.client_secret;
                    break;
                case 'refresh_token':
                    data.refresh_token = this.authorization.refresh_token;
                    break;

            }
        }
        data.apply(this, options.data);
        params.data = data;

        params.headers = this.headers;
        params.success = callback;

        return RestClient.proxy(_.extend(params, options));
    };

    // Function to be implemented/replace the Backbone.js sync function
    RestClient.sync = function (method, model, options) {
        // TODO: implement this function
        return this;
    };

}).call(this);
