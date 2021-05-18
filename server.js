//--------------------------MODULES----------------------------------
const fs = require('fs');
const http = require('http');
const os = require('os');
var crypto = require('crypto');
const url = require('url');
var ejs = require('ejs');
const chalk = require('chalk');
require('dotenv').config();
//-------------------------------------------------------------------
//-----------------------IP AND PORT INFO----------------------------
const hostname = '0.0.0.0';
const port = process.env.PORT;
//-------------------------------------------------------------------
//--------------------------MONGO DB----------------------------------
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONN, { useUnifiedTopology: true, useNewUrlParser: true });
var conn = mongoose.connection;
conn.once("open", function () {
});
conn.on('connected', function () {
    console.log(chalk.bold.rgb(255, 255, 51)("📡 Opening and connecting to MongoDB..."));
    console.log(chalk.bold.rgb(10, 250, 0)('🖥️  ------- MongoDB is connected -------'));
    console.log(chalk.bold.rgb(10, 250, 0)('---------------------------------------'));
});
conn.on('disconnected', function () {
    console.log(chalk.bold.rgb(255, 0, 0)('🖥️  ----- MongoDB is disconnected -----'));
});
conn.on('error', console.error.bind(console, 'connection error:'));
//--------------------------------------------------------------------- 
//----------------------MONGO DB SCHEMA------------------------
var userSchema = new mongoose.Schema(
    {
        player1ign: { type: String },
        player1chr: { type: String },
        player1discord: { type: String },
        player2ign: { type: String },
        player2chr: { type: String },
        player2discord: { type: String },
        player3ign: { type: String },
        player3chr: { type: String },
        player3discord: { type: String },
        player4ign: { type: String },
        player4chr: { type: String },
        player4discord: { type: String },
        phone: { type: String },
        email: { type: String },
        teamname: { type: String },
        subs: { type: String},
        typeCustom: { type: String},
        slot: { type: String}
    });
userSchema.index({ player1ign: 'text', player1chr: 'text', player1discord: 'text', player2ign: 'text', player2chr: 'text', player2discord: 'text',player3ign: 'text', player3chr: 'text', player3discord: 'text',player4ign: 'text', player4chr: 'text', player4discord: 'text', phone: 'text', email: 'text', teamname: 'text',subs:'text', typeCustom: 'text', slot: 'text'});
User = mongoose.model('T3RegInfo', userSchema);

//-------------------------------------------------------------
const server = http.createServer((req, res) => {
    //-----------FILE PATHS-----------------
    template_path = './templates/';
    css_path = './css/';
    javascript_path = './javascripts/';
    serverImages_path = './serverImages/';
    rules = './rooms_rules/';
    //--------------------------------------
    //---------------------------------------------------------------------------------------
    // all SEO related stuffs
    const robots=fs.readFileSync('./robots.txt','utf8');
    const sitemap=fs.readFileSync('./sitemap.xml','utf8');

    // all templates related stuffs
    const home = fs.readFileSync(template_path + 'home.html', 'utf8');
    const contact = fs.readFileSync(template_path + 'contact.html', 'utf8');
    const register_sec = fs.readFileSync(template_path + 'register.ejs', 'utf8');
    const teamlist = fs.readFileSync(template_path + 'teampage.ejs', 'utf8');
    const tournament = fs.readFileSync(template_path + 'tournaments.html', 'utf8');
    const tournament_sec = fs.readFileSync(template_path + 'tournament_sec.ejs', 'utf8');
    const fungames = fs.readFileSync(template_path + 'fungames.html', 'utf8');
    const points = fs.readFileSync(template_path + 'pointstable.html', 'utf8');
    const subs = fs.readFileSync(template_path + 'subspoint.html', 'utf8');

    // all custom room rules
    const free_tdm = fs.readFileSync(rules + 'free_tdms.txt', 'utf8');
    const free_customs = fs.readFileSync(rules + 'free_customs.txt', 'utf8');
    const paid_customs = fs.readFileSync(rules + 'paid_customs.txt', 'utf8');
    // all css related stuffs
    //const login_css = fs.readFileSync(css_path + 'html.css', 'utf8');

    // all javascripts related stuffs  
    //const login_js = fs.readFileSync(javascript_path + 'login.js', 'utf8');

    //---------------------------------------------------------------------------------------

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress  //--------------------------------------> IP of Foreign Host
    
    console.log(chalk.bold.rgb(255, 102, 178)(time()) + " | IP : " + chalk.bold.rgb(255, 255, 0)(ip) + " => " + chalk.bold.rgb(255, 0, 0)(req.method) + ":" + chalk.bold.rgb(153, 255, 255)(req.url)); //----------------> Log Info of Foreign Host with timestamp

    //-----------------------URL INFO------------------------------
    var add = `http://${hostname}:${port}${req.url}`;
    var q = url.parse(add, true);
    var path = q.pathname;
    //-------------------------------------------------------------
    //------------------ROUTING------------------------------------

    
    if (req.method == 'GET') {
        if (path == '/sitemap.xml') {
            checkProtocol(req,res,path)
            route(res,200,"OK",'text/xml',sitemap,{});
        }
        else if (path == '/robots.txt') {
            checkProtocol(req,res,path)
            route(res,200,"OK",'text/plain',robots,{});
        }
        else if (path == '/home/' || path == '/home' || path == '/') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', home, {});
        }
        else if (path == '/contact/' || path == '/contact') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', contact, {});
        }
        else if (path == '/fungames') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', fungames, {});
        }
        else if (path.startsWith('/teamlist')) {
            checkProtocol(req,res,path)
            var typeTeam = path.substring(10);
            if(typeTeam == 'freeroom'){ route(res, 200, "OK", 'text/html', teamlist, {name:'Free Custom Rooms',room:'freeroom'}); }
            else if(typeTeam == 'freetdm'){ route(res, 200, "OK", 'text/html', teamlist, {name:'Free TDM Rooms',room:'freetdm'}); }
            else if(typeTeam == 'paidroom'){ route(res, 200, "OK", 'text/html', teamlist, {name:'Paid Custom Rooms',room:'paidroom'}); }
            else {route(res, 200, "OK", 'text/html', teamlist, {name:'Free Custom Rooms',room:'freeroom'});}
        }
        else if (path.startsWith('/getteam')) {
            checkProtocol(req,res,path)
            try{
                var typeRoom = path.substring(9);
                const teamlist = fs.readFileSync('./teamlist/'+typeRoom+'.json', 'utf8');
                route(res, 200, "OK", 'application/json', teamlist, {});
            }
            catch (e){
                route(res, 404, "Page Not Found", 'text/html', `<h1>No Page Found</h1> <br>${req.url} is not available`, {});
            }
        }
        else if (path == '/tournaments/freetdm/register/' || path == '/tournaments/freetdm/register') {
            checkProtocol(req,res,path)
            //route(res, 200, "OK", 'text/html', register_sec, {name:'Free TDM Rooms'});
            route(res, 200, "OK", 'text/html', '<h1 style="text-align:center">Registration closed for now</h1>', {});
        }
        else if (path == '/tournaments/freecustom/register/' || path == '/tournaments/freecustom/register') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', register_sec, {name:'Free Custom Rooms'});
          //route(res, 200, "OK", 'text/html', '<h1 style="text-align:center">Registration closed for now</h1>', {});
        }
        else if (path == '/tournaments/paidcustom/register/' || path == '/tournaments/paidcustom/register') {
            checkProtocol(req,res,path)
            //route(res, 200, "OK", 'text/html', register_sec, {name:'Paid Custom Rooms'});
            route(res, 200, "OK", 'text/html', '<h1 style="text-align:center">Registration closed for now</h1>', {});
        }
        else if (path == '/tournaments/freetdm') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', tournament_sec, {link:path,category:'Free for all',name:'Free TDM Rooms',rules:free_tdm,time:'3:00 - 4:00 PM',type:'Solo / Duo / Trio / Squad',prize:'Nothing',fee:'Entry Fee : FREE'});
        }
        else if (path == '/tournaments/freecustom') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', tournament_sec, {link:path,category:'Free for all',name:'Free T3 Custom Rooms',rules:free_customs,time:'9:00 - 10:00 PM',type:'Solo / Duo / Trio / Squad',prize:'Nothing',fee:'Entry Fee : FREE'});
        }
        else if (path == '/tournaments/paidcustom') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', tournament_sec, {link:path,category:'Registered Only',name:'Paid Custom Rooms',rules:paid_customs,time:'3:00 - 4:00 PM',type:'Solo / Duo / Trio / Squad',prize:'Cash / UC',fee:'Entry Fee : Rs. 10'});
        }
        else if (path == '/tournaments/' || path == '/tournaments') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', tournament, {});
        }
        else if (path == '/pointstable/' || path == '/pointstable') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', points, {});
        }
        else if (path == '/subspoints/' || path == '/subspoints') {
            checkProtocol(req,res,path)
            route(res, 200, "OK", 'text/html', subs, {});
        }
        else if (path.startsWith('/img')) {
            checkProtocol(req,res,path)
            var img = path.substring('5');
            imageRenderer(img,res);
        }
        else {
            checkProtocol(req,res,path)
            route(res, 404, "Page Not Found", 'text/html', `<h1>No Page Found</h1> <br>${req.url} is not available`, {});
        }
        //---------------------------------------------------------------
    }
    else if (req.method == 'POST') {
        if (path == '/registerteam') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 1e6) {
                    body = "";
                    res.writeHead(413, { 'Content-Type': 'text/plain' }).end();
                    req.connection.destroy();
                }
            });
            req.on('end', function () {
                var post = JSON.parse((body));
                console.log(post);
                if (!(post.player1ign == '' || post.player1chr == '' || post.player1discord == '' || post.player2ign == '' || post.player2chr == '' || post.player2discord == '' || post.player3ign == '' || post.player3chr == '' || post.player3discord == '' || post.player4ign == '' || post.player4chr == '' || post.player4discord == '' || post.phone == '' || post.email == '' || post.teamname == '' || post.typeCustom == '')) {
                    User.exists({ teamname: post.teamname }, function (err, docs) {
                        if (err) { console.log(err) }
                        else {
                            if (docs) { 
                            		res.end('Your team already registered');
                             	      }
                            else { 
                                User.insertMany({ player1ign: post.player1ign, player1chr: post.player1chr, player1discord: post.player1discord, player2ign: post.player2ign, player2chr: post.player2chr, player2discord: post.player2discord, player3ign: post.player3ign, player3chr: post.player3chr, player3discord: post.player3discord, player4ign: post.player4ign, player4chr: post.player4chr, player4discord: post.player4discord, phone: post.phone, email: post.email, teamname: post.teamname, subs: post.subs, typeCustom: post.typeCustom, slot: '-'}, function (err, result) {
                                    if (err) { res.end(err); }
                                    else {
                                        res.end('Registration Successfull');
                                    }
                                });
                             }
                        }
                    });
                }
                else { res.end("Please fill up the form completely to send message to us"); }
            });
        }
        else if (path == '/sendmessage') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 1e6) {
                    body = "";
                    res.writeHead(413, { 'Content-Type': 'text/plain' }).end();
                    req.connection.destroy();
                }
            });
            req.on('end', function () {
                var post = JSON.parse((body));
                console.log(post);
                if (!(post.ign == '' || post.rname == '' || post.email == '' || post.phone == '' || post.message == '')) {
                    post.email = (post.email).trim();
                    res.end('Message sent successfully');
                    var sub = 'Message from Player';
                    var body_html = '<h2 style="color:blue">Details</h2><br><table border="2px solid"><tr><th>Form Details :</th></tr><tr><td>In-Game Name : ' + post.ign + '</td></tr><tr><td>Real Name : ' + post.rname + '</td></tr><tr><td>Email ID : ' + post.email + '</td></tr><tr><td>Phone Number : ' + post.phone + '</td></tr><tr><td>Message : ' + post.message + '</td></tr></table>'
                    email_reset_send('abirghoshmarch1999@gmail.com', sub, body_html);
                }
                else { res.end("Please fill up the form completely to send message to us"); }
            });
        }
    }
});


//protocol check
function checkProtocol(req,res,path)
{
  var protocol = req.headers['fly-forwarded-proto']
  if(protocol == 'http')
  {
   res.statusCode=301;
   res.setHeader('Location','https://www.misraopgaming.tk'+path);
   res.end();
  }
}

// Route Function
function route(res, statCode, statMsg, contType, pageCont, ejsParams) {
    res.statusCode = statCode;
    res.statusMessage = statMsg;
    res.setHeader('Server', 'KaliServer');
    res.setHeader('Content-Type', contType);
    if (contType == 'text/html' && JSON.stringify(ejsParams)!='{}' ) {
        pageCont = ejs.render(pageCont, ejsParams);
    }
    res.end(pageCont);
}

function email_reset_send(email, sub, body_html) {
    var nodemailer = require("nodemailer");
    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS
        }
    });
    const message = {
        from: 'Misra Op Gaming <Misra@misra.jprq.live>',
        to: email,
        subject: sub,
        html: body_html
    };
    transport.sendMail(message, function (err, info) {
        if (err) { console.log(err) }
        else { console.log(chalk.bold.rgb(102, 102, 255)(JSON.stringify((info)))); }
    });

}

// Time Function
function time() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let time = "[" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "]";
    return time;
}

function imageRenderer(image_name, res) {
    fs.access(serverImages_path + image_name, fs.F_OK, (err) => {
        if (err) {
            console.error(err)
            route(res, 404, "Page Not Found", 'text/html', 'No such image', {});
        }
        else {
            const image = fs.readFileSync(serverImages_path + image_name);
            route(res, 200, "OK", 'image/jpeg', image, {});
        }
    })
}

server.listen(port, hostname, () => {

    console.log(chalk.cyanBright('---------------------------------------'));
    console.log(chalk.rgb(51, 255, 255)(`Server running at http://${hostname}:${port}/ \nOS Type : ${os.type()}\nArchitecture : ${os.arch()}`));

    console.log(chalk.cyanBright('---------------------------------------'));
});
