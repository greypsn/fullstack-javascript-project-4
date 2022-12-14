install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
test:
	NODE_OPTIONS=--experimental-vm-modules npx jest
page-loader:
	node bin/page-loader.js