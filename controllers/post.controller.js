const Validator = require('fastest-validator');
const models = require('../models');

function save(req, res) {
    const post = {
        title: req.body.title,
        content: req.body.content,
        categoryId: req.body.categoryId,
        userId: 1
    };

    /// validation schema
    const schema = {
        title: {type: "string", optional:false, max:"100"},
        content: {type: "string", optional:false, max:"100"},
        categoryId: {type: "number", optional:false},
    }

    const v = new Validator();
    const validationResponse = v.validate(post,schema);

    if(validationResponse != true){
        return res.status(400).json({
            message: "validation Failed",
            errors: validationResponse
        });
    }
    models.Post.create(post).then(result => {
        res.status(201).json({
            message: "Post Created Successfully",
            post: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something Went Wrong!",
            error: error
        });
    });
}

function show(req, res){
    const id = req.params.id;
    models.Post.findByPk(id).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
}


function index(req, res) {
    models.Post.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
}


module.exports = {
    save: save,
    show: show,
    index: index
};
