/**
* Base By NdyZz [ github.com/NdyZz ]
* Created On 1/7/2024
* Contact Me on wa.me/6285346923840
*/

const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const { exec } = require('child_process');
//const path = require('path'); // Uncomment if needed for serving static files

const app = global.app = express();

// Function to keep the server alive
function keepAlive() {
  const url = `https://www.google.com`;
  const url2 = 'https://m.facebook.com';
  if (/(\/\/|\.)undefined\./.test(url)) return;
  setInterval(() => {
    fetch(url)
      .catch(console.log);
  }, 30 * 1000);
  if (/(\/\/|\.)undefined\./.test(url2)) return;
  setInterval(() => {
    fetch(url2)
      .catch(console.log);
  }, 30 * 1000);
}

// Function to format a date
function formatDate(n, locale = 'id') {
  const d = new Date(n);
  return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' });
}

// Main function to start the server
function connect(PORT) {
  // Define routes
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="10">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="https://kepo.xsvs.repl.co/file/VZZgayDPvuHM.ico" type="image/x-icon">
    <link rel="shortcut icon" href="https://kepo.xsvs.repl.co/file/VZZgayDPvuHM.ico" type="image/x-icon">
    <title>Liys</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        #clock-container {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
        }

        #clock {
            color: #ff9900; /* Ubah warna jam menjadi oranye */
            font-weight: bold;
        }

        #name {
            font-size: 24px;
            color: #ff9900;
        }

        .btn-custom {
            background-color: green;
            color: #fff;
            border: none;
        }
    </style>
</head>
<body>
    <div id="clock-container">
        <div id="clock-wib"></div>
        <div id="clock-wita"></div>
        <div id="clock-wit"></div>
        <br />
        <div id="name">NdyZz</div>
    </div>

    <div class="container text-center">
        <a href="https://webkunih.kesug.com" class="btn btn-custom btn-primary" target="_blank">Visit My Website</a>
    </div>

    <script>
        function updateClock() {
            const now = new Date();
            const options = { hour12: false };
            const timeStringWIB = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' });
            const timeStringWITA = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Makassar' });
            const timeStringWIT = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Jayapura' });

            document.getElementById('clock-wib').textContent = timeStringWIB + " (WIB)";
            document.getElementById('clock-wita').textContent = timeStringWITA + " (WITA)";
            document.getElementById('clock-wit').textContent = timeStringWIT + " (WIT)";
        }

        setInterval(updateClock, 1000);

        updateClock();
    </script>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
`);
  });
  
  app.get('/nowa', async (req, res) => {
    let q = req.query.number, regex = /x/g
		if (!q) return res.send('Input Parameter Number Parameter')
		if (!q.match(regex)) return res.send('Parameter Number Must Fill With One Letter "x"')
		let random = q.match(regex).length, total = Math.pow(10, random), array = []
		for (let i = 0; i < total; i++) {
			let list = [...i.toString().padStart(random, '0')]
			let result = q.replace(regex, () => list.shift()) + '@s.whatsapp.net'
			if (await ptz.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
				let info = await ptz.fetchStatus(result).catch(_ => {})
				array.push({ jid: result, exists: true, ...info })
			} else {
				array.push({ jid: result, exists: false })
			}
		}
		res.json({ result: array })
  });
  
  app.get('/speedtest', (req, res) => {
    exec('speedtest', (error, stdout, stderr) => {
          if (error) {
              res.status(500).send(`<p>Speedtest failed</p><p>Error: ${error.message}</p>`);
              return;
          }

          const htmlResponse = `
              <h2>Speedtest Results</h2>
              <pre>${stdout}</pre>
          `;

          res.status(200).send(htmlResponse);
      });
  });
  
  app.get('/ping', (req, res) => {
    res.status(200).send('Ping successful');
  });
  
  app.get('/ping2', async (req, res) => {
    const pingResults = [];

    for (let i = 0; i < 10; i++) {
      try {
        const response = await axios.get(`https://google.com`);
        pingResults.push(`Ping result ${i + 1}: ${response.data} ${response.status}<br />`);
      } catch (error) {
        pingResults.push(`Error pinging ${i + 1}: ${error}`);
      }
    }
    res.status(200).send(pingResults.join('\n\n\n'));
  });
  
	app.listen(PORT, () => {
		keepAlive();
		console.log('App listened on port', PORT)
	});
}

module.exports = connect;
