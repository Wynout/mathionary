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
};

/**
 * Initialize Game
 */
Game.prototype.initialize = function() {

	this.initList();		// Initialize List Items
	this.createQuestion();	// Show a question on startup
	this.bindEvents();		// Method for binding all event handlers

	// Setup main interval loop (1 sec)
	var self = this; // move to top of obect
	window.setInterval(function() {
		self.main();
	}, 1000);
};


/**
 * Main Game loop
 */
Game.prototype.main = function() {

	this.createQuestion();
};


/**
 * Method for binding all event handlers
 */
Game.prototype.bindEvents = function() {

	this.events.listMouseenter.call(this);
	this.events.listMouseleave.call(this);
	this.events.listClick.call(this);
	this.events.linkCreateQuestion.call(this);
	this.events.linkShuffle.call(this);
};


/**
 * Events object contains all event handlers
 */
Game.prototype.events = {

	// Add hover classes on list items.
	listMouseenter: function() {
		var self = this; // Self refers to the Game object
		self.list.on('mouseenter', 'li', function() {
			// this refers to element wrapped in jQuery
			$(this).addClass('hover');
		});
	},
	listMouseleave: function() {
		var self = this; // Self refers to the Game object
		self.list.on('mouseleave', 'li', function() {
			// this refers to element wrapped in jQuery
			$(this).removeClass('hover');
		});
	},

	// A List Item was clicked
	listClick: function() {
		var self = this; // Self refers to the Game object
		// this refers to the clicked list item element wrapped in jQuery
		self.list.on('click', 'li', function() {
			var self = this,
				$this = $(this), // cache $(this). this refers to list item clicked
				sum = 0;

			// Toggle list item selection using "selected" class
			$this.toggleClass('selected');


			// print sum
			//$('div.navigation').text('');
			sum = self.calculateSum();
			$('div.navigation').append(', ' + sum);
		});
	},

	// Create question button click
	linkCreateQuestion: function(event) {
		var self = this; // Self refers to the Game object
		self.navigation.find('a#create-question').on('click', function(event) {
			self.createQuestion();
			event.preventDefault();
		});
	},

	// Shuffle list items button click
	linkShuffle: function(event) {
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

		$('<li></li>', {
			text: Math.floor(Math.random()*9+1)
		})
			.appendTo(this.list);
	}
};


/**
 * Create a question
 */
Game.prototype.createQuestion = function() {

	var self     = this,
		items    = self.getActiveItems(),
		itemA    = $(items[Math.floor(items.length * Math.random())]),
		itemB    = $(items[Math.floor(items.length * Math.random())]),
		valueA   = parseInt(itemA.text(), 10),
		valueB   = parseInt(itemB.text(), 10),
		sum      = valueA + valueB;

	self.list.find('li').removeClass('selected');
	// console.log(self.list);

	self.question = {
		text: 'Which numbers add up to: ' + sum + ' ?.',
		answer: [valueA, valueB],
		itemA: itemA,
		itemB: itemB
	};

	self.displayQuestion();
};


/**
 * Display a question
 */
Game.prototype.displayQuestion = function() {

	this.game.find('h1.question').text(this.question.text);
	this.question.itemA.addClass('selected');
	this.question.itemB.addClass('selected');
};


/**
 * Create sum of selected list items
 * @return integer [sum]
 */
Game.prototype.calculateSum = function() {

	var sum = 0;
	$('div.game').find('li.selected').each(function() {
		sum += parseInt($(this).text(), 10);
	});
	return sum;
};


/**
 * Get all active list items
 * These list items do not have a class of "selected"
 */
Game.prototype.getActiveItems = function() {

	return this.list.find(':not(li.selected)');
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
 * Randomize Array
 */
Game.prototype.randomize = function(arr) {
    for(var j,x,i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}