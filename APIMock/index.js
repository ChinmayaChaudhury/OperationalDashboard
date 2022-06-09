/*eslint no-console: 0*/
"use strict";

const fs = require("fs");
const express = require('express');
const websocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;
app.locals.step = 1;

// Custom middleware
const getJSON = path => {
	// Return a middleware callback
	return (req, res, next) => {
		// Read file specific to that app & step in the story
		fs.readFile(`data/step-0${app.locals.step}/${path}`, 'utf8', (error, content) => {
			console.log(`GET ${req.route.path}: loading payload from /data/step-0${app.locals.step}/${path}`);

			if (error) {
				res.status(404).send('No API exists for the current step');
			} else {
				// Return back JSON content
				res.type('json').send(JSON.parse(content));

				// Call next middleware
				next();
			}
		});
	};
}

// Order-Specific
app.get('/api/order-list', (req, res) => {
	// Grab parameters
	const parameters = {
		order: req.query.order
	};

	// Read file specific to that app & step in the story
	let path = '';
	
	if(req.query.order){
		path = `order/header/${req.query.order}.json`;
	}else{
		path = `order/list.json`;
	}

	fs.readFile(`data/step-0${app.locals.step}/${path}`, 'utf8', (error, content) => {
		console.log(`GET ${req.route.path}: loading payload from /data/step-0${app.locals.step}/${path}`);

		if (error) {
			res.status(404).send('No API exists for the current step');
		} else {
			// Return back JSON content
			res.type('json').send(JSON.parse(content));
		}
	});
});
app.get('/api/order-details', (req, res) => {
	// Grab parameters
	const parameters = {
		order: req.query.order
	};

	// Read file specific to that app & step in the story
	const path = `order/details/${req.query.order}.json`;

	fs.readFile(`data/step-0${app.locals.step}/${path}`, 'utf8', (error, content) => {
		console.log(`GET ${req.route.path}: loading payload from /data/step-0${app.locals.step}/${path}`);

		if (error) {
			res.status(404).send('No API exists for the current step');
		} else {
			// Return back JSON content
			res.type('json').send(JSON.parse(content));
		}
	});
});

// Common-API (PAX & Baggage)
app.get(['/api/pax/header', '/api/baggage/header'], getJSON('header.json'));

// PAX-Specific
app.get('/api/pax/journey', getJSON('pax/journey.json'));
app.get('/api/pax/flights', getJSON('pax/flights.json'));
app.get('/api/pax/details', (req, res) => {
	// Grab parameters
	const parameters = {
		connecting: req.query.connecting,
		date: req.query.date,
		time: req.query.time
	};

	// Read file specific to that app & step in the story
	const path = `pax/details/${req.query.connecting? req.query.connecting : 'Airport' }.json`;

	fs.readFile(`data/step-0${app.locals.step}/${path}`, 'utf8', (error, content) => {
		console.log(`GET ${req.route.path}: loading payload from /data/step-0${app.locals.step}/${path}`);

		if (error) {
			res.status(404).send('No API exists for the current step');
		} else {
			// Return back JSON content
			res.type('json').send(JSON.parse(content));
		}
	});
});


// HUB View
app.get('/api/hub/list', getJSON('hub/list.json'));

//TA
app.get('/api/ta/list', getJSON('ta/get_flight_ta.json'));

//PTS
app.get('/api/pts/details', getJSON('pts/read_pts_output.json'));


// Baggage-Specific
app.get('/api/baggage/journey', getJSON('baggage/journey.json'));
app.get('/api/baggage/uld', getJSON('baggage/uld.json'));
app.get('/api/baggage/details', (req, res) => {
	// Grab parameters
	const parameters = {
		connecting: req.query.connecting,
		date: req.query.date,
		time: req.query.time
	};

	// Read file specific to that app & step in the story
	const path = `baggage/details/${req.query.connecting? req.query.connecting : 'Joining' }.json`;

	fs.readFile(`data/step-0${app.locals.step}/${path}`, 'utf8', (error, content) => {
		console.log(`GET ${req.route.path}: loading payload from /data/step-0${app.locals.step}/${path}`);

		if (error) {
			res.status(404).send('No API exists for the current step');
		} else {
			// Return back JSON content
			res.type('json').send(JSON.parse(content));
		}
	});
});

// Start app
const httpServer = app.listen(port);

// Run websocket
const notifier = new websocket.Server({
	server: httpServer,
	path: '/websocket/notifier'
});

notifier.broadcast = message => {
	notifier.clients.forEach(client => {
		client.send(message)
	});
};

const map = new websocket.Server({
	server: httpServer,
	path: '/websocket/map'
});

map.streamCoordinates = () => {
	// Locations
	const locations = [
		["U", "3", "CBU2", "25.247101450791725", "55.36408028187658"],
		["U", "1", "CBU2", "25.247270975405115", "55.36319882173663"],
		["U", "2", "CBU2", "25.249729348461212", "55.3594237132999"],
		["U", "5", "CBU2", "25.247170596055486", "55.3642149155749"],
		["U", "4", "CBU2", "25.2466962596161", "55.36448011605522"],
		["U", "3", "CBU2", "25.2471196293279", "55.36403425131396"],
		["U", "1", "CBU2", "25.24730395314016", "55.36314727214312"],
		["U", "2", "CBU2", "25.24970492789081", "55.359430158457336"],
		["U", "3", "CBU2", "25.24716081265646", "55.363933413357664"],
		["U", "1", "CBU2", "25.247339904370737", "55.36308102591443"],
		["U", "2", "CBU2", "25.24968609367337", "55.359439216931364"],
		["U", "3", "CBU2", "25.247194778525216", "55.36387082571732"],
		["U", "1", "CBU2", "25.247365222698345", "55.36303437257619"],
		["U", "2", "CBU2", "25.249643309312923", "55.35947248819101"],
		["U", "3", "CBU2", "25.24721773567678", "55.36382230979146"],
		["U", "1", "CBU2", "25.247384808228528", "55.36300751450476"],
		["U", "2", "CBU2", "25.249615388968106", "55.35950884413139"],
		["U", "3", "CBU2", "25.247243649729786", "55.36376835489068"],
		["U", "1", "CBU2", "25.247410148350657", "55.362960821009686"],
		["U", "2", "CBU2", "25.249588733856946", "55.35954291652613"],
		["U", "3", "CBU2", "25.247269583511923", "55.363720567676964"],
		["U", "1", "CBU2", "25.247434061774374", "55.362916756465324"],
		["U", "2", "CBU2", "25.249565890698307", "55.35960005372206"],
		["U", "3", "CBU2", "25.247302841279236", "55.36368415866572"],
		["U", "1", "CBU2", "25.247470221583676", "55.362859371630826"],
		["U", "2", "CBU2", "25.24952990081269", "55.359651327141414"],
		["U", "3", "CBU2", "25.247333074872387", "55.36360790497739"],
		["U", "1", "CBU2", "25.24749629929116", "55.36279940550672"],
		["U", "2", "CBU2", "25.24951994048724", "55.35968472536145"],
		["U", "3", "CBU2", "25.247366948908756", "55.36354548654696"],
		["U", "1", "CBU2", "25.247513769671986", "55.362748792514964"],
		["U", "2", "CBU2", "25.24950758386238", "55.35972258707914"],
		["U", "3", "CBU2", "25.247413692391063", "55.3634904704758"],
		["U", "1", "CBU2", "25.247537700536615", "55.362704695849125"],
		["U", "2", "CBU2", "25.249475168806406", "55.359767225345536"],
		["U", "3", "CBU2", "25.247461350544345", "55.363421438470716"],
		["U", "1", "CBU2", "25.24754918084932", "55.36266517679282"],
		["U", "2", "CBU2", "25.249452776731975", "55.35980848682784"],
		["U", "3", "CBU2", "25.247499284876973", "55.363347665564525"],
		["U", "1", "CBU2", "25.247568698218828", "55.362638388025026"],
		["U", "2", "CBU2", "25.24942249443151", "55.35985675926566"],
		["U", "3", "CBU2", "25.247538165109457", "55.363247314702285"],
		["U", "1", "CBU2", "25.24759714843523", "55.36259515298763"],
		["U", "2", "CBU2", "25.24940600810407", "55.3598871383317"],
		["U", "3", "CBU2", "25.247618285487505", "55.36312455370669"],
		["U", "1", "CBU2", "25.24763067502369", "55.36255179542709"],
		["U", "2", "CBU2", "25.249376955137564", "55.3599557421432"],
		["U", "3", "CBU2", "25.247659761435926", "55.363073155989156"],
		["U", "1", "CBU2", "25.247663219349754", "55.362482609531554"],
		["U", "2", "CBU2", "25.249370648807123", "55.35999764374966"],
		["U", "3", "CBU2", "25.247707656538154", "55.363029077716796"],
		["U", "1", "CBU2", "25.24769950302411", "55.362367304372384"],
		["U", "2", "CBU2", "25.249348167442953", "55.3600390697654"],
		["U", "3", "CBU2", "25.24772943414612", "55.362982608477296"],
		["U", "1", "CBU2", "25.247747981260527", "55.3622962558338"],
		["U", "2", "CBU2", "25.249326125752702", "55.36007209724197"],
		["U", "3", "CBU2", "25.24773304943912", "55.362925577264264"],
		["U", "1", "CBU2", "25.24779167702166", "55.362240639423135"],
		["U", "2", "CBU2", "25.24931131365538", "55.36008922518323"],
		["U", "3", "CBU2", "25.247778686277584", "55.36283523171687"],
		["U", "1", "CBU2", "25.247851968953146", "55.362083804360424"],
		["U", "2", "CBU2", "25.249296435052106", "55.360109089532465"],
		["U", "3", "CBU2", "25.24779729166906", "55.36278224953681"],
		["U", "1", "CBU2", "25.247914680280836", "55.36202317445216"],
		["U", "2", "CBU2", "25.249259000807466", "55.360155484255934"],
		["U", "3", "CBU2", "25.24782574829798", "55.36274851229022"],
		["U", "1", "CBU2", "25.247998721067862", "55.36189596752532"],
		["U", "2", "CBU2", "25.249221347659148", "55.3602248670556"],
		["U", "3", "CBU2", "25.247859836154046", "55.36269821408122"],
		["U", "1", "CBU2", "25.248100350654177", "55.361745765979755"],
		["U", "2", "CBU2", "25.24914133498857", "55.360387349518895"],
		["U", "3", "CBU2", "25.247871364843224", "55.36265631139172"],
		["U", "1", "CBU2", "25.248209546670925", "55.36182026512513"],
		["U", "2", "CBU2", "25.249114185931823", "55.36045246900117"],
		["U", "3", "CBU2", "25.24791531764302", "55.362575321212816"],
		["U", "1", "CBU2", "25.24828695014102", "55.36186518952015"],
		["U", "2", "CBU2", "25.24909926417936", "55.36051790699934"],
		["U", "3", "CBU2", "25.24796691198579", "55.362486483146135"],
		["U", "1", "CBU2", "25.24830654986748", "55.36183910251616"],
		["U", "2", "CBU2", "25.24917341132385", "55.360583564650476"],
		["U", "3", "CBU2", "25.247995414241675", "55.362409089269896"],
		["U", "1", "CBU2", "25.248325478448834", "55.36182432911782"],
		["U", "2", "CBU2", "25.249232849784352", "55.36061918489309"],
		["U", "3", "CBU2", "25.24803363245647", "55.36235108367352"],
		["U", "1", "CBU2", "25.248345823823126", "55.36178683932861"],
		["U", "2", "CBU2", "25.24926385706641", "55.36063625594011"],
		["U", "3", "CBU2", "25.24808994260547", "55.36225977922935"],
		["U", "1", "CBU2", "25.2483742699177", "55.36175459270231"],
		["U", "2", "CBU2", "25.24927589367923", "55.36068098022396"],
		["U", "3", "CBU2", "25.248143202163405", "55.36218039660739"],
		["U", "1", "CBU2", "25.24842009085655", "55.361690394695415"],
		["U", "2", "CBU2", "25.24928608920999", "55.360721475758446"],
		["U", "3", "CBU2", "25.248192652973827", "55.3620518488821"],
		["U", "1", "CBU2", "25.248461479726256", "55.36160400320217"],
		["U", "2", "CBU2", "25.249254887369023", "55.360796037734644"],
		["U", "3", "CBU2", "25.248236206572827", "55.36198403118998"],
		["U", "1", "CBU2", "25.248500656641493", "55.361562238461616"],
		["U", "2", "CBU2", "25.249145045405836", "55.36098990095077"],
		["U", "3", "CBU2", "25.248272258993193", "55.361955141552905"],
		["U", "1", "CBU2", "25.248544259448916", "55.36152268889785"],
		["U", "2", "CBU2", "25.249029654451675", "55.36120252985143"],
		["U", "3", "CBU2", "25.248307770520352", "55.36192126013886"],
		["U", "1", "CBU2", "25.248581811205682", "55.36149455326995"],
		["U", "2", "CBU2", "25.24898753350421", "55.36124612668055"],
		["U", "3", "CBU2", "25.248322006507227", "55.36188869745642"],
		["U", "1", "CBU2", "25.248631768664204", "55.361495860925"],
		["U", "2", "CBU2", "25.248957632123616", "55.36125902315252"],
		["U", "3", "CBU2", "25.248335183476293", "55.36185809606404"],
		["U", "1", "CBU2", "25.24868244111362", "55.36149722980923"],
		["U", "2", "CBU2", "25.24892643673128", "55.36129135451401"],
		["U", "3", "CBU2", "25.248351860503398", "55.36178964774073"],
		["U", "1", "CBU2", "25.248735130396298", "55.361507063643636"],
		["U", "2", "CBU2", "25.248885489238244", "55.36134178188145"],
		["U", "3", "CBU2", "25.248364915705352", "55.361744970898656"],
		["U", "1", "CBU2", "25.248775959670493", "55.361529583052196"],
		["U", "2", "CBU2", "25.248844117365323", "55.36143468707081"],
		["U", "3", "CBU2", "25.2483998231164", "55.361686871575856"],
		["U", "1", "CBU2", "25.248792354863447", "55.36155431634985"],
		["U", "2", "CBU2", "25.248803745341267", "55.36149240993759"],
		["U", "3", "CBU2", "25.24847078877822", "55.36159993983856"],
		["U", "1", "CBU2", "25.248810533102986", "55.36157622583931"],
		["U", "2", "CBU2", "25.24879266533377", "55.36154622264348"],
		["U", "3", "CBU2", "25.248560118042093", "55.36151802228545"],
		["U", "1", "CBU2", "25.248822544766224", "55.36159875348284"],
		["U", "2", "CBU2", "25.24880975259612", "55.36159921295458"],
		["U", "3", "CBU2", "25.248635517692676", "55.361496405173945"],
		["U", "1", "CBU2", "25.24882635575219", "55.36163669455985"],
		["U", "2", "CBU2", "25.24882550610665", "55.36164744278649"],
		["U", "3", "CBU2", "25.24870826722781", "55.36149672128593"],
		["U", "3", "CBU2", "25.248783669015044", "55.361503637891694"],
		["U", "3", "CBU2", "25.24881121880751", "55.36153130818325"],
		["U", "3", "CBU2", "25.248834032599415", "55.36154722170566"],
		["U", "3", "CBU2", "25.248828431939724", "55.3615794744303"],
		["U", "3", "CBU2", "25.248839872663858", "55.361624858891226"]
	];

	// Stream coordinates to all clients every 4 seconds
	let index = 0;
	let delay = 4000;

	const timer = setInterval(() => {
		let message = {
			"event": "data",
			"stream": "Positions",
			"data": [locations[index]]
		};

		// Stream locations until no point is left in the array
		if (index < locations.length) {
			// Stream coordinates
			map.clients.forEach(client => {
				client.send(JSON.stringify(message));
			});

			index++;
		} else {
			clearInterval(timer);
		}
	}, delay);
}

const stepper = new websocket.Server({
	server: httpServer,
	path: '/websocket/stepper'
});

stepper.on("connection", ws => {
	// Sending to the connecting client the current step
	ws.send(JSON.stringify({
		"step": app.locals.step
	}));

	ws.on("message", message => {
		// Update current step & and send it back to remote client
		app.locals.step = +parseInt((JSON.parse(message)).step);

		ws.send(JSON.stringify({
			"step": app.locals.step
		}));

		console.log(`Updated the current step to: ${app.locals.step}`);

		// Notify all subscribers
		notifier.broadcast(JSON.stringify({
			"step": app.locals.step
		}));

		if (app.locals.step == 5) {
			map.streamCoordinates();
		}
	});
});