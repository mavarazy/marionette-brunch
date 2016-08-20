import $            from "jquery";
import Backbone     from 'backbone';
import Radio        from "backbone.radio";
import Marionette   from "backbone.marionette";

class AuthSession extends Backbone.Model {
    get idAttribute() {
        return "userName"
    }
    get url() {
        return "/api/session"
    }
}
class TokenStorage {
    init() {
        if (this.isSet()) {
            let token = localStorage.getItem("X-Auth-Token");
            $.ajaxSetup({headers: {'X-Auth-Token': token }});
        }
    }
    isSet() {
        return localStorage.getItem("X-Auth-Token") !== null;
    }
    setToken(token) {
        $.ajaxSetup({ headers : { 'X-Auth-Token': token } });
        localStorage.setItem("X-Auth-Token", token);
    }
    removeToken() {
        $.ajaxSetup({ headers : {} });
        localStorage.removeItem("X-Auth-Token");
    }
}
let tokenStorage = new TokenStorage();
let currentSession = new AuthSession();

class Service {
    registered() {
        return tokenStorage.isSet();
    }
    update(response) {
        tokenStorage.setToken(response.token);
        currentSession.set(response);

        Backbone.history.navigate("", { trigger: true });
    }
    getSession() {
        return currentSession
    }
    cancel() {
        tokenStorage.removeToken();
        currentSession.destroy();
        currentSession.clear();

        Backbone.history.navigate("", { trigger: true });
    }
    remove() {
        $.ajax({
            method: "DELETE",
            url: "/api/auth/register/me"
        });
        tokenStorage.removeToken();
        currentSession.destroy();
        currentSession.clear();

        Backbone.history.navigate("", { trigger: true });
    }
}
let SERVICE = new Service();

if (localStorage !== undefined) {
    tokenStorage.init();
    currentSession.fetch({
        error: () => {
            SERVICE.cancel();
        }
    });

}


let authChannel = Radio.channel("auth");
authChannel.reply("service:registered", () => { return SERVICE.registered(); });
authChannel.reply("service:session", () => { return SERVICE.getSession()})
authChannel.reply("service:update", (response) => { SERVICE.update(response); });
authChannel.reply("service:cancel", () => { SERVICE.cancel();});
authChannel.reply("service:remove", () => { SERVICE.remove();});