$(function(){
    var Controller={
		init:function(){
			return app.Model.createStore('todosjquery');
		},
		generateId:function(){
			return +new Date();
		},
		getActiveTodoCount:function(todo){
            return !todo.completed;
		},
		all:function(){
            this.render();
		},
		active:function(){
            var data=this.todos.filter(Controller.getActiveTodoCount);
         	this.render(data); 
		},
		completed:function(){
           	var data=this.todos.filter(function(todo){
           		return todo.completed;
           	});
           	this.render(data);
		},
		clearCompleted:function(){
			this.todos=this.todos.filter(Controller.getActiveTodoCount);
			this.render();
		},
		toggleController:function(task_id){
			var i;
            for(i=0;i<this.todos.length;i++){
            	if(this.todos[i].id===task_id){
            		this.todos[i].completed=!this.todos[i].completed;
            		this.render();
            			break;
            	}
            }
		},
		destroyController:function(input){
			var todo=this.todos.filter(function(todo){
         		return (todo.id!==input);
         	});
         	this.todos=todo;
         	this.render();
         },
		getCompletedTodos:function(){
            var i;
            var complete_count=0;
			for(i=0;i<this.todos.length;i++){
				if(this.todos[i].completed){
					complete_count++;
				}
			}
			return complete_count;
		},
		taskRemaining:function(){
			var item=0;
			var i;
			var length=this.todos.length;
			for(i=0;i<length;i++){
				if(this.todos[i].completed===false){
					item++;
				}
			}
			return item;
		},
		updateTitle:function(title_id,title){
            var i;
            var length=this.todos.length;
            for(i=0;i<length;i++){
            	if(this.todos[i].id===title_id){
            		this.todos[i].title=title;
            	}
            }
            this.render();
		}

	};
	window.app=window.app||{};	
	window.app.Controller=Controller;
});