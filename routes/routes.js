const Routes = require('express').Router();
const AggregatePolicyController = require('../controller/AggregatePolicyController');
const ScheduleMessageController = require('../controller/ScheduleMessageController');
const SearchpolicyController = require('../controller/SearchpolicyController');
const UploadCSVController = require('../controller/UploadController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/** Routes */
/** Upload API using Worker Threads */
Routes.route('/upload').post(upload.single('file'),UploadCSVController.uploadCSV)
/** Search Policy Info by Username*/
Routes.route('/search').get(SearchpolicyController.searchPolicy)
/** Aggregation API for Policies by User */
Routes.route('/aggregate/policies').get(AggregatePolicyController.AggregatePolicy)


/** scheduler Message Api */
Routes.route('/schedule-message').get(ScheduleMessageController.ScheduleMessage)

module.exports= Routes;