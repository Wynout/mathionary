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

        this.Game.cacheDomElements();
    }, Error, 'Must throw error when $game <div> element not found.');


    // Answers parent element <ul> not found
    raises(function () {

        this.Game.cacheDomElements();
    }, Error, 'Must throw error when $answers parent <ul> element not found.');


    // Statement element <div> not found
    raises(function () {

        this.Game.cacheDomElements();
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
            '<div class="level">Level <span class="number">1</span></div>' +
            '<div class="question">' +
                '<div class="statement"></div>' +
                '<div class="question-text"><!--Question text appended here?--></div>' +
            '</div>' +
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'should-not-exists',
            level: 42,
            answers: [],
            operation: 'addition',
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
test('Test HTML elements', 8, function () {

    var gameState = this.Game.state,
        $answers  = this.Game.$answers.find('li'),
        $level    = this.Game.$game.find('.level .number');

    // Current level is 42 and must be displayed in HTML element
    strictEqual($level.text(), '42', 'Current displayed level equals to a string 42');

    // Answer elements created?
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
        '<div class="game">' +
            '<script class="question-template" type="game/template">' +
                'Which numbers add up to: {{answer}}?.' +
            '</script>' +
            '<ul></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'test-load-game-state',
            level: 42,
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
test('Test loading Game State from Storage', 6, function () {

    strictEqual(this.Game.state.level, 42, 'Game.state.level equals to number 42.');
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
        '<div class="game">' +
            '<ul></ul>' +
            '<button class="reset">Reset Game</button>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            state: {
                level: 1
            }
        }, Game.prototype);

        // Bind all Events
        this.Game.bindEvents.call(this.Game);
    }
});
test('Test bindEvents for answer elements', 3, function () {

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var events = $._data( $(this.Game.$answers).get(0), 'events' );

    strictEqual(typeof events.mouseover, 'object', 'Answer element has a mouseover event.');
    strictEqual(typeof events.mouseout, 'object', 'Answer element has a mouseout event.');
    strictEqual(typeof events.click, 'object', 'Answer element has a click event.');
});
test('Test bindEvents for reset element', 1, function () {

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var $reset = this.Game.$game.find('.reset');
    var events = $._data( $reset.get(0), 'events' );
    strictEqual(typeof events.click, 'object', 'Reset element has a click event.');
});



/**
 * Game.prototype.events
 */
module('Game.prototype.events', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<script id="question-addition-template" type="game/template">' +
                'Which numbers add up to: {{answer}}?.' +
            '</script>' +
            '<div class="level">Level <span class="number">1</span></div>' +
            '<div class="question">' +
                '<div class="statement"></div>' +
                '<div class="question-text"></div>' +
            '</div>' +
            '<ul></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.testState = {
            storageKey: 'test',
            level: 1,
            operation: 'addition',
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
    '<li data-answer="1">1</li>' +
    '<li data-answer="2">2</li>' + // trigger click
    '<li data-answer="3">3</li>' +
    '<li data-answer="5">5</li>')
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').eq(1)
        .trigger('click');

    strictEqual(this.Game.state.user.answer, 2, 'Game.state.user.answer equals to 2.');
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
test('answerClick: Test if answer is correct', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="1">1</li>'+
    '<li class="selected" data-answer="2" data-order="0">2</li>'+
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
        operation: 'addition',
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
test('answerClick: Test if selected answer has a data attribute data-order=""', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-order="0" data-answer="1">1</li>' +
    '<li data-order="1" data-answer="2">3</li>' +
    '<li data-answer="3">3</li>')
        .appendTo(this.Game.$answers);

    var $element = this.Game.$answers.find('li').last()
        .trigger('click');

    // Selected element receives data-order="2"
    strictEqual($element.data('order'), 2, 'Clicked answer has data-order attribute equal to "2".');
});



/**
 * Game.prototype.newQuestionCycle()
 */
module('Game.prototype.newQuestionCycle()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<script class="question-addition-template" type="game/template">Which numbers add up to {{answer}}?</script>' +
            '<ul>' +
                '<li class="used" data-answer="3">3</li>' +
                // For testing purposes, same answers are being used.
                // The answers for x,y are randomly chosen.
                // The results for operations subtraction and division have two possible outcomes.
                // By using equal numbers, there will be only a single result: [-] (3-3), [/] (3/3).
                '<li data-answer="3">3</li>' +
                '<li data-answer="3">3</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.testState = {
            storageKey: 'test-save-game-state',
            operation: 'addition',
            question: {
                answer: null
            },
            user: {
                answer: null
            }
        };

        this.Game = $.extend({
            operation: 'addition',
            $answers: $('#qunit-fixture ul').first(),
            $game: $('#qunit-fixture div.game'),
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
test('Test if Game.state.operation is changed in newQuestionCycle', 1, function () {

    this.Game.newQuestionCycle('subtraction'),
    strictEqual(this.Game.state.operation, 'subtraction', 'Game.state equals to "subtraction".');
});
test('Test if Game State is saved', 1, function () {

    var result = this.Game.newQuestionCycle('subtraction'),
        testString = JSON.stringify(this.Game.state);
    strictEqual(localStorage.getItem('test-save-game-state'), JSON.stringify(this.Game.state), 'localStorage.getItem("test-save-game-state") equals to JSON.stringify(this.Game.state)');
});
test('Test if a new addition question is created', 4, function () {

    var question = this.Game.newQuestionCycle();

    strictEqual(this.Game.state.user.answer, null, 'Game.state.user.answer equals to null.');
    strictEqual(question.answer, 6, 'Game.state.question.answer equals to 6.');
    strictEqual(question.answersNeeded, 2, 'Game.state.question.answersNeeded equals to 2.');
    strictEqual(question.text, 'Which numbers add up to 6?', 'Game.state.question.text equals to "Which numbers add up to 6?.".');
});



/**
 * Game.prototype.newLevelCycle()
 */
module('Game.prototype.newLevelCycle()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<div class="level">Level <span class="number">42</span></div>' +
            '<ul>' +
                '<li class="used" data-answer="1">1</li>' +
                '<li data-answer="2">2</li>' +
                '<li data-answer="3">3</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: {
                level: 42,
                answers:[]
            }
        }, Game.prototype);
    }
});
test('Test Level Number Change', 1, function () {

    var level = this.Game.newLevelCycle();
    strictEqual(level, 43, 'New level equals to 43.');
});
test('Test new level is displayed', 1, function () {

    var $level = this.Game.newLevelCycle();
    strictEqual($level, 43, 'New level number equals to 43.');
});
test('Test creation of answer elements after level cycle', 1, function () {

    var level = this.Game.newLevelCycle.call(this.Game),
        answerCount = this.Game.$answers.find('li').length;
    strictEqual(answerCount, 64, 'New level should contain 64 answers (default).');
});

/**
 * Game.prototype.newAnswers()
 */
module('Game.prototype.newAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            state:  {
                level: 1,
                answers: []
            }
        }, Game.prototype);
    }
});
test('Test if answer elements are created', 1, function () {

    var $answers = this.Game.newAnswers(8);
    strictEqual($answers.find('li').length, 8, 'Amount of answer elements created equals to 8.');
});
test('Test if all answer elements have HTML5 data-index attribute', 1, function () {

    var $answers = this.Game.newAnswers(8);

    var result = true;
    $answers.find('li').each(function() {

        if (typeof $(this).data('index')!=='number') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test if all answer elements have HTML5 data-answer attribute', 1, function () {

    var $answers = this.Game.newAnswers(8);

    var result = true;
    $answers.find('li').each(function() {

        if (typeof $(this).data('answer')!=='number') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test answer objects in Game.state.answers', 1, function () {

    this.Game.newAnswers(8);
    var answers = this.Game.state.answers;

    strictEqual(answers.length, 8, 'Game.state.answers.length equals to 8');
});



/**
 * Game.prototype.newQuestion()
 */
module('Game.prototype.newQuestion()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<script id="question-template" type="game/template">answer = {{answer}}</script>' +
            '<ul>' +
                // For testing purposes, same answers are being used.
                // The answers for x,y are randomly chosen.
                // The results for operations subtraction and division have two possible outcomes.
                // By using equal numbers, there will be only a single result: [-] (3-3), [/] (3/3).
                '<li data-answer="3">3</li>' +
                '<li data-answer="3">3</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            operation: 'addition',
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: {
                level: 42,
                answers: []
            }
        }, Game.prototype);
    }
});
test('Test new question', 3, function () {

    var availableAnswers = $('#qunit-fixture li'),
        template = '#qunit-fixture #question-template',
        question = Game.prototype.newQuestion('addition', availableAnswers, template);

    strictEqual(question.answer, 6, 'Question.answer equals to 6.');
    strictEqual(question.answersNeeded, 2, 'Question.answersNeeded equals to 2.');
    strictEqual(question.text, 'answer = 6', 'Question.text equals to "answer = 6".');
});



/**
 * Game.prototype.calculateAnswer()
 */
module('Game.prototype.calculateAnswer()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<script id="question-template" type="game/template">answer = {{answer}}</script>' +
            '<ul>' +
                '<li data-order="1" data-answer="4">4</li>' + // first in selected order
                '<li data-order="0" data-answer="12">12</li>' + // last in selected order
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            operation: 'addition',
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: {
                level: 42,
                answers: []
            }
        }, Game.prototype);
    }
});
test('Test calculate answer', 4, function () {

    var $elements = $('#qunit-fixture li'),
        answer    = null;

    answer = Game.prototype.calculateAnswer('addition', $elements);
    strictEqual(answer, 16, '12 + 4 equals 16.');

    answer = Game.prototype.calculateAnswer('subtraction', $elements);
    strictEqual(answer, 8, '12 - 4 equals to 8.');

    answer = Game.prototype.calculateAnswer('multiplication', $elements);
    strictEqual(answer, 48, '12 * 4 equals to 48.');

    answer = Game.prototype.calculateAnswer('division', $elements);
    strictEqual(answer, 3, '12 / 4 equals to 3.');
});



/**
 * Game.prototype.reset()
 */
module('Game.prototype.reset()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<script class="question-addition-template" type="game/template">Which numbers add up to {{answer}}?</script>' +
            '<div class="question"><div class="statement"></div></div>' +
            '<ul>' +
                '<li class="used" data-answer="1">1</li>' +
                '<li data-answer="2">2</li>' +
                '<li data-answer="3">3</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.testState = {
            storageKey: 'test-reset',
            operation: 'addition',
            question: {
                answer: null
            },
            user: {
                answer: null
            }
        };

        this.Game = $.extend({
            operation: 'addition',
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: this.testState
        }, Game.prototype);
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('test-reset');
    }
});
test('Test reset game', 3, function () {

    this.Game.reset('subtraction');
    strictEqual(this.Game.$answers.find('li').length, 64, 'New Game contains 64 new answers.');
    var string = localStorage.getItem('test-reset');
    var state = $.parseJSON(string);
    strictEqual(state.operation, 'subtraction', 'Game.state.operation equals to "subtraction".');
    strictEqual(state.answers.length, 64, 'New State contains 64 new answers.');
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
 * Game.prototype.addAnswerToOrder()
 */
module('Game.prototype.addAnswerToOrder()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<ul></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test order data attribute on first selected answers', 1, function () {

    jQuery(
    '<li data-answer="1">1</li>' +
    '<li data-answer="2">2</li>' +
    '<li class="selected" data-answer="3">3</li>') // set order on this element)
        .appendTo(this.Game.$answers);

    var $selected = this.Game.$answers.find('li.selected');
    var $result = this.Game.addAnswerToOrder($selected);
    strictEqual($result.data('order'), 0, 'First element data-order attribute equals to 0.');
});
test('Test order data attribute on selected answers', 1, function () {

    jQuery(
    '<li data-order="0" data-answer="1">1</li>' +
    '<li data-order="1" data-answer="2">2</li>' +
    '<li class="selected" data-answer="3">3</li>') // set order on this element)
        .appendTo(this.Game.$answers);

    var $selected = this.Game.$answers.find('li.selected');
    var $result = this.Game.addAnswerToOrder($selected);
    strictEqual($result.data('order'), 2, 'Element data-order attribute equals to 2.');
});



/**
 * Game.prototype.orderSelectedAnswers()
 */
module('Game.prototype.orderSelectedAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<ul>' +
                '<li class="selected" data-order="1" data-answer="7">7</li>' +
                '<li class="selected" data-order="0" data-answer="5">5</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test order elements by data-order attribute', 2, function () {

    var $elements = this.Game.$answers.find('li.selected');

    var ordered = this.Game.orderSelectedAnswers($elements); // array is returned
    var $ordered = $(ordered);
    strictEqual($ordered.eq(0).data('order'), 0, 'data-order equals to 0.');
    strictEqual($ordered.eq(1).data('order'), 1, 'data-order equals to 1.');
});



/**
 * Game.prototype.isInvalidAnswer()
 */
module('Game.prototype.isInvalidAnswer()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<ul></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test invalid answer when question not answered with max answersNeeded reached', 1, function () {

    jQuery(
    '<li class="selected" data-order="0" data-answer="1">1</li>'+
    '<li class="selected" data-order="1" data-answer="2">2</li>'+
    '<li data-answer="3">3</li>')
        .appendTo(this.Game.$answers);

    this.Game.state = {
        operation: 'addition',
        question: {
            answer: 6,
            answersNeeded: 2
        },
        user: {
            answer: 3
        }
    };

    var $selected = this.Game.$answers.find('.selected');
    var result = this.Game.isInvalidAnswer($selected);
    strictEqual(result, true, 'Test invalid answer when question not answered with max answersNeeded reached.');
});
test('Test cannot select answer directly', 2, function () {

    jQuery(
    '<li data-answer="1">1</li>'+
    '<li data-answer="2">2</li>'+
    '<li class="selected" data-answer="3">3</li>')
        .appendTo(this.Game.$answers);

    this.Game.state = {
        operation: 'addition',
        question: {
            answer: 3,
            answersNeeded: 2
        },
        user: {
            answer: 3
        }
    };

    var $selected = this.Game.$answers.find('.selected'),
        result;
    result = this.Game.isInvalidAnswer($selected);
    strictEqual(result, true, 'For operation "addition": Equals to true when answer is selected directly.');

    this.Game.state.operation = 'subtraction';
    result = this.Game.isInvalidAnswer($selected);
    strictEqual(result, true, 'For operation "subtraction": Equals to true when answer is selected directly.');
});
test('Test invalid answer for addition: selected answer is higher then Question answer', 1, function () {

     this.Game.state = {
        operation: 'addition',
        question: {
            answer: 3,
            answersNeeded: 2
        },
        user: {
            answer: 4
        }
    };

    var $selected = $('#qunit-fixture').find('.selected'),
        result = this.Game.isInvalidAnswer($selected);

    strictEqual(result, true, 'Equals to true when user answer is higher then question answer.');
});
test('Test invalid subtraction', 1, function () {

    this.Game.state = {
        operation: 'subtraction',
        question: {
            answer: 1,
            answersNeeded: 2
        },
        user: {
            answer: -3
        }
    };

    var selected = $('#qunit-fixture').find('.selected'),
        result = this.Game.isInvalidAnswer(selected);

    strictEqual(result, true, 'Equals to true when user answer is lower then question answer.');
});



/**
 * Game.prototype.isQuestionAnswered()
 */
module('Game.prototype.isQuestionAnswered()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        var state = {
            question: {
                answer: 4,
                answersNeeded: 2
            },
            user: {
                answer: 4
            }
        };

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first(),
            state: state
        }, Game.prototype);
    }
});
test('Test is question answered correctly', 2, function () {

    jQuery(
    '<li class="selected" data-answer="1">1</li>' +
    '<li class="selected" data-answer="3">3</li>' +
    '<li data-answer="5">5</li>')
        .appendTo(this.Game.$answers);

    var result = Game.prototype.isQuestionAnswered.call(this.Game);
    strictEqual(result, true, 'Equals to true when question is answered correctly.');

    this.Game.state.user.answer = 321; // incorrect answer
    result = Game.prototype.isQuestionAnswered.call(this.Game);
    strictEqual(result, false, 'Equals to false when question answered incorrectly.');
});



/**
 * Game.prototype.isLevelFinished()
 */
module('Game.prototype.isLevelFinished()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test if level not finished', 1, function () {

    jQuery(
    '<ul>' +
        '<li class="used">1</li>' +
        '<li>2</li>' + // 2 available answers (2 & 3)
        '<li>3</li>' +
    '</ul>')
        .appendTo(this.Game.$answers);

    var result = Game.prototype.isLevelFinished.call(this.Game);
    strictEqual(result, false, 'Equals to false when level not finished.');
});
test('Test if level finished', 1, function () {

    jQuery(
    '<ul>' +
        '<li class="used">1</li>' +
        '<li class="used">2</li>' +
        '<li>3</li>' + // 1 available answers
    '</ul>')
        .appendTo(this.Game.$answers);

    var result = Game.prototype.isLevelFinished.call(this.Game);
    strictEqual(result, true, 'Equals to true when level finished.');
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
module('Game.prototype.displayInvalidAnswer()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<ul>' +
                '<li class="selected" data-answer="1" data-order="0">1</li>' +
                '<li class="selected" data-answer="5" data-order="1">5</li>' +
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul'),
            state: {
                operation: 'addition',
                question: {
                    text: 'Which numbers adds up to 5?',
                    answer: 5
                },
                user: {
                    answer: null
                }
            }
        }, Game.prototype);
    }
});
test('Test display invalid answer', 1, function () {

    var $answer = this.Game.$answers.last(),
        $result = this.Game.displayInvalidAnswer.call($answer, this.Game);
    strictEqual($result.hasClass('selected'), false, 'Class "selected" is removed from answer element.');
});



/**
 * Game.prototype.displayCurrentLevel()
 */
module('Game.prototype.displayCurrentLevel()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize HTML
        jQuery(
        '<div class="game">' +
            '<div class="level">Level <span class="number">1</span></div>' +
        '</div>'
        )
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            state: {
                level: 42
            }
        }, Game.prototype);
    }
});
test('Test display current level number', 1, function () {

    var $result = this.Game.displayCurrentLevel();
    strictEqual($result.text(), '42', 'Current level should be level 42.');
});



/**
 * Game.prototype.displayQuestion()
 */
module('Game.prototype.displayQuestion()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<script class="question-subtraction-template" type="game/template">' +
                'Which numbers add up to {{answer}}?' +
            '</script>' +
            '<div class="question">' +
                '<div class="statement">' +
                    // '<span class="number">1</span>' +
                    // '<span class="addition">&plus;</span>' +
                    // '<span class="number">5</span>' +
                    // '<span class="equal">=</span>' +
                    // '<span class="number">6</span>' +
                '</div>' +
                '<div class="question-text"><!--Question text appended here?--></div>' +
            '</div>' +
            '<ul>' +
                '<li class="selected" data-answer="1" data-order="0">1</li>' +
                '<li class="selected" data-answer="5" data-order="1">5</li>' +
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $statement: $('#qunit-fixture div.statement'),
            $answers: $('#qunit-fixture ul'),
            state: {
                operation: 'addition',
                question: {
                    text: 'Which numbers adds up to 6?',
                    answer: 6
                },
                user: {
                    answer: null
                }
            }
        }, Game.prototype);
    }
});
test('Test .displayQuestion() HTML body receives math operation classes', 4, function () {

    this.Game.state.operation = 'addition';
    this.Game.displayQuestion();
    strictEqual($(document.body).hasClass('addition-operation'), true, 'Body has class="addition-operation" when math operation is addition.');

    this.Game.state.operation = 'subtraction';
    this.Game.displayQuestion();
    strictEqual($(document.body).hasClass('subtraction-operation'), true, 'Body has class="subtraction-operation" when math operation is subtraction.');

    this.Game.state.operation = 'multiplication';
    this.Game.displayQuestion();
    strictEqual($(document.body).hasClass('multiplication-operation'), true, 'Body has class="multiplication-operation" when math operation is multiplication.');

    this.Game.state.operation = 'division';
    this.Game.displayQuestion();
    strictEqual($(document.body).hasClass('division-operation'), true, 'Body has class="division-operation" when math operation is division.');
});
test('Test .displayQuestion() anwers parent element <ul> receives operation classes', 4, function () {

    this.Game.state.operation = 'addition';
    this.Game.displayQuestion();
    strictEqual(this.Game.$answers.hasClass('addition'), true, '<ul> has class="addition" when math operation is addition.');

    this.Game.state.operation = 'subtraction';
    this.Game.displayQuestion();
    strictEqual(this.Game.$answers.hasClass('subtraction'), true, '<ul> has class="subtraction" when math operation is subtraction.');

    this.Game.state.operation = 'multiplication';
    this.Game.displayQuestion();
    strictEqual(this.Game.$answers.hasClass('multiplication'), true, '<ul> has class="multiplication" when math operation is multiplication.');

    this.Game.state.operation = 'division';
    this.Game.displayQuestion();
    strictEqual(this.Game.$answers.hasClass('division'), true, '<ul> has class="division" when math operation is division.');


});
test('Test .displayQuestion() Test existence of statement span elements ', 4, function () {

    // Setup question answered
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 6; // selected answers 1 & 5

    this.Game.displayQuestion();

    var $context   = $('#qunit-fixture');
    var $statement = $context.find('div.statement');
    var text       = $context.find('div.question-text').text();
    var classCount = 0;

    strictEqual(text, 'Which numbers adds up to 6?', 'Element with class="text" has text that equals to "Which numbers adds up to 6?".');

    classCount = $statement.find('span.number').length;
    strictEqual(classCount, 2, 'Statement contains 3 span elements with class of "number"');

    classCount = $statement.find('span.addition').length;
    strictEqual(classCount, 1, 'Statement contains 1 span element with class of "addition"');

    classCount = $statement.find('span.equal').length;
    strictEqual(classCount, 1, 'Statement contains 1 span element with class of "equal"');
});
test('Test .displayQuestion() test classes for all math operations', 8, function () {

    var $span;

    // Test class if span.addition exists
    this.Game.state.operation = 'addition';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.addition');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "addition".');
    strictEqual($span.text(), '+', 'span.addition contains string "&plus;".');

    // Test class if span.subtraction exists
    this.Game.state.operation = 'subtraction';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.subtraction');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "subtraction".');
    strictEqual($span.text(), '−', 'span.subtraction contains string "&minus;".');

    // Test class if span.multiplication exists
    this.Game.state.operation = 'multiplication';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.multiplication');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "multiplication".');
    strictEqual($span.text(), '×', 'span.subtraction contains string "&times;".');

    // Test class if span.division exists
    this.Game.state.operation = 'division';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.division');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "division".');
    strictEqual($span.text(), '÷', 'span.subtraction contains string "&divide;".');
});
test('Test .displayQuestion() Statement contains 1 answer for x', 2, function () {

    // Remove first answer from setup, only one answer remaining: 5
    this.Game.$answers.find('li').first().remove();

    // Setup test "<span>1</span> <span>+<span> <span>5</span> = 6"
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 5; // selected answer is 5

    this.Game.displayQuestion();

    // First span.number contains the single answer.
    var first = this.Game.$statement.find('span.number').eq(0);
    strictEqual(first.text(), '5', 'First span.number contains the string "5".');

    // Second span.number contains the string 'X'.
    var second = this.Game.$statement.find('span.number').eq(1);
    strictEqual(second.text(), 'X', 'Second span.number contains the string "X".');
});
test('Test .displayQuestion() Statement contains 2 answers for x and y', 2, function () {

    // Setup test "<span>1</span> <span>+<span> <span>5</span> = 6"
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 6; // selected answers 1 & 5

    this.Game.displayQuestion();

    // First span.number contains the first answer.
    var first = this.Game.$statement.find('span.number').eq(0);
    strictEqual(first.text(), '1', 'First span.number contains the string "1".');

    // Second span.number contains the second answer.
    var second = this.Game.$statement.find('span.number').eq(1);
    strictEqual(second.text(), '5', 'Second span.number contains the string "5".');
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
test('Test if Game State is saved to Storage', 8, function () {

    // Save Game State to Storage
    var result = this.Game.saveGameState('test-save-game-state'),
        gameState = $.parseJSON(localStorage.getItem('test-save-game-state'));

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

    jQuery('<script id="question-template" type="game/template">test question template</script>')
        .appendTo('#qunit-fixture');

    var $context = $('#qunit-fixture div.game'),
        result = Game.prototype.getTemplate('#question-template');

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
