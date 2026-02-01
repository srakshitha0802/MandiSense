# Contributing to MandiSense 2.0

Thank you for your interest in contributing to MandiSense 2.0! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Types of Contributions
- 🐛 Bug reports and fixes
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🌐 Language translations
- 🎨 UI/UX improvements
- 🧪 Testing and quality assurance

## 🚀 Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/srakshitha0802/MandiSense.git
cd MandiSense
```

### 2. Set Up Development Environment
```bash
npm install
npm start
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
```typescript
// Good component structure
interface ComponentProps {
  // Define props with types
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Implementation
  };
  
  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

### File Organization
```
src/
├── components/          # Reusable UI components
├── services/           # Business logic and API calls
├── assets/            # Images, styles, fonts
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for complex features
- Test accessibility compliance
- Verify multi-language support

## 🌐 Internationalization

### Adding New Languages
1. Add language to `SUPPORTED_LANGUAGES` in `LanguageService.ts`
2. Create translation object in `translations`
3. Add voice synthesis configuration
4. Test all UI elements in the new language

### Translation Guidelines
- Use clear, concise translations
- Maintain cultural context
- Test with native speakers
- Consider text length variations

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Reproduce the bug
- Test in multiple browsers
- Gather system information

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 90]
- Version: [e.g., 2.0.1]
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other solutions considered

**Additional Context**
Screenshots, mockups, etc.
```

## 📝 Pull Request Process

### 1. Prepare Your Changes
- Ensure code follows style guidelines
- Add/update tests as needed
- Update documentation
- Test thoroughly

### 2. Commit Guidelines
```bash
# Use conventional commit format
git commit -m "feat: add voice recognition for Tamil language"
git commit -m "fix: resolve price alert notification issue"
git commit -m "docs: update API documentation"
```

### 3. Submit Pull Request
- Use descriptive title and description
- Reference related issues
- Include screenshots for UI changes
- Request review from maintainers

### 4. Code Review Process
- Address reviewer feedback
- Keep discussions constructive
- Update code as needed
- Maintain clean commit history

## 🏗️ Architecture Guidelines

### Service Layer
- Keep services focused and single-purpose
- Use TypeScript interfaces for data contracts
- Handle errors gracefully
- Implement proper logging

### State Management
- Use React hooks for local state
- Implement proper data flow
- Avoid prop drilling
- Consider context for global state

### Performance
- Optimize bundle size
- Implement lazy loading
- Use React.memo for expensive components
- Monitor performance metrics

## 🔒 Security Guidelines

### Data Handling
- Never store sensitive data in localStorage
- Validate all user inputs
- Sanitize data before display
- Use HTTPS for all API calls

### Authentication
- Implement proper session management
- Use secure token storage
- Handle authentication errors
- Provide clear security feedback

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms
- Explain business logic
- Provide usage examples

### User Documentation
- Keep README up to date
- Add feature documentation
- Create user guides
- Maintain changelog

## 🎯 Priorities

### High Priority
- Bug fixes and security issues
- Performance improvements
- Accessibility enhancements
- Core feature stability

### Medium Priority
- New language support
- UI/UX improvements
- Additional features
- Developer experience

### Low Priority
- Code refactoring
- Documentation updates
- Nice-to-have features
- Experimental features

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Respect different perspectives
- Provide constructive feedback
- Help newcomers

### Communication
- Be clear and concise
- Ask questions when unsure
- Share knowledge and resources
- Celebrate contributions

## 📞 Getting Help

### Resources
- [GitHub Issues](https://github.com/srakshitha0802/MandiSense/issues)
- [GitHub Discussions](https://github.com/srakshitha0802/MandiSense/discussions)
- [Documentation Wiki](https://github.com/srakshitha0802/MandiSense/wiki)

### Contact
- Create an issue for bugs or features
- Use discussions for questions
- Email: contributors@mandisense.com

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

### Contribution Types
- 💻 Code contributions
- 📖 Documentation
- 🌐 Translations
- 🐛 Bug reports
- 💡 Ideas and suggestions
- 🎨 Design contributions

## 📄 License

By contributing to MandiSense 2.0, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to MandiSense 2.0!** 

Your contributions help empower farmers and agricultural communities with better technology. Every contribution, no matter how small, makes a difference.

*Happy coding! 🌾*