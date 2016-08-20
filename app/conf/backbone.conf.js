import Backbone         from 'backbone';
import Validation       from 'backbone-validation';
import _                from 'underscore';

_.extend(Backbone.Model.prototype, Validation.mixin);