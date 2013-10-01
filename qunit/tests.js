/**
 * Automating JavaScript Testing with QUnit
 * @link http://qunitjs.com/
 * @link http://msdn.microsoft.com/en-us/magazine/gg749824.aspx
 */
var LiveReload; // Chrome plugin LiveReload

/**
 * Game.prototype.cacheDomElements
 */
module('Game.prototype.cacheDomElements()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game"><div class="statement"></div><ul class="answers"></ul></div>' +
        '<ul class="buttons">' +
            '<li></li>' +
        '</ul>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            config: {
                container: '#qunit-fixture div.game'
            },
            $game: null,
            $buttons: null,
            $answers: null,
            $statement: null
        }, Game.prototype);
    }
});
test('Test throw Errors', 3, function () {

    // Throws error
    $('#qunit-fixture div.game').empty();

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
test('Test if DOM elements are being cached', 4, function () {

    this.Game.cacheDomElements.call(this.Game);

    strictEqual(this.Game.$game.length, 1, 'Game.$game.length equals to 1.');
    strictEqual(this.Game.$buttons.length, 1, 'Game.$buttons.length equals to 1.');
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
        '<div id="progress"><div id="gauge"></div></div>' +
        '<div class="game">'+
            '<script class="question-addition-template" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<div class="level">Level <span class="number">1</span></div>' +
            '<div class="question">' +
                '<div class="statement"></div>' +
                '<div class="question-text"><!--Question text appended here?--></div>' +
            '</div>' +
            '<ul class="answers buttons">' +
                '<li class="display-solutions">?</li>' +
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'should-not-exists',
            level: 42,
            answers: [],
            operation: 'addition',
            question: {
                answer: 0,
                answersNeeded: 0
            },
            user: {
                answer: 0
            }
        };

        this.Game = $.extend({
            config: {
                gauge: {
                    id: 'gauge'
                }
            },
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul.answers').first(),
            $buttons: $('#qunit-fixture ul.buttons'),
            $statement: $('#qunit-fixture div.statement'),
            state: testState

        }, Game.prototype);

        localStorage.removeItem('should-not-exists');

        this.Game.initialize();
    },

    // Teardown callback runs after each test
    teardown: function () {

        // Test key must be unset after testing
        localStorage.removeItem('should-not-exists');
    }
});
test('Test HTML elements', 4, function () {

    var gameState        = this.Game.state,
        $answers         = this.Game.$answers.find('li.number'),
        $displaySolution = this.Game.$answers.find('li.display-solution'),
        $level           = this.Game.$game.find('.level .number');

    // Answer elements created?
    strictEqual($answers.length, 10, 'Game.$answers contains 10 answer elements.');

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var events = $._data( $(this.Game.$answers).get(0), 'events'),
        count  = 0;
    $.each(events, function (e) {
        count++;
    });
    strictEqual(count, 3, 'Answer element has 3 events.');

    // Test if question is created (question is random)
    strictEqual(typeof gameState.question.answer, 'number', 'typeof Game.state.question.answer equals to "number".');

    // Test if array gameState.answers contains answer objects
    strictEqual(gameState.answers.length, 10, 'Game.state.answers.length equals to 10.');
});

module('Game.prototype.initialize(): Test loadGameState', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div id="progress"><div id="gauge"></div></div>' +
        '<div class="game">' +
            '<script class="question-template" type="game/template">' +
                'Which numbers add up to: {{answer}}?.' +
            '</script>' +
            '<ul class="answers buttons">' +
                '<li class="display-solutions">?</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            storageKey: 'test-load-game-state',
            level: 42,
            answers: [
                {index: 0, answer: 3, selected: true, order:0, used: false, completes: false },
                {index: 1, answer: 2, selected: true, order:1, used: false, completes: false }
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
            config: {
                gauge: {
                    id: 'gauge',
                    max: 0
                }
            },
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul.answers').first(),
            $buttons: $('#qunit-fixture ul.buttons'),
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

    strictEqual(this.Game.state.level, 42, 'Game.state.level equals to number 42.');

    var $answers = this.Game.$answers.find('li.number');
    strictEqual($answers.eq(0).attr('data-index'), "0", 'First answer attribute data-index equals to "0"');
    strictEqual($answers.eq(0).attr('data-answer'), "3", 'First answer attribute data-answer equals to "3".');
    strictEqual($answers.eq(0).hasClass('selected'), true, 'First answer has class "selected."');
    strictEqual($answers.eq(0).hasClass('used'), false, 'First answer does not have class "selected."');
});



/**
 * Game.prototype.initOperation
 */
module('Game.prototype.initOperation()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<ul class="buttons operations">' +
            '<li class="addition" data-operation="addition">&#43;</li>' +
            '<li class="subtraction" data-operation="subtraction">&minus;</li>' +
            '<li class="multiplication" data-operation="multiplication">&times;</li>' +
            '<li class="division" data-operation="division">&divide;</li>' +
        '</ul>' +
        '<div class="game">' +
            '<div class="statement"></div>' +
            '<ul></ul>' +
        '</div>'
        )
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture div.game').find('ul').first(),
            state: {
                operation: null
            }
        }, Game.prototype);
    }
});
test('Test body background class for current math operation', 5, function () {

    this.Game.initOperation('addition');
    strictEqual($(document.body).hasClass('addition-operation'), true, 'Body has class "addition-operation".');

    this.Game.initOperation('subtraction');
    strictEqual($(document.body).hasClass('subtraction-operation'), true, 'Body has class "subtraction-operation".');

    this.Game.initOperation('multiplication');
    strictEqual($(document.body).hasClass('multiplication-operation'), true, 'Body has class "multiplication-operation".');

    this.Game.initOperation('division');
    strictEqual($(document.body).hasClass('division-operation'), true, 'Body has class "division-operation".');

    this.Game.state.operation = 'addition';
    this.Game.initOperation();
    strictEqual($(document.body).hasClass('addition-operation'), true, 'Body get class "addition-operation" from Game.state.operation .');
});
test('Test active/inactive classes on addition operation', 4, function () {

    this.Game.initOperation('addition');

    var $operations = $('#qunit-fixture ul.operations'),
        count = $operations.find('li').length;

    // li.addition has class "active"
    strictEqual($operations.find('li.addition').hasClass('active'), true, 'li.addition has class "active".');
    strictEqual($operations.find('li.active').length, 1, 'Only 1 active operation allowed.');

    // li.addition does not have class "inactive"
    strictEqual($operations.find('li.addition').hasClass('inactive'), false, 'li.addition does not have class "active".');
    strictEqual($operations.find('li.inactive').length, --count, 'Rest of list items have class "inactive".');
});
test('Test active/inactive classes on subtraction operation', 4, function () {

    this.Game.initOperation('subtraction');

    var $operations = $('#qunit-fixture ul.operations'),
        count = $operations.find('li').length;

    // li.subtraction has class "active"
    strictEqual($operations.find('li.subtraction').hasClass('active'), true, 'li.subtraction has class "active".');
    strictEqual($operations.find('li.active').length, 1, 'Only 1 active operation allowed.');

    // li.subtraction does not have class "inactive"
    strictEqual($operations.find('li.subtraction').hasClass('inactive'), false, 'li.subtraction does not have class "active".');
    strictEqual($operations.find('li.inactive').length, --count, 'Rest of list items have class "inactive".');
});
test('Test active/inactive classes on multiplication operation', 4, function () {

    this.Game.initOperation('multiplication');

    var $operations = $('#qunit-fixture ul.operations'),
        count = $operations.find('li').length;

    // li.multiplication has class "active"
    strictEqual($operations.find('li.multiplication').hasClass('active'), true, 'li.multiplication has class "active".');
    strictEqual($operations.find('li.active').length, 1, 'Only 1 active operation allowed.');

    // li.multiplication does not have class "inactive"
    strictEqual($operations.find('li.multiplication').hasClass('inactive'), false, 'li.multiplication does not have class "active".');
    strictEqual($operations.find('li.inactive').length, --count, 'Rest of list items have class "inactive".');
});
test('Test active/inactive classes on division operation', 4, function () {

    this.Game.initOperation('division');

    var $operations = $('#qunit-fixture ul.operations'),
        count = $operations.find('li').length;

    // li.division has class "active"
    strictEqual($operations.find('li.division').hasClass('active'), true, 'li.division has class "active".');
    strictEqual($operations.find('li.active').length, 1, 'Only 1 active operation allowed.');

    // li.division does not have class "inactive"
    strictEqual($operations.find('li.division').hasClass('inactive'), false, 'li.division does not have class "active".');
    strictEqual($operations.find('li.inactive').length, --count, 'Rest of list items have class "inactive".');
});


/**
 * Game.prototype.initGauge
 */
module('Game.prototype.initGauge(): Test initGauge', {

    // Setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div><div id="progress"><div id="gauge"></div></div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('qunit-fixture').find('ul').first(),
            config: {
                gauge: {
                    id: 'override',
                    min: 10,
                    max: 20
                }
            },
            state: {
                level:42
            }

        }, Game.prototype);
    }
});
test('Test initialize Gauge', 3, function () {

    this.Game.initGauge({
        id:'progress',
        min: 30,
        max: 50,
        value: 42 // Level
    });

    strictEqual($('#progress tspan:contains("42")').length, 1, 'Level value equals to 42".');
    strictEqual($('#progress tspan:contains("30")').length, 1, 'Minimal value equals to "30".');
    strictEqual($('#progress tspan:contains("50")').length, 1, 'Maximum value equals to "50".');
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
        '<button class="reset">Reset</button>' +
        '<div id="switch-operation">' +
            '<div data-operation="multiplication"><ul></ul></div>' +
        '</div>' +
        '<div class="game">' +
            '<ul class="answers buttons operations"><li></li><li class="display-solutions">?</li></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture .answers').first(),
            $buttons: $('#qunit-fixture .buttons'),
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
test('Test bindEvents for switch operation element', 1, function () {

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var $element = $('.operations'),
        events   = $._data( $element.get(0), 'events' );
    strictEqual(typeof events.click, 'object', 'Switch operation element has a click event.');
});
test('Test bindEvent for display solution button', 1, function () {

    // http://blog.jquery.com/2012/08/09/jquery-1-8-released/
    // .data() This is now removed in 1.8, but you can still get to the events data for debugging purposes
    // via $._data(element, "events"). Note that this is not a supported public interface;
    // the actual data structures may change incompatibly from version to version.
    var $element = $('#qunit-fixture').find('.display-solutions'),
        events   = $._data( $element.get(0), 'events' );
    strictEqual(typeof events.click, 'object', 'Display solution button element has a click event.');
});


/**
 * Game.prototype.events
 */
module('Game.prototype.events', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="darken">' +
        '<div id="progress"><div id="gauge"></div><div id="gauge"></div></div>' +
        '<div class="game">' +
            '<script id="question-addition-template" type="game/template">' +
                'Which numbers add up to: {{answer}}?.' +
            '</script>' +
            '<div class="level">Level <span class="number">1</span></div>' +
            '<div class="question">' +
                '<div class="statement"></div>' +
                '<div class="question-text"></div>' +
            '</div>' +
            '<ul class="answers buttons"></ul>' +
        '</div>' +
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
            config: {
                gauge: {
                    id: 'gauge'
                }
            },
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $buttons: $('#qunit-fixture .buttons'),
            $statement: $('div.statement'),
            state: this.testState
        }, Game.prototype);

        this.Game.initGauge();

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

    strictEqual($answer.hasClass('hover'), true, 'Answer element receives class "hover" on mouseenter.');
});
test('answerMouseleave', 2, function () {

    // Test mouseleave event on <li /> element
    jQuery('<li class="hover invalid-answer" data-answer="1">1</li>')
        .appendTo(this.Game.$answers);
    var $answer = this.Game.$answers.find('li').first()
        .addClass('hover')
        .trigger('mouseleave');

    strictEqual($answer.hasClass('hover'), false, 'Class "hover" is removed from answer element on mouseleave.');
    strictEqual($answer.hasClass('invalid-answer'), false, 'Class "invalid-answer" is removed from answer element on mouseleave.');
});
test('answerClick: Test cannot select invalid answer', 1, function () {

    this.Game.state.answers[0].selected = true; // selects number 2
    this.Game.state.answers[1].selected = true; // selects number 3

    // Test mouse click event on <li /> element
    jQuery(
    '<li class="selected" data-order="1" data-answer="1">1</li>' +
    '<li data-answer="2">2</li>'
    ).appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').eq(1)
        .trigger('click');

    // Test if answer can be selected
    strictEqual($answer.hasClass('selected'), false, 'Invalid answer does not contain class "selected".');

    $answer = this.Game.$answers.find('li').eq()
        .trigger('click');
});
test('answerClick: Test toggle answer selection/deselection', 3, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li class="number" data-answer="2">2</li>' +
    '<li class="number" data-answer="3">3</li>'
    ).appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li').eq(1)
        .trigger('click');

    // Test if answer can be selected
    strictEqual($answer.hasClass('selected'), true, 'Answer element receives class "selected" when selected.');

    $answer = this.Game.$answers.find('li').eq(1)
        .trigger('click');

    // Test if answer can be deselected
    strictEqual($answer.hasClass('selected'), false, 'Class "selected" is removed from answer element when deselected.');

    // Test if answer can be deselected
    strictEqual($answer.attr('data-order'), undefined, 'Data attribute data-order is removed from answer element when deselected.');
});
test('answerClick: Test property Game.state.user.answer', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="1">1</li>' +
    '<li class="selector" data-answer="2">2</li>' + // trigger click
    '<li data-answer="3">3</li>' +
    '<li data-answer="5">5</li>')
        .appendTo(this.Game.$answers);

    var $answer = this.Game.$answers.find('li.selector')
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
    '<li class="number" data-answer="1">1</li>'+
    '<li class="number selected" data-answer="2" data-order="0">2</li>'+
    '<li class="number" data-answer="3">3</li>'+ // trigger click on eq(2), 5 is the answer
    '<li class="number" data-answer="4">4</li>')
        .appendTo(this.Game.$answers);

    // Test if correct answer receives class "used"
    var $answer = this.Game.$answers.find('li').eq(2) // contains the answer 3
        .trigger('click');
    strictEqual($answer.hasClass('used'), true, 'Correct answer receives class "used" on click.');
});
test('answerClick: Test if Game state is saved', 1, function () {

    jQuery(
    '<li class="number" data-index="0" data-answer="9">9</li>' +
    '<li class="number" data-index="1" data-answer="5">5</li>')
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

    // Game state is saved before answer selection is toggles
    strictEqual(isSelected, false, 'Game.state.answers[0].selected equals to false');
});
test('answerClick: Test if selected answer has a data attribute data-order=""', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li class="number selected" data-order="0" data-answer="1">1</li>' +
    '<li class="number selected" data-order="1" data-answer="2">3</li>' +
    '<li class="number" data-answer="3">3</li>') // trigger click, data-order="2"
        .appendTo(this.Game.$answers);

    var $element = this.Game.$answers.find('li').last()
        .trigger('click');

    // Selected element receives data-order="2"
    strictEqual($element.attr('data-order'), "2", 'Clicked answer has data-order attribute equal to "2".');
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
                '<li class="number used" data-answer="3">3</li>' +
                // For testing purposes, same answers are being used.
                // The answers for x,y are randomly chosen.
                // The results for operations subtraction and division have two possible outcomes.
                // By using equal numbers, there will be only a single result: [-] (3-3), [/] (3/3).
                '<li class="number" data-answer="3">3</li>' +
                '<li class="number" data-answer="3">3</li>' +
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

    this.Game.newQuestionCycle('subtraction');
    strictEqual(this.Game.state.operation, 'subtraction', 'Game.state equals to "subtraction".');
});
test('Test if Game State is saved', 1, function () {

    var result = this.Game.newQuestionCycle('subtraction'),
        testString = JSON.stringify(this.Game.state);
    strictEqual(localStorage.getItem('test-save-game-state'), JSON.stringify(this.Game.state), 'localStorage.getItem("test-save-game-state") equals to JSON.stringify(this.Game.state)');
});
test('Test if a new addition question is created', 3, function () {

    var question = this.Game.newQuestionCycle();

    strictEqual(this.Game.state.user.answer, null, 'Game.state.user.answer equals to null.');
    strictEqual(question.answer, 6, 'Game.state.question.answer equals to 6.');
    strictEqual(question.answersNeeded, 2, 'Game.state.question.answersNeeded equals to 2.');
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
                '<li class="display-solutions">?</li>' +
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
    strictEqual(level, 43, 'New level equals to number 43.');
});
test('Test creation of answer elements after level cycle', 1, function () {

    var level = this.Game.newLevelCycle.call(this.Game),
        answerCount = this.Game.$answers.find('li.number').length;
    strictEqual(answerCount, 10, 'New level should contain 10 answers (default).');
});

/**
 * Game.prototype.newAnswers()
 */
module('Game.prototype.newAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">' +
            '<ul>' +
                '<li class="display-solutions">?</li>' +
            '</ul>' +
        '</div>')
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
test('Test if answer elements are created', 2, function () {

    var $answers = this.Game.newAnswers();

    strictEqual($answers.find('li.number').length, 10, 'Amount of answer elements created equals to 10.');

    var testSequence    = [7,8,9,4,5,6,1,2,3,0],
        correctSequence = true,
        $elements       = $answers.find('li.number');

    for (var i=0; i<testSequence.length; i++) {

        var value = parseInt($elements.eq(i).attr('data-answer'), 10);
        if (value!==testSequence[i]) {
            correctSequence = false; break;
        }
    }
    strictEqual(correctSequence, true, 'Correct answer sequence is 7,8,9,4,5,6,1,2,3,0');
});
test('Test if all answer elements contain the correct number', 1, function () {

    var $answers = this.Game.newAnswers();

    var result = true;
    $answers.find('li.number').each(function() {

        var $this = $(this);

        if ($this.text()!==$this.attr('data-answer')) {
            result = false;
        }
    });
    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test if all answer elements have HTML5 data-index attribute', 1, function () {

    var $answers = this.Game.newAnswers();

    var result = true;
    $answers.find('li').each(function() {

        if (typeof $(this).attr('data-index')===undefined) {
            result = false;
        }
    });
    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test if all answer elements have HTML5 data-answer attribute', 1, function () {

    var $answers = this.Game.newAnswers(),
        result   = true;

    $answers.find('li.number').each(function() {

        if (typeof $(this).attr('data-answer')==='undefined') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});
test('Test answer objects in Game.state.answers', 1, function () {

    this.Game.newAnswers();
    var answers = this.Game.state.answers;

    strictEqual(answers.length, 10, 'Game.state.answers.length equals to 8');
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
test('Test new question', 2, function () {

    var availableAnswers = $('#qunit-fixture li'),
        template = '#qunit-fixture #question-template',
        question = Game.prototype.newQuestion('addition', availableAnswers, template);

    strictEqual(question.answer, 6, 'Question.answer equals to 6.');
    strictEqual(question.answersNeeded, 2, 'Question.answersNeeded equals to 2.');
});



/**
 * Game.prototype.calculate()
 */
module('Game.prototype.calculate()');
test('Test calculate answer', 4, function () {

    var answer;

    answer = Game.prototype.calculate('addition', 12, 4);
    strictEqual(answer, 16, '12 + 4 equals 16.');

    answer = Game.prototype.calculate('subtraction', 12, 4);
    strictEqual(answer, 8, '12 - 4 equals to 8.');

    answer = Game.prototype.calculate('multiplication', 12, 4);
    strictEqual(answer, 48, '12 * 4 equals to 48.');

    answer = Game.prototype.calculate('division', 12, 4);
    strictEqual(answer, 3, '12 / 4 equals to 3.');
});
test('Test cannot calculate answer', 4, function () {

    var answer;

    answer = Game.prototype.calculate('addition', 12, NaN);
    strictEqual(isNaN(answer), true, '12 + NaN equals NaN.');

    answer = Game.prototype.calculate('subtraction', NaN, 4);
    strictEqual(isNaN(answer), true, 'NaN + 4 equals NaN.');

    answer = Game.prototype.calculate('multiplication', NaN, NaN);
    strictEqual(isNaN(answer), true, 'NaN + NaN equals NaN.');

    answer = Game.prototype.calculate('division', 1, 0);
    strictEqual(answer, undefined, '1 / 0 equals undefined.');
});


/**
 * Game.prototype.toggleSelected()
 */
module('Game.prototype.toggleSelected()', {

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
test('Test selection of answer', 2, function () {

    var $answers = jQuery(
    '<li class="selected" data-order="0" data-answer="1" >1</li>' +
    '<li data-answer="2">2</li>' +
    '<li data-answer="3">3</li>'
    ).appendTo(this.Game.$answers);
    var $selected = this.Game.toggleSelected($answers.eq(1));

    strictEqual($selected.hasClass('selected'), true, 'Answer has class "selected".');
    strictEqual($selected.attr('data-order'), "1", 'Answer data-order attribute equals to number "1".');
});
test('Test deselection of answer', 2, function () {

    var $answers = jQuery(
    '<li data-answer="1" data-order="0">1</li>' +
    '<li class="selected" data-answer="2" data-order="10">2</li>' +
    '<li data-answer="3" data-order="2">3</li>'
    ).appendTo(this.Game.$answers);
    var $selected = this.Game.toggleSelected($answers.eq(1));

    strictEqual($selected.hasClass('selected'), false, 'Answer has no class "selected".');
    strictEqual($selected.attr('data-order'), undefined, 'Answer does not have a data-order attribute.');
});


/**
 * Game.prototype.reset()
 */
module('Game.prototype.reset()', {

    // Setup callback runs before each test
    setup: function () {
        jQuery(
        '<div id="progress"><div id="gauge"></div></div>' +
        '<div class="game">' +
            '<script class="question-addition-template" type="game/template">Which numbers add up to {{answer}}?</script>' +
            '<div class="question"><div class="statement"></div></div>' +
            '<ul>' +
                '<li class="number used" data-answer="1">1</li>' +
                '<li class="number" data-answer="2">2</li>' +
                '<li class="number" data-answer="3">3</li>' +
                '<li class="display-solutions">?</li>' +
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
            config: {
                gauge: {
                    id: 'gauge'
                }
            },
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
    strictEqual(this.Game.$answers.find('li.number').length, 10, 'New Game contains 10 new answers.');
    var string = localStorage.getItem('test-reset');
    var state = $.parseJSON(string);
    strictEqual(state.operation, 'subtraction', 'Game.state.operation equals to "subtraction".');
        strictEqual(state.answers.length, 10, 'New State contains 10 new answers.');
});
test('Test reset game level progress', 1, function () {

    this.Game.reset('subtraction');
    strictEqual($('#gauge').is(':empty'), false, 'Gauge container is not empty.');
});

/**
 * Game.prototype.resetAnswers()
 */
module('Game.prototype.resetAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize answers, two answers are selected
        jQuery(
        '<div class="game">' +
            '<ul>' +
                // Remove class "selected", remove data-order attribute
                '<li style="background-color:red;" class="selected" class="solution" data-order="0" data-answer="1">1</li>' +
                '<li style="background-color:green;" class="selected" class="solution" data-order="1" data-answer="2">2</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test deselection of answers', 4, function () {

    var $answers = this.Game.$answers.find('li.numbers');
    this.Game.resetAnswers($answers);

    strictEqual($answers.find('li.solution').length, 0, 'Class "solution" removed from all answers ($answers.length equals to 0).');
    strictEqual($answers.find('li.selected').length, 0, 'Class "selected" removed from all answers ($answers.length equals to 0).');
    strictEqual($answers.attr('data-order'), undefined, 'data-order attribute is removed.');
    strictEqual($answers.attr('style'), undefined, 'style attribute is cleared.');
});



/**
 * Game.prototype.getAvailableAnswers()
 */
module('Game.prototype.getAvailableAnswers()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize answers, two answers are selected
        jQuery(
        '<div class="game">' +
            '<ul>' +
                '<li data-answer="1" class="number used">1</li>' +
                '<li data-answer="2" class="number">2</li>' +
                '<li data-answer="3" class="number">3</li>' +
                '<li class="equal">=</li>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test get available answers', 1, function () {

    var $answers = this.Game.getAvailableAnswers();
    strictEqual($answers.length, 2, 'Count available answers equals to 2.');
});



/**
 * Game.prototype.getSolutions()
 */
module('Game.prototype.getSolutions()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize answers, available answers = 1
        jQuery(
        '<div class="game">' +
            '<ul>' +
            '</ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        var testState = {
            operation: '',
            question: {
                answer: null
            }
        };

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first(),
            state: testState
        }, Game.prototype);
    }
});
test('Test no solutions found', 1, function () {

    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 42;

    jQuery(
        '<li data-answer="0">0</li>' +
        '<li data-answer="1">1</li>' +
        '<li data-answer="2">2</li>' +
        '<li data-answer="3">3</li>' +
        '<li data-answer="4">4</li>' +
        '<li data-answer="5">5</li>' +
        '<li data-answer="6">6</li>' +
        '<li data-answer="7">7</li>' +
        '<li data-answer="8">8</li>' +
        '<li data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    var solutions = this.Game.getSolutions();
    strictEqual(solutions.length, 0, 'No solutions for answer 42');
});
test('Test get all solutions that multiply to 12 when no numbers are selected', 5, function () {

    this.Game.state.operation       = 'multiplication';
    this.Game.state.question.answer = 12;

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number" data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    var solutions = this.Game.getSolutions(),
        $solution, x, y;

    strictEqual(solutions.length, 2, 'Two solutions multiply to 12 (6*2, 4*3).');

    $solution = $(solutions[0]);
    x = parseInt($solution.eq(0).attr('data-answer'), 10);
    y = parseInt($solution.eq(1).attr('data-answer'), 10);
    strictEqual(x, 6, 'First solution x equals to 6.');
    strictEqual(y, 2, 'First solution y equals to 2.');

    $solution = $(solutions[1]);
    x = parseInt($solution.eq(0).attr('data-answer'), 10);
    y = parseInt($solution.eq(1).attr('data-answer'), 10);
    strictEqual(x, 4, 'First solution x equals to 4.');
    strictEqual(y, 3, 'First solution y equals to 3.');
});
test('Test get all solutions for 2 * x = 12, with number 2 selected', 3, function () {

    this.Game.state.operation       = 'multiplication';
    this.Game.state.question.answer = 12;

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number selected" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number" data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    var solutions = this.Game.getSolutions(),
        $solution = $(solutions[0]),
        x, y;

    strictEqual(solutions.length, 1, 'Only one solution multiplies to 12 (2*6).');
    x = parseInt($solution.eq(0).attr('data-answer'), 10);
    y = parseInt($solution.eq(1).attr('data-answer'), 10);
    strictEqual(x, 2, 'x equals to 2.');
    strictEqual(y, 6, 'y equals to 6.');
});
test('Test get all solutions for x - y = -9, with no numbers selected', 3, function () {

    this.Game.state.operation       = 'subtraction';
    this.Game.state.question.answer = -9;

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number" data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    var solutions = this.Game.getSolutions(),
        $solution = $(solutions[0]),
        x, y;

    strictEqual(solutions.length, 1, 'Only one solution subtracts to -9 (0-9).');
    x = parseInt($solution.eq(0).attr('data-answer'), 10);
    y = parseInt($solution.eq(1).attr('data-answer'), 10);
    strictEqual(x, 0, 'x equals to 0.');
    strictEqual(y, 9, 'y equals to 9.');
});
test('Test get all solutions for x / y = 0.375, with no numbers selected', 3, function () {

    this.Game.state.operation       = 'division';
    this.Game.state.question.answer = 0.375;

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number" data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    var solutions = this.Game.getSolutions(),
        $solution = $(solutions[0]),
        x, y;

    strictEqual(solutions.length, 1, 'Only one solution divides to 0.375 (3/8).');
    x = parseInt($solution.eq(0).attr('data-answer'), 10);
    y = parseInt($solution.eq(1).attr('data-answer'), 10);
    strictEqual(x, 3, 'x equals to 3.');
    strictEqual(y, 8, 'y equals to 8.');
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
    strictEqual($result.attr('data-order'), "0", 'First element data-order attribute equals to "0".');
});
test('Test order data attribute on selected answers', 1, function () {

    jQuery(
    '<li class="selected" data-order="0" data-answer="1">1</li>' +
    '<li class="selected" data-order="1" data-answer="2">2</li>' +
    '<li class="selected" data-answer="3">3</li>') // set order on this element
        .appendTo(this.Game.$answers);

    var $selected = this.Game.$answers.find('li.selected');
    var $result = this.Game.addAnswerToOrder($selected);
    strictEqual($result.attr('data-order'), "2", 'Element data-order attribute equals to "2".');
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
test('Test selected answer can complete the question', 1, function () {

    jQuery(
    '<li class="solution" data-answer="2">2</li>'+
    '<li class="solution" data-answer="2">2</li>'+
    '<li class="selected" data-answer="3">3</li>')
        .appendTo(this.Game.$answers);

    this.Game.state = {
        operation: 'addition',
        question: {
            answer: 5,
            answersNeeded: 2
        },
        user: {
            answer: 3
        }
    };

    var $selected  = this.Game.$answers.find('li.selected'),
        $solutions = this.Game.$answers.find('li.solution'),
        result     = this.Game.isInvalidAnswer($selected, $solutions);
    strictEqual(result.length, 0, 'Result.length equals to 0. Selected answer can complete the question.');
});
test('Test selected answer cannot complete the question', 1, function () {

jQuery(
'<li data-answer="21">21</li>'+
'<li data-answer="22">22</li>'+
'<li class="selected" data-answer="3">3</li>')
    .appendTo(this.Game.$answers);

this.Game.state = {
    operation: 'addition',
    question: {
        answer: 5,
        answersNeeded: 2
    },
    user: {
        answer: 3
    }
};

var $selected     = this.Game.$answers.find('li.selected'),
    $solutions    = this.Game.$answers.find('li.solution'), // no solution exist
    result        = this.Game.isInvalidAnswer($selected, $solutions),
    isContaining  = $.inArray(1, result)!==-1 ? true : false;
strictEqual(isContaining, true, 'Result contains number 1: Selected answer cannot complete the question.');
});
test('Test invalid addition', 1, function () {

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

    var $selected     = $('#qunit-fixture').find('.selected'),
        result        = this.Game.isInvalidAnswer($selected),
        isContaining  = $.inArray(40, result)!==-1 ? true : false;
    strictEqual(isContaining, true, 'Result contains number 40: User answer is higher then question answer.');
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

    var selected     = $('#qunit-fixture').find('.selected'),
        result       = this.Game.isInvalidAnswer(selected),
        isContaining = $.inArray(50, result)!==-1 ? true : false;

    strictEqual(isContaining, true, 'Result contains number 50: User answer is lower then question answer.');
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
        '<li class="number used">1</li>' +
        '<li class="number">2</li>' + // 2 available answers (2 & 3)
        '<li class="number">3</li>' +
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

    jQuery('<li class="selected answer-co" data-answer="1">1</li><li class="selected" data-answer="2">2</li>')
        .appendTo('#qunit-fixture');

    var $fixture = $('#qunit-fixture');
    var $answers = $fixture.find('li');

    Game.prototype.markAnswersAsUsed($answers); // all answers get class "used"

    strictEqual($fixture.find('li.used').length, 2, 'All answers elements have class="used".');
    strictEqual($fixture.find('li.solution').length, 0, 'Class="solution" is removed from all answers.');
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
            '<ul class="answers">' +
                '<li class="display-solutions">?</li>' +
            '</ul>'+
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
test('Test if answers are setup', 15, function () {

    var answers = [
        {index: 0, answer: 1, selected: false, order: 1, used: true, completes: false},
        {index: 1, answer: 2, selected: true, order: 0, used: false, completes: false},
        // fill up to 12 answers, answers setup are truncated to 10 in total
        {index: 2, answer: 3, selected: false, used: false, completes: false},
        {index: 3, answer: 3, selected: false, used: false, completes: false},
        {index: 4, answer: 3, selected: false, used: false, completes: false},
        {index: 5, answer: 3, selected: false, used: false, completes: false},
        {index: 6, answer: 3, selected: false, used: false, completes: false},
        {index: 7, answer: 3, selected: false, used: false, completes: false},
        {index: 8, answer: 3, selected: false, used: false, completes: false},
        {index: 9, answer: 3, selected: false, used: false, completes: false},
        {index: 10, answer: 3, selected: false, used: false, completes: false},
        {index: 11, answer: 3, selected: false, used: false, completes: false}
    ];

    var result = this.Game.setupAnswerElements(answers);
    strictEqual(result, true, 'Returns true when answers are setup');

    var $answers = this.Game.$answers.find('li.number');
    strictEqual($answers.length, 10, '<ul/> element contains 10 elements with class "number".');

    strictEqual($answers.eq(0).hasClass('number'), true, 'First <li/> element has class="number".');
    strictEqual($answers.eq(0).attr('data-index'), '0', 'First <li/> element has data-index attribute equal to "0".');
    strictEqual($answers.eq(0).attr('data-answer'), '1', 'First <li/> element has data-answer attribute equal to "1".');
    strictEqual($answers.eq(0).hasClass('selected'), false, 'First <li/> element does not has class="selected".');
    strictEqual($answers.eq(0).attr('data-order'), '1', 'First <li/> element has data-order attribute equal to "1".');
    strictEqual($answers.eq(0).hasClass('used'), true, 'First <li/> element has class="used".');

    strictEqual($answers.eq(1).hasClass('number'), true, 'Second <li/> element has class="number".');
    strictEqual($answers.eq(1).attr('data-index'), '1', 'Second <li/> element has data-index attribute equal to "1".');
    strictEqual($answers.eq(1).attr('data-answer'), '2', 'Second <li/> element has data-answer attribute equal to "2".');
    strictEqual($answers.eq(1).hasClass('selected'), true, 'Second <li/> element has class="selected".');
    strictEqual($answers.eq(1).attr('data-order'), '0', 'Second <li/> element has data-order attribute equal to "0".');
    strictEqual($answers.eq(1).hasClass('used'), false, 'Second <li/> element does not have class="used".');


    var $button = this.Game.$answers.find('li.display-solutions');
    strictEqual($button.length, 1, 'Display solution button must exists.');

});
test('Test when answers could not be setup', 2, function () {

    var answers = [
        {index: 0, answer: 1, selected: false, used: true},
        {} // does not contain the answer properties
    ];

    var result = this.Game.setupAnswerElements(answers);
    strictEqual(result, false, 'Returns false when answers could not be setup');

    var $answers = this.Game.$answers.find('li.number');
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
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
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
test('Test display invalid answer', 1 , function () {

    var $answer = this.Game.$answers.last(),
        $result = this.Game.displayInvalidAnswer($answer);
    strictEqual($result.hasClass('selected'), false, 'Class "selected" is removed from answer element.');
});



/**
 * Game.prototype.displaySolutions()
 */
module('Game.prototype.displaySolutions()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<div class="statement">' +
                '<span class="number x">x</span>' +
                '<span class="number y">y</span>' +
            '</div>' +
            '<ul></ul>' +
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            $statement: $('#qunit-fixture div.statement'),
            state: {
                operation: 'multiplication',
                question: {
                    answer: null
                }
            }
        }, Game.prototype);
    }
});
test('Test display solutions, with no numbers selected', 12 , function () {

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number" data-answer="9">9</li>' +
        '<li class="display-solutions">?</li>'
    ).appendTo(this.Game.$answers);

    this.Game.state.question.answer = 6;

    var $answers  = this.Game.$answers,
        $numbers  = this.Game.$statement,
        $solution = this.Game.$answers.find('.display-solutions'),
        $x        = this.Game.$statement.find('.x'),
        $y        = this.Game.$statement.find('.y'),
        timing    = 100,
        timingX   = 0.1*timing,       // test delay offset
        timingY   = (0.5+0.1)*timing, // test delay offset
        solutions = this.Game.displaySolutions(timing);

    // Display solutions button contains class "active"
    strictEqual($solution.hasClass('active'), true, '<li class="display-solutions"/> contains class "active".');

    stop();

    // First solution
    setTimeout(function () {

        strictEqual($answers.find('[data-answer="6"]').hasClass('solution'), true, 'First solution x: number 6 has classes "solution".');
        strictEqual($x.text(), '6', 'First solution statement x equals to string "6".');
    }, timingX);
    setTimeout(function () {

        strictEqual($answers.find('[data-answer="1"]').hasClass('solution'), true, 'First solution y: number 1 has classes "solution".');
        strictEqual($y.text(), '1', 'First solution statement y equals to string "1".');
    }, timingY);

    // Second solution
    setTimeout(function () {

        strictEqual($answers.find('[data-answer="3"]').hasClass('solution'), true, 'Second solution x: number 3 has classes "solution".');
        strictEqual($x.text(), '3', 'Second solution statement x equals to string "3".');
    }, timing+timingX);
    setTimeout(function () {

        strictEqual($answers.find('[data-answer="2"]').hasClass('solution'), true, 'Second solution y: number 2 has classes "solution".');
        strictEqual($y.text(), '2', 'Second solution statement x equals to string "2".');
    }, timing+timingY);

    // After display sequence completed
    setTimeout(function () {

        strictEqual($solution.hasClass('active'), false, '<li class="display-solutions"/> does not contain class "active".');
        strictEqual($x.text(), '?', 'Statement x equals to string "?".');
        strictEqual($x.text(), '?', 'Statement x equals to string "?".');

        // continue test
        start();
    }, 2*timing);
});
test('Test display solutions, with number 9 selected', 4, function () {

    jQuery(
        '<li class="number" data-answer="0">0</li>' +
        '<li class="number" data-answer="1">1</li>' +
        '<li class="number" data-answer="2">2</li>' +
        '<li class="number" data-answer="3">3</li>' +
        '<li class="number" data-answer="4">4</li>' +
        '<li class="number" data-answer="5">5</li>' +
        '<li class="number" data-answer="6">6</li>' +
        '<li class="number" data-answer="7">7</li>' +
        '<li class="number" data-answer="8">8</li>' +
        '<li class="number selected active" data-answer="9">9</li>'
    ).appendTo(this.Game.$answers);

    this.Game.state.question.answer = 63; // = 9 * 7

    var $answers  = this.Game.$answers,
        $numbers  = this.Game.$statement,
        $x        = this.Game.$statement.find('.x'),
        $y        = this.Game.$statement.find('.y'),
        timing    = 100,
        timingX   = 0.1*timing,       // test delay offset
        timingY   = (0.5+0.1)*timing, // test delay offset
        solutions;

    $x.addClass('active').text('9'); // selected

    solutions = this.Game.displaySolutions(timing);

    stop();

    // Single solution
    setTimeout(function () {

        strictEqual($answers.find('[data-answer="7"]').hasClass('solution'), true, 'Single solution y: number 7 has classes "solution".');
        strictEqual($y.hasClass('active'), false, 'Single solution statement y does not contain class "active".');
        strictEqual($y.text(), '7', 'Single solution statement y equals to string "7".');
    }, timingX);

    // After display sequence completed
    setTimeout(function () {

        strictEqual($x.text(), '9', 'Statement x equals to string "9".');

        // continue test
        start();
    }, 2*timing);
});


/**
 * Game.prototype.displayLevelProgress()
 */
module('Game.prototype.displayLevelProgress()', {

    // Setup callback runs before each test
    setup: function () {

        // Initialize HTML
        jQuery(
        '<div id="progress"><div id="gauge"></div></div>' +
        '<div class="game">' +
            '<ul>' +
                '<li class="used">1</li>' +
                '<li class="used">2</li>' +
                '<li>3</li>' +
            '</ul>' +
        '</div>'
        ).appendTo('#qunit-fixture');

        this.Game = $.extend({
            config: {
                gauge: {
                    id: 'gauge',
                    min: 0,
                    max: 100,
                    value: 50
                }
            },
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul'),
            state: {
                operation: 'multiplication',
                level: 42
            }
        }, Game.prototype);
        this.Game.initGauge({
            id: 'gauge',
            min: 36,
            max: 64,
            value: 52
        });
    }
});
test('Test if level progress is being displayed', 3, function () {

    var result = this.Game.displayLevelProgress();

    strictEqual($('#gauge tspan:contains("42")').length, 1, 'Level value equals to "42".');
    strictEqual($('#gauge tspan:contains("36")').length, 1, 'Minimal value equals to "36".');
    strictEqual($('#gauge tspan:contains("64")').length, 1, 'Maximum value equals to "64".');
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
                    // <span class="number"><span>2</span></span>
                    // <span class="operation">&divide;</span>
                    // <span class="number"><span>11</span></span>
                    // <span class="equal">=</span>
                    // <!-- note: shows vinculus class on repeating decimal -->
                    // <span class="number answer"><span>0.<span class="vinculus">18</span></span></span>
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
                    answer: 6
                },
                user: {
                    answer: null
                }
            }
        }, Game.prototype);
    }
});
test('Test .displayQuestion() Test existence of statement span elements ', 6, function () {

    // Setup question answered
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 6; // selected answers 1 & 5

    this.Game.displayQuestion();

    var $context   = $('#qunit-fixture'),
        $statement = $context.find('div.statement'),
        $x         = $statement.find('span.number').eq(0),
        $y         = $statement.find('span.number').eq(1),
        text       = $context.find('div.question-text').text(),
        classCount = 0;

    strictEqual(text, 'Which numbers add up to 6?', 'Element with class="text" has text that equals to "Which numbers add up to 6?".');

    classCount = $statement.find('span.number').length;
    strictEqual(classCount, 3, 'Statement contains 3 span elements with class of "number"');

    classCount = $statement.find('span.operation').length;
    strictEqual(classCount, 1, 'Statement contains 1 span element with class of "operation"');

    classCount = $statement.find('span.equal').length;
    strictEqual(classCount, 1, 'Statement contains 1 span element with class of "equal"');

    strictEqual($x.hasClass('x'), true, 'First span.number contains class "x".');
    strictEqual($y.hasClass('y'), true, 'First span.number contains class "y".');
});
test('Test .displayQuestion() Test classes for all math operations', 12, function () {

    var $span;

    // Test class if span.operation exists
    this.Game.state.operation = 'addition';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.operation');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "operation".');
    strictEqual($span.hasClass('addition'), true, 'div.statement contains one <span> element with class "addition".');
    strictEqual($span.text(), '+', 'span.operation contains string "&plus;".');

    // Test class if span.operation exists
    this.Game.state.operation = 'subtraction';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.operation');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "operation".');
    strictEqual($span.hasClass('subtraction'), true, 'div.statement contains one <span> element with class "subtraction".');
    strictEqual($span.text(), '−', 'span.operation contains string "&minus;".');

    // Test class if span.operation exists
    this.Game.state.operation = 'multiplication';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.operation');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "operation".');
    strictEqual($span.hasClass('multiplication'), true, 'div.statement contains one <span> element with class "multiplication".');
    strictEqual($span.text(), '×', 'span.operation contains string "&times;".');

    // Test class if span.operation exists
    this.Game.state.operation = 'division';
    this.Game.displayQuestion();
    $span = this.Game.$statement.find('span.operation');
    strictEqual($span.length, 1, 'div.statement contains one <span> element with class "operation".');
    strictEqual($span.hasClass('division'), true, 'div.statement contains one <span> element with class "division".');
    strictEqual($span.text(), '÷', 'span.operation contains string "&divide;".');
});
test('Test .displayQuestion() Statement shows given answer for x', 4, function () {

    // Remove answers
    this.Game.$answers.find('li').remove();

    jQuery(
        '<li data-answer="1">1</li>' +
        '<li class="selected" data-answer="5" data-order="0">5</li>')
    .appendTo(this.Game.$answers);

    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 5; // selected answer is 5

    this.Game.displayQuestion();

    // First span.number contains the single answer entered.
    // First span.number contains class "active".
    var $spans = this.Game.$statement.find('span.number');
    strictEqual($spans.eq(0).text(), '5', 'First span.number contains the string "5".');
    strictEqual($spans.eq(0).hasClass('active'), true, 'First span.number contains class "active".');

    // Second span.number contains the string '?'.
    // Second span.number does not contain class "active".
    strictEqual($spans.eq(1).text(), '?', 'Second span.number contains the string "?".');
    strictEqual($spans.eq(1).hasClass('active'), false, 'Second span.number does not contain class "active".');
});
test('Test .displayQuestion() Statement contains 2 answers for x and y', 4, function () {

    // Setup test "<span>1</span> <span>+<span> <span>5</span> = 6"
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 6;
    this.Game.state.user.answer     = 6; // selected answers 1 & 5

    this.Game.displayQuestion();

    var $spans = this.Game.$statement.find('span.number');

    // First span.number contains the first answer.
    // First span.number contains class "active".
    strictEqual($spans.eq(0).text(), '1', 'First span.number contains the string "1".');
    strictEqual($spans.eq(0).hasClass('active'), true, 'First span.number contains class "active".');

    // Second span.number contains the second answer.
    // Second span.number contains class "active".
    strictEqual($spans.eq(1).text(), '5', 'Second span.number contains the string "5".');
    strictEqual($spans.eq(1).hasClass('active'), true, 'Second span.number contains class "active".');
});
test('Test .displayQuestion() Test if repeating decimals are grouped by vinculus', 2, function () {

    // Setup test
    this.Game.$answers.remove('li');
    jQuery(
    '<li class="selected" data-answer="2" data-order="0">2</li>' +
    '<li class="selected" data-answer="11" data-order="1">11</li>')
        .appendTo(this.Game.$answers); // 2 / 11

    this.Game.state.operation       = 'division';
    this.Game.state.question.answer = 2/11;
    this.Game.state.user.answer     = 2/11;

    this.Game.displayQuestion();

    // Answer has a vinculus class on repeating decimals
    // <span class="number answer"><span>0.<span class="vinculus">18</span></span></span>
    var $repeatingDecimal = this.Game.$statement.find('span.answer span.vinculus');
    strictEqual($repeatingDecimal.length>0, true, 'Repeating decimal 18 has class "vinculus".');
    strictEqual($repeatingDecimal.text(), '18', 'Span contains repeating decimal 18.');
});
test('Test .displayQuestion() Test terminating decimal', 2, function () {

    // Setup test
    this.Game.state.operation       = 'addition';
    this.Game.state.question.answer = 0.375;
    this.Game.state.user.answer     = 6; // selected answers 1 & 5

    this.Game.displayQuestion();

    // Answer contains a terminating decimal. Class "vinculus" should not be present
    // <span class="number answer"><span>0.375</span></span>
    var $repeatingDecimal = this.Game.$statement.find('span.answer');
    strictEqual($repeatingDecimal.hasClass('vinculus'), false, 'Terminating decimal 0.375 does not have a class "vinculus".');
    strictEqual($repeatingDecimal.text(), '0.375', 'Span contains terminating decimal 0.375.');
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
                {index: 0, order:1, answer: 1, selected: false, used: true},
                {index: 1, order:0, answer: 2, selected: true, used: false}
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
                '<li class="number used" data-index="0" data-answer="1">1</li>'+
                '<li class="number selected" data-index="1" data-answer="2" data-order="0">2</li>'+
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
test('Test if Game State is saved to Storage', 9, function () {

    // Save Game State to Storage
    var result = this.Game.saveGameState('test-save-game-state'),
        gameState = $.parseJSON(localStorage.getItem('test-save-game-state'));

    // Test first answer
    strictEqual(gameState.answers[0].index, "0", 'gameState.answers[0].index equals to "0"');
    strictEqual(gameState.answers[0].answer, "1", 'gameState.answers[0].answer equals to "1"');
    strictEqual(gameState.answers[0].selected, false, 'gameState.answers[0].selected equals to false');
    strictEqual(gameState.answers[0].used, true, 'gameState.answers[0].used equals to true');

    // Test second answer
    strictEqual(gameState.answers[1].index, "1", 'gameState.answers[1].index equals to "1"');
    strictEqual(gameState.answers[1].answer, "2", 'gameState.answers[1].answer equals to "2"');
    strictEqual(gameState.answers[1].selected, true, 'gameState.answers[1].selected equals to true');
    strictEqual(gameState.answers[1].order, "0", 'gameState.answers[1].order equals to "0"');
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
 * Game.prototype.getRepeatingDecimalProperties()
 */
module('Game.prototype.getRepeatingDecimalProperties()');
test('test with invalid input', function () {

    var fn = Game.prototype.getRepeatingDecimalProperties;
    deepEqual(fn(''), [], 'fn("") equals to empty array.');
    deepEqual(fn([]), [], 'fn([]) equals to empty array.');
    deepEqual(fn({}), [], 'fn({}) equals to empty array.');
    deepEqual(fn(Math.PI), [], 'fn(Math.PI) equals to empty array.');
    deepEqual(fn(null), [], 'fn(null) equals to empty array.');
    deepEqual(fn(true), [], 'fn(true) equals to empty array.');
    deepEqual(fn(Infinity), [], 'fn(Infinity) equals to empty array.');
    deepEqual(fn(NaN), [], 'fn(NaN) equals to empty array.');
    deepEqual(fn(1 / 5), [], 'fn(1 / 5) equals to empty array.');
    deepEqual(fn(1 / 100), [], 'fn(1 / 100) equals to empty array.');
    deepEqual(fn('1.2.3'), [], 'fn(1.2.3) equals to empty array.');
    deepEqual(fn('1.333333'), [], 'fn(1.333333) equals to empty array.');
});
test('test with decimal numbers as string', function () {

    var fn = Game.prototype.getRepeatingDecimalProperties;
    deepEqual(fn('1.1111111111'), ['1', '', '1'], "fn('1.1111111111') equals to array ['1', '', '1'].");
    deepEqual(fn('1234.11111111111'), ['1234', '', '1'], "fn('1234.11111111111') equals to array ['1234', '', '1'].");
    deepEqual(fn('1.12312311111111'), ['1', '123123', '1'], "fn('1.12312311111111') equals to array ['1', '123123', '1'].");

    deepEqual(fn('12.12121212121212'), ['12', '', '12'], "fn('12.12121212121212') equals to array ['12', '', '12'].");
    deepEqual(fn('1234.1111212121212'), ['1234', '111', '12'], "fn('1234.1111212121212') equals to array ['1234', '111', '12'].");
    deepEqual(fn('2.123412341234'), ['2', '', '1234'], "fn('2.123412341234') equals to array ['2', '', '1234'].");

    deepEqual(fn('3534.3344512341234'), ['3534', '33445', '1234'], "fn('3534.3344512341234') equals to array ['3534', '33445', '1234'].");
});
test('test with computed decimal numbers', function () {

    var fn = Game.prototype.getRepeatingDecimalProperties;
    deepEqual(fn(1 / 333), ['0', '', '003'], "fn(1 / 333) equals to array ['0', '', '003'].");
    deepEqual(fn(7 / 13), ['0', '5384', '615384'], "fn(7 / 13) equals to array ['0', '5384', '615384'].");
    deepEqual(fn(1 / 111), ['0', '', '009'], "fn(1 / 111) equals to array ['0', '', '009'].");
    deepEqual(fn(11 / 111), ['0', '', '099'], "fn(11 / 111) equals to array ['0', '', '099'].");
    deepEqual(fn(100 / 11), ['9', '', '09'], "fn(100 / 11) equals to array ['9', '', '09'].");
    deepEqual(fn(100 / 13), ['7', '692', '307692'], "fn(100 / 13) equals to array ['7', '692', '307692'].");
    deepEqual(fn(1 / 3), ['0', '', '3'], "fn(1 / 3) equals to array ['0', '', '3'].");
    deepEqual(fn(4 / 3), ['1', '', '3'], "fn(4 / 3) equals to array ['1', '', '3'].");
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
