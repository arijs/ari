!function(compMap) {
	compMap['bt-box'] = function(ctx) {
		console.log('Component My/Bt-Box Script running', this, arguments);
		return this.defaultContext(ctx);
	};
}(MyComp);
