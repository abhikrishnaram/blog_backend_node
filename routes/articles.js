const express = require('express')
const Article = require('./../models/article.js')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

router.get('/new', (req, res) => {
    res.render('article/new', { article: new Article() })
});

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        //console.log(article);
        res.render('article/show', { article: article });
    } catch (e) {
        res.redirect('/');
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('article/edit', { article: article });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }    
});


router.delete('/:id', async (req, res) => {
    const article = await Article.findByIdAndDelete(req.params.id);
    res.redirect('/')
})

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
},upload_article('edit'));

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next()
}, upload_article('new'));

function upload_article(path) {
    return async (req, res) => {
        article = req.article;
        article.title = req.body.title,
        article.seo_title = req.body.seo_title,
        article.description = req.body.description,
        article.img_url = req.body.img_url,
        article.markdown = req.body.markdown,
        article.author = req.body.author,
        article.date = new Date().toLocaleDateString(),
        article.a_id = uuidv4()
        

        try {
            article = await article.save();
            res.redirect(`/articles/${article._id}`);
        } catch (e) {
            console.log(e);
            res.render(`article/${path}`, { article: article })
        }
    }
}




module.exports = router