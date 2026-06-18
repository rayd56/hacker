const moment = require("moment-timezone");

const kylefacts = [
    "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
    "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
    "The world's oldest known recipe is for beer.",
    "Bananas are berries, but strawberries are not.",
    "Cows have best friends and can become stressed when they are separated.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
    "The average person walks the equivalent of three times around the world in a lifetime.",
    "Polar bears are left-handed.",
    "The unicorn is Scotland's national animal.",
    "A group of flamingos is called a 'flamboyance'.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "The smell of freshly-cut grass is actually a plant distress call.",
    "A day on Venus is longer than its year.",
    "Honeybees can recognize human faces.",
    "Wombat poop is cube-shaped.",
    "The first oranges weren't orange.",
    "The longest time between two twins being born is 87 days.",
    "A bolt of lightning is six times hotter than the sun.",
    "A baby puffin is called a puffling.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
    "There's a species of jellyfish that is biologically immortal.",
    "The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
    "The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
    "A hummingbird weighs less than a penny.",
    "Koalas have fingerprints that are nearly identical to humans'.",
    "There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
    "A group of owls is called a parliament.",
    "The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
    "The Hawaiian alphabet has only 13 letters.",
    "The average person spends six months of their life waiting for red lights to turn green.",
    "A newborn kangaroo is about 1 inch long.",
    "The oldest known living tree is over 5,000 years old.",
    "Coca-Cola would be green if coloring wasn't added to it.",
    "A day on Mars is about 24.6 hours long.",
    "The Great Wall of China is not visible from space without aid.",
    "A group of crows is called a murder.",
    "There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
    "The world's largest desert is Antarctica, not the Sahara.",
    "A blue whale's heart is so big that a human could swim through its arteries.",
    "The longest word in the English language without a vowel is 'rhythms'.",
    "Polar bears' fur is not white; it's actually transparent.",
    "The electric chair was invented by a dentist.",
    "An ostrich's eye is bigger than its brain.",
    "Wombat poop is cube-shaped.",
    "Even a small amount of alcohol poured on a scorpion will drive it crazy and sting itself to death.",
    "The crocodile can't stick its tongue out.",
    "The oldest known animal in the world is a 405-year-old male, discovered in 2007.",
    "Sharks, like other fish, have their reproductive organs located in the ribcage.",
    "The eyes of the octopus have no blind spots. On average, the brain of an octopus has 300 million neurons. When under extreme stress, some octopuses even eat their trunks.",
    "An elephant's brain weighs about 6,000g, while a cat's brain weighs only approximately 30g.",
    "Cats and dogs have the ability to hear ultrasound.",
    "Sheep can survive up to 2 weeks in a state of being buried in snow.",
    "The smartest pig in the world is owned by a math teacher in Madison, Wisconsin (USA). It has the ability to memorize worksheets multiplying to 12.",
    "Statistics show that each rattlesnake's mating lasts up to ... more than 22 hours",
    "Studies have found that flies are deaf.",
    "In a lack of water, kangaroos can endure longer than camels.",
    "Dogs have 4 toes on their hind legs and 5 toes on each of their front paws.",
    "The average flight speed of honey bees is 24km/h. They never sleep.",
    "Cockroaches can live up to 9 days after having their heads cut off.",
    "If you leave a goldfish in the dark for a long time, it will eventually turn white.",
    "The flying record for a chicken is 13 seconds.",
    "The mosquito that causes the most deaths to humans worldwide is the mosquito.",
    "The quack of a duck doesn't resonate, and no one knows why."
];

module.exports = {
  config: {
    name: "prefix2",
    version: "1.0",
    author: "kyle",
    countdown: 5,
    role: 0,
    shortdescription: "prefix of robot",
    longdescription: "robot prefix from goatbot",
  },
  onStart: async function() {},
  onChat: async ({ event, message, getlang }) => {
    const manilatime = moment.tz("Asia/Manila");
    const formatteddatetime = manilatime.format("MMMM D, YYYY h:mm a");

    if (event.body && event.body.toLowerCase() === "prefix") {
      if (kylefacts.length === 0) {
        return message.reply("No facts available.");
      }

      const randomFact = kylefacts[Math.floor(Math.random() * kylefacts.length)];
      const targetDate = new Date("June 18, 2025 00:00:00");
      const timeDiff = targetDate - new Date();

      const seconds = Math.floor((timeDiff / 1000) % 60);
      const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
      const hours = Math.floor((timeDiff / 1000 / 60 / 60) % 24);
      const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);

      const userNameTag = event.senderName || "User"; // Adjust based on actual property

      return message.reply({
        body: `Hello ${userNameTag}, my prefix is\n\n╭─────◉
│➢ My prefix: [ ✓ ]
│👑Owner: Rayd🤠
│🔗 Facebook: https://www.facebook.com/efouarayd56
╰───────────⬤
        
╭──────────◉
│𝗨𝗣𝗧𝗜𝗠𝗘 :
│⏳${hours} hours
│⏰${minutes} minutes
│⏱️${seconds} seconds
│
│📅 Date and time:
│${formatteddatetime}
│
│📌 Fact: ${randomFact}
│       
╰───────────✪`,
      });
    }
  },
};Entercconst moment = require("moment-timezone");

const kylefacts = [
    "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
    "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
    "The world's oldest known recipe is for beer.",
    "Bananas are berries, but strawberries are not.",
    "Cows have best friends and can become stressed when they are separated.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
    "The average person walks the equivalent of three times around the world in a lifetime.",
    "Polar bears are left-handed.",
    "The unicorn is Scotland's national animal.",
    "A group of flamingos is called a 'flamboyance'.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "The smell of freshly-cut grass is actually a plant distress call.",
    "A day on Venus is longer than its year.",
    "Honeybees can recognize human faces.",
    "Wombat poop is cube-shaped.",
    "The first oranges weren't orange.",
    "The longest time between two twins being born is 87 days.",
    "A bolt of lightning is six times hotter than the sun.",
    "A baby puffin is called a puffling.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
    "There's a species of jellyfish that is biologically immortal.",
    "The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
    "The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
    "A hummingbird weighs less than a penny.",
    "Koalas have fingerprints that are nearly identical to humans'.",
    "There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
    "A group of owls is called a parliament.",
    "The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
    "The Hawaiian alphabet has only 13 letters.",
    "The average person spends six months of their life waiting for red lights to turn green.",
    "A newborn kangaroo is about 1 inch long.",
    "The oldest known living tree is over 5,000 years old.",
    "Coca-Cola would be green if coloring wasn't added to it.",
    "A day on Mars is about 24.6 hours long.",
    "The Great Wall of China is not visible from space without aid.",
    "A group of crows is called a murder.",
    "There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
    "The world's largest desert is Antarctica, not the Sahara.",
    "A blue whale's heart is so big that a human could swim through its arteries.",
    "The longest word in the English language without a vowel is 'rhythms'.",
    "Polar bears' fur is not white; it's actually transparent.",
    "The electric chair was invented by a dentist.",
    "An ostrich's eye is bigger than its brain.",
    "Wombat poop is cube-shaped.",
    "Even a small amount of alcohol poured on a scorpion will drive it crazy and sting itself to death.",
    "The crocodile can't stick its tongue out.",
    "The oldest known animal in the world is a 405-year-old male, discovered in 2007.",
    "Sharks, like other fish, have their reproductive organs located in the ribcage.",
    "The eyes of the octopus have no blind spots. On average, the brain of an octopus has 300 million neurons. When under extreme stress, some octopuses even eat their trunks.",
    "An elephant's brain weighs about 6,000g, while a cat's brain weighs only approximately 30g.",
    "Cats and dogs have the ability to hear ultrasound.",
    "Sheep can survive up to 2 weeks in a state of being buried in snow.",
    "The smartest pig in the world is owned by a math teacher in Madison, Wisconsin (USA). It has the ability to memorize worksheets multiplying to 12.",
    "Statistics show that each rattlesnake's mating lasts up to ... more than 22 hours",
    "Studies have found that flies are deaf.",
    "In a lack of water, kangaroos can endure longer than camels.",
    "Dogs have 4 toes on their hind legs and 5 toes on each of their front paws.",
    "The average flight speed of honey bees is 24km/h. They never sleep.",
    "Cockroaches can live up to 9 days after having their heads cut off.",
    "If you leave a goldfish in the dark for a long time, it will eventually turn white.",
    "The flying record for a chicken is 13 seconds.",
    "The mosquito that causes the most deaths to humans worldwide is the mosquito.",
    "The quack of a duck doesn't resonate, and no one knows why."
];

module.exports = {
  config: {
    name: "prefix2",
    version: "1.0",
    author: "kyle",
    countdown: 5,
    role: 0,
    shortdescription: "prefix of robot",
    longdescription: "robot prefix from goatbot",
  },
  onStart: async function() {},
  onChat: async ({ event, message, getlang }) => {
    const manilatime = moment.tz("Asia/Manila");
    const formatteddatetime = manilatime.format("MMMM D, YYYY h:mm a");

    if (event.body && event.body.toLowerCase() === "prefix") {
      if (kylefacts.length === 0) {
        return message.reply("No facts available.");
      }

      const randomFact = kylefacts[Math.floor(Math.random() * kylefacts.length)];
      const targetDate = new Date("June 18, 2025 00:00:00");
      const timeDiff = targetDate - new Date();

      const seconds = Math.floor((timeDiff / 1000) % 60);
      const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
      const hours = Math.floor((timeDiff / 1000 / 60 / 60) % 24);
      const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);

      const userNameTag = event.senderName || "User"; // Adjust based on actual property

      return message.reply({
        body: `Hello ${userNameTag}, my prefix is\n\n╭─────◉
│➢ My prefix: [ • ]
│👑Owner: Rayd🤠
│🔗 Facebook: https://www.facebook.com/efouarayd56
╰───────────⬤
        
╭──────────◉
│𝗨𝗣𝗧𝗜𝗠𝗘 :
│⏳${hours} hours
│⏰${minutes} minutes
│⏱️${seconds} seconds
│
│📅 Date and time:
│${formatteddatetime}
│
│📌 Fact: ${randomFact}
│       
╰───────────✪`,
      });
    }
  },
};Enter;
