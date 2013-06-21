/**
 * Math Exercise Game, initialized with a value.
 *
 * @param {Object} config.
 * @constructor
 *
 * Requires jQuery 2.0.0 or higher
 *
 * Code Conventions
 * @link http://javascript.crockford.com/code.html
 */
function Game(config) {

    /**
     * Config properties.
     *
     * @property {Object}
     */
    this.config = {
        container: 'div.game'
    };
    $.extend(this.config, config);

    /**
     * Question properties.
     *
     * @property {Object}
     */
    this.question = {
        template: 'Which numbers add up to: {{answer}}?.', // Question template
        text: '', // Question created in method newQuestion using template
        answer: null, // Integer, answers question
        elements: null // jQuery wrapped elements containing the answer
    };

    /**
     * User properties
     *
     * @type {Object}
     */
    this.user = {
        answer: null
    };

    /**
     * Cached answers elements, wrapped in jQuery
     *
     * @type {Object}
     */
    this.$answers = null;

    /**
     * Cached game container element, wrapped in jQuery
     *
     * @type {Object}
     */
    this.$game = null;

    // Cache DOM Elements that we need to access multiple times
    this.cacheDomElements();

    // Initializes & Start Game
    this.initialize();
}


/**
 * CacheDomElements method dedicated to cache anything in the DOM that we need to access.
 *
 * @this {Game}
 * @throws {Error} when elements not found
 */
Game.prototype.cacheDomElements = function ()  {

    this.$game = $(this.config.container);
    if (!this.$game.length) {
        throw new Error("Game CacheDomElements: no html game element found, 'div.game'");
    }
    this.$answers = this.$game.find('ul').first();
    if (!this.$answers.length) {
        throw new Error("Game CacheDomElements: no html unordered list element found, 'ul'");
    }
};


/**
 * Initialize Game
 *
 * @this {Game}
 */
Game.prototype.initialize = function () {

    this.initializeAnswers();  // Game.$answers holds all the answers
    this.bindEvents();          // Method for organizing event handlers
    this.newQuestionCycle();    // Show a question, when Game starts
};


/**
 * Method for binding all event handlers.
 * Organized in one method, for maintainability
 *
 * @this {Game}
 */
Game.prototype.bindEvents = function () {

    this.events.answerMouseenter.call(this);
    this.events.answerMouseleave.call(this);
    this.events.answerClick.call(this);
};


/**
 * Object events contains all event handlers.
 * Organized in one method, for maintainability
 *
 * Event Delegation:
 * Adds one event listener to the parent <ul> and use selector 'li' to filter delegated events on <li> elements.
 *
 * @this {Game}
 */
Game.prototype.events = {

    // Answer element mouseenter and mouseleave events
    // Add hover classes on elements
    answerMouseenter: function () {

        var self = this; // Self refers to the Game object

        self.$answers.on('mouseenter', 'li', function () {
            // This refers to answer element, wrapped in jQuery
            $(this).addClass('hover');
        });
    },
    answerMouseleave: function() {

        var self = this; // Self refers to the Game object

        self.$answers.on('mouseleave', 'li', function () {
            // This refers to answer element, wrapped in jQuery
            $(this).removeClass('hover transition-invalid-answer');
        });
    },

    // An answer element was clicked, check given answer
    answerClick: function() {

        var self = this; // Self refers to the Game object

        self.$answers.on('click', 'li', function () {

            var $this = $(this); // $this refers to the clicked answer element wrapped in jQuery

            // Ignoring clicked used elements
            if (self.isAnswerMarkedAsUsed.call(self, $this)) {
                return;
            }

            // On answer click, toggle element selection
            $this.toggleClass('selected');

            var $selected = self.$answers.find('.selected');

            // Answer is calculated by summing all HTML5 data attribute values
            self.user.answer = self.sumDataAttributes($selected);

            // Selected answer invalid?
            if (self.isInvalidAnswer($selected)===true) {

                self.displayInvalidAnswer.call(this);
                return;
            }

            // Create new question when answered correctly
            if (self.isQuestionAnswered()) {

                // Add class 'used' to elements that are selected
                self.markAnswersAsUsed($selected);

                // Create and display new question.
                self.newQuestionCycle();
            }
        });
    }
};


/**
 * Initializes Answer Elements
 *
 * Creates elements and appends them to the parent element $answers
 * Attaches an 'answer' HTML5 data attribute to each answer element, e.g.: <li data-answer="integer" /> tag.
 *
 * @this {Game}
 * @param {Number} amount, optional default 64
 * @return {Object} $answers (wrapped in jQuery)
 */
Game.prototype.initializeAnswers = function (amount) {

    amount = amount || 64;

    this.$answers.remove('li');

    // Create answer and append them to $answers
    for (var i=1; i<=amount; i++) {

        var answer = Math.floor( Math.random()*9 + 1 );
        var newElement = '<li></li>';
        var item = $(newElement, {
                text: answer
            })
            // Attach HTML5 data attribute
            .data('answer', answer)
            .appendTo(this.$answers);
    }
    return this.$answers;
};


/**
 * Create a new Question object
 *
 * @this {Game}
 * @return {Object} new question object
 */
Game.prototype.newQuestionCycle = function () {

    // Clear all selected answer elements
    this.deselectAllAnswers();

    // Find answers not used already.
    var $availableAnswers = this.getAvailableAnswers();

    // Create question and answer
    this.question = this.createNewQuestion($availableAnswers, '#questionTemplate');

    // Display newly created question
    this.displayQuestion();

    return this.question;
};


/**
 * Remove all 'selected' class from $answers
 *
 * @this {Game}
 * @return {Object} $answers, answer elements, wrapped in jQuery
 */
Game.prototype.deselectAllAnswers = function () {

    return this.$answers.find('li')
        .removeClass('selected');
};


/**
 * Returns all answer elements that do not have the 'used' class
 *
 * @this {Game}
 * @return {Object} $answers answer elements, wrapped in jQuery
 */
Game.prototype.getAvailableAnswers = function () {

    return this.$answers.find('li:not(.used)');
};


/**
 * Creates a new Question and Answer
 *
 * @this {Game}
 * @param {Object} $availableAnswers answer elements, wrapped in jQuery
 * @param {String} templateSelector selector where question template is stored
 * @return {Object} question
 */
Game.prototype.createNewQuestion = function($availableAnswers, templateSelector) {

    // Choose 2 random available answers using Fisher-Yates shuffle algorithm.
    var $answerElements = this.getRandomArrayElements($availableAnswers, 2);

    // Calculate answer from html5 data attribute
    var answer = 0;
    $answerElements.each(function() {

        answer += $(this).data('answer');
    });

    // Question template stored in HTML element
    var template = this.getTemplate(templateSelector);

    var question = {
        answer: answer,
        elements: $answerElements,
        text: this.renderTemplate(template, {answer: answer})
    };
    return question;
 };

/**
 * Retrieves template from HTML element
 *
 * @param {String} selector HTML element containing template
 * @return {String} template
 */
Game.prototype.getTemplate = function (selector) {

    return $.trim( $(selector).html() );
};

/**
 * Displays the Question
 *
 * @this {Game}
 * @return {Object} Question element, wrapped in jQuery
 */
Game.prototype.displayQuestion = function () {

    return this.$game.find('.question').text(this.question.text);
};


/**
 * Returns Sum of all HTML5 data attributes 'answer' <element data-answer="integer" />.
 *
 * @param {Object} elements. Containing elements, wrapped in jQuery
 * @return {Number} Sum
 */
Game.prototype.sumDataAttributes = function ($elements) {

    var sum = 0;
    $elements.each(function() {
        // $(this) refers to current element
        var value = $(this).data('answer');
        sum += (value!==undefined) ? value : 0;
    });
    return sum;
};


/**
 * Returns true when answer is invalid
 *
 * @this {Game}
 * @param {Object} selected, answer elements wrapped in jQuery
 * @return {Boolean} returns true on invalid answer otherwise false
 */
Game.prototype.isInvalidAnswer = function (selected) {

    // Cannot select answer directly,
    // need to select at least two answers (except for last possible answer)
    var answersNeeded = this.question.elements.length;
    var selectedAnswer = $(selected[0]).data('answer');

    if (answersNeeded>1 && selected.length==1 && selectedAnswer==this.question.answer) {

        return true; // Invalid answer, answer chosen directly
    }

    // Invalid answer when user has answer greater then question answer
    return (this.user.answer > this.question.answer) ? true : false;
};


/**
 * Returns boolean if question is answered
 *
 * @this {Game}
 * @return {Boolean} true on answered, otherwise false.
 */
Game.prototype.isQuestionAnswered = function () {

    // Question answered correctly?
    return (this.user.answer===this.question.answer) ? true : false;
};


/**
 * Display an invalid answer
 *
 * @this {Game}
 * @return {Object} element, wrapped in jQuery
 */
Game.prototype.displayInvalidAnswer = function () {

    // This refers to the element that was clicked
    return $(this).addClass('transition-invalid-answer').removeClass('selected');
};


/**
 * Marks $elements as used. Adds class 'used' to all elements
 *
 * @param {Object} $elements, wrapped in jQuery
 * @return {Object} elements, wrapped in jQuery
 */
Game.prototype.markAnswersAsUsed = function ($elements) {

    return $elements.removeClass('selected').addClass('used');
};

/**
 * Returns boolean if $answer is used.
 *
 * @param {Object} $answer, wrapped in jQuery
 * @return {Boolean} true if has class, otherwise false
 */
Game.prototype.isAnswerMarkedAsUsed = function ($answer) {

    return $answer.hasClass('used') ? true : false;
};


/**
 * Returns rendered template
 *
 * @param {String} template "This is a {{test}}."
 * @param {Object} replacements {test:"pass"}
 * @return {String}/{Boolean} "This is a pass."
 */
Game.prototype.renderTemplate = function (template, replacements) {

    var rendered = template;
    $.each(replacements, function (search, replace) {
        var regexp = new RegExp('{{'+search+'}}', 'ig');
        rendered = rendered.replace( regexp, replace );
    });
    return rendered;
};


/**
 * Returns amount of random array elements
 *
 * Randomization is done by using the Fisher-Yates shuffle algorithm
 * @link http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
 *
 * @this {Game}
 * @param {Object} containing array elements
 * @param {Number} amount of random array elements to be returned, defaults to 1
 * @return {Array}
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
 * @param {Object} array to be randomized
 * @return {Array} randomized
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