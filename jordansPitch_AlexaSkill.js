// Author: Jordan Randleman - Alexa-Automated Programming Resume Pitch

/******************************************************************************
* GLOBAL RESUME
******************************************************************************/

/* Invocation: "open jordans pitch" */

const Resume = { 
  "contact": { // ContactIntent
    "email":   "j randleman at s c u dot e d u",
    "phone":   "four oh eight, seven oh one, seven five six four",
    "github":  "github dot com slash j randleman",
    "address": "five hundred El Camino Real in Santa Clara California nine five zero five three",
    "origin":  "Los Altos California"
  }, 
  "education": { // EducationIntent
    "college": { // HighSchoolOrCollegeEducationIntent
      "name":  "Santa Clara University",
      "when":  "twenty eighteen to my expected graduation date of June of twenty twenty two",
      "gpa":   "three point nine",
      "major": "Bachelor of Computer Science and Engineering from the Engineering school"
    },
    "high_school": { // HighSchoolOrCollegeEducationIntent
      "name":         "Waldorf High School of the Peninsula",
      "when":         "twenty fourteen to twenty eighteen",
      "gpa":          "three point nine out of four point oh",
      "sat":          "fifteen hundred out of sixteen hundred, split dead even between math and reading at seven hundred fifty each",
      "subject_test": "Math two subject test where I scored a perfect eight hundred"
    }
  }, 
  "skills": { // SkillsIntent
    "programming_langs": {
      "use_freq":        "C, C plus plus, Python, JavaScript, and H T M L slash C S S",
      "exposure_to":     "P H P and Swift"
    },
    "applications":      "GitHub, Source Tree, Node J S, Puppeteer, Cheerio, Sublime Text, and Excel",
    "foreign_languages": "French",
    "additional":        "organized team player who enjoys the process of problem solving, priding myself as a fast learner and effective communicator"
  }, 
  "work_experience": { // WorkExperienceIntent
    "where":    "Wynd Technologies in Redwood City California",
    "when":     "Summers of two thousand fifteen sixteen seventeen and nineteen",
    "about":    "Wynd is an air purification start up, who's personal air purifier is portable and embedded with an air quality sensor that monitors for particulates and displays measurements in real time",
    "my_title": "Software Development Intern",
    "my_jobs": {
      "polSpiders":       "Built spiders with Node J S to parse and process both pollutant and pollen data from over twenty countries",
      "awsServer":        "Spun up an A W S E C 2 Server to use Honeywell's T five thermostat A P I for Wynd's Halo I O T",
      "appsUsed":         "Collaborated via GitHub and Source Tree to integrate data in Wynd's AirBubbles mobile app",
      "trainIntern":      "Trained new interns on scripting structure",
      "qualityAssurance": "Tested and tracked effectiveness of filtration and particulate detecting hardware"
    }
  }, 
  "extra_curricular_activities": { // ExtraCurricularActivitiesIntent
    "coding_projects": { 
      "proj1": "a C plus plus Overhauled Template List Library with Mapping and Valarray Methods",
      "proj2": "a C Text File Lossless Compression and Encryption Algorithm",
      "proj3": "a C Library for Dynamically Growing Arrays via doubly linked lists",
      "proj4": "C Python and JavaScript Sudoku Generators with different difficulties and save game options",
      "proj5": "a Python Maze Generator in eight by eight plus dimensions",
      "proj6": "JavaScript Spiders to Scrape Parse and Categorize both Webpage Links and Geocoding Data",
      "proj7": "a JavaScript Custom Shorthand, who's unique grammar and characters I created to hasten my high school note taking, Keyboard and English Converter on an H T M L and C S S website",
      "proj8": "a JavaScript and S V G Hypercube Animation Algorithm (up to n dimensions)",
      "proj9": "JavaScript and H T M L Perspective and Star Geometry Animation Algorithms"
    },
    "in_high_school": {
      "student_ambassador": "selected by the administration to participate in new student recruiting",
      "clubs":              "Robotics Club as a programmer and cofounded the Debate Club",
      "sports":             "Basketball Soccer and Cross Country"
    }
  }
};

// programming language keys with project values from 'Resume' JSON 
var programmingTypeProjects = {
  'c':          ["proj2", "proj3", "proj4"],
  'cpp':        ["proj1"],
  'javascript': ["proj4", "proj6", "proj7", "proj8", "proj9"],
  'python':     ["proj4", "proj5"],
  'html':       ["proj7", "proj8", "proj9"],
  'css':        ["proj7", "proj8", "proj9"],
  'svg':        ["proj8", "proj9"]
};

// given a programmingType (language) slot value, returns a key 
// array of projects in said language from the 'Resume' JSON
function getProgrammingTypeProjects(programmingType) {
  programmingType = programmingType.toLowerCase().trim();
  if(programmingType === 's v g')            
    programmingType = 'svg';
  else if(programmingType === 'c s s')       
    programmingType = 'css';
  else if(programmingType === 'h t m l')     
    programmingType = 'html';
  else if(programmingType === 'j s' || programmingType === 'js') 
    programmingType = 'javascript';
  else if(programmingType === 'c plus plus' || programmingType === 'c++') 
    programmingType = 'cpp';
  return programmingTypeProjects[programmingType];
}

const Alexa = require('ask-sdk-core');

/******************************************************************************
* LAUNCH REQUEST
******************************************************************************/

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hello! My name\'s Jordan Randleman, and this is my Alexa automated programmer pitch!' +
                       ' Would you like me to pitch my contact information, education, personal skillset,' +
                       ' work experience, or extra curricular activities?';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

/******************************************************************************
* RESUME INFO INTENT HANDLERS
******************************************************************************/

/**************************** CONTACT INFORMATION ****************************/
// pitch contact info
const ContactIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ContactIntent';
  },
  handle(handlerInput) {
    const contact = Resume.contact;
    const speechText = `You can email me at ${contact.email}, or call ${contact.phone}.` + 
                       ` I currently reside at ${contact.address}, and am a native of ${contact.origin}.` +
                       ` Catch more of my coding projects at ${contact.github}!`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

/***************************** EDUCATION HISTORY *****************************/
// prompt either college or high school grades
const EducationIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'EducationIntent';
  },
  handle(handlerInput) {
    const speechText = `Would you like to hear about my college education or high school education?`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('Did you mean to say college education, or perhaps high school education?')
      .getResponse();
  }
};

// pitch either college or high school grades
const HighSchoolOrCollegeEducationIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HighSchoolOrCollegeEducationIntent';
  },
  handle(handlerInput) {
    const educationType = handlerInput.requestEnvelope.request.intent.slots.educationType.value;

    var speechText, edu = Resume.education;
    if(educationType === 'Uni' || educationType === 'university' || educationType === 'college') {
      edu = edu.college;
      speechText = `I'm currently attending ${edu.name} from ${edu.when}, where I'm persuing` +
                   ` a ${edu.major} with a ${edu.gpa} cumulative G P A.`;
    } else {
      edu = edu.high_school;
      speechText = `I attended ${edu.name} from ${edu.when}, where I had a ${edu.gpa} G P A.` +
                   ` My S A T score was ${edu.sat}, and I also took the ${edu.subject_test}.`;
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

/***************************** PERSONAL SKILLSET *****************************/
// pitch personal skillsets
const SkillsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SkillsIntent';
  },
  handle(handlerInput) {
    const skills = Resume.skills;
    const codeLangs = skills.programming_langs;
    const speechText = `My programming language toolkit includes ${codeLangs.use_freq}, as well as exposure to ${codeLangs.exposure_to}.` +
                       ` I've used ${skills.applications} extensively. I'm also fluent in ${skills.foreign_languages}, and would describe` +
                       ` myself as an ${skills.additional}.`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

/****************************** WORK EXPERIENCE ******************************/
// pitch work experience
const WorkExperienceIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WorkExperienceIntent';
  },
  handle(handlerInput) {
    const work = Resume.work_experience;
    const jobs = Resume.work_experience.my_jobs;
    const speechText = `I was a ${work.my_title} at ${work.where}, throughout the ${work.when}. ${work.about}.` +
                       ` In my time at Wynd, I've ${jobs.polSpiders}, ${jobs.awsServer}, ${jobs.appsUsed},` + 
                       ` ${jobs.trainIntern}, and ${jobs.qualityAssurance}.`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

/************************ EXTRA CURRICULAR ACTIVITIES ************************/
// prompt either coding projects or high school extra curriculars
const ExtraCurricularActivitiesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ExtraCurricularActivitiesIntent';
  },
  handle(handlerInput) {
    const work = Resume.work_experience;
    const speechText = `Would you like to hear about my extra curricular coding projects or high school activities?`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('Did you mean to say coding projects, or perhaps high school activities?')
      .getResponse();
  }
};

// pitch either coding projects or high school extra curriculars
const CodingOrSchoolProjectsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CodingOrSchoolProjectsIntent';
  },
  handle(handlerInput) {
    const projectType = handlerInput.requestEnvelope.request.intent.slots.projectType.value;
    const programmingType = handlerInput.requestEnvelope.request.intent.slots.programmingType.value;
    const codingProjects = ["software development", "software", "programming", "coding"];
    var speechText;

    if(codingProjects.indexOf(projectType) !== -1) {
      let projects = ["proj1", "proj2", "proj3", "proj4", "proj5", "proj6", "proj7", "proj8", "proj9"];
      if(programmingType) projects = getProgrammingTypeProjects(programmingType); // only pitch language-specific projects
      const extras = Resume.extra_curricular_activities.coding_projects;
      speechText = (programmingType) ? `My ${programmingType} coding projects include developing ` 
                                     : 'My coding projects include developing ';
      // append relevant coding projects to speech text
      for(var i = 0, length = projects.length; i < length - 1; ++i)
        speechText += `${extras[projects[i]]}, `;
      if(i !== 0) speechText += `as well as`
      speechText +=  ` ${extras[projects[i]]}.`;
    
    } else {
      const extras = Resume.extra_curricular_activities.in_high_school;
      speechText = `In highschool I was ${extras.student_ambassador}, joined the ${extras.clubs},` +
                   ` and played ${extras.sports} for Waldorf's teams.`;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

/******************************************************************************
* HELP/CANCEL/ISSUE HANDLERS
******************************************************************************/

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can have me pitch my qualifications! How can I help?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
      || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.message}`);
    const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

/******************************************************************************
* SKILL EXECUTION
******************************************************************************/

// runs through viable handlers as ordered below.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,                      // launch intro
    ContactIntentHandler,                      // give contact info
    EducationIntentHandler,                    // education prompt: college or high school?
    HighSchoolOrCollegeEducationIntentHandler, // pitch either college or highschool
    SkillsIntentHandler,                       // pitch personal skillset
    WorkExperienceIntentHandler,               // pitch work experience
    ExtraCurricularActivitiesIntentHandler,    // extra curricular prompt: coding or high school?
    CodingOrSchoolProjectsIntentHandler,       // pitch either coding or high school extra curriculars
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(
    ErrorHandler)
  .lambda();
