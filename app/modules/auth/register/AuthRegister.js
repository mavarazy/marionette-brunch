import Backbone from 'backbone';
import StickIt from 'backbone.stickit';

import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import registrationTemplate from './template/registration.hbs';

class Registration extends Backbone.Model {
    get validation() {
        return {
            username: {
                required: true,
                minLength: 4
            },
            password: {
                required: true,
                minLength: 8
            },
            passwordConfirm: (value) => {
                if(value !== this.get("password")) {
                    return 'Do not match';
                }
            },
            agree: {
                required: true
            }
        }
    }
    get url () {
        return "/api/auth/register"
    }
}

class RegisterView extends Marionette.ItemView {
    template() {
        return registrationTemplate;
    }
    bindings() {
        return {
            "#username"             : "username",
            "#password"             : "password",
            "#passwordConfirm"      : "passwordConfirm",
            "#agree"                : "agree"
        }
    }
    behaviors() {
        return {
            "Navigation": {},
            "Validation": {},
            "StickIt": {}
        }
    }
    events() {
        return {
            "click #register": "register"
        };
    }
    register() {
        if(this.model.isValid(true)) {
            this.model.save({}, {
                success: (data, response) => {
                    Radio.channel("auth").request("service:update", response);
                }
            });
        }
    }
}

Radio.channel('auth').reply("register:show", (region) => {
    region.show(new RegisterView({
        model: new Registration()
    }));
});


