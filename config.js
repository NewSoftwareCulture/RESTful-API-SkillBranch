module.exports = {
    db: {
        uri: process.env.DB_URI || "mongodb://localhost:27017/skillbranch_db",
    },
    jwt: {
        token: {
            access: {
                key: process.env.JWT_KEY || 'secret',
                expiresIn: 20*60,
            },
            refresh: {
                key: process.env.JWT_KEY || 'secret',
            },
        },
    },
    email: {
        service: 'yandex',
        login: process.env.EMAIL_LOGIN || '',
        password: process.env.EMAIL_PASSWORD || '',
        title: 'Recovery code Skillbranch',
    },
    AUTH_TOKEN: process.env.DADATA_AUTH_TOKEN ||'e44398eba74fe445009be67dd8413453a1b59d0e',
    port:  process.env.PORT || 3000,
};