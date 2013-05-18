/**
 * Math Exercise Game, initialized with a value.
 * @param {Object} config.
 * @constructor
 *
 * Requires jQuery 2.0.0 or higher
 *
 * Code Conventions
 * @link http://javascript.crockford.com/code.html
 */
function Game(config) {

    // Config properties
    this.config = {
        //effect: 'slideDown'
    };
    this.config.answer = {
        parentElement: 'ul',
        childElement: 'li'
    };
    // Merge config into this.config
    $.extend(this.config, config);

    // Question properties
    this.question = {
        template: 'Which numbers add up to: {{answer}}?.', // Question template
        text: '', // Question created in method newQuestion using template
        answer: null, // Integer, answers question
        elements: null // jQuery wrapped elements containing the answer
    };

    // User properties
    this.user = {
        answer: null
    };

    // Cached answers elements
    this.$answers = null;

    // Cached game container element
    this.$game = null;

    // Cached navigation elements
    this.$navigation = null;


    // Cache DOM Elements that we need to access
    this.cacheDomElements();

    // Initializes & Start Game
    this.initialize();
}


/**
 * CacheDomElements method dedicated
 * to cache anything in the DOM that we need to access.
 */
Game.prototype.cacheDomElements = function ()  {

    // Check existence of jQuery wrapped Game HTML elements
    this.$game = $('div.game');
    if (!this.$game.length) {
        throw new Error("Game CacheDomElements: no html game element found, 'div.game'");
    }
    this.$answers = this.$game.find(this.config.answer.parentElement).first();
    if (!this.$answers.length) {
        throw new Error("Game CacheDomElements: no html unordered list element found, 'ul'");
    }
    this.$navigation = this.$game.find('div.navigation');
    if (!this.$navigation.length) {
        throw new Error("Game CacheDomElements: no html navigation element found, 'div.navigation'");
    }
};


/**
 * Initialize Game
 */
Game.prototype.initialize = function () {

    // Initialize Answer Elements
    this.initAnswerElements();

    // Method for binding all event handlers
    this.bindEvents();

    // Show a new question when Game initializes
    this.newQuestion();
};


/**
 * Method for binding all event handlers
 */
Game.prototype.bindEvents = function () {

    this.events.answerMouseenter.call(this);
    this.events.answerMouseleave.call(this);
    this.events.answerClick.call(this);
};


/**
 * Object events contains all event handlers
 */
Game.prototype.events = {

    // Answer element mouseenter and mouseleave events
    // Add hover classes on elements
    answerMouseenter: function() {

        var self = this; // Self refers to the Game object
        var answerElement = self.config.answer.childElement;

        self.$answers.on('mouseenter', answerElement, function() {
            // This refers to answer element, wrapped in jQuery
            $(this).addClass('hover');
        });
    },
    answerMouseleave: function() {

        var self = this; // Self refers to the Game object
        var answerElement = self.config.answer.childElement;

        self.$answers.on('mouseleave', answerElement, function() {
            // This refers to answer element, wrapped in jQuery
            $(this).removeClass('hover transition-invalid-move');
        });
    },

    // An answer element was clicked, check given answer
    answerClick: function() {

        var self = this; // Self refers to the Game object
        var answerElement = self.config.answer.childElement;

        self.$answers.on('click', answerElement, function() {

            var $this = $(this); // $this refers to the clicked answer element wrapped in jQuery

            // Cannot use elements where class="used"
            if ($this.hasClass('used')) {
                return;
            }

            // Toggle element selection
            $this.toggleClass('selected');

            // A selected element is an element where class="selected"
            var selectedElements = self.$answers.find('.selected');

            // Answer is calculated by summing all HTML5 data attribute values
            self.user.answer = self.sumDataAttributes('answer', selectedElements);

            if (self.isValidAnswer(selectedElements)===false) {
                // This refers to the element that was clicked
                self.displayInvalidMove.call(this);
                return;
            }

            // New question if answered correctly
            if (self.isQuestionAnswered()) {
                // Mark selected answer elements as used
                selectedElements.removeClass('selected').addClass('used');

                // Create and display new question.
                self.newQuestion();
            }
        });
    }
};


/**
 * Object effects contains all effects
 */
Game.prototype.effects = {

    highlight: function () {
        this.effect('highlight', {}, 1500);
    },
    displayInvalidMove: function () {
        //
    }
};


/**
 * Initialize Answer Elements
 * Creates elements and appends them to the parent this.answers
 * Attaches an 'answer' HTML5 data attribute to each list item: <element data-answer="integer" /> tag.
 */
Game.prototype.initAnswerElements = function () {

    var answerElement = this.config.answer.childElement;

    // Create answer and append them to answers
    for (var i=1; i<=64; i++) {

        var answer = Math.floor( Math.random()*9 + 1 );
        var createElement = '<'+answerElement+'></'+answerElement+'>'; // e.g. '<li></li>'
        var item = $(createElement, {
                text: answer
            })
            // Attach HTML5 data attribute
            .data('answer', answer)
            .appendTo(this.$answers);
    }
};


/**
 * Create a new question and store question in Game object question.
 * <h1/> tags will show question.
 *
 * @param {object} this.answers
 * @param {object} HTML script element "#questionTemplate"
 * @return {object} jQuery wrapped element containing the question text
 */
Game.prototype.newQuestion = function (displayQuestion) {

    // Remove all selected answers
    this.$answers.find(this.config.answerElement).removeClass('selected');

    // Find answers not used already.
    var availableAnswers = this.$answers.find(':not(.used)');

    // Choose 2 random available answers using Fisher-Yates shuffle algorithm.
    var randomAnswer = $(this.getRandomArrayElements(availableAnswers, 2));

    // Calculate answer from html5 data attribute
    var answer = 0;
    randomAnswer.each(function() {
        answer += $(this).data('answer');
    });

    // Store Question in Game object
    this.question.answer = answer;
    this.question.elements = randomAnswer;

    // Retrieve Question template from HTML
    var template = $.trim( $('#questionTemplate').html() );

    // Replace all Question template variables
    this.question.text = template.replace( /{{answer}}/ig, answer );

    // Update all h1 question tags
    return this.$game.find('h1.question').text(this.question.text);
};


/**
 * Returns Sum of all HTML5 data attribute 'answer' <element data-answer="integer" /> tags.
 *
 * @param {string} data attribute name
 * @param {object} containing elements
 * @return {integer}
 */
Game.prototype.sumDataAttributes = function (attributeName, elements) {

    var sum = 0;
    elements = elements || {};
    elements.each(function() {
        // $(this) refers to current element
        var value = $(this).data(attributeName);
        sum += (value!==undefined) ? value : 0;
    });
    return sum;
};


/**
 * Validate the answer
 *
 * @param {object} selected, jQuery wrapped answer elements
 * @param {object} this.question
 * @return {boolean} returns true/false on valid answer
 */
Game.prototype.isValidAnswer = function (selected) {

    // Cannot select answer directly,
    // need to select at least two answers (except for last possible answer)
    var answersNeeded = this.question.elements.length;
    var selectedAnswer = $(selected[0]).data('answer');
    if ( answersNeeded>1 && selected.length===1 && selectedAnswer>=this.question.answer) {

        return false;
    }

    // Invalid answer when user has answer greater then question answer
    return (this.user.answer > this.question.answer) ? false : true;
};


/**
 * Check if the question is answered
 *
 * @param {object} this.user.answer
 * @return {Boolean} [description]
 */
Game.prototype.isQuestionAnswered = function () {

    // Question answered correctly?
    return (this.user.answer===this.question.answer) ? true : false;
};


/**
 * Display an invalid move
 *
 * @param  {object} element that was clicked
 * @return {object} jQuery wrapped element
 */
Game.prototype.displayInvalidMove = function () {
    // This refers to the element that was clicked.
    return $(this).addClass('transition-invalid-move').removeClass('selected');
};


/**
 * Returns amount of random array elements
 *
 * @param {array} containing answer elements
 * @param {integer} amount of random to be returned
 * @return {array}
 */
Game.prototype.getRandomArrayElements = function (array, amount) {

    // Default amount is 1
    amount = (amount>0 ? amount : 1) || 1;

    // Limit max returned elements to length of array
    amount = (amount > array.length) ? array.length : amount;
    return this.shuffleArray(array).slice(0, amount);
};


/**
 * Randomize array element order in-place using Fisher-Yates shuffle algorithm.
 *
 * @param {array} to be randomized
 * @return {array} randomized
 */
Game.prototype.shuffleArray = function (array) {

    for ( var i=array.length-1; i>0; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};