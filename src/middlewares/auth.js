const adminAuth = (req, resp, next) => {
    let token = '123456';
    let isAuthorized = token == '123456s';
    if(isAuthorized) {
        resp.status(200).send('Authorized');
    } else {
        resp.status(401).send('Unauthorized');
    }
};

module.exports = {
    adminAuth
}