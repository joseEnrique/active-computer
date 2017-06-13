FROM elasticsearch:latest
RUN bin/elasticsearch-plugin install x-pack --batch

COPY config/elasticsearch.yml /etc/elasticsearch/
ENV ES_JAVA_OPTS="-Des.path.conf=/etc/elasticsearch -Xms2g -Xmx2g"

CMD ["-E", "network.host=0.0.0.0", "-E", "discovery.zen.minimum_master_nodes=1"]
