/*
TODO
*
* put all events in one object, for quick access to events in one place.
* Code Organisation is Vital.
*/
var MathExercise =  {

	// Constructor method
	init: function() {

		// MathExercise propertieds
		this.length = 8;
		this.total = Math.pow(this.length,2);

		this.game = $('div.game');
		this.navigation = this.game.find('div.navigation');
		this.list = this.game.find('ul').first();
		this.question =  {};

		this.initList();
		this.createQuestion();
		this.bindEvents();

		// Setup main interval loop every second.
		window.setInterval(function() {
			MathExercise.main();
		}, 1000);

	},

	main: function() {
		// MathExercise.createQuestion();
	},


	initList: function() {
		for (var i=1; i<=this.total; i++) {

			$('<li></li>', {
				text: Math.floor(Math.random()*9+1)
			})
				.appendTo(this.list);
		}
	},

	bindEvents: function() {

		// Add hover classes on list items.
		this.list.on('mouseenter', 'li', function() {
			$(this).addClass('hover');
		});
		this.list.on('mouseleave', 'li', function() {
			$(this).removeClass('hover');
		});

		// List item click
		this.list.on('click', 'li', this.listClick );

		// Create question button click
		this.navigation.find('a#create-question').on('click', function(e) {
			MathExercise.createQuestion();
			e.preventDefault();
		});

		// Shuffle button
		this.navigation.find('a#shuffle').on('click', function(e) {
			MathExercise.shuffle();
			e.preventDefault();
		});

	},


	listClick: function() {
		var self = MathExercise,
			$this = $(this), // cache $(this). this refers to list item clicked
			sum = 0;

		// Toggle list item selection using "selected" class
		$this.toggleClass('selected');


		// print sum
		//$('div.navigation').text('');
		sum = self.calculateSum();
		$('div.navigation').append(', ' + sum);

	},

	calculateSum: function() {
		var sum = 0;
		$('div.game').find('li.selected').each(function() {
			sum += parseInt($(this).text(), 10);
		});
		return sum;
	},

	/**
	 * Create a question
	 */
	createQuestion: function() {

		var self 	 = MathExercise,
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
	},

	/**
	 * Display a question
	 */
	displayQuestion: function() {
		this.game.find('h1.question').text(this.question.text);
		this.question.itemA.addClass('selected');
		this.question.itemB.addClass('selected');
	},

	/**
	 * Returns active items
	 * @return object jQuery object containing active list items
	 */
	getActiveItems: function() {

		return this.list.find(':not(li.selected)');
	},


	/**
	 * Shuffle list items
	 */
	shuffle: function(e) {
		var self = MathExercise,
			items = self.list.find('li'),
			random = self.randomize(items);

		items = self.list.empty();
		$(random).appendTo(items);
	},

	/**
	 * Randomize Array
	 */
	randomize: function(arr) {
	    for(var j,x,i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	    return arr;
	}

};







