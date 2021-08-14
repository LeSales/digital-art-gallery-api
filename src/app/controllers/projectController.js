const express = require('express');
const authMiddleware = require ('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

//list route
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('user');

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects'});
    }
});

//show route
router.get('/:projectID', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectID).populate('user');

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading project'});
    }
});

//create route
router.post('/', async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, user: req.userId });

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project'});
    }
});

//update route
router.put('/:projectID', async (req, res) => {
    res.send({ user: req.userId });
});

//delete route
router.delete('/:projectID', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectID);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project'});
    }
});

module.exports = app => app.use('/projects', router);