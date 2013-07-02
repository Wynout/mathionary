/**
 * Automating JavaScript Testing with QUnit
 * @link http://qunitjs.com/
 * @link http://msdn.microsoft.com/en-us/magazine/gg749824.aspx
 */


/**
 * Game.prototype.cacheDomElements
 */
module('Game.prototype.cacheDomElements()', {

    // Setup callback runs before each test
    setup: function () {

        this.Game = $.extend({
            config: {
                container: '#qunit-fixture div.game'
            },
            $game: null
        }, Game.prototype);
    }
});
test('Test throw Errors', 3, function () {

    jQuery('<div class="game"></div>').appendTo('#qunit-fixture');

    // Game element not found
    raises(function () {
        this.Game.cacheDomElements.call(this.Game);
    }, Error, 'Must throw error when $game <div> element not found.');


    // Answers parent element <ul> not found
    raises(function () {
        this.Game.cacheDomElements.call(this.Game);
    }, Error, 'Must throw error when $answers parent <ul> element not found.');


    // Statement element <div> not found
    raises(function () {
        this.Game.cacheDomElements.call(this.Game);
    }, Error, 'Must throw error when $statement element not found.');
});
test('Test if DOM elements are being cached', 3, function () {

    jQuery('<div class="game"><div class="statement"></div><ul></ul></div>').appendTo('#qunit-fixture');

    this.Game.cacheDomElements.call(this.Game);

    strictEqual(this.Game.$game.length, 1, 'Game.$game.length equals to 1.');
    strictEqual(this.Game.$answers.length, 1, 'Game.$answers.length equals to 1.');
    strictEqual(this.Game.$statement.length, 1, 'Game.$statement.length equals to 1.');
});



/**
 * Game.prototype.initialize
 */
module('Game.prototype.initialize(): Test initialize answers', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script class="question-addition-template" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<div class="question">' +
                '<div class="statement"></div>' +
                '<div class="question-text"><!--Question text appended here?--></div>' +
            '</div>' +
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'should-not-exists',
            gameInProgress: false,
            answers: [],
            question: {
                template: 'Which numbers add up to: {{answer}}?',
                text: 'Which numbers add up to: answer?',
                answer: 0,
                answersNeeded: 0
            },
            user: {
                answer: 0
            }
        };

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: testState

        }, Game.prototype);

        localStorage.removeItem('should-not-exists');

        this.Game.initialize.call(this.Game, 64);
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('should-not-exists');
    }
});
test('Test answer elements', 7, function () {

    var gameState = this.Game.state;
    var $answers = this.Game.$answers.find('li');

    // DOM elements created?
    strictEqual($answers.length, 64, 'Game.$answers contains 64 answer elements.');

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var events = $._data( $(this.Game.$answers).get(0), 'events');
    var count = 0;
    $.each(events, function (e) {
        count++;
    });
    strictEqual(count, 3, 'Answer element has 3 events.');

    // Test if question is created (question is random)
    strictEqual(typeof gameState.question.answer, 'number', 'typeof Game.state.question.answer equals to "number".');
    strictEqual(typeof gameState.question.text, 'string', 'typeof Game.state.question.text equals to "string".');
    strictEqual(gameState.question.answersNeeded, 2, 'Game.state.question.answersNeeded equals to 2.');
    strictEqual(gameState.question.text==='', false, 'Game.state.question.text is not an empty string.');

    // Test if array gameState.answers contains answer objects
    strictEqual(gameState.answers.length, 64, 'Game.state.answers.length equals to 64.');
});

module('Game.prototype.initialize(): Test loadGameState', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script class="questionTemplate" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'test-load-game-state',
            gameInProgress: true,
            answers: [
                {index: 0, answer: 3, selected: true, used: false },
                {index: 1, answer: 2, selected: true, used: false }
            ],
            question: {
                template: 'Which numbers add up to: {{answer}}?.',
                text: 'Which numbers add up to: 5?.',
                answer: 5,
                answersNeeded: 2
            },
            user: {
                answer: 5
            }
        };

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: testState
        }, Game.prototype);

        this.testString = JSON.stringify(testState);
        // Setup test string in Storage
        localStorage.setItem('test-load-game-state', this.testString); // JSON

        this.Game.initialize.call(this.Game);
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test storageKey must be unset after testing
        localStorage.removeItem('test-load-game-state');
    }
});
test('Test loading Game State from Storage', 5, function () {

    strictEqual(this.Game.state.answers.length, 2, 'Game.state.answers.length equals to 2.');

    var $answers = this.Game.$answers.find('li');
    strictEqual($answers.eq(0).data('index'), 0, 'First answer attribute data-index equals to 0');
    strictEqual($answers.eq(0).data('answer'), 3, 'First answer attribute data-answer equals to 3.');
    strictEqual($answers.eq(0).hasClass('selected'), true, 'First answer has class "selected."');
    strictEqual($answers.eq(0).hasClass('used'), false, 'First answer does not have class "selected."');
});


/**
 * Game.prototype.bindEvents
 *
 * Event Delegation: one event listener is attached to the $answers <ul> element.
 */
module('Game.prototype.bindEvents', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);

        // Bind all Events
        this.Game.bindEvents.call(this.Game);
    }
});
test('Test bindEvents', 3, function () {

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var events = $._data( $(this.Game.$answers).get(0), 'events' );

    strictEqual(typeof events.mouseover, 'object', 'Answer element has a mouseover event.');
    strictEqual(typeof events.mouseout, 'object', 'Answer element has a mouseout event.');
    strictEqual(typeof events.click, 'object', 'Answer element has a click event.');
});



/**
 * Game.prototype.events
 */
module('Game.prototype.events', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script id="question-addition-template" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<div class="question">'+
                '<div class="statement"></div>'+
                '<div class="question-text"></div>'+
            '</div>'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.testState = {
            storageKey: 'test',
            gameInProgress: true,
            question: {
                answer: 5,
                template: 'Which numbers add up to: {{answer}}?.',
                text: 'Which numbers add up to: 5?.',
                answerNeeded: 2
            },
            answers: [
                {answer: 2, selected: false, used: false},
                {answer: 3, selected: false, used: false}
                ],
            user: {
                answer: 2
            }
        };

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('div.statement'),
            state: this.testState
        }, Game.prototype);

        // Bind all Events
        this.Game.bindEvents.call(this.Game);
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test');
    }
});
test('answerMouseenter', 1, function () {

    // Test mouseleave event on <li /> element
    jQuery('<li data-answer="1">1</li>').appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').first()
        .trigger('mouseenter');

    strictEqual($answer.hasClass('hover'), true, 'Answer element gets class "hover" on mouseenter.');
});
test('answerMouseleave', 2, function () {

    // Test mouseleave event on <li /> element
    jQuery('<li class="hover invalid-answer" data-answer="1">1</li>').appendTo(this.Game.$answers);
    var $answer = this.Game.$answers.find('li').first()
        .addClass('hover')
        .trigger('mouseleave');

    strictEqual($answer.hasClass('hover'), false, 'Class "hover" is removed from answer element on mouseleave.');
    strictEqual($answer.hasClass('invalid-answer'), false, 'Class "invalid-answer" is removed from answer element on mouseleave.');
});
test('answerClick: Test toggle answer selection', 2, function () {

    // Test mouse click event on <li /> element
    jQuery('<li data-answer="1">1</li>')
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').first()
        .trigger('click');

    // Test if answer can be selected
    strictEqual($answer.hasClass('selected'), true, 'Answer element gets class "selected" on click.');

    $answer = this.Game.$answers.find('li').first()
        .trigger('click');

    // Test if answer can be deselected
    strictEqual($answer.hasClass('selected'), false, 'Class "selected" is removed from answer element on click.');
});
test('answerClick: Test property Game.state.user.answer', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="2">2</li>'+
    '<li data-answer="3">3</li>'+
    '<li data-answer="5">5</li>') // trigger click
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').last()
        .trigger('click');

    // Test if user.answer is correct
    strictEqual(this.Game.state.user.answer, 5, 'Game.state.user.answer equals to 5.');
});
test('answerClick: Test if used answers cannot be selected', 1, function () {

    // Test mouse click event on <li /> element
    jQuery('<li class="used" data-answer="1">1</li>')
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li')
        .trigger('click');

    // Cannot select used answers. Used answers must be ignored.
    strictEqual($answer.hasClass('selected'), false, 'Answer elements with class "used" cannot get class "selected" on click.');
});
test('answerClick: Test invalid moves', 2, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="6">6</li>'+
    '<li data-answer="7">6</li>')
        .appendTo(this.Game.$answers);

    this.Game.state = {
        storageKey: 'test',
        question: {
            answer: 0
        },
        user: {
            answer: 0
        }
    };

    // Test invalid answer: cannot select answer directly
    $answer = this.Game.$answers.find('li').first()
        .trigger('click');
    strictEqual($answer.hasClass('invalid-answer'), true, 'Invalid move: Cannot select answer directly. Answer element gets class "invalid-answer".');

    // Test invalid answer: cannot select answer higher question.answer
    var $answer = this.Game.$answers.find('li').last()
        .trigger('click');
    strictEqual($answer.hasClass('invalid-answer'), true, 'Invalid move: Cannot select answer higher question.answer. Answer element gets class "invalid-answer".');
});
test('answerClick: Test if answer is correct', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="1">1</li>'+
    '<li class="selected" data-answer="2">2</li>'+
    '<li data-answer="3">3</li>'+ // trigger click, 5 is the answer
    '<li data-answer="4">4</li>')
        .appendTo(this.Game.$answers);

    // Test if correct answer receives class "used"
    var $answer = this.Game.$answers.find('li').eq(2) // contains the answer 3
        .trigger('click');
    strictEqual($answer.hasClass('used'), true, 'Correct answer gets class "used" on click.');
});
test('answerClick: Test if Game state is saved', 1, function () {

     jQuery('<li data-index="0" data-answer="9" class="">9</li>')
        .appendTo(this.Game.$answers);

    this.Game.state = {
        storageKey: 'test',
        question: {
            answer: 14,
            answersNeeded: 2
        },
        user: {
            answer: 0
        }
    };

    var $answer = this.Game.$answers.find('li').eq(0)
        .trigger('click');


    var obj = {};
    try { obj = $.parseJSON(localStorage.getItem('test')); } catch (error) {}

    var isSelected = false;
    if (typeof obj.answers!=='undefined' && obj.answers.length==1 && 'selected' in obj.answers[0]) {
        isSelected = obj.answers[0].selected===true ? true : false;
    }

    strictEqual(isSelected, true, 'Game.state.answers[0].selected equals to true');
});
test('answerClick: Test if selected answer have a selected order index', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li class="selected" data-selected-order="0" data-answer="1">1</li>' +
    '<li class="selected" data-selected-order="1" data-answer="1">1</li>')
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li')
        .trigger('click');

    // Cannot select used answers. Used answers must be ignored.
    strictEqual($answer.hasClass('selected'), false, 'Answer elements with class "used" cannot get class "selected" on click.');
});


/**
 * Game.prototype.newQuestionCycle()
 */
module('Game.prototype.newQuestionCycle()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script class="question-addition-template " type="game/template">'+
                'Which numbers add up to: {{answer}}?'+
            '</script>'+
            '<ul>'+
                '<li class="used" data-answer="1">1</li>'+
                '<li data-answer="2">2</li>'+
                '<li data-answer="3">3</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.testState = {
            storageKey: 'test-save-game-state',
            question: {
                answer: null
            },
            user: {
                answer: null
            },
            gameInProgress: true
        };

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: this.testState
        }, Game.prototype);

        // Storage key must not exists when test starts
        localStorage.removeItem('test-save-game-state');
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test storageKey must be unset after testing
        localStorage.removeItem('test-save-game-state');
    }
});
test('Test if a new question is created', 4, function () {

    var question = this.Game.newQuestionCycle.call(this.Game);

    strictEqual(this.Game.state.user.answer, 0, 'Game.state.user.answer equals to 0.');
    strictEqual(question.answer, 5, 'Game.state.question.answer equals to 5.');
    strictEqual(question.answersNeeded, 2, 'Game.state.question.answersNeeded equals to 2.');
    strictEqual(question.text, 'Which numbers add up to: 5?', 'Game.state.question.text equals to "Which numbers add up to: 5?.".');
});
test('Test if Game State is saved', 1, function () {

    var result = this.Game.newQuestionCycle(),
        testString = JSON.stringify(this.Game.state);

    strictEqual(localStorage.getItem('test-save-game-state'), JSON.stringify(this.Game.state), 'localStorage.getItem("test-save-game-state") equals to JSON.stringify(this.Game.state)');
});


/**
 * Game.prototype.createNewAnswers()
 */
module('Game.prototype.createNewAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        var testState = {
            answers: []
        };

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first(),
            state: testState
        }, Game.prototype);
    }
});
test('Test if answer elements are created', 1, function () {

    var $answers = this.Game.createNewAnswers(8);
    strictEqual($answers.find('li').length, 8, 'Amount of answer elements created equals to 8.');
});
test('Test if all answer elements have HTML5 data-index attribute', 1, function () {

    var $answers = this.Game.createNewAnswers(8);

    var result = true;
    $answers.find('li').each(function() {

        if (typeof $(this).data('index')!=='number') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test if all answer elements have HTML5 data-answer attribute', 1, function () {

    var $answers = this.Game.createNewAnswers(8);

    var result = true;
    $answers.find('li').each(function() {

        if (typeof $(this).data('answer')!=='number') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test answer objects in Game.state.answers', 1, function () {

    this.Game.createNewAnswers(8);
    var answers = this.Game.state.answers;

    strictEqual(answers.length, 8, 'Game.state.answers.length equals to 8');
});



/**
 * Game.prototype.createNewQuestion()
 */
module('Game.prototype.createNewQuestion()');
test('Test new question object', 3, function () {

    // Initialize answers, sum of data answers = 3
    jQuery('<ul><li data-answer="1">1</li><li data-answer="2">2</li></ul>')
        .appendTo('#qunit-fixture');
    // Initialize question template
    jQuery('<script id="questionTemplate" type="game/template">answer = {{answer}}</script>')
        .appendTo('#qunit-fixture');

    var availableAnswers = $('#qunit-fixture li'),
        result = Game.prototype.createNewQuestion(availableAnswers, '#qunit-fixture #questionTemplate');

    strictEqual(result.answer, 3, 'Question.answer equals to 3.');
    strictEqual(result.answersNeeded, 2, 'Question.answersNeeded equals to 2.');
    strictEqual(result.text, 'answer = 3', 'Question.text equals to "answer = 3".');
});



/**
 * Game.prototype.deselectAllAnswers()
 */
module('Game.prototype.deselectAllAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize answers, two answers are selected
        jQuery(
        '<div class="game">'+
            '<ul>'+
                '<li data-answer="1">1</li>'+
                '<li class="selected" data-answer="2">2</li>'+
                '<li class="selected" data-answer="3">3</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test if all answers have class "selected" removed', 1, function () {

    var $answers = this.Game.deselectAllAnswers.call(this.Game);

    strictEqual($answers.find('li.selected').length, 0, 'Class "selected" removed from all answers ($answers.length equals to 0).');
});



/**
 * Game.prototype.getAvailableAnswers()
 */
module('Game.prototype.getAvailableAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize answers, available answers = 1
        jQuery(
        '<div class="game">'+
            '<ul>'+
                '<li data-answer="1">1</li>'+
                '<li class="used" data-answer="2">2</li>'+
                '<li class="used" data-answer="3">3</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test get all answers, not used already', 1, function () {

    var $answers = Game.prototype.getAvailableAnswers.call(this.Game);

    strictEqual($answers.length, 1, 'Amount of available answer equals to 1 ($answers.length equals to 1).');
});



/**
 * Game.prototype.isAnswerMarkedAsUsed()
 */
module('Game.prototype.isAnswerMarkedAsUsed()');
test('Test is answer marked as used', 1, function () {

    var $answer = jQuery('<li class="used" data-answer="1">1</li>')
        .appendTo('#qunit-fixture');

    var result = Game.prototype.isAnswerMarkedAsUsed($answer);
    strictEqual(result, true, 'Answer element has class "used".');
});



/**
 * Game.prototype.isInvalidAnswer()
 */
module('Game.prototype.isInvalidAnswer()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<ul>'+
                '<li data-answer="1">1</li>'+
                '<li data-answer="2">2</li>'+
                '<li class="selected" data-answer="3">3</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        var testGameState = {
            question: {
                answer: 3,
                answersNeeded: 2
            },
            user: {
                answer: 3
            }
        };

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first(),
            state: testGameState
        }, Game.prototype);
    }
});
test('Test cannot select answer directly', 1, function () {

    var selected = this.Game.$answers.find('.selected');
    var result = this.Game.isInvalidAnswer(selected);



    strictEqual(result, true, 'Equals to true when answer is selected directly.');
});
test('Test selected answer is higher then Question answer.', 1, function () {

    this.Game.state.user.answer = 4;

    var selected = $('#qunit-fixture').find('.selected'),
        result = this.Game.isInvalidAnswer.call(this.Game, selected);

    strictEqual(result, true, 'Equals to true when user answer is higher then question answer.');
});



/**
 * Game.prototype.isQuestionAnswered()
 */
module('Game.prototype.isQuestionAnswered()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        var testGameState = {

            question: {
                answer: 123
            },
            user: {
                answer: 123
            }
        };

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first(),
            state: testGameState
        }, Game.prototype);
    }
});
test('Test is question answered correctly', 2, function () {

    var result = Game.prototype.isQuestionAnswered.call(this.Game);
    strictEqual(result, true, 'Equals to true when question is answered correctly.');

    this.Game.state.user.answer = 321; // incorrect answer
    result = Game.prototype.isQuestionAnswered.call(this.Game);
    strictEqual(result, false, 'Equals to false when question answered incorrectly.');
});



/**
 * Game.prototype.markAnswersAsUsed()
 */
module('Game.prototype.markAnswersAsUsed()');
test('Test mark answer as used', 2, function () {

    jQuery('<li class="selected" data-answer="1">1</li><li class="selected" data-answer="2">2</li>')
        .appendTo('#qunit-fixture');

    var $fixture = $('#qunit-fixture');
    var $answers = $fixture.find('li');

    Game.prototype.markAnswersAsUsed($answers); // all answers get class "used"

    strictEqual($fixture.find('li.used').length, 2, 'All answers elements have class="used".');
    strictEqual($fixture.find('li.selected').length, 0, 'Class="selected" is removed from all answers.');
});



/**
 * Game.prototype.setupAnswerElements()
 */
module('Game.prototype.setupAnswerElements()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<div class="navigation">'+
                '<h1 class="question">Question</h1>'+
            '</div>'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            state: {
                answers:[]
            }
        }, Game.prototype);
    }
});
test('Test if answers are setup', 10, function () {

    var answers = [
        {index: 0, answer: 1, selected: false, used: true},
        {index: 1, answer: 2, selected: true, used: false}
    ];

    var result = this.Game.setupAnswerElements(answers);
    strictEqual(result, true, 'Returns true when answers are setup');

    var $answers = this.Game.$answers.find('li');
    strictEqual($answers.length, 2, '<ul/> element contains 2 answers');

    strictEqual($answers.eq(0).data('index'), 0, 'First <li/> element has data-index attribute equal to 0.');
    strictEqual($answers.eq(0).data('answer'), 1, 'First <li/> element has data-answer attribute equal to 1.');
    strictEqual($answers.eq(0).hasClass('selected'), false, 'First <li/> element does not has class="selected".');
    strictEqual($answers.eq(0).hasClass('used'), true, 'First <li/> element has class="used".');

    strictEqual($answers.eq(1).data('index'), 1, 'Second <li/> element has data-index attribute equal to 1');
    strictEqual($answers.eq(1).data('answer'), 2, 'Second <li/> element has data-answer attribute equal to 2.');
    strictEqual($answers.eq(1).hasClass('selected'), true, 'Second <li/> element has class="selected".');
    strictEqual($answers.eq(1).hasClass('used'), false, 'Second <li/> element does not have class="used".');
});
test('Test when answers could not be setup', 2, function () {

    var answers = [
        {index: 0, answer: 1, selected: false, used: true},
        {} // does not contain the answer properties
    ];

    var result = this.Game.setupAnswerElements(answers);
    strictEqual(result, false, 'Returns false when answers could not be setup');

    var $answers = this.Game.$answers.find('li');
    strictEqual($answers.length, 0, 'No answer elements should be created on failure');
});



/**
 * Game.prototype.displayInvalidAnswer()
 */
module('Game.prototype.displayInvalidAnswer()');
test('Test display invalid answer', 2, function () {

    var answer = jQuery('<li class="selected" data-answer="1">1</li>')
        .appendTo('#qunit-fixture');
    var $result = $(Game.prototype.displayInvalidAnswer.call(answer)[0]);

    strictEqual($result.hasClass('invalid-answer'), true, 'Answer element gets class "invalid-answer".');
    strictEqual($result.hasClass('selected'), false, 'Class "selected" is removed from answer element.');
});



/**
 * Game.prototype.displayQuestion()
 */
module('Game.prototype.displayQuestion()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script class="question-addition-template" type="game/template">' +
                'Which numbers add up to {{answer}}?' +
            '</script>' +
            '<div class="question">' +
                '<div class="statement">' +
                    // '<span class="number">12</span>' +
                    // '<span class="addition">&plus;</span>' +
                    // '<span class="number">Y</span>' +
                    // '<span class="equal">=</span>' +
                    // '<span class="number">15</span>' +
                '</div>' +
                '<div class="question-text"><!--Question text appended here?--></div>' +
            '</div>' +
            '<ul>' +
                '<li class="selected" data-answer="1">1</li>' +
                '<li class="selected" data-answer="5">5</li>' +
                '<li class="selected" data-answer="7">7</li>' +
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $statement: $('#qunit-fixture div.statement'),
            $answers: $('#qunit-fixture ul'),
            state: {
                question: {
                    text: 'Which numbers adds up to 15?',
                    answer: 15
                },
                user: {
                    answer: null
                }
            }
        }, Game.prototype);
    }
});
test('Test .displayQuestion() Test existence of statement span elements ', 4, function () {

    // Setup question answered
    this.Game.state.question.answer = 15;
    this.Game.state.user.answer = 13; // selected answers 1 + 7 + 5

    this.Game.displayQuestion.call(this.Game);

    var $context   = $('#qunit-fixture');
    var $statement = $context.find('div.statement');
    var text       = $context.find('div.question-text').text();
    var classCount = 0;

    strictEqual(text, 'Which numbers adds up to 15?', 'Element with class="text" has text that equals to "Which numbers adds up to 15?".');

    classCount = $statement.find('span.number').length;
    strictEqual(classCount, 2, 'Statement contain 3 span elements with class of "number"');

    classCount = $statement.find('span.addition').length;
    strictEqual(classCount, 1, 'Statement contain 1 span element with class of "addition"');

    classCount = $statement.find('span.equal').length;
    strictEqual(classCount, 1, 'Statement contain 1 span element with class of "equal"');
});
test('Test .displayQuestion() question not answered, Statement contains user answer', 2, function () {

    // Setup test
    // <span>13</span> <span>+<span> <span>X</span> = 15
    this.Game.state.question.answer = 15;
    this.Game.state.user.answer = 13; // selected answers 1 + 7 + 5

    this.Game.displayQuestion();

    // When question not answered, first span.number contains state.user.answer.
    var first = this.Game.$statement.find('span.number').eq(0);
    strictEqual(first.text(), '13', 'First span.number contains the string "13", when question not answered.');

    // When question not answered, second span.number contains the string 'Y'.
    var second = this.Game.$statement.find('span.number').eq(1);
    strictEqual(second.text(), 'X', 'Second span.number contains the string "X", when question not answered.');
});



/**
 * Game.prototype.isBrowserSupportingDOMStorage()
 */
module('Game.prototype.isBrowserSupportingDOMStorage()');
test('Test when browser window supports HTML5 Local Storage', 1, function () {

    var testStorage = function (){}, result;

    result = Game.prototype.isBrowserSupportingDOMStorage(testStorage);
    strictEqual(result, true, 'Equals to boolean true when browser window supports HTML5 Local Storage.');
});
test('Test when browser window does not support HTML5 Local Storage', 1, function () {

    var testStorage, result;

    result = Game.prototype.isBrowserSupportingDOMStorage(testStorage);
    strictEqual(result, false, 'Equals to boolean false when browser window does not support HTML5 Local Storage.');
});



/**
 * Game.prototype.loadGameState()
 */
module('Game.prototype.loadGameState()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            state: {}
        }, Game.prototype);

        this.testState = {
            gameInProgress: true,
            question: {
                answer: 3,
                template: 'Which numbers add up to: {{answer}}?.',
                text: 'Which numbers add up to: 3?.',
                answerNeeded: 2
            },
            answers: [
                {index: 0, answer: 1, selected: false, used: true},
                {index: 1, answer: 2, selected: true, used: false}
                ],
            user: {
                answer: 2
            }
        };
        this.testString = JSON.stringify(this.testState);
        // Setup test string in Storage
        localStorage.setItem('test-load-game-state', this.testString); // JSON
        // Setup invalid GameState in Storage
        localStorage.setItem('test-cannot-load-game-state', 'This is not a well formed JSON string');
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test-load-game-state');
        localStorage.removeItem('test-cannot-load-game-state');
    }
});
test('Test if Game State Object can be loaded from Storage', 2, function () {

    // Load Game State from Storage
    var result = this.Game.loadGameState('test-load-game-state');

    // Test if result is equal to true
    deepEqual(result, true, 'Result equals true when gameState cannot be loaded from Storage.');

    // Test Game State object
    deepEqual(this.Game.state, this.testState, 'Game.state object equals to this.testState.');
});
test('Test if Game State Object cannot be loaded from Storage', 2, function () {

    // Load Game State from Storage
    var result = this.Game.loadGameState('test-cannot-load-game-state');

    // Test failure loading JSON string from Storage
    deepEqual(result, false, 'Result equals false when gameState cannot be loaded from Storage.');

    // Test Game State object
    deepEqual(this.Game.state, this.Game.state, 'Game.state object equals to this.testState.');
});
test('Test Game.state.question object after loading from Storage', 1, function () {

    // Load Game State from Storage
    this.Game.loadGameState('test-load-game-state');

    // Test if object loaded from Storage
    deepEqual(JSON.stringify(this.Game.state), this.testString, 'Game.state equals to Test state.');
});



/**
 * Game.prototype.saveGameState()
 */
module('Game.prototype.saveGameState()', {

    // Setup callback runs before each test
    setup: function () {

        // Test key must be unset before testing
        localStorage.removeItem('test-save-game-state');

        // These answers will be stored in gameState
        jQuery(
        '<div class="game">'+
            '<ul>'+
                '<li data-index="0" data-answer="1" class="used">1</li>'+
                '<li data-index="1" data-answer="2" class="selected">2</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        // Test properties of Game State
        var gameState = {
            gameInProgress: true,
            answers: []
        };

        this.Game = $.extend({
            state: gameState,
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test-save-game-state');
    }
});
test('Test if Game State is saved to Storage', 9, function () {

    // Save Game State to Storage
    var result = this.Game.saveGameState('test-save-game-state'),
        gameState = $.parseJSON(localStorage.getItem('test-save-game-state'));

    // Test gameInProgress
    strictEqual(gameState.gameInProgress, true, 'gameState.gameInProgress equals to true');

    // Test first answer
    strictEqual(gameState.answers[0].index, 0, 'gameState.answers[0].index equals to 0');
    strictEqual(gameState.answers[0].answer, 1, 'gameState.answers[0].answer equals to 1');
    strictEqual(gameState.answers[0].selected, false, 'gameState.answers[0].selected equals to false');
    strictEqual(gameState.answers[0].used, true, 'gameState.answers[0].used equals to true');

    // Test second answer
    strictEqual(gameState.answers[1].index, 1, 'gameState.answers[1].index equals to 1');
    strictEqual(gameState.answers[1].answer, 2, 'gameState.answers[1].answer equals to 2');
    strictEqual(gameState.answers[1].selected, true, 'gameState.answers[1].selected equals to true');
    strictEqual(gameState.answers[1].used, false, 'gameState.answers[1].used equals to false');
});



/**
 * Game.prototype.getFromStorage()
 */
module('Game.prototype.getFromStorage', {

    // Setup callback runs before each test
    setup: function () {

        // Set test JSON string
        localStorage.setItem('test-get-from-storage', '{"key":"a value"}');
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test-get-from-storage');
    }
});

test('Test if object is returned from Storage', 1, function () {

    Game.prototype.getFromStorage('test-get-from-storage');
    strictEqual(localStorage.getItem('test-get-from-storage'), '{"key":"a value"}', "localStorage.getItem('test-get-from-storage') must equal to object {key: 'value'}.");
});



/**
 * Game.prototype.saveToStorage()
 */
module('Game.prototype.saveToStorage', {

    // Setup callback runs before each test
    setup: function () {

        // Test key must be unset before testing
        localStorage.removeItem('test:save');
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test:save');
    }
});
test('Test if object can be saved to Storage', 1, function () {

    var testObject = {key: 'a value'},
        testString = JSON.stringify(testObject), // '{"key":"a value"}'
        result = Game.prototype.saveToStorage('test:save', testObject);

    strictEqual(localStorage.getItem('test:save'),testString,"localStorage.getItem('test:save') must equal to string "+'{"key":"a value"}');
});



/**
 * Game.prototype.deleteFromStorage()
 */
module('Game.prototype.deleteFromStorage', {

    // Setup callback runs before each test
    setup: function () {

        // Set test values
        localStorage.setItem('test-remove-me', 'remove');
        localStorage.setItem('test-keep-me', 'keep');
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test-remove-me');
        localStorage.removeItem('test-keep-me');
    }
});
test('Test if key can be deleted from Storage', 2, function () {

    // Test if key is removed from Storage
    var result = Game.prototype.deleteFromStorage('test-remove-me');
    strictEqual(localStorage.getItem('test-remove-me'),null,"localStorage.getItem('test-remove-me') must equal to undefined.");

    // Test if another key is not removed from Storage
    strictEqual(localStorage.getItem('test-keep-me'),'keep',"localStorage.getItem('test-keep-me') must equal to 'keep'.");
});



/**
 * Game.prototype.getTemplate()
 */
module('Game.prototype.getTemplate()');
test('Test retrieval question template from HTML', 1, function () {

    jQuery('<script id="questionTemplate" type="game/template">test question template</script>')
        .appendTo('#qunit-fixture');

    var $context = $('#qunit-fixture div.game'),
        result = Game.prototype.getTemplate('#questionTemplate');

    strictEqual(result, 'test question template', 'Template should be "test question template".');
});



/**
 * Game.prototype.renderTemplate()
 */
module('Game.prototype.renderTemplate(template, replace)');
test('Test rendering template', 1, function () {

    var result = Game.prototype.renderTemplate("{{test}}", {test:"pass"});
    strictEqual(result, 'pass', 'Rendered template equals "pass".');
});



/**
 * Game.prototype.getRandomArrayElements()
 */
module('Game.prototype.getRandomArrayElements()');
test('Test randomize array elements', 1, function () {

    var elements = [1,2,3,4,5];
    var result = Game.prototype.getRandomArrayElements(elements, 2);
    strictEqual(result.length, 2, 'Returns 2 array elements.');
});



/**
 * Game.prototype.shuffleArray()
 */
module('Game.prototype.shuffleArray(array)');
test('Test length shuffled array elements', 1, function () {

    var result = [1,2,3,4,5];

    Game.prototype.shuffleArray(result);

    strictEqual(result.length, 5, 'Returns 5 array elements.');
});



/**
 * Game.prototype.sumDataAttributes()
 */
module('Game.prototype.sumDataAttributes()');
test('Test sum data answer attributes', 1, function () {

    jQuery('<ul><li data-answer="1">1</li><li data-answer="2">2</li></ul>')
        .appendTo('#qunit-fixture');

    var elements = $('#qunit-fixture').find('li'),
        result = Game.prototype.sumDataAttributes(elements);

    strictEqual(result, 3, 'Sum equals to 3.');
});
