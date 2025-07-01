if (process.env.NODE_ENV != "Production") {
    require("dotenv").config();
}

require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

/*PASSWORD CONNECTION*/
const passport = require("passport");
const localstatergy = require("passport-local")

/*mongo connection*/
const mongoose = require("mongoose");
const User = require("./Model/User.js");
const session = require("express-session");
const ejsMate = require("ejs-mate");

const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const dburl = process.env.ATLAS_DB;
const port = 8020;
//for different type of blog
const BLOG = require("./Model/edit.js");
const TECH=require("./Model/tech,.js");
const CRIC=require("./Model/cric.js");
const GEN=require("./Model/gen.js");
const NAT=require("./Model/nature.js");
const MOTIVE=require("./Model/motive.js");
//FOR IMAGE UPLOAD
const multer = require("multer");

const { storage } = require("./cloudConfig.js");
const UPLOAD = multer({ storage });

//for file upload
const Lbrary = require("./Model/library.js");
const { isLoggedIn } = require("./middleware.js");
app.set("views", path.join(__dirname, "VIEW"));
// for sms
const {sms}=require("./sms.js");


app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "PUBLIC")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(require('express-status-monitor')())


main().
    then(() => {
        console.log("sucessful connection");
    }).catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/blog");

}

const sessionOption = ({
    secret: "musecretcode",
    resave: false,
    saveUninitialized: true,
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.user = req.user;
    req.time=new Date(Date.now()).toString();
    res.locals.time=req.time;
    res.locals.msg=req.flash("sucess");
    next();
})

app.get("/", (req, res) => {
    res.render("HOME/index.ejs");
})

app.get("/sign", (req, res) => {
    res.render("LOG-SIGN/signup.ejs");
})
app.post("/sign", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const regis = await User.register(newuser, password);
        res.redirect("/home");
        sms(username);
    } catch (err) {
        console.error(err);
    }
})
app.get("/login", (req, res) => {
    
    res.render("LOG-SIGN/login.ejs");
})

app.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("sucess","login sucessful");
    res.redirect("/home");
})

app.get("/logout", (req, res) => {
    try {
        req.logOut((err) => {
            if (err) {
                nextTick(err);
            }
            res.redirect("/home");
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send("please fill the data");
    }
})


//EDIT BLOG PAGE and ROUTE
app.get("/blog/new", (req, res) => {

    res.render("BLOG/edit.ejs");
})

app.get('/pdf', (req, res) => {
    const filePath = 'C:\\Users\\Aaditya\\Pictures\\Impotant Unit -2 BAS0204[1].pdf';
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        }
    });
});


app.post("/blog", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0]; 
    const image1File = req.files['Image1'][0]; 

    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;

    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;
    let lt = new BLOG({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });
    try {
        await lt.save();
        console.log(imageFile);
        res.redirect("/blog");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});

//Display OF individual Blog Page
app.get("/blog", async (req, res) => {
    let Blog = await BLOG.find({});
    res.render("BLOG/blog.ejs", { Blog });
})

app.get("/blog/:id", async (req, res) => {
    const id = req.params.id;
    const display = await BLOG.findById(id);
    res.render("BLOG/DisplayBlog.ejs", { b: display });
})

app.delete("/blog/:id", async (req, res) => {
    let { id } = req.params;
    await BLOG.findByIdAndDelete(id);
    res.redirect("/blog");
})

//BLOG for TECH
app.get("/tech/new", (req, res) => {

    res.render("TECH/editTech.ejs");

app.post("/tech", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }
    const imageFile = req.files['Image'][0]; 
    const image1File = req.files['Image1'][0]; 

    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;
    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;

    let tech = new TECH({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });

    try {
        await tech.save();
        res.redirect("/tech");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
})
});

app.get("/tech",async(req,res)=>{
    let tech = await TECH.find({});
    res.render("TECH/tech.ejs", { tech });
})
app.delete("/tech/:id",async(req,res)=>{
    let {id}=req.params;
    await TECH.findByIdAndDelete(id);
    res.redirect("/tech");
})
//CRICKET BLOG
app.get("/cric/new",(req,res)=>{
    res.render("SPORTS/editcric.ejs");
});
app.post("/cric", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0];
    const image1File = req.files['Image1'][0]; 

    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;

    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;

    let cric = new CRIC({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });

    try {
        await cric.save();
        res.redirect("/cric");
        console.log("working");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});

app.get("/cric",async(req,res)=>{
    let cric = await CRIC.find({});
    res.render("SPORTS/cric.ejs", { cric });
});
app.delete("/cric/:id",async(req,res)=>{
    let {id}=req.params;
    await CRIC.findByIdAndDelete(id);
    res.redirect("/cric");
})

app.get("/gen/new",(req,res)=>{
    res.render("GENERAL/editgen.ejs");
})
app.post("/gen", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0]; 
    const image1File = req.files['Image1'][0]; 

    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;

    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;

    let gen = new GEN({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });
    try {
        await gen.save();
        res.redirect("/gen");
        console.log("working");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});
app.get("/gen",async(req,res)=>{
    let gen= await GEN.find({});
    res.render("GENERAL/gen.ejs",{gen});
})
app.delete("/gen/:id",async(req,res)=>{
    let {id}=req.params;
    await GEN.findByIdAndDelete(id);
    res.redirect("/gen");
})
//FOR  NATURE BLOG
app.get("/nat/new",(req,res)=>{
    res.render("NATURE/editnat.ejs");
})
app.post("/nat", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }
    const imageFile = req.files['Image'][0]; 
    const image1File = req.files['Image1'][0]; 
    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;

    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;

    let nat = new NAT({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });

    try {
        await nat.save();
        res.redirect("/nat");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});
app.get("/nat",async(req,res)=>{
    let nat= await NAT.find({});
    res.render("NATURE/nat.ejs",{nat});
})
app.delete("/nat/:id",async(req,res)=>{
    let {id}=req.params;
    await NAT.findByIdAndDelete(id);
    res.redirect("/nat");
})

//FOR MOTIVATION BLOG
app.get("/motive/new",(req,res)=>{
    res.render("MOTIVE/editmotive.ejs");
})
app.post("/motive", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0]; 
    const image1File = req.files['Image1'][0]; 

    let url = imageFile.path;
    let filename = imageFile.filename;
    let url1 = image1File.path;
    let filename1 = image1File.filename;
    let { Title, Content, Contents, Author ,Content1,Content2} = req.body;

    let motive = new MOTIVE({
        Title: Title,
        Content: Content,
        Contents: Contents,
        Author: Author,
        Content1:Content1,
        Content2:Content2,
        Image: { url, filename },
        Image1: { url: url1, filename: filename1 }
    });

    try {
        await motive.save();
        res.redirect("/motive");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});
app.get("/motive",async(req,res)=>{
    let motive= await MOTIVE.find({});
    res.render("MOTIVE/motive.ejs",{motive});
    console.log(motive);
    // res.send("working");
})
app.delete("/motive/:id",async(req,res)=>{
    let {id}=req.params;
    await MOTIVE.findByIdAndDelete(id);
    res.redirect("/motive");
})

//for Main
app.get("/Main", (req, res) => {
    res.render("BLOG/blogMain.ejs");
})

app.post("/library",async (req, res) => {
    res.send("working");
})

//ABOUT US PAGE 
app.get("/About", (req, res) => {
    res.render("HOME/About.ejs");
})

Sentry.setupExpressErrorHandler(app);
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


app.listen(port, (req, res) => {
    console.log(`server working on ${port}`);
})
