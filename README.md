# Atlier Backend System

This project is an API infrastructure service for the Ratings and Reviews module of a retail e-commerce application.

## Technologies

Node | Express | MySQL | AWS EC2 | NGINX

## Overview

- [x] Designed database schema for characteristics, reviews, characteristic, and photos tables.
- [x] Created and utilized an ETL process to load data into a MySQL database.
- [x] Architected an API service using Node and Express, and locally stress-tested the service with K6.
- [x] Deployed server and database on AWS EC2 instances and stress-tested the service using Loader.io.
- [x] Horizontally scaled microservice to handle over 1000 requests per second by deploying two additional AWS EC2 instances and an NGINX load balancer instance.

## Testing

- [x] Local: Jest, K6
- [x] Deployed: Loader.io