# Contributing to One Health Surveillance System

We welcome contributions! This document explains how to contribute to the project.

## Code of Conduct

- Be respectful and professional
- Focus on the code, not the person
- Help others learn and grow
- Report issues constructively

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/one-health-surveillance.git
   cd one-health-surveillance
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set Up Development Environment**
   - Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - Ensure all tests pass

## Development Guidelines

### Python (Backend)

**Code Style**
- Follow PEP 8 guidelines
- Use meaningful variable names
- Add docstrings to functions and classes
- Maximum line length: 100 characters

**Example**
```python
def calculate_risk_score(human_cases: list, animal_events: list) -> float:
    """
    Calculate the risk score based on nearby events.
    
    Args:
        human_cases: List of human disease cases
        animal_events: List of animal health events
    
    Returns:
        Risk score between 0 and 100
    """
    return sum(case.severity for case in human_cases) * 0.5
```

**Testing**
- Write tests for new functions
- Run: `pytest backend/tests/`
- Aim for 80%+ code coverage

### JavaScript/React (Frontend)

**Code Style**
- Use ES6+ syntax
- Use functional components with hooks
- Add PropTypes for prop validation
- Maximum line length: 100 characters

**Example**
```jsx
import PropTypes from 'prop-types';

const AlertCard = ({ alert, onDismiss }) => {
  return (
    <div className="alert-card">
      <h3>{alert.title}</h3>
      <p>{alert.message}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
};

AlertCard.propTypes = {
  alert: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default AlertCard;
```

**Testing**
- Use React Testing Library
- Test user interactions, not implementation
- Run: `npm run test`

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic changes)
- `refactor`: Code restructuring
- `test`: Test additions/changes
- `chore`: Build, deps, config

**Examples:**
```
feat(alerts): add email notification for critical alerts

fix(dashboard): resolve stat card loading state issue

docs: update API documentation for environmental endpoints

refactor(database): simplify alert query logic

test(human-routes): add tests for case submission endpoint
```

### Commit Best Practices

- Make logical, focused commits
- One feature per commit
- Write clear commit messages
- Test before committing

## Pull Request Process

### Before Submitting

1. **Update Your Branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run All Tests**
   ```bash
   # Backend
   cd backend
   pytest
   
   # Frontend
   cd frontend
   npm run lint
   npm run test
   ```

3. **Update Documentation**
   - Add/update docstrings
   - Update README if needed
   - Add comments for complex logic

### Submitting PR

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use descriptive title
   - Reference related issues: "Closes #123"
   - Add description of changes
   - Include testing instructions

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings generated
```

## Bug Reporting

### Before Reporting

- Check existing issues
- Verify bug on latest version
- Try to reproduce consistently

### Bug Report Format

Include:
1. **Environment**: OS, Python/Node version, browser
2. **Steps to Reproduce**: Exact steps to trigger bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots/Logs**: Error messages, stack traces
6. **Additional Context**: Any other relevant info

**Example:**
```markdown
### Environment
- OS: Windows 10
- Python: 3.11.0
- Browser: Chrome 120

### Steps to Reproduce
1. Open dashboard
2. Submit human case with severity "critical"
3. View alerts list

### Expected Behavior
Critical alert should appear with red icon

### Actual Behavior
Alert appears with yellow icon (moderate level)

### Screenshots
[Attach screenshot showing issue]

### Logs
```
ERROR: [error message here]
```
```

## Feature Requests

### Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How it should work

## Alternatives Considered
Other possible approaches

## Additional Context
Any other relevant info
```

## Areas for Contribution

### High Priority
- [ ] Mobile app development
- [ ] Machine learning for alert optimization
- [ ] Multi-language support
- [ ] Performance optimization

### Medium Priority
- [ ] Export data to CSV/PDF
- [ ] API authentication (OAuth2)
- [ ] User management system
- [ ] Advanced filtering

### Low Priority
- [ ] UI improvements
- [ ] Documentation expansion
- [ ] Additional chart types
- [ ] Keyboard shortcuts

## Development Tools

### Backend
- **Linter**: `pylint backend/`
- **Formatter**: `black backend/`
- **Type Checker**: `mypy backend/`
- **Testing**: `pytest backend/`

### Frontend
- **Linter**: `npm run lint`
- **Formatter**: `npm run format`
- **Testing**: `npm run test`
- **Build**: `npm run build`

## Release Process

1. Update version in `package.json` and `requirements.txt`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Create GitHub release

## Questions?

- Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- Review [API_REFERENCE.md](../API_REFERENCE.md)
- Open an issue with `question` label
- Contact: team@onehealth.example

## License

By contributing, you agree your code will be under MIT License.

---

**Thank you for contributing to One Health Surveillance!** 🎉
