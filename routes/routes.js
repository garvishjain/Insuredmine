const Routes = require('express').Router();
const AggregatePolicyController = require('../controller/AggregatePolicyController');
const SearchpolicyController = require('../controller/SearchpolicyController');
const UploadCSVController = require('../controller/UploadController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/** Routes */
Routes.route('/upload').post(upload.single('file'),UploadCSVController.uploadCSV)
Routes.route('/search').get(SearchpolicyController.searchPolicy)
Routes.route('/aggregate/policies').get(AggregatePolicyController.AggregatePolicy)

module.exports= Routes;