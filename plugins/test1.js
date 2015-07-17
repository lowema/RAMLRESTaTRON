exports.plap = {
	route: '/plap',
	methods: {
		POST: function(req,rep) {
			console.log('PLAP P1 POST');
			rep('plap post');
		},
		GET: function(req,rep) {
			console.log('PLAP P1 GET');
			rep('plap get');
		}
	}
};
