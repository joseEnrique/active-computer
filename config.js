var config = {};
config.elasticsearch = {};
config.registry = {};

config.elasticsearch.host = process.env.ELASTICSEATCH_HOST || "localhost";
config.elasticsearch.port = parseInt(process.env.ELASTICSEATCH_PORT || 9200);
config.registry.host = process.env.REGISTRY_HOST || "localhost";
config.registry.port = parseInt(process.env.REGISTRY_PORT || 3000);
config.registry.metrics = process.env.REGISTRY_METRICS || "/metrics/";
config.registry.states = process.env.REGISTRY_STATES || "/states/";
config.port = parseInt(process.env.PORT || 4000);
config.host = process.env.HOST || "localhost";


module.exports = config;
