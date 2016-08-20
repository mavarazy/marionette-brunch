import service  from './service/AuthService';
import login    from './login/AuthLogin';
import singin   from './register/AuthRegister';
import restor   from './restore/AuthRestore';

import Marionette from 'backbone.marionette';
import Radio      from 'backbone.radio';

class AuthenticationRoutes extends Marionette.AppRouter {
    routes() {
        return {
            "auth"              : 'login',
            "auth/login"        : 'login',
            "auth/register"     : 'register',
            "auth/restore"      : 'restore'
        };
    }
    login() {
        let region = Radio.channel('app').request("region");
        Radio.channel("auth").request("login:show", region);
    }
    register() {
        let region = Radio.channel('app').request("region");
        Radio.channel("auth").request("register:show", region);
    }
    restore() {
        let region = Radio.channel('app').request("region");
        Radio.channel("auth").request("restore:show", region);
    }
}

new AuthenticationRoutes()