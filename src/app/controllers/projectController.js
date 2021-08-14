const express = require('express');
const authMiddleware = require ('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    res.send({ user: req.userId });
});

router.get('/:projectID', async (req, res) => {
    res.send({ user: req.userId });
});

router.post('/', async (req, res) => {
    res.send({ user: req.userId });
});

router.put('/:projectID', async (req, res) => {
    res.send({ user: req.userId });
});

router.delete('/:projectID', async (req, res) => {
    res.send({ user: req.userId });
});

module.exports = app => app.use('/projects', router);