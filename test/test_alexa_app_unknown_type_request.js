/*jshint expr: true*/
"use strict";
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var mockHelper = require("./helpers/mock_helper");
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.config.includeStack = true;

describe("Alexa", function() {
  var Alexa = require("../index");
  describe("app", function() {
    var app = new Alexa.app("myapp");
    describe("unknown type #request", function() {
      describe("response", function() {

        var mockRequest = mockHelper.load("unknown_type_request.json");

        it("invokes a globally defined error function", function() {
          app = new Alexa.app("myapp");

          app.error = function(e, request, response) {
            throw "foobar";
          };

          var subject = app.request(mockRequest);
          return expect(subject).to.be.rejectedWith("foobar");
        });

        it("fails with not a valid request", function() {
          app = new Alexa.app("myapp");

          var subject = app.request(mockRequest).then(function(response) {
            return response.response.outputSpeech;
          });
          return expect(subject).to.eventually.become({
            ssml: "<speak>Error: not a valid request</speak>",
            type: "SSML"
          });
        });
      });
    });
  });
});
