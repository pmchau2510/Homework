const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    // const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    // const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    // return {
    //     iv: iv.toString('hex'),
    //     content: encrypted.toString('hex')
    // };
    var cipher = crypto.createCipheriv(algorithm, secretKey, iv)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};

const decrypt = (hash) => {

    // const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    // const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    // return decrpyted.toString();
    var decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
    var dec = decipher.update(hash, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};

module.exports = {
    encrypt,
    decrypt
};