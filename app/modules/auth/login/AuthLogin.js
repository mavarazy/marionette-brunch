import Backbone from 'backbone';
import StickIt from 'backbone.stickit';
import $       from 'jquery';

import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import loginTemplate from './template/login.hbs';

class Login extends Backbone.Model {
    get validation() {
        return {
            username: {
                required: true,
                minLength: 4
            } ,
            password: {
                required: true,
                minLength: 8
            }
        }
    }
    get url () {
        return "/api/session"
    }
}

class LoginView extends Marionette.ItemView {
    template() {
        return loginTemplate;
    }
    bindings() {
        return {
            "#username": "username",
            "#password": "password"
        }
    }
    behaviors() {
        return {
            "Navigation": {},
            "StickIt": {},
            "Validation": {}
        }
    }
    events() {
        return {
            "click #login": "login"
        };
    }
    login() {
        if(this.model.isValid(true)) {
            this.model.save({}, {
                success: (data, response) => {
                    Radio.channel("auth").request("service:update", response);
                }
            });
        }
    }
}

Radio.channel('auth').reply("login:show", (region) => {
    let loginModel = new Login();
    let loginView = new LoginView({
        model: loginModel
    });
    region.show(loginView);
});


