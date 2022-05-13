interface UserModel {
    login :string;
}

export = class UserDTO {
    login: string;

    constructor(model: UserModel) {
        this.login = model.login;
    }
}

