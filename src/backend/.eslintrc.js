/**
 * ESLint Configuration
 * 
 * This configuration defines code style rules and linting preferences for the
 * Node.js Hello World application. It ensures consistent code style across the
 * project and helps prevent common programming errors.
 * 
 * @version 1.0.0
 */

module.exports = {
  // Environment configuration specifies the environments in which the code will run
  env: {
    node: true,     // Node.js global variables and Node.js scoping
    es2021: true,   // Adds all ECMAScript 2021 globals and sets the parser's ecmaVersion
    jest: true,     // Jest global variables for testing
  },

  // Extends the recommended ESLint rules
  extends: [
    'eslint:recommended',
  ],

  // Parser options determine how ESLint parses the code
  parserOptions: {
    ecmaVersion: 2021,  // Use ECMAScript 2021 syntax
    sourceType: 'module', // Allows the use of imports
  },

  // Rules configuration (0=off, 1=warn, 2=error)
  rules: {
    // Formatting and style
    'indent': ['error', 2],                // Use 2 spaces for indentation
    'linebreak-style': ['error', 'unix'],  // Enforce Unix-style line breaks
    'quotes': ['error', 'single'],         // Use single quotes
    'semi': ['error', 'always'],           // Require semicolons
    'no-console': ['warn', {               // Warn on console usage except for specific methods
      'allow': ['warn', 'error', 'info']
    }],
    'no-unused-vars': ['error', {          // Error on unused variables except those starting with _
      'argsIgnorePattern': '^_'
    }],
    'no-var': 'error',                     // Disallow var, use let or const
    'prefer-const': 'error',               // Prefer const over let when possible
    'eqeqeq': ['error', 'always'],         // Require === and !== over == and !=
    'curly': ['error', 'all'],             // Require curly braces for all control statements
    'brace-style': ['error', '1tbs'],      // Enforce one true brace style
    'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline objects/arrays
    'max-len': ['warn', {                  // Warn on lines longer than 100 characters
      'code': 100,
      'ignoreUrls': true,
    }],
    'no-multiple-empty-lines': ['error', { // Limit empty lines
      'max': 1,
      'maxEOF': 1
    }],

    // Spacing rules
    'object-curly-spacing': ['error', 'always'], // Require spaces inside object literals
    'array-bracket-spacing': ['error', 'never'],  // Disallow spaces inside array brackets
    'arrow-parens': ['error', 'always'],         // Require parens around arrow function parameters
    'arrow-spacing': 'error',                    // Require spaces before/after arrow function's arrow
    'space-before-function-paren': ['error', {   // Control spaces before function parentheses
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'keyword-spacing': 'error',                 // Require spaces before/after keywords
    'space-infix-ops': 'error',                 // Require spaces around operators
    'comma-spacing': ['error', {                // Require spaces after commas
      'before': false,
      'after': true
    }],
    'key-spacing': ['error', {                  // Require space after colon in object literals
      'beforeColon': false,
      'afterColon': true
    }],
    'no-trailing-spaces': 'error',              // Disallow trailing whitespace
  },

  // Overrides for specific file patterns
  overrides: [
    {
      files: ['**/*.test.js'],  // Apply these rules to test files
      env: {
        jest: true,             // Enable Jest globals
      },
      rules: {
        'max-len': 'off',       // Disable line length limits in test files
      },
    },
  ],
};