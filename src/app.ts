import { DockerService } from './dockerService';
import Handlebars from 'handlebars';
import fs from "fs";

const serviceTemplateFile = fs.readFileSync(`${__dirname}/templates/service.handlebars`);
const composeTemplateFile =  fs.readFileSync(`${__dirname}/templates/compose.handlebars`);
Handlebars.registerHelper(`ifEquals`, function (a, b) {
  return a === b;
});
Handlebars.registerPartial('service', Handlebars.compile(serviceTemplateFile.toString()));

DockerService.create().then((serviceAnswers) => {
  const composeTemplate = Handlebars.compile(composeTemplateFile.toString());
  const compose = composeTemplate({serviceAnswers});
  fs.writeFileSync('./docker-compose.yml', compose);
  // console.log(JSON.stringify(serviceAnswers, null, '  '));
});

//TODO: Générer la partie network
//TODO: Générer les fichiers env
//TODO: Configuration simple/avancée
