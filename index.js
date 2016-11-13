const knockKnockJokes = require('knock-knock-jokes');
const cnApi = require('chuck-norris-api');

const talkify = require('talkify');

const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;
const StaticRandomResponseSkill = BotTypes.StaticRandomResponseSkill;
const Skill = BotTypes.Skill;

const bot = new Bot();

bot.trainAll([
    new TrainingDocument('knock_joke', 'knock'),
    new TrainingDocument('knock_joke', 'knock knock'),

    new TrainingDocument('chuck_norris_joke', 'chuck norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck'),
    new TrainingDocument('chuck_norris_joke', 'norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck norris joke'),

    new TrainingDocument('greeting', 'hey'),
    new TrainingDocument('greeting', 'hi'),
    new TrainingDocument('greeting', 'you there'),
    new TrainingDocument('greeting', 'hello'),
    new TrainingDocument('greeting', 'whats up'),
    new TrainingDocument('greeting', 'what\'s up'),
    new TrainingDocument('greeting', 'how\'s it going?'),
    new TrainingDocument('greeting', 'hola'),

    new TrainingDocument('who_am_i', 'who are you?'),
    new TrainingDocument('who_am_i', 'about yourself'),
    new TrainingDocument('who_am_i', 'identify'),

    new TrainingDocument('rejection', 'nevermind'),
    new TrainingDocument('rejection', 'don\'t worry about it'),
    new TrainingDocument('rejection', 'not today'),
    new TrainingDocument('rejection', 'no'),

    new TrainingDocument('what_can_you_do', 'what can you do'),
    new TrainingDocument('what_can_you_do', 'good for'),
    new TrainingDocument('what_can_you_do', 'your abilities'),
], function () {
    console.log(' BOT> Ready.');
});

const greetingSkill = new StaticRandomResponseSkill('my_greeting_skill', 'greeting', ['Hey', 'Hi', 'Hey there! How can I lighten up your day today?', 'Hello', 'Hello! What can I do for you?', 'How can I help?']);

const whoAmISkill = new StaticRandomResponseSkill('my_identity_skill', 'who_am_i',
    [
    'I am your sidekick. I can lighten up your day by telling you knock knock or chuck norris jokes.',
    'I\'m sidekick! Would you like to hear a knock knock or a chuck norris joke? I can tell you either.',
    'My name is sidekick. I know knock knock and chuck norris jokes. Which one would you like to hear?'
    ]
);

const whatSkill = new StaticRandomResponseSkill('my_what_skill', 'what_can_you_do',
[
    'I can lighten up your day by telling you knock knock or chuck norris jokes.',
    'Would you like to hear a knock knock or a chuck norris joke? I can tell you either.',
    'I know knock knock and chuck norris jokes. Which one would you like to hear?'
]);

const rejectionSkill = new StaticRandomResponseSkill('my_rejection_skill', 'rejection',
[
    'Ok. :/',
    'Sure! Maybe next time. :D',
    'Cool beans B)',
    'No worries dude!'
]);

const kJokeSkill = new Skill('my_knock_knock_joke_skill', 'knock_joke', function (context, request, response) {
    if (!context.kJokes) {
        context.kJokes = [];
    }

    let newJoke = knockKnockJokes();
    let counter = 0;
    while (counter < 11 && context.kJokes.indexOf(newJoke) !== -1) {
        newJoke = knockKnockJokes();
        counter++;
    }

    if (counter === 11) {
        return response.send(new SingleLineMessage('Sorry I am out of knock knock jokes. :('));
    }

    context.kJokes.push(newJoke);
    return response.send(new SingleLineMessage(newJoke));
});

const cJokeSkill = new Skill('my_chuck_norris_joke_skill', 'chuck_norris_joke', function (context, request, response) {
    return cnApi.getRandom().then(function (data) {
        return response.send(new SingleLineMessage(data.value.joke));
    });
});

const uncertainSkill = new StaticRandomResponseSkill('my_uncertain_skill', undefined,
[
    'Sorry, I am not sure what you mean. Would you like to hear a knock knock joke? or perhaps a chuck norris joke?',
    'Apologies. I do not understand what you mean. I can tell you knock knock or chuck norris jokes. You just need to ask.'
]);

bot.addSkill(kJokeSkill, 0.8);
bot.addSkill(cJokeSkill, 0.8);
bot.addSkill(whoAmISkill);
bot.addSkill(greetingSkill);
bot.addSkill(rejectionSkill);
bot.addSkill(whatSkill);
bot.addSkill(uncertainSkill);

module.exports = bot;