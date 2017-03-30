"use strict";
var prueba = require('./index.js');

prueba.doParallelRequestFromfile('./configurations/config-exec.yaml').then(function(success) {

    console.log(success);

});
