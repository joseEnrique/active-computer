#!/bin/bash
curl -X GET localhost:4000/api/v1/restart
gov test --readFromFile --path ./randomize.yml
