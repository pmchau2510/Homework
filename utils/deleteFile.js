const fs = require('fs');

const deleteFile = (url) => {
    const exitFile = fs.existsSync(url)
    if (exitFile) {
        fs.unlinkSync(url)
        console.log({
            status: "200",
            responseType: "string",
            response: "success"
        })
    } else {
        console.log('Not found file')
    }
}


module.exports = deleteFile;