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
		res.end('{"success" : updated kontaktInfo.txt successfully", "status" : 200}');

	})
})



// Get prices
// format : 'width price, length price'
app.get('/api/getPrices', function(req, res) {
	fs.readFile('server/data/priser.txt', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		
		var dataOpdelt = data.split('-');

		var prices = {
			lengthPrice : parseFloat(dataOpdelt[0]),
			kvmPrice :  parseFloat(dataOpdelt[1])
		};

		res.send(prices);
	})
})

// Update prices
app.post('/api/updatePrices', function(req, res) {

	var newPrices = req.body.KvmPrice + "-" + req.body.lengthPrice;
	fs.writeFile('server/data/priser.txt', newPrices, function() {
		console.log('updated priser.txt succesfully')
		res.send('{"success" : "updated priser.txt succesfully", "status" : 200}');	
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

	res.send('{"success" : "uploaded image Successfully", "status" : 200}');
});

// Delete image.
app.post('/api/deleteImage', function(req, res) {
	console.log(req.body)
	var imageSrc = req.body.src;
	fs.unlink('public/images/' + imageSrc, function() {
		
	res.send(true)
	});

})

// Login Auth.
app.post('/api/login', function(req, res) {
	
	var user = req.body;	
	
	fs.readFile('server/data/login.txt', 'utf8', function(err, data) {
		if(err) {
			return console.log(err)
		}

		var dataOpdelt = data.split(',');
		var username = dataOpdelt[0];
		var password = dataOpdelt[1];

		if(user.username == username && user.password == password) {
			res.send(true);
		} else {
			res.send(false);
		}
	});

});