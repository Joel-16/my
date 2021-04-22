var request=  require('request')
var apioptions={server:'http://localhost:3000/'};
if (process.env.NODE_ENV==='production'){
    apioptions.server=' https://papa-joe.herokuapp.com/'
}

module.exports.homepage= function( req ,res, next){
    var requestopt, path;
    path='api/apiloc/';
    requestopt={
        url:apioptions.server+path,
        method: 'GET',
        port: 3000,
        json:{},
        qs:{
            lng: -0.7992599,
            lat: 51.378091,
            maxdistance:20
        }
    }
    request(requestopt, (err, response, body)=>{
        if (err){
            console.log(err)
        }else if(response.statusCode===200){
            renderhome(req,res,body)
        }else{
            console.log(response.statusCode)
        }  
    })
    
};
module.exports.location=function(req, res, next){
    res.render('location', {
        title:'Locations',
        
    })
};
module.exports.readone=(req,res, next)=>{
    var requestopt, path;
    path='api/apiloc/'+ req.params.id;
    requestopt={
        url:apioptions.server+path,
        method: 'GET',
        port: 3000,
        json:{},
        qs:{
            
        }
    }
    request(requestopt, (err, response, body)=>{
        if (err){
            console.log(err)
        }else if(response.statusCode===200){
            one(req,res,body)
        }else{
            console.log(response.statusCode)
        }  
    })
}
module.exports.review= function(req, res, next){
    res.render('review',{title:'Reviews'})
};
module.exports.about=function(req,res, next){
    res.render('index',{title:'About'})
}
var renderhome=(req,res,body)=>{
    var message
    if (!(body instanceof Array)){
        message='API lookip error';
        body=[]
    }else if (!body.length){
        message='no places found nearby'
    }

    res.render('home', {
        title:'My',
        pageheader:{
            title:'My',
            strapline:'Find places to work with wifi near you'
        },
        locations:body,
        message: message,
        sidebar:'Looking for Wifi and a seat?My helps you find places to work when out and about'
    }); 
}
var one=(req,res,body)=>{
    res.render('location', {
        title: body.name,
        pageHeader: {title: body.name},
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
            },
        location: body
        });
}