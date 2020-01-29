# web-socket-react-native
POC project using WebSocket server based on deno and the client based on React Native

## Running WebSocket on [Deno](https://deno.land)

First of all, follow the instal instructions at [Deno Land](https://deno.lan).

After you have installed it, you need to start the `WebSocket` and you can do that by running the following:

```bash
# If everthing went sucessfuly, you must see the message:
# "WebSocket server is running on :8008"
# it means the server is running on "ws://localhost:8080"
deno --allow-net ./web-socket-server/index.ts
```
