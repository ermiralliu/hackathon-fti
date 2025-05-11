// eslint-disable-next-line no-empty-file
// // src/routes/api/socket/+server.js
// import { WebSocketServer } from 'ws';
// import { json, type RequestHandler } from '@sveltejs/kit';

// // Keep track of connected clients
// const clients = new Set();
// const rooms = new Map();

// // Create a WebSocket Server instance
// const wss = new WebSocketServer({ noServer: true });

// wss.on('connection', ws => {
//   console.log('Client connected');
//   clients.add(ws);

//   // Send a welcome message to the new client
//   ws.send(JSON.stringify({ type: 'message', data: 'Welcome to the WebSocket server!' }));

//   // Handle messages received from the client
//   ws.on('message', message => {
//     try {
//       const parsedMessage = JSON.parse(message.toString());
//       console.log('Received message:', parsedMessage);

//       // Broadcast the received message to all connected clients (including the sender)
//       clients.forEach(client => {
//         if (client.readyState === 1) { // Check if the client is open
//           client.send(JSON.stringify({ type: 'message', data: parsedMessage.data, sender: 'server' }));
//         }
//       });
//     } catch (error) {
//       console.error('Failed to parse or process message:', error);
//       ws.send(JSON.stringify({ type: 'error', data: 'Invalid message format' }));
//     }
//   });

//   // Handle client disconnection
//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clients.delete(ws);
//   });

//   // Handle errors
//   ws.on('error', error => {
//     console.error('WebSocket error:', error);
//     clients.delete(ws);
//   });
// });

// export const GET: RequestHandler = ({ request, server }) => {
//   if (server) {
//     // Handle the WebSocket upgrade request
//     server.handleUpgrade(request, request.socket, Buffer.alloc(0), ws => {
//       wss.emit('connection', ws, request);
//     });
//     return new Response(null, { status: 101, headers: { 'Sec-WebSocket-Accept': request.headers['sec-websocket-key'] } });
//   } else {
//     return json({ error: 'This route can only be accessed by a WebSocket client.' }, { status: 400 });
//   }
// };