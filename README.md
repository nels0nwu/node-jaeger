# Node-Jaeger
Project to test distributed tracing with Jaeger/OpenTelemetry

Spins up three node express apps. Hitting the first app sends request to second and third

To run:
```
docker-compose build

docker-compose up -d
```

You can hit the first app on http://localhost:5000/request

## Jaeger UI
Traces can be viewed on http://localhost:16686
