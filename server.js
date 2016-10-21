var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'public/images/' });

var app = express();

app.use(express.static('public'));

// support JSON-encoded bodies
app.use(bodyParser.json());

app.listen(7000, function() {
	console.log('Server listening on port 7000...');
});


// API ROUTES

// get frontpage text
app.get('/api/getFrontpageTxt', function(req, res) {
	fs.readFile('server/data/forsideTekst.txt', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		res.send(data);
	});

});

// Update frontpage text
app.post('/api/updateFrontPageTxt', function(req, res) {

	var newText = req.body.text;
	fs.writeFile('server/data/forsideTekst.txt', newText, function() {
		console.log('updated forsideTekst.txt successfully!');
	})
	
	res.end('{"success" : "Updated successfully", "status" : 200}');
})

// Get about us text
app.get('/api/getAboutUsTxt', function(req, res) {
	fs.readFile('server/data/omOsTekst.txt', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		res.send(data);
	});

})

// Update about us text 
app.post('/api/updateAboutUsTxt', function(req, res) {

	var newText = req.body.text;
	fs.writeFile('server/data/omOsTekst.txt', newText, function() {
		console.log('update about omOsTekst.txt successfully')
	})

	res.end('{"success" : "Updated successfully", "status" : 200}');	
});

// Get contact info
app.get('/api/getContactInfo', function(req, res) {
	fs.readFile('server/data/kontaktInfo.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		// format email,number
		var dataOpdelt = data.split(',');

		var contactInfo = {
			email : dataOpdelt[0],
			number : dataOpdelt[1]
		};

		res.send(contactInfo);
	})
})

// Update contact info
// format : email,number
app.post('/api/updateContactInfo', function(req, res) {

	var newContactInfo = req.body.email + "," + req.body.number;
	fs.writeFile('server/data/kontaktInfo.txt', newContactInfo, function() {
		console.log('updated kontaktInfo.txt successfully')
		res.end('{"success" : "Updated successfully", "status" : 200}');

	})
})



// Get prices
// format : 'width,length'
app.get('/api/getPrices', function(req, res) {
	fs.readFile('server/data/priser.txt', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		
		var dataOpdelt = data.split(',');

		var prices = {
			lengthPrice : parseInt(dataOpdelt[0]),
			widthPrice :  parseInt(dataOpdelt[1])
		};

		res.send(prices);
	})
})

// Update prices
app.post('/api/updatePrices', function(req, res) {

	var newPrices = req.body.widthPrice + "," + req.body.lengthPrice;
	fs.writeFile('server/data/priser.txt', newPrices, function() {
		console.log('updated priser.txt succesfully')
	})

});

// Get images names
app.get('/api/getImages', function(req, res) {
	var files = fs.readdirSync('public/images');
	
	res.send(files);
});

// Upload image.
app.post('/api/upload', upload.any(), function(req, res) {
	console.log('new image was uploaded: ');
	console.log(req.files);

	res.end('{"success" : "uploaded image Successfully", "status" : 200}');
});

// Delete image.

// Login Auth.
app.get('/api/', function(req, res) {
	// todo
});