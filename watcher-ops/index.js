var elasticsearch = require('elasticsearch');
var elasticsearchWatcher = require('elasticsearch5-watcher');
var request = require("request");

var client = function(url) {
    return new elasticsearch.Client({
        host: url,
        //log: 'trace',
        plugins: [elasticsearchWatcher]
    });


}
module.exports.deleteWatcher = function(url, id) {

    client(url).watcher.deleteWatch({
        id: id
    });



}

module.exports.saveWatcher = function(url, id, body) {

    client(url).watcher.putWatch({
        id: id,
        body: body
    });

}


module.exports.createMapping = function(url,index,body){
  options = {
           uri: "http://"+url+"/"+index,
           method: "PUT",
           json: true,
           body: body,
       };

request(options);

}

module.exports.createIndex = function(url,id){
  client(url).indices.create({
    index: id});
}
module.exports.deleteIndex = function(url,id){
  client(url).indices.delete({
    index: id});
}
