/**
 * Math Exercise Game, initialized with a value.
 *
 * Methods:
 *
 * Game.prototype.cacheDomElements()
 * Game.prototype.initialize()
 * Game.prototype.bindEvents()
 *
 * Game.prototype.events = {
 *     answerMouseenter()
 *     answerMouseleave()
 *     answerClick()
 * }
 *
 * Game.prototype.effects = {
 *     onInvalidAnswer()
 * }
 *
 * Game.prototype.newQuestionCycle()
 * Game.prototype.newLevelCycle()
 * Game.prototype.newAnswers()
 * Game.prototype.newQuestion()
 * Game.prototype.calculate()
 * Game.prototype.reset()
 *
 * Game.prototype.toggleSelected()
 * Game.prototype.resetAnswers()
 * Game.prototype.getAvailableAnswers()
 * Game.prototype.getSolutionsCompletingQuestion()
 * Game.prototype.isAnswerMarkedAsUsed()
 * Game.prototype.isInvalidAnswer()
 * Game.prototype.isQuestionAnswered()
 * Game.prototype.isLevelFinished()
 * Game.prototype.markAnswersAsUsed()
 * Game.prototype.addAnswerToOrder()
 *
 * Game.prototype.setupAnswerElements()
 *
 * Game.prototype.displayInvalidAnswer()
 * Game.prototype.displaySolution()
 * Game.prototype.displayCurrentLevel()
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
 *
 *
 * @param {Object} config.
 * @constructor
 *
 * Requires jQuery 2.0.0 or higher
 * Requires jRumble 1.3, https://github.com/jackrugile/jrumble
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
     * Holds the Question Statement and Text
     *
     * @property {Object}
     */
    this.$statement = null;

    /**
     * Holds the current Game state
     *
     * @property {Object}
     */
    this.state = {
        storageKey: 'Mathionary',
        operation: 'subtraction',  // addition, subtraction, multiplication, division
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
        },
        level: 1
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
    this.$statement = this.$game.find('div.statement');
    if (!this.$statement.length) {
        throw new Error("Game CacheDomElements: no statement element found, 'div.statement'");
    }
};


/**
 * Initialize Game
 *
 * @this  {Game}
 * @param {Number} amount, amount of elements to create
 */
Game.prototype.initialize = function (amount) {

    amount = amount || 64;

    this.bindEvents();

    var isGameStateLoaded = this.loadGameState(this.state.storageKey),
        createNewGame = true;

    this.displayCurrentLevel();

    // Resume Game?
    if (isGameStateLoaded===true) {

        // Setup answers from Game State
        if (this.setupAnswerElements(this.state.answers)===true) {

            createNewGame = false;

            if (this.isLevelFinished()===true) {

                this.newLevelCycle();
                return;

            } else  {

                this.displayQuestion();
                return;
            }

        }
    }

    // New Game
    this.reset();
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
    this.events.resetClick.call(this);
};


/**
 * Object events contains all event handlers.
 * Organized in one method, for maintainability
 *
 * Answers Event Delegation:
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
            $(this).removeClass('hover invalid-answer');
        });
    },

    // An answer element was clicked, check given answer
    answerClick: function () {

        var self = this; // Self refers to the Game object

        self.$answers.on('click', 'li', function () {

            var $this = $(this); // $this refers to the clicked answer element wrapped in jQuery

            // Ignoring clicked used elements
            if (self.isAnswerMarkedAsUsed.call(self, $this)) {

                return;
            }

            self.toggleSelected($this);
            var $selected = self.$answers.find('li.selected'),
                x = parseInt(self.$answers.find('[data-order="0"]').attr('data-answer'), 10),
                y = parseInt(self.$answers.find('[data-order="1"]').attr('data-answer'), 10);

            self.state.user.answer = null;
            if (!isNaN(x) && !isNaN(y)) {

                self.state.user.answer = self.calculate(self.state.operation, x ,y);
            } else if(!isNaN(x)) {

                self.state.user.answer = x;
            }

            // Create new question when answered correctly
            if (self.isQuestionAnswered()) {

                self.markAnswersAsUsed($selected);

                if (self.isLevelFinished()===true) {

                    self.newLevelCycle();
                    self.newQuestionCycle();

                } else  {

                    self.newQuestionCycle();
                }
                self.displayQuestion();

            // Validate selected answer
            } else if($selected.length>0) {

                var $solutions = self.getSolutionsCompletingQuestion($selected),
                    invalid    = self.isInvalidAnswer($selected, $solutions); //invalid is array containing numbers

                self.displayQuestion();

                if (invalid.length!==0) {

                    self.displayInvalidAnswer.call(self, $this); // self Game, $this element
                    self.displaySolution.call(self, $solutions); // self Game
                }
            // No answer selected.
            } else  {

                self.displayQuestion(); // Return Question statement to default style
            }

            // Store Game State
            self.saveGameState(self.state.storageKey);
        });
    },

    // A reset element was clicked, reset game
    resetClick: function () {

        var self = this; // Self refers to the Game object
        self.$game.find('.reset').on('click', function () {

            // This refers to reset element, wrapped in jQuery
            self.reset();
        });
    }
};


/**
 * Object effects contains all effects
 * Organized in one method, for maintainability
 */
Game.prototype.effects = {

    /**
     * Shakes <ul> (not tested)
     *
     * @this  {Game}
     * @param {Object} answer<li> element, wrapped in jQuery
     * @chainable
     */
    onInvalidAnswer: function ($answer) {

        var self   = this,
            $spans = this.$statement.find('span.number');

        // Initialize jRumble on <ul> and statement <spans>
        this.$answers.jrumble({x:1, y:1, rotation:0});
        $spans.jrumble({x:2, y:2, rotation:1});

        // Shake answers element <ul>
        this.$answers.trigger('startRumble'); // setTimeOut blocks code execution

        // Shake Statement element
        var $selected = this.$answers.find('li.selected'),
            index     = $selected.length>0 ? --$selected.length : 0;

        // Shake statement span at the same time
        $spans.eq(index).trigger('startRumble');
        setTimeout(function () {

            $answer.trigger('stopRumble');
            $spans.trigger('stopRumble');
        }, 250);

        $spans.eq(index).animate({backgroundColor: '#990000'}, 325, 'swing', function ()  {

            // After animation, return element to default style
            $spans.eq(index).removeAttr('style');
        });

        // Animate answer element <li> background color to red then to transparent
        return $answer.animate({backgroundColor: '#990000'}, 250)
            .animate({backgroundColor: 'transparent'}, 150, 'swing', function ()  {

                // After animation, return answer and statement to default
                self.resetAnswers($answer);
                self.displayQuestion();
                self.$answers.find('li.solution').removeClass('solution');
            });
    }
};


/**
 * Create a new Question object
 *
 * @this   {Game}
 * @param  {String} operation, math operation for question
 * @return {Object} new question object
 */
Game.prototype.newQuestionCycle = function (operation) {

    // Change math operation
    if (operation) {

        this.state.operation = operation;
    }

    // Clear all selected answer elements
    this.resetAnswers(this.$answers.find('li'));

    // Find answers not used already.
    var $availableAnswers = this.getAvailableAnswers();

    // Create question and answer
    var templateSelector = '.question-' + this.state.operation + '-template';

    this.state.question = this.newQuestion(this.state.operation, $availableAnswers, templateSelector);

    // Clear user answer
    this.state.user.answer = null;

    // Display new question
    this.displayQuestion();

    // Save Game State
    this.saveGameState(this.state.storageKey);

    return this.state.question;
};


/**
 * Returns boolean true when level is finished
 *
 * Level is finished when less then 2 answers are available
 * @return {Boolean}
 */
Game.prototype.isLevelFinished = function () {

    var $available = this.getAvailableAnswers(this.$answers);
    return $available.length<2 ? true : false;

};


/**
 * Starts a new level
 *
 * @this   {Game}
 * @return {Number} current level
 */
Game.prototype.newLevelCycle = function () {

    this.state.level++;
    this.newAnswers();
    this.displayCurrentLevel();
    return this.state.level;
};


/**
 * Populates $answer parent <ul/> with answer elements <li/>
 * Populates this.state.answers with answer objects
 *
 * @this   {Game}
 * @param  {Number} amount, optional default 64
 * @return {Object} $answers (wrapped in jQuery)
 */
Game.prototype.newAnswers = function (amount) {

    // Default 64 elements are created
    amount = amount || 64;

    // Clear all answers
    this.$answers.find('li').remove('li');
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
            .attr('data-index', index)
            .attr('data-answer', randomNumber)
            // Append to parent element <ul/>
            .appendTo(this.$answers);
    }
    return this.$answers;
};


/**
 * Creates a new Question and Answer
 *
 * @this   {Game}
 * @param  {String} operation: 'addition', 'subtraction', 'multiplication', 'division'
 * @param  {Object} $answers for creating a question, wrapped in jQuery
 * @param  {String} selector points to HTML element containing the template
 * @return {Object} question
 */
Game.prototype.newQuestion = function(operation, $answers, selector) {

    // Choose 2 random available answers using Fisher-Yates shuffle algorithm.
    var $elements = this.getRandomArrayElements($answers, 2),
        x         = parseInt($elements.eq(0).attr('data-answer'), 10),
        y         = parseInt($elements.eq(1).attr('data-answer'), 10),
        answer    = this.calculate(operation, x, y);

    // Return question object
    var question = {
        answer: answer,
        text: this.renderTemplate(this.getTemplate(selector), {answer: answer}),
        answersNeeded: $elements.length
    };
    return question;
};


/**
 * Returns answer for Math operation
 *
 * @this   {Game}
 * @param  {String} operation: 'addition', 'subtraction', 'multiplication', 'division'
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number} answer
 */
Game.prototype.calculate = function (operation, x, y)  {

    x = x || NaN;
    y = y || NaN;

    switch (operation) {

        case 'addition'         : return x += y;
        case 'subtraction'      : return x -= y;
        case 'multiplication'   : return x *= y;
        case 'division'         : return x /= y;
    }
    return x;
};


/**
 * Creates new answers and question
 * @param {String} operation, reset Game to operation
 * @this {Game}
 */
Game.prototype.reset = function (operation) {

    this.newAnswers();
    this.newQuestionCycle(operation);
};


/**
 * Toggle selection
 *
 * @param  {Object} $answer element wrapped in jQuery
 * @return {Object} Selected/Deselected $answer element
 * @chainable
 */
Game.prototype.toggleSelected = function ($answer) {

    if ($answer.toggleClass('selected').hasClass('selected')) {

        // Answer is selected. Add answer to last in order.
        this.addAnswerToOrder($answer);

    } else  {

        // Answer is not selected. Remove data-order attribute.
        $answer.removeAttr('data-order');
    }
    return $answer;
};


/**
 * Returns answer element <li> to default state
 *
 * @this   {Game}
 * @param  {Object} elements wrapped in jquery
 * @return {Object} $answers, answer elements, wrapped in jQuery
 */
Game.prototype.resetAnswers = function ($answers) {

    return $answers
        .removeAttr('style')
        .removeAttr('data-order')
        .removeClass('selected')
        .removeClass('solution');
};


/**
 * Returns all answer elements that do not have the 'used' class
 *
 * @this   {Game}
 * @return {Object} $answers answer elements, wrapped in jQuery
 * @chainable
 */
Game.prototype.getAvailableAnswers = function () {

    return this.$answers.find('li:not(.used)');
};


/**
 * Returns array containing <li> elements that solve the question
 *
 * @this   {Game}
 * @param  {Object} $answers parent element <ul> wrapped in jQuery
 * @return {Object} $solutions containing <li> elements answering question
 */
Game.prototype.getSolutionsCompletingQuestion = function ($selected) {

    var self       = this,
        x          = parseInt(this.$answers.find('li[data-order="0"]').attr('data-answer'), 10),
        $available = this.getAvailableAnswers(),
        $solutions = $([]);

     $solutions = $available.map(function () {

        var $this     = $(this), // refers to answer element <li>
            y         = parseInt($this.attr('data-answer'), 10),
            answer    = self.calculate(self.state.operation, x, y);

        if (answer===self.state.question.answer) {

            return this; // solution found.
        }
    });
    return $solutions;
};


/**
 * Returns boolean if $answer is used.
 *
 * @param  {Object} $answer, wrapped in jQuery
 * @return {Boolean} true if has class, otherwise false
 */
Game.prototype.isAnswerMarkedAsUsed = function ($answer) {

    return $answer.hasClass('used') ? true : false;
};


/**
 * Returns Array containing numbers, indicating invalid type.
 * An empty array indicates that answer is valid.
 *
 * @this   {Game}
 * @param  {Object} $selected, answer elements wrapped in jQuery
 * @param  {Object} $solutions, elements wrapped in jQuery
 * @return {Object} array containing numbers indicating invalid type.
 */
Game.prototype.isInvalidAnswer = function ($selected, $solutions) {

    $solutions    = $solutions || $([]);

    var self      = this,
        invalid   = [],
        operation = this.state.operation,
        question  = this.state.question,
        user      = this.state.user,
        x         = parseInt(this.$answers.find('li[data-order="0"]').attr('data-answer'), 10),
        y         = parseInt(this.$answers.find('li[data-order="1"]').attr('data-answer'), 10);

    // Current answer cannot complete question
    if ($selected.length>0 && $solutions.length===0) {

        invalid.push(1);
    }
    // Wrong answer. Required amount answers selected
    if ($selected.length>=question.answersNeeded && user.answer!==question.answer) {

        invalid.push(10);
    }
    // Addition: Cannot select answer greater then question
    if (operation==='addition' && user.answer > question.answer) {

        invalid.push(40);
    }
    // Subtraction: Cannot select answer smaller then question
    if (operation==='subtraction' && user.answer < question.answer) {

        invalid.push(50);
    }
    return invalid;
};


/**
 * Returns boolean if question is answered
 *
 * @this   {Game}
 * @return {Boolean} true on answered, otherwise false.
 */
Game.prototype.isQuestionAnswered = function () {

    if (this.$answers.find('li.selected').length < this.state.question.answersNeeded) {

        return false;
    }
    return (this.state.user.answer===this.state.question.answer) ? true : false;
};


/**
 * Marks $elements as used. Adds class 'used' to all elements
 *
 * @param  {Object} $elements, wrapped in jQuery
 * @return {Object} elements, wrapped in jQuery
 */
    Game.prototype.markAnswersAsUsed = function ($elements) {

        return $elements.removeClass('selected')
            .removeClass('solution')
            .addClass('used');
};


/**
 * Record sequence of answers selected
 *
 * All selected answers elements have an order data attribute.
 * <li data-order="0"> order is ascending, starting from 0.
 *
 * @param  {Object} $element wrapped in jQuery
 * @return {Object} $element wrapped in jQuery, containing data-order attribute
 * @chainable
 */
Game.prototype.addAnswerToOrder = function ($element) {

    var last     = -1, // contains last in order
        setOrder = 0;  // <li data-order="setOrder" />

    // Get last in order from this.$answers <li> elements
    this.$answers.find('li.selected').each(function (index, answer) {

        var order = parseInt($(answer).attr('data-order'), 10);
        if (!isNaN(order) && order>last) {

            last = order;
        }
    });
    // return last in order
    setOrder = (last===-1 ? 0 : ++last);
    return $element.attr('data-order', setOrder);
};



/**
 * Populates $answers <ul/> with answers
 *
 * @this   {Game}
 * @param  {Array} answers [{index:0, answer: 5, selected:true, used:false, ...},...]
 * @return {Boolean} true on success or false on failure
 */
Game.prototype.setupAnswerElements = function (answers) {

    var self = this;

    // Remove all answers from HTML
    this.$answers.remove('li');

    // Validate existence of answer properties
    var invalid = false,
        required = [
            'answer',
            'completes',
            'index',
            'order',
            'selected',
            'used'
        ];

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
            .attr('data-index', this.index)
            .attr('data-answer', this.answer);

        if (this.selected===true) {

            $element.addClass('selected');
        }
        if (this.completes===true) {

            $element.addClass('solution');
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
 * @this   {Game}
 * @param  {Object} $answer element, wrapped in jQuery
 * @return {Object} $answer element, wrapped in jQuery
 * @chainable
 */
Game.prototype.displayInvalidAnswer = function ($answer) {

    return this.effects.onInvalidAnswer.call(this, $answer);
};


/**
 * Display solution to question
 *
 * @this   {Game}
 * @param  {Object} $solutions elements, wrapped in jQuery
 * @return {Object} $solutions elements, wrapped in jQuery
 * @chainable
 */
Game.prototype.displaySolution = function ($solutions) {

    return $solutions.addClass('solution');
};


/**
 * Displays the current Game level
 *
 * @this   {Game}
 * @return {Object} level number element, wrapped in jQuery
 * @chainable
 */
Game.prototype.displayCurrentLevel = function () {

    return this.$game.find('.level .number')
        .text(this.state.level);
};


/**
 * Displays the Question
 *
 * @this   {Game}
 * @return {Object} Question element, wrapped in jQuery
 */
Game.prototype.displayQuestion = function () {

    // Clear previous question
    this.$statement.find('span').remove('span');

    var $answers   = this.$answers,
        operation  = this.state.operation,
        span       = '<span></span>',
        x, xString = '?',
        y, yString = '?',
        answer     = !isNaN(this.state.question.answer) ? this.state.question.answer : '?',
        operations = {
            addition       : '&plus;',
            subtraction    : '&minus;',
            multiplication : '&times;',
            division       : '&divide;'
        };

    if ($answers.find('li.selected')) {

        x = parseInt($answers.find('li[data-order="0"]').attr('data-answer'), 10),
        y = parseInt($answers.find('li[data-order="1"]').attr('data-answer'), 10);
        xString = isNaN(x) ? '?' : x.toString(),
        yString = isNaN(y) ? '?' : y.toString()
    }

    // Create elements and append to div.statement
    $(span, {class: 'number', text: xString}).appendTo(this.$statement);
    $(span, {class: operation, html: operations[operation]}).appendTo(this.$statement);
    $(span, {class: 'number', text: yString}).appendTo(this.$statement);
    $(span, {class: 'equal', text: '='}).appendTo(this.$statement);
    $(span, {class: 'answer', text: answer}).appendTo(this.$statement);

    // Remove operation class from body
    $("body[class$='-operation']").removeClass();

    // Set math operation classes
    $(document.body).addClass(operation + '-operation');
    this.$answers.attr('class', 'answers ' + operation);

    // Show Question Text and return question object
    return this.$game.find('div.question .question-text')
        .text(this.state.question.text);
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
 * @this   {Game}
 * @param  {String} prefix, for example 'Mathionary:gameState'
 * @return {Boolean} true on success, false on failure
 */
Game.prototype.loadGameState = function (prefix) {

    var self = this,
        savedState;

    // Merge stored content into this.state
    try  {
        savedState = $.parseJSON(localStorage.getItem(prefix));

    }
    catch (error) {

        // Capture exception when JSON cannot be parsed
        return false;
    }
    if (savedState===null) {
        return false;
    }
    $.extend(this.state, savedState);
    return true;
};


/**
 * Saves Current Game State to HTML5 localStorage
 *
 * @this   {Game}
 * @param  {String} prefix, for example 'Mathionary:gameState'
 * @return {Object} localStorage object
 */
Game.prototype.saveGameState = function (prefix) {

    // Create answes array containing all answers, used for converting to JSON
    var listItems = this.$answers.find('li');

    this.state.answers = $.map(listItems, function (item, index) {

        var $item = $(item);
        return {
            'index'     : $item.attr('data-index'),
            'answer'    : $item.attr('data-answer'),
            'selected'  : $item.hasClass('selected'),
            'completes' : $item.hasClass('solution'),
            'order'     : $item.attr('data-order'),
            'used'      : $item.hasClass('used')
        };
    });
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
        obj = $.parseJSON(localStorage.getItem(key));
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

    try {
        obj = localStorage.setItem(key, JSON.stringify(obj));
    }
    catch (error) {
        // Capture exception when localStorage is not available
    }
    return obj;
};


/**
 * Deletes matching keys from Storage
 *
 * @param  {key} matching key is removed from Storage
 * @return {Boolean} on success
 */
Game.prototype.deleteFromStorage = function (key) {

    if (localStorage===undefined) {
        return false;
    }
    localStorage.removeItem(key);
    return true;
};


/**
 * Retrieves template from HTML element
 *
 * @param  {String} selector HTML element containing template
 * @return {String} template
 */
Game.prototype.getTemplate = function (selector) {

    return $.trim( $(selector).html() );
};


/**
 * Returns rendered template
 *
 * @param  {String} template "This is a {{test}}."
 * @param  {Object} replacements {test:"pass"}
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
 * @this   {Game}
 * @param  {Object} containing array elements
 * @param  {Number} amount of random array elements to be returned, defaults to 1
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
 * @param  {Object} array to be randomized
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
