> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Connect to the Sports WebSocket and receive live updates

Connect to the Sports WebSocket to receive real-time sports results. No authentication required—just connect and handle incoming messages.

## Endpoint

```
wss://sports-api.polymarket.com/ws
```

***

## JavaScript Example

<CodeGroup>
  ```javascript JavaScript theme={null}
  const ws = new WebSocket('wss://sports-api.polymarket.com/ws');

  ws.onopen = () => {
    console.log('Connected to Sports WebSocket');
  };

  ws.onmessage = (event) => {
    // Respond to server PING
    if (event.data === 'ping') {
      ws.send('pong');
      return;
    }

    // Parse and handle sports updates
    const data = JSON.parse(event.data);
    console.log('Update:', data.slug, data.score, data.period);
  };

  ws.onclose = () => {
    console.log('Disconnected');
    // Reconnect after 1 second
    setTimeout(() => location.reload(), 1000);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  ```

  ```typescript React Hook theme={null}
  import { useEffect, useRef, useState } from 'react';

  interface SportsUpdate {
    slug: string;
    live: boolean;
    ended: boolean;
    score: string;
    period: string;
    elapsed: string;
    last_update: string;
    finished_timestamp?: string;
    turn?: string;
  }

  export function useSportsWebSocket() {
    const [updates, setUpdates] = useState<Map<string, SportsUpdate>>(new Map());
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
      const ws = new WebSocket('wss://sports-api.polymarket.com/ws');
      wsRef.current = ws;

      ws.onmessage = (event) => {
        if (event.data === 'ping') {
          ws.send('pong');
          return;
        }
        const data: SportsUpdate = JSON.parse(event.data);
        setUpdates(prev => new Map(prev).set(data.slug, data));
      };

      ws.onclose = () => setTimeout(() => location.reload(), 1000);

      return () => ws.close();
    }, []);

    return Array.from(updates.values());
  }
  ```
</CodeGroup>

***

## Critical: PING/PONG Handling

The server sends PING messages every 5 seconds. Your client **must** respond with PONG to stay connected.

```javascript  theme={null}
// CORRECT - Handle PING messages
ws.onmessage = (event) => {
  if (event.data === 'ping') {
    ws.send('pong');  // Respond immediately
    return;
  }
  // Handle other messages...
  const data = JSON.parse(event.data);
  handleUpdate(data);
};
```

```javascript  theme={null}
// WRONG - Ignoring PING messages will disconnect you
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);  // Fails on "ping" string!
  handleUpdate(data);
};
```

<Warning>
  If you don't respond to PING within 10 seconds, your connection will be terminated.
</Warning>

***

## Connection State Management

Always check connection state before sending:

```javascript  theme={null}
if (ws.readyState === WebSocket.OPEN) {
  ws.send('pong');
} else {
  console.warn('WebSocket not connected');
}
```

***

## Browser Tab Visibility

Connections may drop when browser tabs become inactive. Handle visibility changes:

```javascript  theme={null}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && ws.readyState !== WebSocket.OPEN) {
    console.log('Tab became visible, reconnecting...');
    connect();
  }
});
```

***

## Troubleshooting

<AccordionGroup>
  <Accordion title="Connection drops after exactly 10 seconds">
    Your PING/PONG handler isn't working correctly.

    **Check:**

    * You're responding to `"ping"` string messages (not JSON)
    * You're sending `"pong"` as a string response
    * No errors are preventing the PONG from being sent

    ```javascript  theme={null}
    // Debug PING/PONG handling
    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      if (event.data === 'ping') {
        console.log('Sending PONG response');
        ws.send('pong');
        return;
      }
      // Handle JSON messages...
    };
    ```
  </Accordion>

  <Accordion title="Connection keeps dropping frequently">
    This may be network instability or main thread blocking.

    **Solutions:**

    * Implement exponential backoff for reconnection
    * Ensure your message handler doesn't block the main thread
    * Check network stability

    ```javascript  theme={null}
    handleReconnect() {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
    ```
  </Accordion>

  <Accordion title="Messages not updating UI">
    Ensure you're updating state correctly based on the `slug` identifier.

    ```javascript  theme={null}
    // Use slug as unique key
    setSportsData(prev => {
      const index = prev.findIndex(item => item.slug === data.slug);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = data;
        return updated;
      }
      return [...prev, data];
    });
    ```
  </Accordion>

  <Accordion title="Memory leaks with multiple connections">
    Clean up properly when disconnecting:

    ```javascript  theme={null}
    const cleanup = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close();
        ws = null;
      }
    };

    // React: cleanup in useEffect return
    // Vanilla: call on page unload
    window.addEventListener('beforeunload', cleanup);
    ```
  </Accordion>
</AccordionGroup>

***

## Debugging Tips

Enable verbose logging to diagnose connection issues:

```javascript  theme={null}
ws.onopen = () => console.log('[connected]');
ws.onclose = (e) => console.log('[closed]', e.code, e.reason);
ws.onerror = (e) => console.error('[error]', e);
ws.onmessage = (e) => console.log('[message]', e.data);
```

Monitor connection state:

```javascript  theme={null}
setInterval(() => {
  const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  console.log('WebSocket state:', states[ws.readyState]);
}, 5000);
```
