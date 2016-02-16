$(function(){
	var Model={
        createStore:function(database,data){
   			if (arguments.length > 1) {
				return localStorage.setItem(database, JSON.stringify(data));
			}else {
				var store = localStorage.getItem(database);
				return (store && JSON.parse(store)) || [];
			}
		}

    };
    window.app=window.app||{};
	window.app.Model=Model;

});