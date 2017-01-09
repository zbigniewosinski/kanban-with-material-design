// ------ BOARD

function Board(id, name) {
	var self = this;

	this.id = id;
	this.name = name;
	this.$element = createBoard();

	function createBoard() {
		const $board = $('<div>').addClass('board').attr('id',id);
		const $boardTitle = $('<h1>').addClass('board-title').text(name);
		const $boardColumnList = $('<ul>').addClass('board-column-list');
		const $pseudoColumn = $('<li>').addClass('pseudo-column');
		const $inputAddColumn = $('<input>').addClass('input-add-column')
			.attr('placeholder', 'Dodaj kolumnę...');
		const $btnAddColumn = $('<button>').addClass('btn btn-add-column').text(' + ');

		$btnAddColumn.click( () => {
			const columnName = $inputAddColumn.val();
			if (columnName !== '') {

				$.ajax({
					url: baseUrl + '/column',
					method: 'POST',
					data: {
						name: columnName
					},
					success: response => {
						self.addColumn(new Column( response.id, columnName ));
					}
				});
				$inputAddColumn.val('');
				return true;						

			}
			alert('Podaj nazwę');
			return false;
		});
		$inputAddColumn.on('keydown', event => {
			if (event.keyCode === 13) {
				$btnAddColumn.click()
			}
		});

		$board.append($boardTitle)
			.append($boardColumnList);
		$boardColumnList.append($pseudoColumn)
		$pseudoColumn.append($inputAddColumn).append($btnAddColumn);
		return $board;
	};
};

Board.prototype = {
	addColumn: function(column) {
		this.$element.children('ul').children('.pseudo-column').before(column.$element);
		initSortable();
	}
};

function initSortable() {
	$('.column-card-list').sortable({
		connectWith: '.column-card-list',
		placeholder: 'card-placeholder',
		dropOnEmpty: true,
		receive: (event, ui) => {
			const cardId = ui.item.attr('id');
			const targetColumn = $(event.target).closest('.column');
			const targetColumnId = targetColumn.attr('id');
			
			$.ajax({
				url: baseUrl + '/card/' + cardId,
				method: 'PUT',
				data: {
					id: cardId,
					name: ui.item.find('p.card-description').text(),
					bootcamp_kanban_column_id: targetColumnId
				}
			});
		}
	}).disableSelection();
};

