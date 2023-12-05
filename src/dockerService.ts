import inquirer from 'inquirer';

export type ServiceAnswer = {
  createService: boolean;
  advancedConfig: boolean;
  serviceDoc: string;
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
  tty: boolean;
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

  private static questions = [
    {
      type: 'confirm',
      name: 'createService',
      message: 'Create a new service?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'advancedConfig',
      message: 'Use advanced configuration?',
      default: false,
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'serviceDoc',
      message: 'Enter service documentation:',
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'serviceName',
      message: 'Enter service name:',
      when: (answers: ServiceAnswer) => answers.createService,
      validate: (answer: string) => answer !== '' ? true : "You need to set a service name"
    },
    {
      type: 'input',
      name: 'imageName',
      message: 'Image name:',
      when: (answers: ServiceAnswer) => answers.createService,
      validate: (answer: string) => answer !== '' ? true : "You need to set an image name (with registry if needed)"
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
      message: 'User:',
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'entrypoint',
      message: 'Entrypoint:',
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'command',
      message: 'Command to execute:',
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'dependsOn',
      message: 'Dependencies (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'labels',
      message: 'Labels (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'envFiles',
      message: 'Environment file(s) (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'volumePaths',
      message: 'Volume path(s) (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'runtime',
      message: 'Runtime:',
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'capabilities',
      message: 'Additional capabilities (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'dns',
      message: 'DNS servers (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'securityOpts',
      message: 'Security options (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'sysctls',
      message: 'Sysctls (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'confirm',
      name: 'tty',
      message: 'TTY?',
      default: false,
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'ports',
      message: 'Exposed ports (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'input',
      name: 'networks',
      message: 'Networks (comma-separated):',
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService,
    },
    {
      type: 'confirm',
      name: 'useNetworksAliases',
      message: 'Use networks aliases:',
      default: false,
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig,
    },
    {
      type: 'input',
      name: 'networksAliases',
      message: 'Networks aliases (comma-separated aliases and pipe separated networks):',
      filter: (input: string) => input.length === 0 ? [] : input.split('|').map((item) => item.split(',').map(alias => alias.trim())),
      when: (answers: ServiceAnswer) => answers.createService && answers.advancedConfig && answers.useNetworksAliases,
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
      name: 'healthcheck',
      message: 'Healthcheck test command (comma-separated):',
      validate: (answer: string[]) =>  answer.length !== 0 ? true : "You need to set a healthcheck test command",
      filter: (input: string) => input.length === 0 ? [] : input.split(',').map((item) => item.trim()),
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckInterval',
      message: 'Healthcheck interval:',
      default: '1m30s',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckTimeout',
      message: 'Healthcheck timeout:',
      default: '10s',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'number',
      name: 'healthcheckRetries',
      message: 'Healthcheck retries:',
      default: 3,
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckStartPeriod',
      message: 'Healthcheck start period:',
      default: '40s',
      when: (answers: ServiceAnswer) => answers.createService && answers.useHealthcheck,
    },
    {
      type: 'input',
      name: 'healthcheckStartInterval',
      message: 'Healthcheck start interval:',
      default: '5s',
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
}
