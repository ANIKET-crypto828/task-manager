# Contributing to Task Manager

First off, thank you for considering contributing to Task Manager! It's people like you that make Task Manager such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** and add tests
4. **Run tests**: `npm test`
5. **Ensure the test suite passes**
6. **Format your code**: `npm run format`
7. **Lint your code**: `npm run lint`
8. **Commit your changes** using conventional commits
9. **Push to your fork** and submit a pull request

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript for all new code
* Use interfaces for object type definitions
* Use enums for fixed sets of values
* Avoid `any` type when possible
* Use meaningful variable names
* Add JSDoc comments for public APIs

### Testing Styleguide

* Write tests for all new features
* Ensure all tests pass before submitting PR
* Aim for >80% code coverage
* Use descriptive test names

## Project Structure

Please maintain the existing project structure:
* Controllers handle HTTP requests/responses
* Services contain business logic
* Repositories handle data access
* Validators use Zod schemas
* Keep components small and focused

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you! ❤️