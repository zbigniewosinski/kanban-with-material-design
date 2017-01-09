// ------- API CONFIG
const baseUrl = 'https://kodilla.com/pl/bootcamp-api';
const myHeaders = {
	'X-Client-Id': 88,
	'X-Auth-Token': 'f5fd0923173f9fbc73da8a6ee51c1007'
};
$.ajaxSetup({
	headers: myHeaders
});

	// DASHBOARD 

$(function(){


	initialize();

	function initialize() {
		const dashboard = $('section.main');
		const header = $('header');
		// const inputAddBoard = $('<input>').addClass('add-board').attr('placeholder', 'Dodaj tablicę...');
		const inputAddBoard = $('#input-add-board');
		// const btnAddBoard = $('<button>').addClass('btn btn-add-board').text(' + ');
		const btnAddBoard = $('#btn-add-board');

		$.ajax({
			url: baseUrl + '/board',
			method: 'GET',
			success: response => {
				console.log(response);
				setupBoards(response);
			}
		});

		btnAddBoard.click( () => {
			if (inputAddBoard.val() !== '') {
				addBoard();
				inputAddBoard.val('');				
				return true;
			}
			alert('Podaj nazwę');
			return false;
		});
		
		inputAddBoard.on('keydown', event => {
			if (event.keyCode === 13) {
				btnAddBoard.click();
			}
		});

		function addBoard(){
				const board = new Board( inputAddBoard.val() );
				dashboard.append(board.$element);
		};

		function setupBoards(item) {
			// boards.forEach(function(item){
				const board = new Board(item.id, item.name);
				dashboard.append(board.$element);
				setupColumns(board, item.columns);
			// });
		};

		function setupColumns(board, columns) {
			columns.forEach( item => {
				const column = new Column(item.id, item.name);
				board.addColumn(column);
				setupCards(column, item.cards);
			});
		};


		function setupCards(column, cards){ // ustawia kolumny na podstawie request do API
			cards.forEach( item => {
				const card = new Card(item.id, item.name, column.id);
				column.addCard(card);
			});
		};

		// header.append(inputAddBoard).append(btnAddBoard);
		inputAddBoard.focus();
	}


});

