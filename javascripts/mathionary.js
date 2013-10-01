/**
 * Math Exercise Game, initialized with a value.
 *
 * Methods:
 *
 * Game.protod type.cacheDomElements()
 * Game.prototype.initialize()
 * Game.prototype.initOperation()
 * Game.prototype.initGauge()
 * Game.prototype.bindEvents()
 *
 * Game.prototype.events = {
 *     buttonMouseenter()
 *     buttonMouseleave()
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
 * Game.prototype.getSolutions()
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
 * Game.prototype.displaySolutions()
 * Game.prototype.displayLevelProgress()
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
 * Game.prototype.getRepeatingDecimalProperties()
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
        container: 'div.game',
        gauge: {
            id: 'gauge',
            value: 0,
            min: 0,
            max: 0,
            showMinMax: true,
            title: 'Level Progress',
            titleFontColor: '#fff',
            label: 'level',
            levelColors: ['rgba(255,255,255,.8)'],
            gaugeColor: 'rgba(255,255,255,.1)',
            levelColorsGradient: true,
            valueFontColor: '#fff',
            gaugeWidthScale: 1,
            shadowOpacity: 0.5,
            shadowSize: 5,
            shadowVerticalOffset: 5,
            // Math operation override config
            operations: {
                addition: {
                    levelColors: ['#1DC91D'],
                    gaugeColor: '#115f11'
                },
                subtraction: {
                    levelColors: ['#c43'],
                    gaugeColor: '#622018'
                },
                multiplication: {
                    levelColors: ['#4D97E0'],
                    gaugeColor: '#073b72'
                },
                division: {
                    levelColors: ['#E99B0F'],
                    gaugeColor: '#694405'
                },
            }
        }
    };
    $.extend(this.config, config);

    /**
     * Cached answers elements, wrapped in jQuery
     *
     * @type {Object}
     */
    this.$answers = null;

    /**
     * Cached button elements, wrapped in jQuery
     *
     * @type {Object}
     */
    this.$buttons = null;

    /**
     * Level progress gauge
     *
     * @type {Object}
     */
    this.gauge = null;

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
            answer: null,
            answersNeeded: 0
        },
        user: {
            answer: null,
            name: 'Unknown'
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

        throw new Error("Game CacheDomElements: no html game elements found, 'div.game'");
    }
    this.$answers = this.$game.find('.answers').first();
    if (!this.$answers.length) {

        throw new Error("Game CacheDomElements: no html unordered' list element found, 'ul'");
    }
    this.$statement = this.$game.find('div.statement');
    if (!this.$statement.length) {

        throw new Error("Game CacheDomElements: no statement element found, 'div.statement'");
    }
    this.$buttons = $('.buttons');
    if (!this.$buttons.length) {

        throw new Error("Game CacheDomElements: no html button elements found, 'div.game'");
    }
};


/**
 * Initialize Game
 *
 * @this  {Game}
 */
Game.prototype.initialize = function () {

    this.bindEvents();

    var isGameStateLoaded = this.loadGameState(this.state.storageKey);

    // New Game
    if (isGameStateLoaded===false) {

        this.reset();
        return;
    }

    // Resume Game. Setup answers
    if (this.setupAnswerElements(this.state.answers)===true) {

        if (this.isLevelFinished()===true) {

            this.newLevelCycle();

        } else  {

            this.displayQuestion();
        }
        this.initOperation();
        this.initGauge({max: 10});
        this.displayLevelProgress();
    } else  {

        this.reset();
        return;
    }
};


/**
 * Initializes a Math operation
 *
 * @this   {Game}
 * @param  {String} operation
 */
Game.prototype.initOperation = function (operation) {

    if (operation) {
        this.state.operation = operation;
    }

    // Remove all operation classes from body
    $("body[class$='-operation']").removeClass();
    $(document.body).addClass(this.state.operation + '-operation');

    // Set classes on answers parent element <ul>
    this.$answers.attr('class', 'buttons answers ' + this.state.operation);

    // Set active/inactive classes for current operation
    var $operations = $('.operations');
        $operations.find('li:not(.' + this.state.operation + ')')
            .removeClass('active')
            .addClass('inactive');
    $operations.find('li.' + this.state.operation)
        .addClass('active')
        .removeClass('inactive');
};


/**
 * Initialize Gauge
 *
 * @this   {Game}
 * @param  {Object} config custom gauge configuration
 */
Game.prototype.initGauge = function (config) {

    // Override default config
    config = config || {};
    $.extend(this.config.gauge, config);

    // Override config with math operation specific config
    if ('gauge' in this.config && 'operations' in this.config.gauge) {

        var operations = this.config.gauge.operations;
        if (operations[this.state.operation]!==undefined) {

            $.extend(this.config.gauge, operations[this.state.operation]);
        }
    }

    var $progress = $('#progress'),
        $gauge    = $('#' + this.config.gauge.id);

    // Garbage collection: remove reference to canvas element
    if ((typeof this.gauge==='Object') && ('canvas' in this.gauge)) {

        this.gauge.canvas = null;
    }
    $progress.find('div#gauge').remove();

    // Init & display new gauge
    $('<div></div>', {id: 'gauge'}).appendTo($progress);
    this.gauge = new JustGage(this.config.gauge);
    this.displayLevelProgress();
};


/**
 * Method for binding all event handlers.
 * Organized in one method, for maintainability
 *
 * @this {Game}
 */
Game.prototype.bindEvents = function () {

    this.events.buttonMouseenter.call(this);
    this.events.buttonMouseleave.call(this);
    this.events.answerClick.call(this);
    this.events.switchOperationClick.call(this);
    this.events.displaySolutionsClick.call(this);
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
    buttonMouseenter: function () {

        var self = this; // Self refers to the Game object

        self.$buttons.on('mouseenter', 'li', function () {

            // This refers to answer element, wrapped in jQuery
            $(this).addClass('hover');
        });
    },
    buttonMouseleave: function() {

        var self = this; // Self refers to the Game object

        self.$buttons.on('mouseleave', 'li', function () {

            // This refers to answer element, wrapped in jQuery
            $(this).removeClass('hover invalid-answer');
        });
    },

    // An answer element was clicked, check given answer
    answerClick: function () {

        var self = this; // Self refers to the Game object

        self.$answers.on('click', 'li.number', function () {

            var $this = $(this); // $this refers to the clicked answer element wrapped in jQuery

            // Ignoring clicked used elements
            if (self.isAnswerMarkedAsUsed.call(self, $this)) {

                return;
            }

            // Game state is saved before toggle selection
            self.saveGameState(self.state.storageKey);

            self.toggleSelected($this);
            var $selected = self.$answers.find('li.selected'),
                x = parseInt(self.$answers.find('[data-order="0"]').attr('data-answer'), 10),
                y = parseInt(self.$answers.find('[data-order="1"]').attr('data-answer'), 10);

            self.state.user.answer = null;

            if (!isNaN(x) && !isNaN(y)) {

                self.state.user.answer = self.calculate(self.state.operation, x, y);
            } else if(!isNaN(x)) {

                self.state.user.answer = x;
            }

            // Create new question when answered correctly
            if (self.isQuestionAnswered()) {

                self.effects.onCorrectAnswer();
                self.markAnswersAsUsed($selected);

                if (self.isLevelFinished()===true) {

                    self.newLevelCycle();
                }

                // Wait for CSS3 animation
                setTimeout(function () {

                    self.newQuestionCycle();
                    self.displayQuestion();
                }, 300);

            // Validate selected answer
            } else if($selected.length>0) {

                var solutions = self.getSolutions(),
                    invalid   = self.isInvalidAnswer($selected, solutions); // array containing numbers

                self.displayQuestion();

                if (invalid.length!==0) {

                    self.displayInvalidAnswer.call(self, $this); // self Game, $this element
                }
            // No answer selected.
            } else  {

                self.displayQuestion(); // Return Question statement to default style
            }

            self.displayLevelProgress();
        });
    },

    // Switch math operation
    switchOperationClick: function () {

        var self = this; // Self refers to the Game object
        $('.operations').on('click', 'li', function () {

            var $this     = $(this),
                operation = $this.attr('data-operation');
            if (typeof operation!=='string') {

                return false;
            }
            self.newQuestionCycle(operation);
            self.initOperation(operation);
            self.initGauge();
            self.displayQuestion();
        });
    },

    // Solutions
    displaySolutionsClick: function () {

        var self = this; // Self refers to the Game object
        $('.display-solutions').on('click', function () {

            self.displaySolutions();
        });
    }
};


/**
 * Object effects contains all effects
 * Organized in one method, for maintainability
 */
Game.prototype.effects = {

    /**
     * Shows invalid answer
     *
     * @this  {Game}
     * @param {Object} $answer <li> element, wrapped in jQuery
     * @chainable
     */
    onInvalidAnswer: function ($answer) {

        var self   = this,
            $spans = this.$statement.find('span.number');

        // Shake Statement element
        var $selected = this.$answers.find('li.selected'),
            index     = $selected.length>0 ? --$selected.length : 0;

        $spans.eq(index).addClass('invalid');
        $answer.removeClass('selected').addClass('invalid');

        setTimeout(function () {

            $spans.eq(index).removeAttr('style');

            self.resetAnswers($answer);
            self.displayQuestion();
            self.$answers.find('li.solution').removeClass('solution');
            self.$answers.find('li').removeClass('invalid');

        }, 600);
        return $answer;
    },


    /**
     * Fade current Statement out and slide in new question
     *
     * @this  {Game}
     * @chainable
     */
    onCorrectAnswer: function () {

        var self = this;

        $('.question').fadeTo(300, 0, function () {

            $(this).css({
                position: 'relative',
                top: '200px'
            }).animate({top:'0px',opacity: 1}, 600);
        });
    }
};


/**
 * Create a new Question Object
 *
 * @this   {Game}
 * @param  {String} operation, set math operation for question
 * @return {Object} new question object
 */
Game.prototype.newQuestionCycle = function (operation) {

    // Change math operation
    if (operation) {

        this.state.operation = operation;
    }

    this.initOperation();
    this.resetAnswers(this.$answers.find('li.number'));

    var $availableAnswers = this.getAvailableAnswers();

    // Create new question
    var templateSelector   = '.question-' + this.state.operation + '-template';
    this.state.question    = this.newQuestion(this.state.operation, $availableAnswers, templateSelector);
    this.state.user.answer = null;
    this.displayQuestion();
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

    var $available = this.getAvailableAnswers();
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
    return this.state.level;
};


/**
 * Populates $answer parent <ul/> with answer elements <li/>
 * Populates this.state.answers with answer objects
 *
 * @this   {Game}
 * @return {Object} $answers (wrapped in jQuery)
 */
Game.prototype.newAnswers = function () {

    var self    = this,
        answers = [7,8,9,4,5,6,1,2,3,0],
        $button = this.$answers.find('.display-solutions');

    // Clear all answers
    this.$answers.find('.number').remove();
    this.state.answers = [];

    // Append answers to the parent element <ul/>
    $(answers).each(function (index, answer) {

        // Add new answer to Game State,
        self.state.answers.push({
            answer: index, // must be answer, write test first
            selected: false,
            used: false
        });

        // Append a new answer element to the DOM
        $('<li></li>', {text: answer, class: 'number'})
            // Attach HTML5 data attributes
            .attr('data-index', index)
            .attr('data-answer', answer)

            // Insert elements before <li class="display-solutions"/>
            .insertBefore($button);
    });
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
    var $elements;
    do {
        $elements = this.getRandomArrayElements($answers, 2);
    } while (operation=='division' && parseInt($elements.eq(1).attr('data-answer'), 10)===0);

    var x         = parseInt($elements.eq(0).attr('data-answer'), 10),
        y         = parseInt($elements.eq(1).attr('data-answer'), 10),
        answer    = this.calculate(operation, x, y),
        question  = {
            answer: answer,
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

    if (operation==='division' && y===0) {

        return undefined;
    }

    switch (operation) {

        case 'addition'         : return x += y;
        case 'subtraction'      : return x -= y;
        case 'multiplication'   : return x *= y;
        case 'division'         : return x /= y;
    }
};


/**
 * Creates new answers and question
 *
 * @this  {Game}
 * @param {String} operation, reset Game to operation
 */
Game.prototype.reset = function (operation) {

    this.newAnswers(10);
    this.newQuestionCycle(operation);
    this.initGauge({
        min: 0,
        value: 0,
        max: this.$answers.find('li.number').length
    });
    this.displayLevelProgress();
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

   return this.$answers.find('li.number:not(.used)');
};


/**
 * Returns array containing <li> elements that solve the question
 *
 * First index contains x, second index contains y.
 * X contains always the highest number (x*y)=(6*2)
 *
 * @this   {Game}
 * @param  {Object}
 * @return {Array} containing array with <li> elements.
 */
Game.prototype.getSolutions = function () {

    var self        = this,
        operation   = this.state.operation,
        $available  = this.getAvailableAnswers(),
        hasSelected = this.$answers.find('li.selected').length>0 ? true : false,
        $current,
        answer,
        distinct    = [],
        solutions   = [],
        tmp,
        unique      = true,
        x, $x,
        y, $y;

    if ($available.length===0) {
        return [];
    }

    // Find solutions
    $available.each(function (i) {

        $x = $(this);
        x  = parseInt($x.attr('data-answer'), 10);

        if (hasSelected===true && $x.hasClass('selected')===false) {

            return true; // continue to next iteration
        }

        for (var j=0; j<$available.length; j++) {

            // Answer can be only used one time
            if (i===j) {

                continue;
            }

            $y     = $available.eq(j),
            y      = parseInt($y.attr('data-answer'), 10),
            answer = self.calculate(self.state.operation, x, y);

            if (answer===self.state.question.answer) {

                solutions.push([$x.get(0), $y.get(0)]);
            }
        }
    });

    // Filter out duplicate solutions
    for (var i=solutions.length-1; i>=0; i--) { // loop backwards, because of splice

        $current = $(solutions[i]);
        x = parseInt($current.eq(0).attr('data-answer'), 10);
        y = parseInt($current.eq(1).attr('data-answer'), 10);

        // Order x,y descending
        if (y>x) {

           tmp = x; x = y; y = tmp;
        }

        $.each(distinct, function () {

            if (this[0]===x && this[1]===y) {
                unique = false;
                return;
            }
        });

        if (unique) {

            distinct.push([x,y]);
        } else {

            solutions.splice(i, 1);
        }
    }

    if (operation!=='subtraction' && operation!=='division') {

        // Sort solutions combinations by x descending, y
        for (var i=0; i<solutions.length; i++) {

            solutions[i].sort(function (a, b) {

                var $a = $(a),
                    $b = $(b);

                if ($a.hasClass('selected')) {
                    return -1;
                }

                if ($b.hasClass('selected')) {
                    return -1;
                }

                a = parseInt($a.attr('data-answer'), 10);
                b = parseInt($b.attr('data-answer'), 10);
                return b-a;
            });
        };
    }

    // Sort again all solutions by x descending
    solutions.sort(function (a,b) {

        a = parseInt($(a[0]).attr('data-answer'), 10);
        b = parseInt($(b[0]).attr('data-answer'), 10);
        return b-a;
    });

    return solutions
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
 * @param  {Object} solutions, elements wrapped in jQuery
 * @return {Object} array containing numbers indicating invalid type.
 */
Game.prototype.isInvalidAnswer = function ($selected, solutions) {

    solutions    = solutions || $([]);

    var self      = this,
        invalid   = [],
        operation = this.state.operation,
        question  = this.state.question,
        user      = this.state.user,
        x         = parseInt(this.$answers.find('li[data-order="0"]').attr('data-answer'), 10),
        y         = parseInt(this.$answers.find('li[data-order="1"]').attr('data-answer'), 10);

    // Current answer cannot complete question
    if ($selected.length>0 && solutions.length===0) {

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
 * Answers are truncated to 10
 *
 * @this   {Game}
 * @param  {Array} answers [{index:0, answer: 5, selected:true, used:false, ...},...]
 * @return {Boolean} true on success or false on failure
 */
Game.prototype.setupAnswerElements = function (answers) {

    var self    = this,
        $button = this.$answers.find('.display-solutions'),
        $element;

    // Remove all answers from HTML
    this.$answers.remove('li');

    answers = answers.slice(0,10);

    // Validate existence of answer properties
    var invalid = false,
        required = [
            'answer',
            'completes',
            'index',
            // 'order', // not required
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

        $element = $('<li></li>', {text: this.answer, class:'number'})
            // Attach HTML5 data attributes
            .attr('data-index', this.index)
            .attr('data-answer', this.answer)
            .attr('data-order', this.order);

        if (this.selected===true) {

            $element.addClass('selected');
        }
        if (this.completes===true) {

            $element.addClass('solution');
        }
        if (this.used===true) {

            $element.addClass('used');
        }
        // Insert elements before <li class="display-solutions"/>
        $element.insertBefore($button);
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
 * Display solutions to question
 *
 * @this   {Game}
 * @param  {Number} timing in milliseconds
 * @chainable
 */
Game.prototype.displaySolutions = function (timing) {

    timing = typeof timing !== 'undefined' ? timing : 1000;

    var self      = this,
        $answers  = this.$answers.find('li'),
        $button   = this.$answers.find('li.display-solutions'),
        $x        = this.$statement.find('.x'),
        $y        = this.$statement.find('.y'),
        solutions = this.getSolutions();

    // Active class on <li class="display-solution"/>
    $button.addClass('active');

    // Shows each solution in sequence
    $.each(solutions, function (index, solution) {

        var $solution = $(solution);
        $answers.removeClass('solution');

        if ($solution.eq(0).hasClass('selected')===true) {

            // skip x, show solution y
            setTimeout( function () {

                $solution.eq(1).addClass('solution');
                $y.text($solution.eq(1).text());
            }, index * timing);

        } else {

            // solution x
            setTimeout( function () {

                $solution.eq(0).addClass('solution');
                $x.text($solution.eq(0).text());
            }, index * timing);

            // solution y
            setTimeout( function () {

                $solution.eq(1).addClass('solution');
                $y.text($solution.eq(1).text());
            }, index * timing + 0.5 * timing);
        }

        // cleanup after display sequence
        setTimeout( function () {

            $button.removeClass('active');
            $answers.removeClass('solution');
            if (self.$answers.find('.selected').length===0) {

                $x.text('?');
            }
            $y.text('?');

        }, (index + 1) * timing);
    });

    return solutions;
};


/**
 * Shows current level progress
 *
 * @this {Game}
 */
Game.prototype.displayLevelProgress = function () {

    var used  = this.$answers.find('li.used').length,
        total = this.$answers.find('li').length;

    this.gauge.refresh(used, this.state.level, true);
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

    var $answers     = this.$answers,
        operation    = this.state.operation,
        $span        = null,
        span         = '<span></span>',
        x, xString   = '?', xClasses,
        y, yString   = '?', yClasses,
        answer       = !isNaN(this.state.question.answer) ? this.state.question.answer : '?',
        $answer      = null,
        $question    = this.$game.find('div.question'),
        questionText = '',
        selector     = '.question-' + operation + '-template',
        operations   = {
            addition       : '&plus;',
            subtraction    : '&minus;',
            multiplication : '&times;',
            division       : '&divide;'
        };

    if ($answers.find('li.selected').length>0) {

        x = parseInt($answers.find('li[data-order="0"]').attr('data-answer'), 10);
        y = parseInt($answers.find('li[data-order="1"]').attr('data-answer'), 10);
        xString = isNaN(x) ? '?' : x.toString();
        yString = isNaN(y) ? '?' : y.toString();
    }
    xClasses = xString==='?' ? 'number x' : 'number x active';
    yClasses = yString==='?' ? 'number y' : 'number y active';

    // X
    $span = $(span, {class: xClasses}).appendTo(this.$statement);
    $(span, {text: xString}).appendTo($span);

    // Operation
    $(span, {class: 'operation '+operation, html: operations[operation]}).appendTo(this.$statement);

    // Y
    $span = $(span, {class: yClasses}).appendTo(this.$statement);
    $(span, {text: yString}).appendTo($span);

    // =
    $(span, {class: 'equal', text: '='}).appendTo(this.$statement);

    // Answer
    $span = $(span, {class: 'number answer'}).appendTo(this.$statement);

    // Answer: group repeating decimals with a Vinculus overbar.
    var setClass  = '',
        setAnswer = this.state.question.answer,
        props;
    if (this.state.question.answer%1!==0 && (props = this.getRepeatingDecimalProperties(this.state.question.answer)).length>0) {

        setAnswer = props[0] + '.' + props[1];
        $(span, {text: setAnswer}).appendTo($span);

        // Repeating decimal found, set vinculus class: <span class="number answer"><span>0.<span class="vinculus">18</span></span></span>
        if (props[2]!=='') {

            // 1/3 = 0.33... show double repeating decimal for making question clear to user, No test written.
            answer    = props[1]!=='' ? (setAnswer + props[2]) : (setAnswer + props[2] + props[2]);
            answer    += '...';
            setAnswer = props[2]; // show repeating decimal
            setClass  = 'vinculus';
        }
    }

    $(span, {class: setClass, text: setAnswer}).appendTo($span);

    // Question template
    questionText = this.renderTemplate(this.getTemplate(selector), {answer: answer});
    $question.find('.question-text').text(questionText);

    return $question;
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
    if (savedState===null) { return false; }
    $.extend(this.state, savedState);

    if (this.state.question.answer===null) { return false; }
    if (this.state.answers.length===0) { return false; }
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
    var listItems = this.$answers.find('li.number');

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
 * Returns array containing properties of decimal fraction.
 *
 * @example Game.prototype.getRepeatProps(0 . 5384 615384 615384 ) equals to array ['0', '5384', '615384'].
 *          Where ['Integer digits', 'Terminating fractional digits', 'Repeating fractional digit']
 *
 * Note: The last digit might be removed to avoid rounding errors.
 *
 * @method Game.prototype.getRepeatProps
 * @param  {Number} val
 * @return {Array} [String, String, String] (must return strings because of zeros in pattern)
 * @link https://github.com/LarryBattle/Ratio.js
 */
Game.prototype.getRepeatingDecimalProperties = function (val) {

    val = String(val || "");

    var repeatingDecimals = /[^\.]+\.\d*(\d{2,})+(?:\1)$/,
        repeatingNumbers  = /^(\d+)(?:\1)$/,
        arr               = [],
        match             = repeatingDecimals.exec(val),
        RE2_RE1AtEnd,
        RE3_RepeatingNums = repeatingNumbers;

    if (!match) {

        val = val.replace(/\d$/, "");
        match = repeatingDecimals.exec(val);
    }
    if (match && 1 < match.length && /\.\d{10}/.test(match[0])) {

        match[1]     = RE3_RepeatingNums.test(match[1]) ? RE3_RepeatingNums.exec(match[1])[1] : match[1];
        RE2_RE1AtEnd = new RegExp("(" + match[1] + ")+$");
        arr          = val.split(/\./).concat(match[1]);
        arr[1]       = arr[1].replace(RE2_RE1AtEnd, "");
    }
    return arr;
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
