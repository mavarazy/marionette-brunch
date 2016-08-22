import Backbone         from 'backbone';
import Marionette       from 'backbone.marionette';
import Radio            from 'backbone.radio';
import Validation       from 'backbone-validation';

Radio.DEBUG = true;

let Behaviors = {
    StickIt: Marionette.Behavior.extend({
        onRender() {
            this.view.stickit();
        },
        onDestroy() {
            this.view.unstickit();
        }
    }),
    CollectionFilter: Marionette.Behavior.extend({
        modelEvents() {
            return {
                'change': 'changed'
            }
        },
        changed() {
            console.log("changed");
            let filterAttr = this.view.model.attributes;
            let fieldFilters = Object.keys(filterAttr).map((fieldName) => {
                let value = filterAttr[fieldName].toLowerCase();
                if (value.trim() === "" || value === undefined) {
                    return function() {
                        return true;
                    }
                } else {
                    return (child) => {
                        let fieldValue = child.get(fieldName).toLowerCase();
                        return fieldValue !== undefined && fieldValue.indexOf(value) != -1;
                    }
                }
            });
            this.view.target.filter = (child) => {
                let failedFilter = fieldFilters.find((func) => !func(child));
                return failedFilter === undefined;
            }
            this.view.target.render();
        }
    }),
    Navigation: Marionette.Behavior.extend({
        events: {
            'click [href]' : 'navigateTo'
        },
        navigateTo(evt) {
            let dest = evt.target.getAttribute("href");
            if (dest.startsWith("/")) {
                evt.preventDefault();
                Backbone.history.navigate(dest, {trigger: true})
            }
        }
    }),
    Validation: Marionette.Behavior.extend({
        setFieldError(key, error) {
            let $el = this.view.$(`#${key}`),
                $group = $el.closest('.form-group');

            $group.addClass('has-error');
            $group.find('.help-block').html(error).removeClass('hidden');
        },
        removeFieldError(key) {
            let $el = this.view.$(`#${key}`),
                $group = $el.closest('.form-group');

            $group.removeClass('has-error');
            $group.find('.help-block').html('').addClass('hidden');
        },
        setGlobalError(error) {
            let $glError = this.view.$("#global-error");
            $glError.html(error).removeClass('hidden');
        },
        removeGlobalError() {
            let $glError = this.view.$("#global-error");
            $glError.html('').addClass('hidden');
        },
        onRender() {
            let $glErr = this.view.$("#global-error");
            if ($glErr.length === 0)
                throw "#global-error error missing"

            this.view.model.on("validated:invalid", (model, attr) => {
                Object.keys(attr).forEach((key) => {
                    this.setFieldError(key, attr[key]);
                    this.view.model.once(`change:${key}`, () => { this.removeFieldError(key) });
                });
            });

            this.view.model.on("error", (model, data) => {
                let err = JSON.parse(data.error().responseText);
                if (err.errors !== undefined) {
                    let validationError = {}
                    err.errors.forEach((error) => {
                        validationError[error.field] = error.defaultMessage
                    });
                    model.trigger("validated", false, model, validationError);
                    // isValid, model, errors
                    model.trigger("validated:invalid", model, validationError);
                } else if (err.exception === "org.springframework.security.authentication.BadCredentialsException") {
                    this.setGlobalError("User name or password is wrong");
                    this.view.model.once(`change`, () => { this.removeGlobalError() });
                } else {
                    this.setGlobalError(err.message);
                }
            })
        }
    })

}

Marionette.Behaviors.behaviorsLookup = Behaviors;
