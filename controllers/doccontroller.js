const Document = require('../models/Document');
const getAllDoc = async (req, res) => {
    const docs = await Document.find({});
    res.status(200).json({ docs });
}

const createDoc = async (req, res) => {

}

const updateDoc = async (req, res) => {

}

const deleteDoc = async (req, res) => {

}


module.exports = {
    getAllDoc,
    createDoc,
    updateDoc,
    deleteDoc,
}