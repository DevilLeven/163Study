(function(root) {
	var optionsCache = {};
	var _ = {
		callbacks: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			// 	var index=0,length,testting,memory,start,starts;
			var index=0,length,testting,memory;
			var fire = function(data){
				memory = options.memory && data;
				testting = true;
				length = list.length;
				for(;index < length;index++){
					if(list[index].apply(data[0], data[1]) === false && options.stopOnfalse){
						break;
					}
				}
			};
			var self = {
				add: function(){
					var args = Array.prototype.slice.call(arguments);
					args.forEach(function(fn){
						if(toString.call(fn) ==="[object Function]"){
							list.push(fn);
						}
					});
					memory && fire(memory);
				},
				fireWith: function(context, arguments){
					var args = [context, arguments];
					if(!options.once || !testting){
					  // index一直记录着队列执行的位置，只有当不是once的时候，才从头开始
					  index = 0;
					  fire(args);
					}
				},
				fire: function(){
					self.fireWith(this, arguments);
				}
			};
			return self;
		}
	};
	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}
	root._ = _;
})(this);
