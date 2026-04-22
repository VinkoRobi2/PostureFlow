const net = require("node:net");

const [host, portArg, timeoutArg] = process.argv.slice(2);

if (!host || !portArg) {
  console.error("Usage: node scripts/wait-for-tcp.js <host> <port> [timeoutMs]");
  process.exit(1);
}

const port = Number(portArg);
const timeoutMs = Number(timeoutArg || 60000);
const startedAt = Date.now();

function tryConnect() {
  const socket = net.createConnection({ host, port });

  socket.setTimeout(3000);

  socket.on("connect", () => {
    socket.end();
    console.log(`TCP ready at ${host}:${port}`);
    process.exit(0);
  });

  socket.on("timeout", () => {
    socket.destroy();
  });

  socket.on("error", () => {
    socket.destroy();

    if (Date.now() - startedAt >= timeoutMs) {
      console.error(`Timed out waiting for ${host}:${port}`);
      process.exit(1);
    }

    setTimeout(tryConnect, 1500);
  });
}

tryConnect();
