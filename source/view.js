$(function(){
	var View={
		template:function(){
			return '<li data-id="{{id}}" class="{{completed}}">'
					+'<div class="view">'
					+'<input class="toggle" type="checkbox" {{checked}}>'
					+'<label>{{title}}</label>'
					+'<button class="destroy">X</button>'
					+'</div>'
					+'</li>';
		},
		bindEvents:function(){
			var foot=
			$('#new-todo').on('keyup',this.create.bind(this));
			$('#todolist')
				.on('change', '.toggle', this.toggleView.bind(this))
				.on('click', '.destroy', this.destroyView.bind(this))
				.on('dblclick','label',this.editLabel.bind(this))
				.on('blur','.edit',this.editLabelDone.bind(this))
				.on('keyup','.edit',this.editFilter.bind(this));
			$('#footer').on('click','.clear-completed',app.Controller.clearCompleted.bind(this))
				.on('click','.all-button',app.Controller.all.bind(this))	
				.on('click','.active-button',app.Controller.active.bind(this))
				.on('click','.completed-button',app.Controller.completed.bind(this));
		},
		init:function(){
			this.todos=app.Controller.init();
			this.bindEvents();
            this.render();
		},
		createTodoTemplate:function(data){
			var i;
			var viewlabel='';
        	for(i=0;i<data.length;i++){
         		var temp=this.template();
         		var completed='';
         		var checked='';
         		if(data[i].completed){
         			completed='completed';
         			checked='checked';
         		}
         		temp=temp.replace('{{id}}',data[i].id);
         		temp=temp.replace('{{completed}}',completed);
         		temp=temp.replace('{{checked}}',checked);
            	temp=temp.replace('{{title}}',this._escape(data[i].title));
            	viewlabel=viewlabel+temp;
         	}
         	return viewlabel;
		},
		render:function(data){
			var todo;
			if(arguments.length>0){
			 	todo=data;
			}else{
				todo=this.todos;
			}
           	var temp=this.createTodoTemplate(todo);
			$("#todolist").html(temp);
			$('strong').html(app.Controller.taskRemaining.call(this));
			$("#main").toggle(todo.length>0);
			var completed_todos_count=app.Controller.getCompletedTodos.call(this);
			this.renderCompletedButton(completed_todos_count);
            $("#new-todo").focus();
            if(arguments.length==0)
               app.Model.createStore("todosjquery",this.todos);
		},
		renderCompletedButton:function(completed_todos_count){
			$('.clear-completed').toggle(completed_todos_count>0);
		},
		create:function(e){
			var input=$(e.target);
			var value=input.val();
			value=value.trim();
            if(e.which!==13 || !value)
               	return;
            else{
               	var obj={
               		id:app.Controller.generateId(),
               		title:value,
               		completed:false
               	};
               this.todos.push(obj);
            }
            input.val('');
            this.render();
		},
		toggleView:function(e){
	        var task_id=$(e.target).closest('li').data('id');
            app.Controller.toggleController.call(this,task_id);
		},
		destroyView:function(e){
        	var input=$(e.target).closest('li').data('id');
         	app.Controller.destroyController.call(this,input);
		},
		escapeSeq:function(ch){
         	switch(ch){
          		case '<': return '&lt';
          		case '>': return '&gt';
          		case '&': return '&amp';
          		default: return ch;
          	}
		},
		_escape:function(title){
         	var i;
          	var newtitle='';
          	var length=title.length;
          	for(i=0;i<length;i++){
            	newtitle=newtitle+""+this.escapeSeq(title.charAt(i));
          	}
          	return newtitle;
		},
		editLabel:function(e){
          	var txt=$(e.target).text();
          	$(e.target).closest('li').addClass("editing");
          	$(e.target).replaceWith("<input class='edit'/>");
          	$(".edit").text(txt).focus();
		},
		editLabelDone:function(){
         	var txt=$(".edit").val();
          	var txt_id=$(".edit").closest('li').data('id');
          	$(".edit").replaceWith("<label></label>");
          	$(".editing").find('label').text(txt);
          	$(".editing").removeClass("editing");
          	app.Controller.updateTitle.call(this,txt_id,txt);
          
		},
		editFilter:function(e){
  			var input=$(e.target).val();
  			input=input.trim();
  			if(e.which!==13 || !input)
               	return;
            else{
            	this.editLabelDone();
            }
                  	
		}
		
	};
	window.app=window.app||{};
	window.app.View=View;

});