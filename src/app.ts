import { DockerService } from './dockerService.js';

DockerService.create().then((answers) => {
  console.log(DockerService.renderServices(answers));
  // console.log(dump(answers));
  // console.log(JSON.stringify(answers, null, '  '));
});
