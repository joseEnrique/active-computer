# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:8.17.2
#RUN bin/kibana-plugin install https://github.com/joseEnrique/kibana-plugin-line-sg/archive/1.00.0.zip
#RUN bin/kibana-plugin install x-pack
COPY config/kibana.yml /usr/share/kibana/config
# ADD plugins/line-sg plugins/line-sg
# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>
