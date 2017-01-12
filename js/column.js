// ------ COLUMN

function Column(id, name, backgroundColor) {
	var self = this;

	this.id = id;
	this.name = name;
	this.backgroundColor = backgroundColor || 'white';
	this.$element = createColumn();
	function createColumn() {
		// const $column = $('<li>').addClass('panel panel-default column').attr('id', id);
		const $column = $('<li>').addClass('column').attr('id', id);
		// const $columnBody = $('<div>').addClass('panel-body');
		const $columnBody = $('<div>');
		const $columnTitle = $('<h2>').addClass('column-title').text(name);
		const $columnId = $('<div>').addClass('id').text(id);
		const $columnCardList = $('<ul>').addClass('column-card-list');
		// const $columnNav = $('<div>').addClass('nav-column');
		const $columnNav = $('<div>').addClass('column-nav btn-group');
		const $columnNavDropdownToggle = $('<button>').addClass('btn btn-sm dropdown-toggle').attr('data-toggle', 'dropdown')
			.attr('type', 'button');
		const $columnNavDropdownMenu = $('<ul>').addClass('dropdown-menu dropdown-menu-right');
		// const $btnColumnDelete = $('<button>').addClass('btn btn-delete').text('x');
		// const $btnColumnEdit = $('<a>').addClass('btn btn-xs btn-primary btn-edit')
		// 	.append($('<i>').addClass('material-icons md-18').text('edit'));
		// const $btnColumnDelete = $('<a>').addClass('btn btn-xs btn-delete')
		// 	.append($('<i>').addClass('material-icons md-18').text('delete'));
		const $btnColumnEdit = $('<a href="#">').append($('<i>').addClass('material-icons md-18').text('edit'));
		const $btnColumnDelete = $('<a href="#">').append($('<i>').addClass('material-icons md-18').text('delete'));


		// const $columnColorPicker = $('<input>').addClass('btn color-picker').attr('type', 'color');
		const $pseudoCard = $('<div>').addClass('pseudo-card form-group');
		const $textareaAddCard = $('<textarea>').addClass('textarea-add-card form-control')
			.attr('placeholder', 'Dodaj kartę...')
			.attr('rows', 2)
			.attr('wrap', 'soft');
		const $btnAddCard = $('<button>').addClass('btn btn-sm btn-add-card').text(' + ');

		$btnColumnDelete.click( () => self.removeColumn() );
		$btnColumnEdit.click( () => self.editColumnName() );
		$columnTitle.dblclick( () => self.editColumnName() );

		$textareaAddCard.focus( (event) => {
			$(event.target).closest('.pseudo-card').addClass('is-focused');
		});
		$textareaAddCard.focusout( (event) => {
			$(event.target).closest('.pseudo-card').removeClass('is-focused');
		});
		
		$btnAddCard.click( () => {
			const cardDescription = $textareaAddCard.val();
			const data = {
						name: cardDescription,
						bootcamp_kanban_column_id: self.id
					};
			event.preventDefault();
			
			if (cardDescription !== '') {
				$.ajax({
					url: baseUrl + '/card',
					method: 'POST',
					data: data,
					success: response => {
						self.addCard(new Card( response.id, cardDescription, self.id ));
					}
				});
				$pseudoCard.removeClass('has-warning is-empty')
				$textareaAddCard.val('');
				return true;
			};
			showAlert('Podaj treść karty', 'danger', 3000);
			$pseudoCard.addClass('has-warning is-empty')
			return false;
		});

		$textareaAddCard.on('keydown', event => {
			if (event.keyCode === 13 && !event.shiftKey) {
				$btnAddCard.click();
				event.preventDefault();
			}
		});

		// $columnColorPicker.on('change', function(event) {
		// 	this.backgroundColor = $columnColor.val();
		// 	self.$element.css('background-color', this.backgroundColor);
		// });

		// $columnNav.append($columnColorPicker).append($btnColumnDelete);
		// $columnNav.append($btnColumnEdit).
		// 	append($btnColumnDelete);

		// $columnNav.append( $('<button>').addClass('btn dropdown-toggle').attr('data-toggle', 'dropdown')
		// 	.attr('type', 'button') ).attr('data-target', '#');
		// $columnNav.find('button').append($('<i>').addClass('material-icons').text('more_vert'));
		
		// $columnNav.hover( () => {
		// 	$columnNavDropdownMenu.dropdown('toggle');
		// });
		// $columnNavDropdownToggle.click( () => {
			
		// });
		
		$columnNavDropdownToggle.append($('<i>').addClass('material-icons').text('more_vert'));
		$columnNavDropdownMenu.append($('<li>').append($btnColumnEdit));
		$columnNavDropdownMenu.append($('<li>').append($btnColumnDelete));
		$columnNav.append($columnNavDropdownToggle).append($columnNavDropdownMenu);
		
		$pseudoCard.append($textareaAddCard).append($btnAddCard);
		$columnBody
			.append($columnTitle)
			.append($columnId)
			.append($columnNav)
			.append($pseudoCard)
			.append($columnCardList);
		$column.append($columnBody);

		// $columnNav.append($('<ul>').addClass('dropdown-menu').append($('<li>').append($btnColumnEdit)).
		// 	append($('<li>').append($btnColumnDelete)));

		// $columnNav.find('button').hover( () => {
		// 	$columnNav.find('.dropdown-menu').dropdown('toggle');
		// })


		return $column;
	};
};

Column.prototype = { 
	addCard: function(card) {
		this.$element.find('.column-card-list').prepend(card.$element);
	},
	
	removeColumn: function() {
		// var self = this;
		$.ajax({
			url: baseUrl + '/column/' + this.id,
			method: 'DELETE',
			success: response => {
				this.$element.remove();
			}
		});
	},

	updateColumnName: function(columnNewTitle, callback) {

		$.ajax({
			url: baseUrl + '/column/' + this.id,
			method: 'PUT',
			data: {
				id: this.id,
				name: columnNewTitle
			},
			success: response => {
				this.name = columnNewTitle;
				callback();
			}
		});
	},

	editColumnName: function() {
		const self = this;
		const $columnNameFormGroup = $('<div>').addClass('column-name-form-group form-group');
		const $inputColumnName = $('<input>').addClass('input-column-name form-control');
		const $columnTitle = self.$element.find('.column-title');
		const $navColumn = self.$element.find('.column-nav');

		$(window).on('keydown', (event) => {
			console.log('keyCode', event.keyCode);
			if (event.keyCode === 13) {
				const columnNewTitle = $inputColumnName.val();
				if (columnNewTitle !== '') {
					self.updateColumnName(columnNewTitle, () => {
						$columnTitle.text(columnNewTitle);
						bringBackStdElements();		
					});
					return true;
				};
				showAlert('Nazwa kolumny nie może być pusta', 'danger', 3000);
				return false;
			};
			if (event.keyCode === 27) {
				bringBackStdElements();
			}
		});
		
		const bringBackStdElements = () => {
			$columnNameFormGroup.remove()
			$columnTitle.show();
			$navColumn.show();		
		};

		$navColumn.hide()
		$inputColumnName.val($columnTitle.text());
		$columnTitle.after($columnNameFormGroup);
		$columnTitle.hide();		
		$columnNameFormGroup.append($inputColumnName).show();
		$inputColumnName.focus();
		$columnNameFormGroup.addClass('is-focused');

	}
};




