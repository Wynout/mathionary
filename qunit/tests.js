/**
 * Automating JavaScript Testing with QUnit
 * @link http://qunitjs.com/
 * @link http://msdn.microsoft.com/en-us/magazine/gg749824.aspx
 */


/**
 * Game.prototype.cacheDomElements
 */
module('Game.prototype.cacheDomElements', {

    // setup callback runs before each test
    setup: function () {

        this.Game = $.extend({
            config: {
                container: '#qunit-fixture div.game'
            }
        }, Game.prototype);

        // this.Game.cacheDomElements.call(this.Game);
    }
});
test('Test throw Errors', 2, function () {

    // Game element not found
    raises(function () {
        this.Game.cacheDomElements.call(this.Game);
    }, Error, 'Must throw error when $game <div> element not found.');

    // Answers parent element <ul> not found
    jQuery('<div class="game"></div>').appendTo('#qunit-fixture');
    raises(function () {
        this.Game.cacheDomElements.call(this.Game);
    }, Error, 'Must throw error when $answers parent <ul> element not found.');
});
test('Test if DOM elements are being cached', 2, function () {

    jQuery('<div class="game"><ul></ul></div>').appendTo('#qunit-fixture');

    this.Game.cacheDomElements.call(this.Game);

    strictEqual(this.Game.$game.length, 1, 'Game.$game.length equals to 1.');
    strictEqual(this.Game.$answers.length, 1, 'Game.$answers.length equals to 1.');
});



/**
 * Game.prototype.initialize
 */
module('Game.prototype.initialize', {

    // setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<div class="navigation">'+
                '<h1 class="question">Question</h1>'+
            '</div>'+
            '<script id="questionTemplate" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);

        this.Game.initialize.call(this.Game, 8);
    }
});
test('Test initialization', 6, function () {

    var $answers = this.Game.$answers.find('li');
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

    // Test question
    strictEqual(typeof this.Game.question.answer, 'number', 'typeof Game.question.answer equals to "number".');
    strictEqual(this.Game.question.elements.length, 2, 'Game.question.elements.length equals to 2.');
    strictEqual(typeof this.Game.question.text, 'string', 'typeof Game.question.text equals to "string".');
    ok(this.Game.question.text.length, 'Game.question.text.length greater then 0.');
});



/**
 * Game.prototype.bindEvents
 *
 * Event Delegation: one event listener is attached to the $answers <ul> element.
 */
module('Game.prototype.bindEvents', {

    // setup callback runs before each test
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

    // setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<div class="navigation">'+
                '<h1 class="question">Question</h1>'+
            '</div>'+
            '<script id="questionTemplate" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<ul></ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first(),
            user: {
                answer: null
            },
            question: {
                text: null,
                answer: 5,
                // answer to the question
                elements : jQuery('<li data-answer="2">2</li><li data-answer="3">3</li>')
            }
        }, Game.prototype);

        // Bind all Events
        this.Game.bindEvents.call(this.Game);
    }
});
test('answerMouseenter', 1, function () {

    // Test mouseleave event on <li /> element
    jQuery('<li data-answer="1">1</li>').appendTo(this.Game.$answers);

    $answer = this.Game.$answers.find('li').first()
        .trigger('mouseenter');
    strictEqual($answer.hasClass('hover'), true, 'Answer element gets class "hover" on mouseenter.');
});
test('answerMouseleave', 2, function () {

    // Test mouseleave event on <li /> element
    jQuery('<li class="hover transition-invalid-answer" data-answer="1">1</li>').appendTo(this.Game.$answers);
    $answer = this.Game.$answers.find('li').first()
        .addClass('hover')
        .trigger('mouseleave');

    strictEqual($answer.hasClass('hover'), false, 'Class "hover" is removed from answer element on mouseleave.');
    strictEqual($answer.hasClass('transition-invalid-answer'), false, 'Class "transition-invalid-answer" is removed from answer element on mouseleave.');
});
test('answerClick: Test toggle answer selection', 2, function () {

    // Test mouse click event on <li /> element
    jQuery('<li data-answer="1">1</li>')
        .appendTo(this.Game.$answers);

    $answer = this.Game.$answers.find('li').first()
        .trigger('click');

    // Test if answer can be selected
    strictEqual($answer.hasClass('selected'), true, 'Answer element gets class "selected" on click.');

    $answer = this.Game.$answers.find('li').first()
        .trigger('click');

    // Test if answer can be deselected
    strictEqual($answer.hasClass('selected'), false, 'Class "selected" is removed from answer element on click.');
});
test('answerClick: Test property Game.user.answer', 1, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="2">2</li>'+
    '<li data-answer="3">3</li>'+
    '<li data-answer="5">5</li>') // trigger click
        .appendTo(this.Game.$answers);

    $answer = this.Game.$answers.find('li').last()
        .trigger('click');

    // Test if user.answer is correct
    strictEqual(this.Game.user.answer, 5, 'Game.user.answer equals to 5.');
});
test('answerClick: Test if used answers cannot be selected', 1, function () {

    // Test mouse click event on <li /> element
    jQuery('<li class="used" data-answer="1">1</li>')
        .appendTo(this.Game.$answers);

    $answer = this.Game.$answers.find('li')
        .trigger('click');

    // Cannot select used answers. Used answers must be ignored.
    strictEqual($answer.hasClass('selected'), false, 'Answer elements with class "used" cannot get class "selected" on click.');
});
test('answerClick: Test invalid moves', 2, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="5">5</li>'+ // 5 is the answer
    '<li data-answer="6">6</li>')
        .appendTo(this.Game.$answers);

    // Test invalid answer: cannot select answer directly
    $answer = this.Game.$answers.find('li').first()
        .trigger('click');
    strictEqual($answer.hasClass('transition-invalid-answer'), true, 'Invalid move: Cannot select answer directly. Answer element gets class "transition-invalid-answer".');

    // Test invalid answer: cannot select answer higher question.answer
    $answer = this.Game.$answers.find('li').last()
        .trigger('click');
    strictEqual($answer.hasClass('transition-invalid-answer'), true, 'Invalid move: Cannot select answer higher question.answer. Answer element gets class "transition-invalid-answer".');
});
test('answerClick: Test if answer is correct', 2, function () {

    // Test mouse click event on <li /> element
    jQuery(
    '<li data-answer="1">1</li>'+
    '<li class="selected" data-answer="2">2</li>'+
    '<li data-answer="3">3</li>'+ // trigger click, 5 is the answer
    '<li data-answer="4">4</li>')
        .appendTo(this.Game.$answers);

    // Test if correct answer receives class "used"
    $answer = this.Game.$answers.find('li').eq(2) // contains the answer 3
        .trigger('click');
    strictEqual($answer.hasClass('used'), true, 'Correct answer gets class "used" on click.');

    // Test if new question is created. available answers are 1 and 4.
    strictEqual($('h1.question').text(), 'Which numbers add up to: 5?.', 'Test if new question is created. New question equals to "Which numbers add up to: 5?.".');
});



/**
 * Game.prototype.initializeAnswers()
 */
module('Game.prototype.initializeAnswers()', {

    // setup callback runs before each test
    setup: function () {

        jQuery('<div class="game"><ul></ul></div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test if answer elements are created', 1, function () {

    var $answers = this.Game.initializeAnswers(8);
    strictEqual($answers.find('li').length, 8, 'Amount of answer elements created equals to 8.');
});
test('Test if all answer elements have a HTML5 data attribute', 1, function () {

    var $answers = this.Game.initializeAnswers(8),
        result = true;

    $answers.find('li').each(function() {
        if (typeof $(this).data('answer')!=='number') {
            result = false;
        }
    });

    strictEqual(result, true, 'All answer elements have a HTML5 data attribute with a number.');
});



/**
 * Game.prototype.newQuestionCycle()
 */
module('Game.prototype.newQuestionCycle()', {

    // Setup callback runs before each test
    setup: function () {

        jQuery(
        '<div class="game">'+
            '<div class="navigation">'+
                '<h1 class="question">Question</h1>'+
            '</div>'+
            '<script id="questionTemplate" type="game/template">'+
                'Which numbers add up to: {{answer}}?.'+
            '</script>'+
            '<ul>'+
                '<li class="used" data-answer="1">1</li>'+
                '<li data-answer="2">2</li>'+
                '<li data-answer="3">3</li>'+
            '</ul>'+
        '</div>')
            .appendTo('#qunit-fixture');

        this.Game = $.extend({
            $game: $('#qunit-fixture div.game'),
            $answers: $('#qunit-fixture ul').first()
        }, Game.prototype);
    }
});
test('Test if a new question is created', 3, function () {

    var question = this.Game.newQuestionCycle();

    strictEqual(question.answer, 5, 'Question.answer equals to 5.');
    strictEqual(question.elements.length, 2, 'Question.elements.length equals to 2.');
    strictEqual(question.text, 'Which numbers add up to: 5?.', 'Question.text equals to "Which numbers add up to: 5?.".');
});



/**
 * Game.prototype.deselectAllAnswers()
 */
module('Game.prototype.deselectAllAnswers()', {

    // setup callback runs before each test
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

    $answers = this.Game.deselectAllAnswers.call(this.Game);

    strictEqual($answers.find('li.selected').length, 0, 'Class "selected" removed from all answers ($answers.length equals to 0).');
});



/**
 * Game.prototype.getAvailableAnswers()
 */
module('Game.prototype.getAvailableAnswers()', {

    // setup callback runs before each test
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
    strictEqual(result.elements.length, 2, 'Question.elements.length equals to 2.');
    strictEqual(result.text, 'answer = 3', 'Question.text equals to "answer = 3".');
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
 * Game.prototype.displayQuestion()
 */
module('Game.prototype.displayQuestion()', {

    // setup callback runs before each test
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
            question: {text: 'test question text'}
        }, Game.prototype);
    }
});
test('Test display question', 1, function () {

    var result = this.Game.displayQuestion();
    strictEqual(result.text(), 'test question text', 'Displayed question equals to "test question text".');
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



/**
 * Game.prototype.isInvalidAnswer()
 */
module('Game.prototype.isInvalidAnswer()', {

    // setup callback runs before each test
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

        this.Game = $.extend({
            question: {
                answer: 3,
                elements: $('#qunit-fixture li:not(.selected)')
            },
            user: {answer: null}
        }, Game.prototype);
    }
});
test('Test cannot select answer directly', 1, function () {

    this.Game.user.answer = 3;

    var selected = $('#qunit-fixture').find('.selected'),
        result = this.Game.isInvalidAnswer(selected);

    strictEqual(result, true, 'Equals to true when answer is selected directly.');
});
test('Test selected answer is higher then Question answer.', 1, function () {

   this.Game.user.answer = 4;

    var selected = $('#qunit-fixture').find('.selected'),
        result = this.Game.isInvalidAnswer(selected);

    strictEqual(result, true, 'Equals to true when user answer is higher then question answer.');
});



/**
 * Game.prototype.isQuestionAnswered()
 */
module('Game.prototype.isQuestionAnswered()', {

    // setup callback runs before each test
    setup: function () {

        this.question = {answer: 123};
        this.user     = {answer: 123};
    },
    // teardown callback runs after each test
    teardown: function () {
    }
});
test('Test is question answered correctly', 2, function () {

    var result = Game.prototype.isQuestionAnswered.call(this);
    strictEqual(result, true, 'Equals to true. Question answered correctly.');

    this.user.answer = 321;
    result = Game.prototype.isQuestionAnswered.call(this);
    strictEqual(result, false, 'Equals to false. Question answered incorrectly.');
});



/**
 * Game.prototype.displayInvalidAnswer()
 */
module('Game.prototype.displayInvalidAnswer()');
test('Test display invalid answer', 2, function () {

    var answer = jQuery('<li class="selected" data-answer="1">1</li>')
        .appendTo('#qunit-fixture');
    var $result = $(Game.prototype.displayInvalidAnswer.call(answer)[0]);

    strictEqual($result.hasClass('transition-invalid-answer'), true, 'Answer element gets class "transition-invalid-answer".');
    strictEqual($result.hasClass('selected'), false, 'Class "selected" is removed from answer element.');
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


