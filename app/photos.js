const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Photo = require('../models/Photo');
const ObjectId = require('mongoose').Types.ObjectId;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.author)
        return Photo.find({user: new ObjectId(req.query.author)})
            .then(photos => res.send(photos))
            .catch(() => res.sendStatus(500))
    Photo.find()
        .then(photos => res.send(photos))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Photo.findById(req.params.id).populate('user')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404);
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', upload.single('image'), (req, res) => {
    const photoData = {
        title: req.body.title,
    };
    if (req.file) {
        photoData.image = req.file.filename;
    }
    const photo = new Photo(photoData);
    photo.save()
        .then(result => res.send(result))
        .catch((error) => res.sendStatus(400).send(error))
});

router.delete('/:id', auth, (req, res) => {
    Photo.findById(req.params.id)
        .then(photo => {
            if (!photo.user.equal(req.user._id)) res.sendStatus(401)
            photo.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/:id/publish', auth, (req, res) => {
    Photo.findById(req.params.id)
        .then(photo => {
            photo.published = true;
            photo.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});


module.exports = router;
