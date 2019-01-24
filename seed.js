var mongoose = require("mongoose");
var Article = require("./modules/articles");
var Comment = require("./modules/comments");
var data = [
    {
        title:"Midnight at Texas",
        body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rutrum arcu blandit velit aliquam cursus. Aenean posuere ligula nisi, nec maximus odio dictum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam vitae quam vitae elit sagittis vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent dictum leo sapien. Sed sed ipsum eget dolor accumsan gravida. Ut non nisi dapibus, tempor enim eget, facilisis mauris. In congue euismod neque, ac iaculis neque mattis at. Suspendisse vitae arcu viverra sapien luctus convallis non et ante. Vestibulum non nisl eget arcu scelerisque pharetra. Praesent vel diam et enim cursus consectetur. Morbi vestibulum arcu non erat sodales tincidunt"
    },{
       title:"New York",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rutrum arcu blandit velit aliquam cursus. Aenean posuere ligula nisi, nec maximus odio dictum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam vitae quam vitae elit sagittis vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent dictum leo sapien. Sed sed ipsum eget dolor accumsan gravida. Ut non nisi dapibus, tempor enim eget, facilisis mauris. In congue euismod neque, ac iaculis neque mattis at. Suspendisse vitae arcu viverra sapien luctus convallis non et ante. Vestibulum non nisl eget arcu scelerisque pharetra. Praesent vel diam et enim cursus consectetur. Morbi vestibulum arcu non erat sodales tincidunt"
    },{
        title:"Chicago",
        body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rutrum arcu blandit velit aliquam cursus. Aenean posuere ligula nisi, nec maximus odio dictum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam vitae quam vitae elit sagittis vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent dictum leo sapien. Sed sed ipsum eget dolor accumsan gravida. Ut non nisi dapibus, tempor enim eget, facilisis mauris. In congue euismod neque, ac iaculis neque mattis at. Suspendisse vitae arcu viverra sapien luctus convallis non et ante. Vestibulum non nisl eget arcu scelerisque pharetra. Praesent vel diam et enim cursus consectetur. Morbi vestibulum arcu non erat sodales tincidunt"
    }
    ];

function seedDB(){
    Article.remove({}, function(err){
        if (err){
            console.log(err);
        }
        else {
            console.log("Removed article");
            data.forEach(function(seed){
               Article.create(seed, function(err, data){
                   if(err){
                       console.log(err);
                   } else{
                       console.log("Added article");
                       Comment.create({user:"Emad", text:"this is an awesome website"}, function(err, comment){
                           if (err){
                               console.log(err);
                           }
                           else{
                               data.comments.push(comment);
                               data.save();
                           }
                       });
                   }
               });
            });
        }
    });
}

module.exports = seedDB;