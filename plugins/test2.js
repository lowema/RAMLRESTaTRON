exports.plop = {
	route: '/plop',
	methods: {
		GET: function(req,rep) {
			console.log('PLOP P1 GET');
			rep('gotcha plop');
		}
	}
};

exports.gil = {
	route: '/gil',
	methods: {
		GET: function(req,rep) {
			console.log('NEW GET GIL');
			rep('gotcha gil');
		}
	}
};

