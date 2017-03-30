#!/bin/bash
vagrant up
gov test --readFromFile --path ./test10-elasticsearch.yaml
gov test --readFromFile --path ./test50-elasticsearch.yaml
gov test --readFromFile --path ./test100-elasticsearch.yaml
gov test --readFromFile --path ./test500-elasticsearch.yaml
gov test --readFromFile --path ./test1000-elasticsearch.yaml
gov test --readFromFile --path ./test5000-elasticsearch.yaml
gov test --readFromFile --path ./test15000-elasticsearch.yaml
vagrant destroy
