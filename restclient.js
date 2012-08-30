//  restclient.js 0.1.1
//  (c) 2012 Enrique Ponce de Leon, Qennix
//  RestClient.js may be distributed under the MIT license.
//  For all details and documentation:
//  http://qennix.github.com/restclient

// Keeps a reference of the window or global object
var root = this;

//Include a reference to 'underscore' function
var _ = root._;

//Include 'underscore' module in server mode
if (!_ && typeof require !== 'undefined'){
    _ = require('underscore');
}

// Create the RestClient namespace and object;
var RestClient = function(){
    this.VERSION = '0.1.1';
    this.authorization = {};
    this.server = {};
    this.response = {};
    this.headers = {};
    this.needsAuthorization = true;

    // Setting the REST methods accepted
    this.RESTMethods = {
        'create' : 'POST',
        'read' : 'GET',
        'update' : 'PUT',
        'delete' : 'DELETE'
    };

    // Setting the OAUTH2 Grant Types
    this.OAUTH2GrantTypes = {
        'code' : 'authorization_code',
        'implicit' : 'token',
        'user' : 'password',
        'client' : 'client_credentials',
        'refresh' : 'refresh_token'
    };

    return this;
};

//Define Module to be used in server side (Node.js)
if (typeof exports !== 'undefined'){
    module.exports = RestClient;
}

//Reset Initial Values
RestClient.prototype.reset = function(){
    this.authorization = {};
    this.server = {};
    this.response = {};
    this.headers = {};
    this.needsAuthorization = true;
    return this;
};

// Setting the client authorization credentials
RestClient.prototype.setClient = function (client_id, client_secret, client_url) {
    this.authorization.client_id = client_id;
    this.authorization.client_secret = client_secret;
    this.authorization.client_url = (client_url !== 'undefined') ? client_url
        : null;
    return this;
};

// Setting the OAuth2 Grant Type and Data
RestClient.prototype.setGrantType = function (type, data) {
    this.authorization.grant_type = (this.OAUTH2GrantTypes[type] !== 'undefined') ? this.OAUTH2GrantTypes[type]
        : null;
    this.authorization = _.extend(this.authorization, data);
    return this;
};

// Setting the Server URL to consume REST
RestClient.prototype.setAuthorizationServer = function(url) {
    var result = true;
    if (typeof url === 'undefined' || url === null) {
        result = false;
    } else {
        var reg_url = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (url.match(reg_url)) {
            this.server.rest_auth_uri = url;
        } else {
            result = false;
        }
    }
    return result;
};

/**
 *  Include Base64 object
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
RestClient.prototype.Base64 = {

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


//Convert and Object to Key/Value string
RestClient.prototype.toParams = function(obj){
    //var obj = this;
    var keys = _.keys(obj);
    var out = [];
    _.each (keys, function(key){
        out.push(key + '=' + obj[key]);
    });
    return out.join('&');
};

//Create an object XmlHttpRequest or returns false if fails
RestClient.prototype.createXHR = function()
{
    var httpRequest;
    if (window.XMLHttpRequest){
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try{
            httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {}
        }
    }
    if (!httpRequest) {
        return false;
    }
    return httpRequest;
};

//Request an access token
RestClient.prototype.authorize = function(config)
{
    var self = this;
    var success = false;
    var method = 'create';
    var type = this.RESTMethods[method];

    var basicHash = this.Base64.encode(this.authorization.client_id + ':' + this.authorization.client_secret);

    var xhr = this.createXHR();
    xhr.open(type, this.server.rest_auth_uri, false);

    xhr.onreadystatechange = function(){
        if (config.ready){
            config.ready(xhr);
        }
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                self.response = _.extend(self.response, response);
                success = true;
                if (config.success){
                    config.success (xhr);
                }
            } else {
                if (config.failure){
                    config.failure(xhr);
                }
            }
            return success;
        }
    };
    var body = {};

    if (this.authorization.grant_type){
        body.grant_type = this.authorization.grant_type;
        switch(this.authorization.grant_type){
            case 'authorization_code':
                body.code = this.authorization.code;
                break;
            case 'token':
                body.token = this.authorization.token;
                break;
            case 'password':
                body.username = this.authorization.username;
                body.password = this.authorization.password;
                break;
            case 'client_credentials':
                body.client_id = this.authorization.client_id;
                body.client_id = this.authorization.client_secret;
                break;
            case 'refresh_token':
                body.refresh_token = this.authorization.refresh_token;
                break;

        }
    }

    if (this.needsAuthorization) {
        xhr.setRequestHeader("Authorization","Basic " + basicHash);
    }

    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    //Insert Headers
    _.each(this.headers, function(value, key){
        xhr.setRequestHeader(key, value);
    });

    xhr.send(this.toParams(body));
};

//Insert header values
RestClient.prototype.setHeader = function(name, value){
    var response = true;
    if (name && value){
        var addObj = JSON.parse('{"' + name + '" :  "' + value + '"}');
        this.headers = _.extend(this.headers, addObj);
    } else {
        response = false;
    }
    return response;
};

//Set Authorization Mode
RestClient.prototype.setAuthorizationMode = function(value){
    if (_.isBoolean(value)){
        this.needsAuthorization = value;
    }
    return this;
};

//    // Execute the REST request
//    RestClient.consume = function (method, options, callback, authorize) {
//
//        var needsAuthorization = (authorize !== 'undefined')? authorize : true;
//        var type = this.RESTMethods[method];
//
//        var params = {type: type, dataType: 'json'};
//
//        params.url = (options.url) ? options.url : this.server.rest_url;
//
//        if (needsAuthorization) {
//            var basicHash = this.Base64.encode(this.authorization.client_id + ':' + this.authorization.client_secrect);
//            this.headers.Authorization = 'Basic ' + basicHash;
//        }
//
//        var data = {};
//        if (this.authorization.grant_type){
//            data.grant_type = this.authorization.grant_type;
//            switch(this.authorization.grant_type){
//                case 'authorization_code':
//                    data.code = this.authorization.code;
//                    break;
//                case 'token':
//                    data.token = this.authorization.token;
//                    break;
//                case 'password':
//                    data.username = this.authorization.username;
//                    data.password = this.authorization.password;
//                    break;
//                case 'client_credentials':
//                    data.client_id = this.authorization.client_id;
//                    data.client_id = this.authorization.client_secret;
//                    break;
//                case 'refresh_token':
//                    data.refresh_token = this.authorization.refresh_token;
//                    break;
//
//            }
//        }
//        data.apply(this, options.data);
//        params.data = data;
//
//        params.headers = this.headers;
//        params.success = callback;
//
//        return RestClient.proxy(_.extend(params, options));
//    };
//
//    // Function to be implemented/replace the Backbone.js sync function
//    RestClient.sync = function (method, model, options) {