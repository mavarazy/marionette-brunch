import Backbone     from 'backbone';
import Radio        from 'backbone.radio';
import $            from 'jquery';

class User extends Backbone.Model {
    get idAttribute() {
        return "username"
    }
    get urlRoot() {
        return "/api/user"
    }
    setRole(ROLE) {
        $.ajax({
            url: `${this.url()}/role`,
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ authority: ROLE }),
            processData: false,
            success: () => {
                let update = {};
                this.specifyRole(ROLE, update);
                this.set(update);
            },
            error: (data) => {
                this.trigger("error", this, data)
            }
        });
    }
    specifyRole(role, obj) {
        obj.isManager   = false;
        obj.isAdmin     = false;
        obj.isUser      = false;
        switch (role) {
            case "MANAGER":
                obj.isManager = true;
                break;
            case "ADMIN":
                obj.isAdmin   = true;
                break;
            case "USER":
                obj.isUser    = true;
                break;
        }

    }
    parse(res) {
        res.authorities.forEach((auth) => {
            this.specifyRole(auth.authority, res);
        })
        return res
    }
}

class Users extends Backbone.Collection {
    get model() {
        return User
    }
    get url() {
        return "/api/user"
    }
}

class API {
    all() {
        let users = new Users();
        users.fetch();
        return users;
    }
    getUser(username) {
        let user = new User({
            username: username
        });
        user.fetch();
        return user;
    }
}

let service = new API()

Radio.channel("user").reply("entities", () => service.all())
Radio.channel("user").reply("entities:get", (username) => service.getUser(username))
