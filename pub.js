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

async function publishMessage(channel, message) {
  const cluster = await createRedisCluster();
  await cluster.publish(channel, message);
  await cluster.quit();
}

module.exports = { publishMessage };
