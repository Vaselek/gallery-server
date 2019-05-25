const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    mongoOptions: {useNewUrlParser: true},
    dbUrl: 'mongodb://localhost/gallery',
    facebook: {
        appId: '471260170082980',
        appSecret: 'bb8c3c3622c5c67ef1aad15c9f8a50e3'
    }
}