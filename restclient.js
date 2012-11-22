/**
 * @class RCBase64
 * This class Encode and Decode Base64
 * @singleton
 */
var RCBase64 = {
    /**
     * @private
     * @type {String} Valid Characters for Base64
     */
    keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz0123456789+/=",

    //
    /**
     * Public method for encoding
     * @param input
     * @return {String}
     */
    encode : function (input) {
        var output = "",
            chr1,
            chr2,
            chr3,
            enc1,
            enc2,
            enc3,
            enc4,
            i = 0;

        input = this.utf8_encode(input);

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
                this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

        }

        return output;
    },

    /**
     * Public method for decoding
     * @param input
     * @return {String}
     */
    decode : function (input) {
        var output = "",
            chr1,
            chr2,
            chr3,
            enc1,
            enc2,
            enc3,
            enc4,
            i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

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

        output = this.utf8_decode(output);

        return output;

    },

    /**
     * private method for UTF-8 encoding
     * @param string
     * @return {String}
     * @private
     */
    utf8_encode : function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "", n, c;

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    /**
     * private method for UTF-8 decoding
     * @param utftext
     * @return {String}
     * @private
     */
    utf8_decode : function (utftext) {
        var string = "",
            i = 0,
            c = 0,
            c2 = 0,
            c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) |
                    ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};
/**
 * @class RestClient
 * Little REST Client written in JS
 *
 * @constructor
 * Create the RestClient namespace and object
 * @return {RestClient}
 */
var RestClient;
RestClient = function () {
    /**
     * Library's Version
     * @type {String}
     */
    this.VERSION = '0.1.2';
    /**
     * Stores the authorization variables
     * @type {Object}
     */
    this.authorization = {};
    /**
     * Stores the server variables
     * @type {Object}
     */
    this.server = {};
    /**
     * Stores the response variables
     * @type {Object}
     */
    this.response = {};
    /**
     * Stores the header variables
     * @type {Object}
     */
    this.headers = {};
    /**
     * Stores the authorization mode
     * @type {Boolean}
     */
    this.needsAuthorization = true;
    /**
     * Stores the authorization type. Values Accepted: none, basic, oauth2
     * @type {String}
     */
    this.authorizationType = 'none';
    /**
     * Stores the Oauth2.0 access token
     * @type {Object}
     */
    this.accessToken = {};
    /**
     * Stores the REST method/verbs accepted
     * @type {Object}
     */
    this.RESTMethods = {
        'create' : 'POST',
        'read' : 'GET',
        'update' : 'PUT',
        'delete' : 'DELETE'
    };
    /**
     * Setting the OAUTH2 Grant Types
     * @type {Object}
     */
    this.OAUTH2GrantTypes = {
        'code' : 'authorization_code',
        'implicit' : 'token',
        'user' : 'password',
        'client' : 'client_credentials',
        'refresh' : 'refresh_token'
    };
    return this;
};

/**
 * Resets the RestClient
 * @return {RestClient}
 */
RestClient.prototype.reset = function () {
    this.authorization = {};
    this.server = {};
    this.response = {};
    this.headers = {};
    this.needsAuthorization = true;
    this.authorizationType = 'none';
    return this;
};
/**
 * Setting the client authorization credentials
 * @param {String} client_id Client Identificator
 * @param {String} client_secret Client Secret or Password
 * @param {String} client_url Authorization URL
 * @return {RestClient}
 */
RestClient.prototype.setClient = function (client_id, client_secret,
                                           client_url) {
    this.authorization.client_id = client_id;
    this.authorization.client_secret = client_secret;
    this.authorization.client_url = (client_url !== 'undefined') ? client_url
        : null;
    return this;
};

/**
 * Setting the OAuth2 Grant Type and Data
 * @param {String} type Grant Type
 * @param {Object} data
 * @return {RestClient}
 */
RestClient.prototype.setGrantType = function (type, data) {
    this.authorization.grant_type = (this.OAUTH2GrantTypes[type] !==
        'undefined') ? this.OAUTH2GrantTypes[type]
        : null;
    this.authorization = _.extend(this.authorization, data);
    return this;
};

/**
 * Setting the Server URL to consume REST
 * @param {String} url Authorization URL
 * @return {Boolean}
 */
RestClient.prototype.setAuthorizationServer = function (url) {
    var result = true,
        reg_url;
    if (typeof url === 'undefined' || url === null) {
        result = false;
    } else {
        reg_url = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (url.match(reg_url)) {
            this.server.rest_auth_uri = url;
        } else {
            result = false;
        }
    }
    return result;
};


/**
 * Convert an Object to Key/Value string
 * @param {Object} obj Input Object
 * @return {String}
 */
RestClient.prototype.toParams = function (obj) {
    var keys = _.keys(obj),
        out = [];
    _.each(keys, function (key) {
        out.push(key + '=' + obj[key]);
    });
    return out.join('&');
};

/**
 * Create an object XmlHttpRequest or returns false if fails
 * @return {*}
 */
RestClient.prototype.createXHR = function () {
    var httpRequest;
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (ex) {}
        }
    }
    if (!httpRequest) {
        return false;
    }
    return httpRequest;
};

//
/**
 * Request an authorization
 * @param {Object} config
 * @return {Boolean}
 */
RestClient.prototype.authorize = function (config) {
    var self = this,
        success = false,
        method = 'create',
        type = this.RESTMethods[method],
        basicHash,
        xhr,
        body;

    basicHash = RCBase64.encode(this.authorization.client_id + ':' +
        this.authorization.client_secret);

    xhr = this.createXHR();
    try {
        xhr.open(type, this.server.rest_auth_uri, false);
    } catch(e){
        XHRFailure(e, {});
        return success;
    }

    xhr.onreadystatechange = function () {
        if (config.ready) {
            config.ready(xhr);
        }
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //self.response = _.extend(self.response, response);
                self.accessToken = (response.token) ? response.token : {};
                success = true;
                if (config.success) {
                    config.success(xhr);
                }
            } else {
                if (config.failure) {
                    config.failure(xhr);
                }
            }
        }
    };

    body = {};

    if (this.authorization.grant_type) {
        body.grant_type = this.authorization.grant_type;
        switch (this.authorization.grant_type) {
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
        xhr.setRequestHeader("Authorization", "Basic " + basicHash);
    }

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    //Insert Headers
    _.each(this.headers, function (value, key) {
        xhr.setRequestHeader(key, value);
    });

    xhr.send(this.toParams(body));

    return success;
};

/**
 * Add HTML header information to send though XHR
 * @param {String} name Name Field
 * @param {String} value Value Field
 * @return {Boolean}
 */
RestClient.prototype.setHeader = function (name, value) {
    var response = true,
        addObj;
    if (name && value) {
        addObj = JSON.parse('{"' + name + '" :  "' + value + '"}');
        this.headers = _.extend(this.headers, addObj);
    } else {
        response = false;
    }
    return response;
};

/**
 * Set Authorization Mode
 * @param {Boolean} value Authorization Mode
 * @return {RestClient}
 */
RestClient.prototype.setAuthorizationMode = function (value) {
    if (_.isBoolean(value)) {
        this.needsAuthorization = value;
    }
    return this;
};

/**
 * Returns the library version
 * @return {String} RestClient Version
 */
RestClient.prototype.getVersion = function () {
    return this.VERSION;
};
/**
 * Sets the authorization type
 * @param {String} type Valid Authorization Type
 * @return {Boolean}
 */
RestClient.prototype.setAuthorizationType = function (type) {
    var acceptedTypes = {none: 1, basic: 1, oauth2: 1},
        success = false;
    if (acceptedTypes[type]) {
        this.authorizationType = type;
        success = true;
    }
    return success;
};

/**
 * Set the user and password for the basic authentication method
 * @param {String} username
 * @param {String} password
 * @return {RestClient}
 */
RestClient.prototype.setBasicCredentials = function (username, password) {
    this.authorization.basic_user = username;
    this.authorization.basic_password = password;
    return this;
};
/**
 * Set manually with an access token
 * @param {Object} obj
 * @return {*}
 */
RestClient.prototype.setAccessToken = function(obj){
    if (typeof obj === 'object'){
        this.accessToken = obj;
    }
    return this;
};

/**
 * Consume REST through GET Method
 * @param {String} url REST Endpoint
 * @param {Object} data
 * @return {Object} JSON Response
 */
RestClient.prototype.getCall = function (url, data, id) {
    if (typeof id === 'undefined'){
        id = null;
    }
    return this.consume('read', url, data, id);
};

/**
 * Consume REST through POST Method
 * @param {String} url REST Endpoint
 * @param {Object} data
 * @return {Object} JSON Response
 */
RestClient.prototype.postCall = function (url, data) {
    return this.consume('create', url, data, null);
};

/**
 * Consume REST through PUT Method
 * @param {String} url REST Endpoint
 * @param {String} id Identificator
 * @param {Object} data
 * @return {Object} JSON Response
 */
RestClient.prototype.putCall = function (url, id, data) {
    return this.consume('update', url, data, id);
};

/**
 * Consume REST through DELETE Method
 * @param {String} url REST Endpoint
 * @param {String} id Identificator
 * @param {Object} data
 * @return {Object} JSON Response
 */
RestClient.prototype.deleteCall = function (url, id, data) {
    return this.consume('delete', url, data, id);
};

/**
 * Consume  REST method
 * @param {String} operation REST Verb/Method
 * @param {String} url REST Endpoint
 * @param {Object} data
 * @param {String} id Optional Indentificator
 * @return {Object}
 */
RestClient.prototype.consume = function (operation, url, data, id) {
    var basicHash,
        xhr,
        type,
        response = {},
        body = null,
        prepareUrl,
        self,
        error,
        sendBody = true;

    switch(operation){
        case 'read':
        prepareUrl = url;
        if (id){
            prepareUrl += id;
        }
        prepareUrl += '?access_token=' + this.accessToken.access_token;
        if (data !== {}){
            prepareUrl += "&" + this.toParams(data);
        }
        sendBody = false;
        break;
        case 'create':
        prepareUrl = url;
        break;
        case 'update':
        prepareUrl = url + id;
        break;
        case 'delete':
        prepareUrl = url + id;
        break;
    }

    xhr = this.createXHR();
    switch (this.authorizationType) {
    case 'none':
        break;
    case 'basic':
        basicHash = RCBase64.encode(this.authorization.basic_user + ':' +
            this.authorization.basic_user);
        xhr.setRequestHeader("Authorization", "Basic " + basicHash);
        break;
    case 'oauth2':
        if (!this.accessToken.access_token) {
            error = {success: false, msg: 'Access Token not defined'};
            this.RequestFailure(error);
            return JSON.stringify(error);
        }
        break;
    }
    type = this.RESTMethods[operation];
    try{
        xhr.open(type, prepareUrl, false);
    } catch(e){
        XHRFailure(e, data);
        return false;
    }

    self = this;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText !== '') {
                    response = JSON.parse(xhr.responseText);
                } else {
                    response = xhr.responseText;
                }
                self.RestSuccess(type, response);
            } else {
                if (xhr.responseText !== '') {
                    response = JSON.parse(xhr.responseText);
                } else {
                    response = xhr.responseText;
                }
                self.RestFailure(type, response);
            }
        }
    };

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    //Insert Headers
    _.each(this.headers, function (value, key) {
        xhr.setRequestHeader(key, value);
    });

    if (sendBody){
        body = 'access_token=' + this.accessToken.access_token + "&json=" + JSON.stringify(data);
    }
    xhr.send(body);

    return response;
};

/**
 * Event is called when the REST request is successfully
 * @param method
 * @param data
 * @event
 */
RestClient.prototype.RestSuccess = function (method, data) {
};

/**
 * Event is called when the REST request has failed
 * @param method
 * @param data
 * @event
 */
RestClient.prototype.RestFailure = function (method, data) {
};

/**
 * Event is called when the Request has failed
 * @param {Object} data Error Response
 * @event
 */
RestClient.prototype.RequestFailure = function (data) {
};

/**
 * Event is called when the Request has failed
 * @param {Object} error JS Error
 * @param {Object} data Error Response
 * @event
 */
RestClient.prototype.XHRFailure = function (error, data) {
};


//Define Module to be used in server side (Node.js)
if (typeof exports !== 'undefined') {
    module.exports = RestClient;
    var _ = require('underscore');
}