install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
test-coverage:
	npm test -- --coverage
test:
	npm test
page-loader:
	node bin/page-loader.js