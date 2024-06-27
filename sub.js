const { createCluster } = require("redis");

async function createRedisCluster() {
  const cluster = createCluster({
    rootNodes: [
      { url: "redis://localhost:7000" },
      { url: "redis://localhost:7001" },
      { url: "redis://localhost:7002" },
    ],
  });

  cluster.on("error", (err) => console.error("Redis Cluster Error:", err));
  await cluster.connect();
  return cluster;
}

async function subscribeToChannel(channel) {
  const cluster = await createRedisCluster();
  const subscriber = cluster.duplicate();

  await subscriber.connect();
  await subscriber.subscribe(channel, (message) => {
    console.log(`Received message: ${message}`);
  });
}

module.exports = { subscribeToChannel };
