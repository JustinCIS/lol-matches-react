var express = require('express');
var request = require('request');

var app = express();
var apiKey = "RGAPI-53ca1155-c6ee-406d-907b-6d426d87e5f6";

var ddragonURL = "https://ddragon.leagueoflegends.com";
var devAPIURL = "https://na1.api.riotgames.com/lol/summoner/v3";
var acsAPIURL = "https://acs.leagueoflegends.com/v1";

var headerOptions = { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36' };

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/summoner', function (req, res) {
    const summonerURL = devAPIURL + "/summoners/by-name/";
    const ign = req.query.ign;
    request({
        method: 'GET',
        uri: summonerURL + ign + "?api_key=" + apiKey
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

app.get('/api/matchhistory', function (req, res) {
    const matchHistoryURL = acsAPIURL + "/stats/player_history/NA1/";
    const id = req.query.id;
    request({
        headers: headerOptions,
        method: 'GET',
        uri: matchHistoryURL + id
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

app.get('/api/version', function (req, res) {
    const versionURL = ddragonURL + "/api/versions.json";
    request({
        headers: headerOptions,
        method: 'GET',
        uri: versionURL
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

app.get('/api/champions', function (req, res) {
    const version = req.query.version;
    const championsURL = ddragonURL + "/cdn/" + version + "/data/en_US/champion.json";
    request({
        headers: headerOptions,
        method: 'GET',
        uri: championsURL
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

app.get('/api/spells', function (req, res) {
    const version = req.query.version;
    const spellsURL = ddragonURL + "/cdn/" + version + "/data/en_US/summoner.json";
    request({
        headers: headerOptions,
        method: 'GET',
        uri: spellsURL
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

app.get('/api/reforged', function (req, res) {
    const version = req.query.version;
    const spellsURL = ddragonURL + "/cdn/" + version + "/data/en_US/runesReforged.json";
    request({
        headers: headerOptions,
        method: 'GET',
        uri: spellsURL
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});


app.listen(process.env.PORT || 8080);