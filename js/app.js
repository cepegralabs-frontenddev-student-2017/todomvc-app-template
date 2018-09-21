(function (window) {
	'use strict';

	// store todos list
	let todoList = [];

	// initial state
	$('section.main, footer.footer').hide()

	// bind events
	$('.new-todo').on('keypress',           addTodo)
	$('.toggle-all').on('change',           toggleAll)
	$('button.clear-completed').on('click', deleteCompleted)
	$('.filters a').on('click',             filterList)

	$('.todoapp').on('change',   'input.toggle[type="checkbox"]', toggleDone)
	$('.todoapp').on('click',    'button.destroy',                deleteTodo)
	$('.todoapp').on('dblclick', 'ul.todo-list li',               editMode)
	$('.todoapp').on('keypress', 'input.edit',                    editTodo)

	function updateList(target, list){
		// update completed
		const left = todoList.filter(todo => todo.completed === false).length;
		$('.todo-count strong').text(left);

		// update dom with list
		let html   = '';
		$(list).each(function(index){
			const completed      = this.completed;
			const completedClass = completed ? ' class="completed"' : '';
			const completedAttr  = completed ? ' checked'           : '';
			html += `
				<li${completedClass} data-index="${index}">
					<div class="view">
						<input class="toggle" type="checkbox"${completedAttr}>
						<label>${this.label}</label>
						<button class="destroy"></button>
					</div>
					<input class="edit" value="${this.label}">
				</li>
			`
		})
		$(target).html(html)

		// hide/show section if list empty
		if (todoList.legnth === 0) {
			$('section.main, footer.footer').fadeOut();
		} else {
			$('section.main, footer.footer').fadeIn();
		}
	}

	function addTodo(e){
		const code = e.which;
		const value = $(this).val();
		if (code === 13) { // enter
			todoList.push(
				{
					label: value,
					completed: false
				}
			);
			// reset input
			$(this).val('');

			// update DOM
			updateList('.todo-list', todoList)
		}
	}

	function toggleDone(){
		const index = $(this).closest('li').data('index');
		const checked = this.checked

		// update todoList
		todoList[index].completed = checked;

		// update DOM
		updateList('.todo-list', todoList)
	}

	function toggleAll(){
		const value = this.checked;

		$(todoList).each(function(index){
			todoList[index].completed = value;
		})

		// update DOM
		updateList('.todo-list', todoList)
	}

	function deleteTodo() {
		const index = $(this).closest('li').data('index');

		// update todoList
		todoList = todoList.filter((todo, i, array) => array[i] !== array[index])

		// update DOM
		updateList('.todo-list', todoList)
	}

	function editTodo(e) {
		const code = e.which;

		if (code === 13) {
			const index = $(this).closest('li').data('index');
			const label = $(this).val();

			// update todoList
			todoList[index].label = label;

			// update DOM
			updateList('.todo-list', todoList)
		}
	}

	function deleteCompleted() {
		// update todoList
		todoList = todoList.filter(todo => todo.completed === false)

		// update DOM
		updateList('.todo-list', todoList)
	}

	function editMode(value=true) {
		$(this).toggleClass('editing', value);
	}

	function filterList() {
		// update selected filter
		$('ul.filters>li>a.selected').removeClass('selected');
		$(this).addClass('selected');

		// create filtered array
		let filteredList = todoList;
		switch ($(this).attr('href')) {
			case '#/active':
				filteredList = todoList.filter(todo => todo.completed === false)
				break;
			case '#/completed':
				filteredList = todoList.filter(todo => todo.completed === true)
				break;
		}

		// update DOM
		updateList('.todo-list', filteredList)
	}

})(window);
