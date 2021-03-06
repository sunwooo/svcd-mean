'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Search Page';
    },

    createSearch: (req) => {

        var findCompany = {},
            highlight = {};
        var AndQueries = []; 
        var OrQueries = [];

        if (req.query.searchText) {

            OrQueries.push({
                company_nm: { $regex : new RegExp(req.query.searchText, "i") }
            });

            logger.debug('OrQueries : ' + OrQueries);
            
            highlight.content = req.query.searchText;

            if (OrQueries.length > 0){
                findCompany.$or = OrQueries;
            }
        }

        logger.debug('findCompany : ' + JSON.stringify(findCompany));
        logger.debug('req.query.searchText : ' + req.query.searchText);
        return {
            searchText: req.query.searchText,
            findCompany: findCompany,
            highlight: highlight
        };
    }

};