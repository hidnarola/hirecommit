var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var jwt = require('jsonwebtoken');
var async = require('async');
var fs = require('fs');
var path = require('path');
var common_helper = require('../../helpers/common_helper');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = router;