/**
 * Math Exercise Game, initialized with a value.
 *
 * Methods:
 *
 * Game.prototype.cacheDomElements()
 * Game.prototype.initialize()
 * Game.prototype.bindEvents()
 * Game.prototype.events()
 *
 * Game.prototype.newQuestionCycle()
 * Game.prototype.createNewAnswers()
 * Game.prototype.createNewQuestion()
 * Game.prototype.deselectAllAnswers()
 * Game.prototype.getAvailableAnswers()
 * Game.prototype.isAnswerMarkedAsUsed()
 * Game.prototype.isInvalidAnswer()
 * Game.prototype.isQuestionAnswered()
 * Game.prototype.markAnswersAsUsed()
 * Game.prototype.setupAnswerElements()
 *
 * Game.prototype.displayInvalidAnswer()
 * Game.prototype.displayQuestion()
 *
 * Game.prototype.isBrowserSupportingDOMStorage()
 * Game.prototype.loadGameState()
 * Game.prototype.saveGameState()
 * Game.prototype.getFromStorage()
 * Game.prototype.saveToStorage()
 * Game.prototype.deleteFromStorage()
 *
 * Game.prototype.getTemplate()
 * Game.prototype.renderTemplate()
 *
 * Game.prototype.getRandomArrayElements()
 * Game.prototype.shuffleArray()
 * Game.prototype.sumDataAttributes()
 *
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

    /**
     * Holds the current Game state
     *
     * @property {Object}
     */
    this.state = {
        storageKey: 'Mathionary-Add:',
        gameInProgress: false,
        answers: [],
        question: {
            template: 'Which numbers add up to: {{answer}}?.',
            text: '',
            answer: 0,
            answersNeeded: 0
        },
        user: {
            answer: 0,
            name: ''
        }
    };

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
 * @param {Number} amount, amount of elements to create
 */
Game.prototype.initialize = function (amount) {

    amount = amount || 64;

    var isStateLoaded = this.loadGameState(this.state.storageKey),
        createNewGame = false;

    if (isStateLoaded) {

        // Create new game if answers cannot be set.
        if (this.setupAnswerElements(this.state.answers)===true) {

            this.displayQuestion();
        } else {

            createNewGame = true;
        }

    } else  {

        createNewGame = true;
    }

    if (createNewGame) {

        this.createNewAnswers(amount);
        this.newQuestionCycle();
    }
    this.bindEvents();
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

            // Toggle answer selection
            var index = $this.data('index');

            var $selected = self.$answers.find('.selected');

            // Answer is calculated by summing all HTML5 data attribute values
            self.state.user.answer = self.sumDataAttributes($selected);

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

            self.saveGameState(self.state.storageKey);
        });
    }
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
    this.state.question = this.createNewQuestion($availableAnswers, '#questionTemplate');

    // Display new question
    this.displayQuestion();

    // Save Game State
    this.saveGameState(this.state.storageKey);

    return this.state.question;
};


/**
 * Populates $answer parent <ul/> with answer elements <li/>
 * Populates this.state.answers with answer objects
 *
 * @this {Game}
 * @param {Number} amount, optional default 64
 * @return {Object} $answers (wrapped in jQuery)
 */
Game.prototype.createNewAnswers = function (amount) {

    // Default 64 elements are created
    amount = amount || 64;

    // Clear all answers
    this.$answers.remove('li');
    this.state.answers = [];

    // Create {amount} answers with random value between 1-9
    // and append them to the parent element <ul/>
    for (var index=0; index<amount; index++) {

        var randomNumber = Math.floor( Math.random()*9 + 1 );

        // Add new answer to Game State,
        this.state.answers.push({
            answer: randomNumber,
            selected: false,
            used: false
        });

        // Append a new answer element to the DOM
        $('<li></li>', {text: randomNumber})
            // Attach HTML5 data attributes
            .data('index', index)
            .data('answer', randomNumber)
            // Append to parent element <ul/>
            .appendTo(this.$answers);
    }
    return this.$answers;
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
    $answerElements.each( function (index) {

        answer += $(this).data('answer');
    });

    // Question template stored in HTML element
    var template = this.getTemplate(templateSelector);

    var question = {
        answer: answer,
        text: this.renderTemplate(template, {answer: answer}),
        answersNeeded: $answerElements.length
    };
    return question;
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
 * Returns boolean if $answer is used.
 *
 * @param {Object} $answer, wrapped in jQuery
 * @return {Boolean} true if has class, otherwise false
 */
Game.prototype.isAnswerMarkedAsUsed = function ($answer) {

    return $answer.hasClass('used') ? true : false;
};


/**
 * Returns true when answer is invalid
 *
 * @this {Game}
 * @param {Object} $selected, answer elements wrapped in jQuery
 * @return {Boolean} returns true on invalid answer otherwise false
 */
Game.prototype.isInvalidAnswer = function ($selected) {

    var self = this,
        isInvalid = false;

    // Need to select at least two answers (except for last possible answer)
    $selected.each(function (key, element) {

        var $element = $(element);
        if ($element.length===1 && self.state.question.answersNeeded>1 &&
            $element.data('answer')===self.state.question.answer) {

            isInvalid = true;
        }
    });

    // Invalid answer when user has answer greater then question answer
    if (this.state.user.answer > this.state.question.answer) {
        isInvalid = true;
    }

    return isInvalid;
};


/**
 * Returns boolean if question is answered
 *
 * @this {Game}
 * @return {Boolean} true on answered, otherwise false.
 */
Game.prototype.isQuestionAnswered = function () {

    return (this.state.user.answer===this.state.question.answer) ? true : false;
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
 * Populates $answers <ul/> with answers
 *
 * @param  {Array} answers [{index:0, answer: 5, selected:true, used:false, ...},...]
 * @return {Boolean} true on success or false on failure
 */
Game.prototype.setupAnswerElements = function (answers) {

    var self = this;

    // Clear all answers
    this.$answers.remove('li');

    // Validate existence of answer properties
    var invalid = false,
        required = ['index', 'answer', 'selected', 'used'];
    $.each(answers, function (i, answer) {

        $.each(required, function (j, property) {

            if (!(property in answer)) {

                invalid = true;
            }
        });
    });

    if (invalid) {

        return false;
    }

    // Append answer elements to the DOM
    $.each(answers, function () {

        var $element = $('<li></li>', {text: this.answer})
            // Attach HTML5 data attributes
            .data('index', this.index)
            .data('answer', this.answer);

        if (this.selected===true) {

            $element.addClass('selected');
        }
        if (this.used===true) {

            $element.addClass('used');
        }
        // Append to parent element <ul/>
        $element.appendTo(self.$answers);
    });
    return true;
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
 * Displays the Question
 *
 * @this {Game}
 * @return {Object} Question element, wrapped in jQuery
 */
Game.prototype.displayQuestion = function () {

    return this.$game.find('.question').text(this.state.question.text);
};


/**
 * Returns Boolean if browser is supporting DOM Storage
 *
 * @param  {Object} Storage constructor function
 * @return {Boolean} supporting
 */
Game.prototype.isBrowserSupportingDOMStorage = function (Storage) {

    return typeof(Storage)!=='undefined' ? true : false;
};


/**
 * Loads Game State from Storage into {Game}.$answers
 *
 * @this {Game}
 * @param {String} prefix, for example 'Mathionary:gameState'
 * @return {Boolean} true on success, false on failure
 */
Game.prototype.loadGameState = function (prefix) {

    var self = this,
        savedState;

    // Merge stored content into this.state
    try  {
        savedState = $.parseJSON(localStorage[prefix]);
    }
    catch (error) {

        // Capture exception when JSON cannot be parsed
        return false;
    }
    $.extend(this.state, savedState);

    return true;
};


/**
 * Saves Current Game State to HTML5 localStorage
 *
 * @this {Game}
 * @param {String} prefix, for example 'Mathionary:gameState'
 * @return {Object} localStorage object
 */
Game.prototype.saveGameState = function (prefix) {

    // Create answes array containing all answers, used for converting to JSON
    var listItems = this.$answers.find('li');

    var answers = $.map(listItems, function (item, index) {

        var $item = $(item);
        return {
            'index': $item.data('index'),
            'answer': $item.data('answer'),
            'selected': $item.hasClass('selected'),
            'used': $item.hasClass('used')
        };
    });
    // Store answers in Game state
    this.state.answers = answers;
    return this.saveToStorage(prefix, this.state);
};


/**
 * Returns an object from Storage
 * and parses the JSON formatted string into an object
 *
 * @param  {String} key
 * @return {Object}
 */
Game.prototype.getFromStorage = function (key) {

    var obj = {};

    try {
        obj = $.parseJSON(localStorage[key]);
    }
    catch (error) {
        // Capture exception when JSON cannot be parsed
    }
    return obj;
};


/**
 * Saves an object to Storage as a JSON formatted string
 *
 * @param  {String} key, for example 'Mathionary:GameState'
 * @param  {Object} obj, object to store
 * @return {Object}
 */
Game.prototype.saveToStorage = function (key, obj) {

    return (localStorage[key] = JSON.stringify(obj));
};


/**
 * Deletes matching keys from Storage
 *
 * @param {String} matching keys to remove from Storage
 * @return {Object} localStorage object
 */
Game.prototype.deleteFromStorage = function (matchingKeys) {

    Object.keys(localStorage)
        .forEach( function (key) {

            // Remove all keys that match with matchingKeys
            var reg = new RegExp('^' + matchingKeys);
            if (reg.test(key)) {
                localStorage.removeItem(key);
            }
    });
    return localStorage;
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
