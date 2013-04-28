/**
 * Math Exercise Game
 */
function Game() {

	// Game properties
	this.length   = 8;
	this.total    = Math.pow(this.length,2);
	this.question =  {};

	// jQuery wrapped elements
	this.game       = $('div.game');
	this.navigation = this.game.find('div.navigation');
	this.list       = this.game.find('ul').first();

	// Initialize Game
	this.initialize();
}

/**
 * Initialize Game
 */
Game.prototype.initialize = function() {

	this.initList();		// Initialize List Items
	this.createQuestion();	// Show a question on start up
	this.bindEvents();		// Method for binding all event handlers

	// show a question when Game initialized
	this.createQuestion();
	this.displayQuestion();
};


/**
 * Method for binding all event handlers
 */
Game.prototype.bindEvents = function() {

	this.events.answerMouseenter.call(this);
	this.events.answerMouseleave.call(this);
	this.events.answerClick.call(this);
	this.events.createQuestion.call(this);
	this.events.answerShuffle.call(this);
};


/**
 * Events object contains all event handlers
 */
Game.prototype.events = {

	// Add hover classes on list items.
	answerMouseenter: function() {
		var self = this; // Self refers to the Game object
		self.list.on('mouseenter', 'li', function() {
			// this refers to element wrapped in jQuery
			$(this).addClass('hover');
		});
	},
	answerMouseleave: function() {
		var self = this; // Self refers to the Game object
		self.list.on('mouseleave', 'li', function() {
			// this refers to element wrapped in jQuery
			$(this).removeClass('hover');
		});
	},

	// A List Item was clicked
	answerClick: function() {
		var self = this, // Self refers to the Game object
			valid = false;

		self.list.on('click', 'li', function() {

			var $this = $(this); // $this refers to the clicked list item element wrapped in jQuery

			// Toggle list item selection using "selected" class
			$this.toggleClass('selected');

			// Get sum of all selected list items
			var selected = self.list.find('li.selected'),
				sum = 0;
			selected.each(function() {
				// $(this) refers to current selected element
				var value = $(this).data('answer');
				sum += (value!==undefined) ? value : 0;
			});

			if (sum > self.question.answer) {
				$this.removeClass('selected');

			} else if(sum===self.question.answer) {

				// Mark selected items as used
				selected.removeClass('selected').addClass('used');

				self.createQuestion();
				self.displayQuestion();
			}
		});
	},

	// Create question button click
	createQuestion: function(event) {
		var self = this; // Self refers to the Game object
		self.navigation.find('a#create-question').on('click', function(event) {
			self.createQuestion();
			event.preventDefault();
		});
	},

	// Shuffle list items button click
	answerShuffle: function(event) {
		var self = this; // Self refers to the Game object
		self.navigation.find('a#shuffle').on('click', function(event) {
			self.shuffle();
			event.preventDefault();
		});
	}
};


/**
 * Create List Items with random numbers
 */
Game.prototype.initList = function() {

	for (var i=1; i<=this.total; i++) {

		var answer = Math.floor( Math.random()*9 + 1 );
		var item = $('<li></li>', {
			text: answer
		})
			// attach answer html5 data attribute to <li data-answer="integer"> tag
			.data('answer', answer)
			.appendTo(this.list);
	}
};


/**
 * Create a question
 */
Game.prototype.createQuestion = function() {

	var	items    = this.list.find(':not(li.used)'), // items not currently selected
		itemA    = $(items[Math.floor(items.length * Math.random())]),
		itemB    = $(items[Math.floor(items.length * Math.random())]),
		valueA   = parseInt(itemA.text(), 10),
		valueB   = parseInt(itemB.text(), 10),
		sum      = valueA + valueB;

	this.list.find('li').removeClass('selected');

	this.question = {
		type: 'sum',
		text: 'Which numbers add up to: ' + sum + ' ?.',
		answer: sum,
		itemA: itemA,
		itemB: itemB
	};
};


/**
 * Display a question
 */
Game.prototype.displayQuestion = function() {

	this.game.find('h1.question').text(this.question.text);
};


/**
 * Shuffle List Items
 */
Game.prototype.shuffle = function() {

	var self = this,
		items = self.list.find('li'),
		random = self.randomize(items);

	items = self.list.empty();
	$(random).appendTo(items);
};

/**
 * Randomize array
 * @param  array to be randomized
 * @return array randomized
 */
Game.prototype.randomize = function(array) {

	var length = array.length;

	$.each(array, function(index, value) {

		// Switch current element with a random array element
		random = parseInt(Math.random() * length, 10);
		current = array[--length];
		array[length] = array[random];
		array[random] = current;
	});
	return array;
};
