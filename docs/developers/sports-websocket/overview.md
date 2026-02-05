> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Real-time sports results via WebSocket

The Polymarket Sports WebSocket API provides real-time sports results updates. Clients connect to receive live match data including scores, periods, and game status as events happen.

**Endpoint:**

```
wss://sports-api.polymarket.com/ws
```

<Note>
  No authentication is required. This is a public broadcast channel that streams updates for all active sports events.
</Note>

## How It Works

Once connected, clients automatically receive JSON messages whenever a sports event updates. There is no subscription message required—simply connect and start receiving data.

***

## Connection Management

### Automatic Ping/Pong Heartbeat

The server sends PING messages at regular intervals. Clients **must** respond with PONG to maintain the connection.

| Parameter     | Default    | Description                                   |
| ------------- | ---------- | --------------------------------------------- |
| PING Interval | 5 seconds  | How often the server sends PING messages      |
| PONG Timeout  | 10 seconds | How long the server waits for a PONG response |

<Warning>
  If your client doesn't respond to PING within 10 seconds, the connection will be closed automatically.
</Warning>

### Connection Health

* Server sends `PING` → Client must respond with `PONG`
* No response within timeout → Connection terminated
* Clients should implement automatic reconnection with exponential backoff

***

## Session Affinity

The server uses cookie-based session affinity (`sports-results` cookie) to ensure clients maintain connection to the same backend instance. This is handled automatically by the browser.

***

## Next Steps

<CardGroup cols={2}>
  <Card title="Message Format" icon="brackets-curly" href="/developers/sports-websocket/message-format">
    Understand the structure of sports update messages
  </Card>

  <Card title="Quickstart" icon="code" href="/developers/sports-websocket/quickstart">
    Implementation examples in JavaScript and TypeScript
  </Card>
</CardGroup>
