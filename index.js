const http   = require('http');
const config = require('./config.json');



config.idToDelete.forEach(id => {
	var getRequestOptions = {
		hostname: config.hostname,
		path: "/" + id,
		method: "GET",
		port: config.port
	}

	/* First request to get the object associated to the id, used to extract the rev number */
	var getReq = http.request(getRequestOptions, function (getRes) {
		var getResponseRaw = "";
		var getResponse; 

		getRes.on('data', function (chunk) {
			getResponseRaw += chunk;
		})

		getRes.on('end', function () {
			getResponse = JSON.parse(getResponseRaw)
			console.log(getResponse);

			if (typeof getResponse._rev !== 'undefined'){

				var rev = getResponse._rev;

				/* Once the rev number is here, we send a DELETE request to the server */
				var deleteRequestOptions = {
					hostname: config.hostname,
					path: "/" + id + "?rev=" + rev,
					method: "DELETE",
					port: config.port
				}

				var deleteReq = http.request(deleteRequestOptions, function (deleteRes) {
					var deleteResponseRaw = "";
					var deleteResponse;

					deleteRes.on('data', function (chunk) {
						deleteResponseRaw += chunk;
					})

					deleteRes.on('end', function () {
						deleteResponse = JSON.parse(deleteResponseRaw);
						console.log(deleteResponse);
					})

				}).end()

			}

		})

	}).end();
});



