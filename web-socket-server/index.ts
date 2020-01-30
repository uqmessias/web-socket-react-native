import { listenAndServe } from 'https://deno.land/std/http/server.ts';
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts';

import formatDate from './formatDate.js';

const handler = async (portArg: string) => {
  const port = Deno.args[1] || (typeof portArg === 'string' ? portArg : '80');

  const connections = [];
  const MS_IN_MIN = 1000 * 60;
  let lastMs = MS_IN_MIN * 0.1;

  async function timeSender() {
    const durationMs = MS_IN_MIN * Math.random() * 60 * 24 * 1.1;
    lastMs = durationMs;
    const durationDate = new Date(Date.now() + durationMs);
    console.log(`It will overdue ${formatDate(durationDate)} (${durationMs}ms) from now`);

    for await (const sock of connections) {
      await sock.send(durationDate.toISOString());
    }

    const msNext = MS_IN_MIN * Math.random();
    timeoutId = setTimeout(timeSender, msNext);
    console.log(`Next tick in ${formatDate(new Date(Date.now() + msNext))} (${msNext}ms)...`);
  }

  let timeoutId = setTimeout(timeSender, 0);

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

      const lastDate = new Date(Date.now() + lastMs);
      console.log('socket connected!');
      console.log(`Send next expiration "${formatDate(lastDate)}" (${lastMs}ms) to client...`);
      sock.send(lastDate.toISOString());

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
      clearTimeout(timeoutId);
    }
  });
};

handler('8080');
