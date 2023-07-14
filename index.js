import fetch from "node-fetch"
import express, { query } from 'express'
import fs from 'fs'

let file = 'log.txt'
fs.writeFileSync(file, '')

function funcD() {
    let d = new Date()
    return d.getHours() + ":" + d.getMinutes()
}

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')
app.get('/', (req, res) => {
    res.render("city");
})


app.get('/details', (req, res) => {
    fs.appendFileSync(file, funcD() + ": Fetching weather details for " + req.query.name + "\n")
    console.log(funcD() + ": Fetching weather details for " + req.query.name)

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&appid=none&units=metric`

    let settings = { method: "Get" };
    if (!url.includes('favicon.ico')) {
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                fs.appendFileSync(file, funcD() + ": Weather data fetched for " + req.query.name + "\n")
                console.log(funcD() + ": Weather data fetched for for " + req.query.name)

                res.render('details', { city: req.query.name.toUpperCase(), det: json })
                let detail = "Location: " + req.query.name + "-> Temperature: " + json.main.temp + ", Min-Temp: " + json.main.temp_min;
                detail += ", Max-Temp: " + json.main.temp_max + ", Feels like: " + json.main.feels_like;
                detail += ", Pressure: " + json.main.pressure + ", Humidity: " + json.main.humidity;

                fs.appendFileSync(file, funcD() + ": " + detail + "\n")
                console.log(funcD() + detail)


                let mail = req.query.mail
                let ph = req.query.ph

                fs.appendFileSync(file, funcD() + ": Email received: " + mail + "\n")
                console.log(funcD() + ": Email received: " + mail)
                fs.appendFileSync(file, funcD() + ": Phone received: " + ph + "\n")
                console.log(funcD() + ": Phone received: " + ph)

                const url2 = 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send';
                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '9bc57549a7mshc94b563d224d066p1068a7jsnbed876c1443c',
                        'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
                    },
                    body: '{"personalizations":[{"to":[{"email":"' + mail + '"}],"subject":"Weather Details!"}],"from":{"email":"weather@weather.com"},"content":[{"type":"text/plain","value":"' + detail + '"}]}'
                };

                fs.appendFileSync(file, funcD() + ": Sending Email...\n")
                console.log(funcD() + ": Sending Email...")

                fetch(url2, options)
                    .then(res => res.json())
                    .then(json => console.log(json))
                    .catch(err => console.error('error:' + err));

                fs.appendFileSync(file, funcD() + ": Email sent...\n")
                console.log(funcD() + ": Email sent...")

                fs.appendFileSync(file, funcD() + ": Sending SMS...\n")
                console.log(funcD() + ": Sending SMS...")

                const encodedParams = new URLSearchParams();
                encodedParams.append("to", ph);
                encodedParams.append("p", "0aQEPRXoCe0i7gDtdedo4PvPUplbHhq4bH8GSMXcpAhuvkrbopJgPD6dAXL9fcm3");
                encodedParams.append("text", detail);

                const url3 = 'https://sms77io.p.rapidapi.com/sms';

                const options2 = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'X-RapidAPI-Key': '9bc57549a7mshc94b563d224d066p1068a7jsnbed876c1443c',
                        'X-RapidAPI-Host': 'sms77io.p.rapidapi.com'
                    },
                    body: encodedParams
                };

                fetch(url3, options2)
                    .then(res => res.json())
                    .then(json => console.log(json))
                    .catch(err => console.error('errormsg:' + err));

                fs.appendFileSync(file, funcD() + ": SMS sent...\n")
                console.log(funcD() + ": SMS sent...")

            });
    }
})


app.listen('8888', () => {
    console.log(funcD() + ': Listening to Port 8888...\n')
    fs.appendFileSync(file, funcD() + ': Listening to Port 8888...\n')
})

