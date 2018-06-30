module.exports = function TokenBroker(){
  const { ServiceBroker } = require('moleculer');
  let ApiService = require("moleculer-web");

  const broker = new ServiceBroker({
    logger: console,
    transporter: "nats://localhost:4222"
  });

  broker.loadService('./src/token.service');
  broker.createService(ApiService);

  broker.start();
};