const express = require('express');
const authMiddleware = require ('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

//list route
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects'});
    }
});

//show route
router.get('/:projectID', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectID).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading project'});
    }
});

//create route
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project'});
    }
});

//update route
router.put('/:projectID', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectID, {
            title,
            description
        }, { new: true });

        project.tasks = [];
        await Task.deleteMany({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating project'});
    }
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