$(function(){
	var view={

		template:function(){
			return '<li data-id="{{id}}" class="{{completed}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="destroy">X</button>'
		+		'</div>'
		+	'</li>';
		},
		bindevents:function(){
			$("#new-todo").on("keyup",this.create.bind(this));
			$('#todolist')
				.on('change', '.toggle', this.toggleview.bind(this))
				.on('click', '.destroy', this.destroyview.bind(this))
				.on('dblclick','label',this.editlabel.bind(this))
				.on('blur','.edit',this.editlabeldone.bind(this))
				.on('keyup','.edit',this.editfilter.bind(this));
			$('#footer .clear-completed').on("click",app.controller.clearcompleted.bind(this));
			$('#footer .all-button').on("click",app.controller.all.bind(this));	
			$('#footer .active-button').on("click",app.controller.active.bind(this));
			$('#footer .completed-button').on("click",app.controller.completed.bind(this));


		},
		init:function(){
			this.todos=app.controller.init();
			this.bindevents();
            this.render();
		},
		
		createtodotemplate:function(data){
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
            temp=temp.replace('{{title}}',this.Escape(data[i].title));
            viewlabel=viewlabel+temp;
         }
         return viewlabel;
		},
		render:function(data){
			var todo;
			if(arguments.length>0){
			 todo=data;
			}
			else{
				todo=this.todos;
			}
           var temp=this.createtodotemplate(todo);
			$("#todolist").html(temp);
			$('strong').html(app.controller.taskremaining.call(this));
			$("#main").toggle(todo.length>0);
			var completed_todos_count=app.controller.getcompletedtodos.call(this);
			this.render_completed_button(completed_todos_count);
            $("#new-todo").focus();
            if(arguments.length==0)
               app.model.createstore("todosjquery",this.todos);
		},
		render_completed_button:function(completed_todos_count){

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
               	id:app.controller.generateid(),
               	title:value,
               	completed:false
               };
               this.todos.push(obj);
               }
            input.val('');
            this.render();
		},
		
		toggleview:function(e){
	        var task_id=$(e.target).closest('li').data('id');
            app.controller.togglecontroller.call(this,task_id);

		},
		destroyview:function(e){
        	var input=$(e.target).closest('li').data('id');
         	app.controller.destroycontroller.call(this,input);
		},
		escape_seq:function(ch){
         	switch(ch){
          		case '<': return '&lt';
          		case '>': return '&gt';
          		case '&': return '&amp';
          		default: return ch;
          	}
		},
		Escape:function(title){
         	var i;
          	var newtitle='';
          	var length=title.length;
          	for(i=0;i<length;i++){
            	newtitle=newtitle+""+this.escape_seq(title.charAt(i));
          	}
          	return newtitle;
		},
		editlabel:function(e){
          	var txt=$(e.target).text();
          	$(e.target).closest('li').addClass("editing");
          	$(e.target).replaceWith("<input class='edit'/>");
          	$(".edit").text(txt).focus();
		},
		editlabeldone:function(){
         	var txt=$(".edit").val();
          	var txt_id=$(".edit").closest('li').data('id');
          	$(".edit").replaceWith("<label></label>");
          	$(".editing").find('label').text(txt);
          	$(".editing").removeClass("editing");
          	app.controller.updateTitle.call(this,txt_id,txt);
          
		},
		editfilter:function(e){
  			var input=$(e.target).val();
  			input=input.trim();
  			if(e.which!==13 || !input)
               return;
            else{
            	
            	this.editlabeldone();
            }
                  	
		}
		
		
	};
	window.app=window.app||{};
	window.app.view=view;

});