const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = {};
  context.mergeJson['.babelrc'] = {};
  context.config = {
    set: () => {}
  };
});

test('Call this.config.set twice', () => {
  context.config = {
    set: () => {}
  };
  const spy = chai.spy.on(context.config, 'set');
  TestUtils.call(context, 'configuring.config');
  expect(spy).to.have.been.called.twice();
  expect(spy).to.have.been.called.with('version');
  expect(spy).to.have.been.called.with('props');
});

test(`Add 'react' to package.json dependencies`, t => {
  context.props = {router: 'none'};
  TestUtils.call(context, 'configuring.pkg');
  t.is(context.mergeJson['package.json'].dependencies.react, '^15.0.1');
  t.is(context.mergeJson['package.json'].devDependencies['react-addons-test-utils'], '^15.0.1');
});

test(`Add 'router' to package.json dependencies`, t => {
  context.props = {router: 'router', modules: 'webpack'};
  TestUtils.call(context, 'configuring.pkg');
  t.is(context.mergeJson['package.json'].dependencies['react-router'], '^2.4.0');
});

test(`Add 'router' cdn url to package.json dependencies`, t => {
  context.props = {router: 'router', modules: 'inject'};
  TestUtils.call(context, 'configuring.pkg');
  t.is(context.mergeJson['package.json'].dependencies['react-router'], 'https://cdnjs.cloudflare.com/ajax/libs/react-router/2.4.1/ReactRouter.min.js');
});

test(`Add 'react' to '.babelrc'`, t => {
  context.props = {js: 'babel'};
  TestUtils.call(context, 'configuring.babel');
  t.deepEqual(context.mergeJson['.babelrc'].presets, ['react']);
});

test(`Not add 'react' to '.babelrc'`, t => {
  context.props = {js: 'typescript'};
  TestUtils.call(context, 'configuring.babel');
  t.deepEqual(context.mergeJson['.babelrc'], {});
});
