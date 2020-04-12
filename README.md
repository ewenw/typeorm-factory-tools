`typeorm-factory-tools` is a factory library for `typeorm` that
supports writing clean, transactional tests.

Inspired by the `factory-bot` gem.

### Installation
```
npm install --save-dev typeorm-factory-tools
```

### Features
- Define multiple factory variations for the same entity in a simple yet featureful syntax
- Use factories to build instances with overridden properties
- Support complex entity relationships without violating key constraints
- Wrap up test cases in a transaction context to prevent disk-writes and enable fast tests
- Create common instances used in multiple cases

### Documentation

This package provides a set of core functions that makes it easy to define factories, create instances, and wrap everything in tests that run in transactions:
- `define` - defines factories with default properties
- `relate` - creates many-to-many relationships between instances
- `make` - makes an instance of a factory
- `makeMany` - makes multiple instances of a factory
- `transact` - runs the test function in a single transaction by overriding typeorm's `connection` object
- `context` - creates common instances for each test case that uses `transact`