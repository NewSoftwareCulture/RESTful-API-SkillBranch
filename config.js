module.exports = {
    db: {
        uri: "mongodb://localhost:27017/skillbranch_db",
    },
    jwt: {
        token: "123456",
    },
    email: {
        service: 'yandex',
        login: 'testermajler@yandex.ru',
        password: '12345678test',
        title: 'Recovery code Skillbranch',
    },
    port:  process.env.PORT || 3000,
};