module.exports = {
    db: {
        uri: "mongodb://localhost:27017/skillbranch_db",
    },
    jwt: {
        token: {
            access: {
                key: 'secret',
                expiresIn: 20*60,
            },
            refresh: {
                key: 'secret',
            },
        },
    },
    email: {
        service: 'yandex',
        login: 'testermajler@yandex.ru',
        password: '12345678test',
        title: 'Recovery code Skillbranch',
    },
    AUTH_TOKEN: '',
    port:  process.env.PORT || 3000,
};