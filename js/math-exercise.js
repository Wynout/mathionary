/**
 * Math Exercise Game
 */
function Game(config) {

	this.config = {
		//effect: 'slideDown'
	};
	// Merge config into this.config
	$.extend(this.config, config);

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
			$(this).removeClass('hover transition-invalid-move');
		});
	},

	// A List Item was clicked
	answerClick: function() {
		var self = this, // Self refers to the Game object
			valid = false;

		self.list.on('click', 'li', function() {

			var $this = $(this); // $this refers to the clicked list item element wrapped in jQuery

			// Exit when item with class "used" is clicked
			if ($this.hasClass('used')) {
				return;
			}

			// Toggle list item selection using "selected" class
			$this.toggleClass('selected');

			// Get sum of all selected list items
			var selected = self.list.find('li.selected'),
				sum = 0;

			// cannot select answer directly, need to select two items
			if (selected.length===1	&& $(selected[0]).data('answer')>=self.question.answer) {
				$this.addClass('transition-invalid-move');
				$this.removeClass('selected');
				return;
			}

			// Select minimal 2 items
			if (selected.length<2) {
				return;
			}

			selected.each(function() {
				// $(this) refers to current selected element
				var value = $(this).data('answer');
				sum += (value!==undefined) ? value : 0;
			});

			if (sum > self.question.answer) {
				$this.addClass('transition-invalid-move');
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
			self.displayQuestion();
			event.preventDefault();
		});
	}
};

/**
 * Animations object contains all animations
 */
Game.prototype.animations = {
	highlight: function() {
		this.effect('highlight', {}, 1500);
	},

	invalidMove: function() {
		//
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

	this.list.find('li').removeClass('selected');

	var	items    = this.list.find(':not(li.used)'); // items not used already
		sum = 0,
		elements = $(this.randomArrayElement(items, 2));

		elements.each(function() {
			sum += $(this).data('answer');
		});

	this.question = {
		type: 'sum',
		text: 'Which numbers add up to: ' + sum + ' ?.',
		answer: sum,
		elements: elements
	};
};


/**
 * Display a question
 */
Game.prototype.displayQuestion = function() {

	this.game.find('h1.question').text(this.question.text);
};


/**
 * Returns amount of random array elements
 *
 * @param  array to to pick random element
 * @param  integer amount of random to be returned
 * @return array
 */
Game.prototype.randomArrayElement = function(array, amount) {

	// default 1
	amount = amount || 1;
	// limit min returned elements
	if (amount < 1 ) {
		amount = 1;
	}
	// limit max returned elements to length array
	amount = (amount > array.length) ? array.length : amount;
	return this.shuffleArray(array).slice(0, amount);
};


/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 *
 * @param array to be randomized
 * @return array randomized
 */
Game.prototype.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};