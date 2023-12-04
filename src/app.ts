import { DockerService } from './dockerService';

DockerService.create().then((answers) => {
  console.log(__dirname);
  console.log(DockerService.renderServices(answers));
  // console.log(dump(answers));
  // console.log(JSON.stringify(answers, null, '  '));
});
