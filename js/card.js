// ------ CARD

function Card(id, description, parentColumnId) {
	var self = this;

	this.id = id;
	this.description = description || '';
	this.parentColumnId = parentColumnId;
	this.$element = createCard();
	function createCard() {
		const $card = $('<li>').addClass('panel panel-default card').attr('id',self.id);
		const $cardId = $('<div>').addClass('id').text(self.id);
		const $cardDescription = $('<p>').addClass('panel-body card-description').text(self.description);
		const $btnCardEdit = $('<a>').addClass('btn btn-xs btn-primary btn-edit')
			.append($('<i>').addClass('material-icons md-18').text('edit'));
		const $btnCardDelete = $('<a>').addClass('btn btn-xs btn-delete')
			.append($('<i>').addClass('material-icons md-18').text('delete'));

		$btnCardDelete.click( () => {
			self.removeCard();
		});
		$btnCardEdit.click( () => {
			self.editCard();		
		});
		$cardDescription.dblclick( () => {
			self.editCard();
		});

		$card.append($btnCardDelete)
			.append($btnCardEdit)
			.append($cardId)
			.append($cardDescription);

		return $card;
	};

};

Card.prototype = {
	removeCard: function() {
		var self = this;
		$.ajax({
			url: baseUrl + '/card/' + self.id,
			method: 'DELETE',
			success: function() {
				self.$element.remove();
			}
		});
	},
	
	updateCard: function(cardNewDescription, callback) {
		var self = this;
		var data = {
			id: self.id,
			name: cardNewDescription,
			bootcamp_kanban_column_id: self.parentColumnId
		};
		console.log(data);

		$.ajax({
			url: baseUrl + '/card/' + self.id,
			method: 'PUT',
			data: data,
			success: () => {
				self.description = cardNewDescription;
				self.$element.find('.card-description').text(cardNewDescription);
				callback();
				// self.$element.show();
			},
			error: (response) => {
				// self.$cardDescription.text(cardNewDescription);
				// alert(cardNewDescription);
			}

		});
	},

	editCard: function() {
		var self = this;
		var $modalCardContainer = $('<div>').addClass('modal-container');
		var $modalCard = $('<div>').addClass('modal-card'); 
		var $textareaEditCard = $('<textarea>').addClass('textarea-edit-card').attr('wrap', 'soft');
		$textareaEditCard.text(self.description);
		var $btnSaveCard = $('<button>').addClass('btn btn-primary btn-save-card').text(' Zapisz ');
		var $btnCancel = $('<button>').addClass('btn btn-cancel').text(' Anuluj ');

		$btnSaveCard.click(function() {
			var cardNewDescription = $textareaEditCard.val();
			if (cardNewDescription !== '') {
				self.updateCard(cardNewDescription, function(){
					$modalCardContainer.remove()
				});
				return true;
			};
			showAlert('Podaj treść karty', 'danger', 3000);
			return false;
		});
		$btnCancel.click(function() {
			$modalCardContainer.remove()
		});

		$textareaEditCard.on('keydown', function(event) {
			if (event.keyCode === 13 && !event.shiftKey) {
				$btnSaveCard.click();
				event.preventDefault();
			}
		});
		$(document).on('keydown', function(event) {
			if (event.keyCode === 27) $btnCancel.click();
		});

		$modalCardContainer.append($modalCard);
		$modalCard.append($textareaEditCard)
			.append($btnCancel)
			.append($btnSaveCard);
		
		$('body').append($modalCardContainer);
		$modalCardContainer.show();
		$textareaEditCard.focus();
	}


};

// function editCard(cardObj) {
// 	var $modalCardContainer = $('<div>').addClass('modal-container');
// 	var $modalCard = $('<div>').addClass('modal-card'); 
// 	var $textareaEditCard = $('<textarea>').addClass('textarea-edit-card').attr('wrap', 'soft');
// 	$textareaEditCard.text(cardObj.description);
// 	var $btnSaveCard = $('<button>').addClass('btn btn-save-card').text(' Zapisz ');
// 	var $btnCancel = $('<button>').addClass('btn btn-cancel').text(' Anuluj ');

// 	$btnSaveCard.click(function() {
// 		var cardNewDescription = $textareaEditCard.val();
// 		if (cardNewDescription !== '') {
// 			cardObj.updateCard(cardNewDescription, function(){
// 				$modalCardContainer.remove()
// 			});
// 			return true;
// 		};
// 		showAlert('Podaj treść karty', 'danger', 3000);
// 		return false;
// 	});
// 	$btnCancel.click(function() {
// 		$modalCardContainer.remove()
// 	});

// 	$textareaEditCard.on('keydown', function(event) {
// 		if (event.keyCode === 13 && !event.shiftKey) {
// 			$btnSaveCard.click();
// 			event.preventDefault();
// 		}
// 	});
// 	$(document).on('keydown', function(event) {
// 		if (event.keyCode === 27) $btnCancel.click();
// 	});

// 	$modalCardContainer.append($modalCard);
// 	$modalCard.append($textareaEditCard)
// 		.append($btnCancel)
// 		.append($btnSaveCard);
	
// 	$('body').append($modalCardContainer);
// 	$modalCardContainer.show();
// 	$textareaEditCard.focus();
// };
