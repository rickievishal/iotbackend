const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let storedData = {
    id: 0,
    temp: "25",
    oxy: "98",
    heart_rate: "72",
    humidity: "30"
};

// Broadcast data to all connected clients
const broadcastData = () => {
    const dataString = JSON.stringify(storedData);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(dataString);
        }
    });
};

app.get('/data/:temp/:humidity/:oxy/:heartrate', (req, res) => {
    const { temp, humidity, oxy, heartrate } = req.params;

    // Update the storedData object
    storedData = {
        id: storedData.id + 1, // Increment the ID
        temp: temp,
        humidity: humidity,
        oxy: oxy,
        heart_rate: heartrate
    };

    // Broadcast the updated data to all clients
    broadcastData();
    
    res.send("Data updated successfully!"); // Send confirmation
});

app.get('/data', (req, res) => {
    res.json(storedData); // Send the storedData object as JSON response
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket connection handler
wss.on("connection", ws => {
    console.log("New client connected");

    // Send the current data to the newly connected client
    ws.send(JSON.stringify(storedData));

    // Handle client disconnection
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
