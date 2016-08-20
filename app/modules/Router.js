import Backbone     from 'backbone';
import Marionette   from 'backbone.marionette';
import Radio        from 'backbone.radio';

class Router extends Marionette.AppRouter {
    routes() {
        return {
            ""                  : 'show'
        };
    }
    navigate(session) {
        switch (session.get("role")) {
            case "ADMIN":
                Backbone.history.navigate("user", true);
                break;
            case "USER":
                Backbone.history.navigate("clock", true);
                break;
            case "MANAGER":
                Backbone.history.navigate("user", true);
                break;
            default:
                Backbone.history.navigate("marketing", true);
                break;
        }
    }
    show() {
        let region = Radio.channel('app').request("region");
        let registered = Radio.channel('auth').request('service:registered');
        let session = Radio.channel("auth").request("service:session");
        session.once("sync", (session) => {
            this.navigate(session);
        });
        this.navigate(session);
    }
}

new Router()