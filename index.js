const yaml = require('js-yaml');
const fs = require('fs');
var Promise = require("bluebird");
var config = require('./config');

var request = require('request');
var manageElastic = require('./watcher-ops');

var moment = require('moment');



var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
var router = express.Router();
app.use(bodyParser.json());
app.use(router);

router.post('/notifications/', function(req, res) {

    try {
        var agreement = yaml.safeLoad(fs.readFileSync('./templates/agreement.yml', 'utf8'));
        var indentedJson = JSON.stringify(agreement, null, 4);
        //console.log(agreement);
    } catch (e) {
        console.error(e);
    }
    var body = require('./templates/watcher-range.json');
    var state = require('./templates/watcher-states.json');
    var time = agreement.terms.metrics.requests.window.period;
    var id = agreement.id;
    console.log("time"+time);
    var range = "now-1s"
    if (time == "minutely") {
        range = "now-1m"

    }
    body.input.search.request.body.query.bool.filter.range["measures.ts"].gt = range;
    body.input.search.request.body.query.bool.must.term.sla = id;
    //create watcher count on minute or second or hour
    manageElastic.saveWatcher(config.elasticsearch.ip, id, body)

    scopes = agreement.terms.rates[0].of

    //crear un watcher por scope
    for (var scope in scopes) {
        console.log("------------------------");
        var state = require('./templates/watcher-states.json');
        state.input.search.request.body.query.bool.must = []
        term = {
            term: {
                sla: id
            }
        };
        state.input.search.request.body.query.bool.must.push(term);

        max = scopes[scope].limits[0].max
        period = scopes[scope].limits[0].period
        for (var scp in scopes[scope].scope) {
            var key = ""
            term = {
                term: {}
            }
            if (scopes[scope].scope[scp] != "*" && scp != "level") {

                if (scp == "operation") {
                    key = "method"
                } else {
                    key = scp
                }

                term.term[key] = scopes[scope].scope[scp];

                state.input.search.request.body.query.bool.must.push(term);

            }
        }
        //console.log(state.input.search.request.body.query.bool.must);
        state.actions.notify_pager.transform.script = "[ctx.a = ctx.payload.hits.total < " + scopes[scope].limits[0].max + ", ctx.payload.hits.total, ctx.payload.hits.hits.0._source ]"
        //console.log(state.input.search.request.body.query.bool.must);
        manageElastic.saveWatcher(config.elasticsearch.ip, id + "-state" + scope, state)
    }
    res.sendStatus(200);
});


router.post('/transform/', function(req, res) {
    console.log(req.body);
    var start = new Date();
    console.log(start);
    var dp = req.body.total.replace(/=/g, ":").replace(/\s+/g, "").replace(/(key:)([a-zA-z|@.|\/|[0-9]+)/g, 'key:\"$2\"').replace(/(\w+)(:)/g, '"\$1\":');
    objeto = JSON.parse(dp);
    for (var account in objeto.account.buckets) {
        for (var tenant in objeto.account.buckets[account].tenant.buckets) {
            for (var method in objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets) {
                for (var resource in objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets[method].resource.buckets) {
                    Aobject = {}
                    Aobject.method = objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets[method].key;
                    Aobject.method = objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets[method].key;
                    Aobject.account = objeto.account.buckets[account].key;
                    Aobject.tenant = objeto.account.buckets[account].tenant.buckets[tenant].key;
                    Aobject.resource = objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets[method].resource.buckets[resource].key;
                    Aobject.num = objeto.account.buckets[account].tenant.buckets[tenant].attrs_root.method.buckets[method].resource.buckets[resource].doc_count;
                    Aobject.sla = req.body.id
                    Aobject.period = req.body.period

                    //objs.push(Aobject)
                    var options = {
                        uri: "http://" + config.elasticsearch.ip + "/states/state",
                        method: "POST",
                        json: true,
                        body: Aobject,
                    };

                    request(options);

                    var options1 = {
                        uri: "http://" + config.registry.ip + "/metrics",
                        method: "POST",
                        json: true,
                        body: Aobject,
                    };
                    request(options1);
                }
            }
        }
    }

    var end = new Date() - start;
    console.log("Execution time: ", end, " ms");
    res.sendStatus(200);

});


router.post('/transform-state/', function(req, res) {
    console.log("STATE");
    var start = new Date();
    var pmetric = require('./templates/partial-state-metric.json');
    var prate = require('./templates/partial-state-rate.json');
    var fromdate = new Date(req.body.date);
    var period = req.body.period_metric;
    if (period == "secondly") {
        fromdate = new Date(fromdate.setSeconds(fromdate.getSeconds() - 1));
    } else if (period == "minutely") {
        fromdate = new Date(fromdate.setSeconds(fromdate.getSeconds() - 60));
    } else if (period == "daily") {
        fromdate = new Date(fromdate.setSeconds(fromdate.getSeconds() - 86400));
    }
    prate.agreementId = req.body.id
    prate.id = req.body.id
    prate.scope = {
        tenant: req.body.tenant,
        account: req.body.account,
        resource: req.body.resource,
        operations: req.body.method

    };
    prate.underLimit = req.body.underLimit;
    prate.metrics.numReq = req.body.numRequest;
    prate.period.from = fromdate.toISOString();
    prate.period.to = req.body.date;

    pmetric.agreementId = req.body.id
    pmetric.id = req.body.id
    pmetric.scope = {
        tenant: req.body.tenant,
        account: req.body.account,
        resource: req.body.resource,
        operations: req.body.method

    };
    pmetric.period.from = fromdate.toISOString();
    pmetric.period.to = req.body.date;
    pmetric.value = req.body.total;
    sendBody = [prate, pmetric]
    //console.log(sendBody);
    //config.registry.ip
    var options = {
        uri: "http://" + config.registry.ip + "/state",
        method: "POST",
        json: true,
        body: sendBody,
    };
    request(options);
    var end = new Date() - start;
    console.log("Execution time: ", end, " ms");
    res.sendStatus(200);
});


router.get('/restart/', function(req,res){
  var log = require('./templates/mapping.json');
  var state = require('./templates/mapping-state.json');
  manageElastic.deleteIndex(config.elasticsearch.ip,'event');
  manageElastic.deleteIndex(config.elasticsearch.ip,'states');
  setTimeout(function(){
    manageElastic.createMapping(config.elasticsearch.ip,'event',log);
    manageElastic.createMapping(config.elasticsearch.ip,'states',state);
    var options = {
             uri: "http://localhost:4000/notifications",
             method: "POST",
             json: true,
             body: {s:"s"},
         };

    request(options);
    console.log("creado");
  }, 2000);

  res.sendStatus(200);



})




app.listen(4000, function() {
    console.log("Node server running on http://localhost:4000");
});
