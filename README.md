
# Nest Boiler Plate

Welcome to the Nest Boiler Plate project! This is a boilerplate template designed to kickstart your development with NestJS, a powerful and extensible Node.js framework. Whether you are building a small API or a complex microservices architecture, this starter provides a solid foundation and best practices to help you get started quickly


## Features

- Modular Structure: Follows a modular architecture to organize your code into reusable and maintainable modules.
- Dependency Injection: Leverages NestJS's built-in dependency injection system for better code organization and testability.
- Database Integration: Includes support for popular database MongoDB
- Authentication: Implements a basic authentication system using JWT (JSON Web Tokens).
- Swagger Documentation: Automatic API documentation using Swagger UI for easy testing and exploration.
- Testing: Unit and integration tests set up using Jest for ensuring code reliability.
- Environment Variables: Utilizes environment variables for configuration to enhance flexibility.
- Logging: Integrated logging with Winston for better debugging and monitoring.


## Installation

Clone this repository: 
```
git clone https://github.com/your-username/nest-js-starter.git
```

Install dependencies: 
```
npm install
```

Set up your environment variables by creating a .env file based on .env.example.
Choose and configure your preferred database settings in the configuration files.

Run the application:
```
npm run start:dev
```

Access the Swagger documentation at http://localhost:3000/api/docs to explore the API.


## Commands

There are couple of Commands already pre-configured for different purposes. Following are few of them. 

Command | Description | 
--- | --- | 
build | Triggers the production build |
start | Start the project locally |
start:dev | Start the project with DEV mode |
start:debug | Start the project with DEBUG mode |
start:prod | Start the project with PROD mode |
format:check | Will check the code format |
format:write | Changes the format to match with required format |
lint:check | Lint check |
lint:write | Write the lint changes |
test | Run test cases |
test:watch | Run tests with watch mode enabled |
test:cov | Run tests with coverage |
test:debug | Run test cases in debug mode |


## Authors

- [@iamjayantchauhan](https://github.com/iamjayantchauhan)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Contribution

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

Happy coding with Nest JS Starter! 🚀
