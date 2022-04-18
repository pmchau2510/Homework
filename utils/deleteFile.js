const fs = require('fs');
const fsa = require('fs-extra');

const deleteFile = (url) => {
    const exitFile = fs.existsSync(url)
    if (exitFile) {
        fs.unlinkSync(url)
        console.log({
            status: '200',
            responseType: 'string',
            response: 'success'
        })
    } else {
        console.log('Not found file')
    }
}

const removeFile = (doc) => {
    const url = doc.url.replace('/uploads/', '');
    fsa.move(`.\\public\\uploads\\${url}`, `.\\public\\trashs\\${url}`, err => {
        if (err) console.error(err)
    });
}

const restoreFile = (doc) => {
    const url = doc.url.replace('/uploads/', '');
    fsa.move(`.\\public\\trashs\\${url}`, `.\\public\\uploads\\${url}`, err => {
        if (err) console.error(err)
    });
}

module.exports = { deleteFile, removeFile, restoreFile };