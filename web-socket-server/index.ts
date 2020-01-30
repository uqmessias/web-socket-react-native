import { listenAndServe } from 'https://deno.land/std/http/server.ts';
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts';

const handler = async (portArg: string) => {
  const port = Deno.args[1] || (typeof portArg === 'string' ? portArg : '80');

  const connections = [];

  const intervalId = setInterval(async () => {
    for await (const sock of connections) {
      await sock.send(new Date(Date.now()).toISOString());
    }
  }, 2);

  console.log(`WebSocket server is running on :${port}`);

  await listenAndServe(`:${port}`, async req => {
    const { headers, conn } = req;
    try {
      const sock = await acceptWebSocket({
        conn,
        headers,
        bufReader: req.r,
        bufWriter: req.w,
      });
      console.log('socket connected!');
      connections.push(sock);
      const it = sock.receive();
      while (true) {
        try {
          const { done, value } = await it.next();
          if (done) {
            break;
          }
          const ev = value;
          if (isWebSocketCloseEvent(ev)) {
            // close
            const { code, reason } = ev;
            const index = connections.indexOf(sock);
            connections.splice(index, 1);
            console.log('ws:Close', code, reason);
          }
        } catch (e) {
          console.error(`failed to receive frame: ${e}`);
          await sock.close(1000).catch(console.error);
        }
      }
    } catch (err) {
      console.error(`failed to accept WebSocket: ${err}`);
      clearInterval(intervalId);
    }
  });
};

handler('8080');
