import inquirer from 'inquirer';
import Handlebars from 'handlebars';
import * as fs from "fs";

export type ServiceAnswer = {
  createService: boolean;
  serviceName: string;
  imageName: string;
  imageTag: string;
  containerName: string;
  user: string;
  entrypoint: string;
  command: string;
  dependsOn: string[];
  labels: string[];
  envFiles: string[];
  volumePaths: string[];
  runtime: string;
  capabilities: string[];
  dns: string[];
  securityOpts: string[];
  sysctls: string[];
  ports: string[];
  useNetworksAliases: boolean;
  networks: string[];
  networksAliases: string[][];
  useHealthcheck: boolean;
  healthcheckTest: string[];
  healthcheckInterval: string;
  healthcheckTimeout: string;
  healthcheckRetries: number;
  healthcheckStartPeriod: string;
  healthcheckStartInterval: string;
  restartPolicy: string;
}

export class DockerService {
  private static SERVICES_TEMPLATE_FILE = './templates/services.handlebars'

  private static questions = [
    {
      type: 'confirm',
      name: 'createService',
      message: 'Create a new service?',
      default: false,
    },
    {
      type: 'input',
      name: 'serviceName',
      message: 'Enter service name:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'imageName',
      message: 'Image name:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'imageTag',
      message: 'Image tag:',
      default: "latest",
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'containerName',
      message: 'Container name:',
      default: (answers: ServiceAnswer) => answers.serviceName,
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'user',
      message: 'Entrypoint:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'command',
      message: 'Command to execute:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'dependsOn',
      message: 'Dependencies (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'labels',
      message: 'Labels (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'envFiles',
      message: 'Environment file(s) (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'volumePaths',
      message: 'Volume path(s) (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'runtime',
      message: 'Runtime:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'capabilities',
      message: 'Additional capabilities (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'dns',
      message: 'DNS servers (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'securityOpts',
      message: 'Security options (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'sysctls',
      message: 'Sysctls (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'ports',
      message: 'Exposed ports (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'networks',
      message: 'Networks (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'confirm',
      name: 'useNetworksAliases',
      message: 'Use networks aliases:',
      default: false,
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'networksAliases',
      message: 'Networks aliases (comma-separated aliases and pipe separated networks):',
      filter: (input: string) => input.split('|').map((item) => item.split(',').map(alias => alias.trim())),
      when: (answers: ServiceAnswer) => answers.createService && answers.useNetworksAliases,
    },
    {
      type: 'confirm',
      name: 'useHealthcheck',
      message: 'Use healthcheck?',
      default: false,
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'healthcheckTest',
      message: 'Healthcheck test command (comma-separated):',
      filter: (input: string) => input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckInterval',
      message: 'Healthcheck interval:',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckTimeout',
      message: 'Healthcheck timeout:',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'number',
      name: 'healthcheckRetries',
      message: 'Healthcheck retries:',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckStartPeriod',
      message: 'Healthcheck start period:',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckStartInterval',
      message: 'Healthcheck start interval:',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'list',
      name: 'restartPolicy',
      message: 'Restart policy:',
      choices: ['no', 'always', 'on-failure', 'unless-stopped'],
      default: 'unless-stopped',
      when: (answers: ServiceAnswer) => answers.createService,
    },
  ];

  static async create(answers: ServiceAnswer[] = []): Promise<ServiceAnswer[]> {
    answers.push(await inquirer.prompt(DockerService.questions));
    if (answers[answers.length - 1].createService) {
      return await this.create(answers);
    }
    return answers;
  }

  static renderServices(answers: ServiceAnswer[]): string {
    const file = fs.readFileSync(this.SERVICES_TEMPLATE_FILE);
    const template = Handlebars.compile(file.toString());
    answers.forEach((answer) => {
      if (answer.createService) {
        console.log(template({answer}));
      }
    });
    return '';
  }

}
