'use strict'

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const {W3CTraceContextPropagator} = require("@opentelemetry/core");
const {W3CBaggagePropagator} = require("@opentelemetry/core");
const {CompositePropagator} = require("@opentelemetry/core");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { JaegerPropagator } = require('@opentelemetry/propagator-jaeger');

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
//const traceExporter = new ConsoleSpanExporter();
const jaegerExporter = new JaegerExporter();
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'nelsons-service',
  }),
  spanProcessor: new SimpleSpanProcessor(jaegerExporter),
  instrumentations: [getNodeAutoInstrumentations()],
  textMapPropagator: new CompositePropagator({ propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator(), new JaegerPropagator()]})
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
