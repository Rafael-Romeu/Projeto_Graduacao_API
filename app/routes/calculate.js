var convert = require('xml-js');
var fetch = require('node-fetch');
var fs = require('fs');
const path = require('path');


module.exports = function (app) {
    app.post('/calculate', function (req, res) {

        (async() => {
            var xml = convert.xml2js(req.body.xml, {compact: false});

            await fetchFunction(xml);
            
            var response = convert.js2xml(xml, {compact: false, spaces: 4});
            response = response.toString();
            res.status(200).send({ xml: response, ref: save(response) });
        })();
    })
}

function save(data) {
    var p = __dirname + "/../views/newmaps/";
    console.log(p);
    var name = 'new.xml';
    fs.writeFile(p+name, data, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    return "./newmaps/" + name;
}

async function fetchFunction(xml) {

    await asyncForEach(xml.elements[0].elements, async element => {
        if (element.name == 'bounds'){

            let minlat = element.attributes.minlat;
            let minlon = element.attributes.minlon;

            let json = await fetchHelper(minlat, minlon);

            element.attributes.minlat = json[0].easting;
            element.attributes.minlon = json[0].northing;
            element.attributes.zone = json[0].zone;

            let maxlat = element.attributes.maxlat;
            let maxlon = element.attributes.maxlon;

            json = await fetchHelper(maxlat, maxlon);

            element.attributes.maxlat = json[0].easting;
            element.attributes.maxlon = json[0].northing;
            element.attributes.zone = json[0].zone;
        }
        else if (element.name == 'node'){
            
            let lat = element.attributes.lat;
            let lon = element.attributes.lon;

            let json = await fetchHelper(lat, lon);
            element.attributes.lat = json[0].easting;
            element.attributes.lon = json[0].northing;
        }
    }); 
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

async function fetchHelper(lat, lon){
    let response = await fetch(`https://www.latlong.net/dec2utm.php?lat=${lat}&long=${lon}`, {
        method: 'get',
        Headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
}