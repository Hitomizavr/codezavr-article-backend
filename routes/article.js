const Article = require('../models/article');
const { Validator } = require('node-input-validator');

module.exports = function(app) {
    app.get('/articles', function(req, res) {
        Article.find({}, function(err, articles) {
            if (err) {
                res.status(500);
                res.json({ message: 'Error!' });
            }
    
            res.json(articles);
        });
    });


app.put('/articleqq', function (req, res) {
    const v = new Validator(req.body, {
        title: 'required',
        subtitle: 'required',
        text: 'required',
        tags: 'required|array',
        image: 'required'
    });
    
    v.check().then((matched) => {
        if (!matched) {
            res.status(422).send(v.errors);
        } else {
            const { title, subtitle, text, tags, image } = v.inputs;
            
            Article.create({
                title,
                subtitle,
                text,
                tags,
                image,
                views: 0,
                likes: 0
            }, function(err, article) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ message: 'Please try again later' });
                }

                res.json({ "id": article._id });
            });
        }
    });
})

    app.get('/article/:id', function(req, res) {
        var id = req.params.id.trim();
    
        Article.findOne({ _id: id,}, { __v: false, _id: false, }, function(err, article) {
            if (err) {
                res.status(404);
                res.json({ message: 'Article with this ID not found' });
            }
            res.json(article);
        });
    });



    app.get('/articles/:tag', function(req, res) {
        var tag = decodeURIComponent(req.params.tag.trim());
   
        Article.find({ tags: tag.toLowerCase() }, { __v: false, _id: false }, { sort: '-date' }, function(err, articles) {     // Мы пишем в массиве - с маленькой буквы; когда юзер пишет любой регистр - образует все символы в маленькие.
            if (err) {
                res.status(500);
                res.json({ message: 'Error!' });
            }
   
            res.json(articles);
        });
     });


     app.get('/last', function(req, res) {
        Article.find({}, { __v: false, _id: false }, { sort: '-date', limit: 10 }, function(err, articles) {
            if (err) {
                res.status(500);
                res.json({ message: 'Error!' });
            }



            let tmp = articles.map(item => {
                let text = item._doc.text;
                text = text.substring(0, 300) + (text.length > 300 ? "..." : "");

                return {...item._doc, ...{ text }};
            });
   
            res.json(tmp);
        });
     });

    
}