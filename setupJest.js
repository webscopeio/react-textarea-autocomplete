/**
 * Polyfill for CI
 */
import 'babel-polyfill';

window.HTMLElement.prototype.scrollIntoView = function() {};
