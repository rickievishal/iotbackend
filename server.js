const express = require("express")
const os = require('os');
const { send } = require("process");

const app = express();
const port = 3000;

//prints ip of the machine
const networkInterfaces = os.networkInterfaces();


Object.keys(networkInterfaces).forEach((interfaceName) => {
    const networkInterface = networkInterfaces[interfaceName];
    networkInterface.forEach((address) => {

        if (address.family === 'IPv4' && !address.internal) {
            console.log(`Server running at: http://${address.address}:${port}`);
        }
    });
});
let id = 1;
let data = [{
    id: 0,
    temp: "25",
    oxy: "98",
    heart_rate: "72",
    humidity: "30"
}]

app.get('/data/:temp/:humidity/:oxy/:heartrate', (req, res) => {
    const { temp, oxy, humidity, heartrate } = req.params
    data.push({
        id: id, temperature: temp,
        oxygen: oxy,
        heart_rate: heartrate,
        humidity: humidity
    })
    res.send(data)
    id += 1;
})
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});