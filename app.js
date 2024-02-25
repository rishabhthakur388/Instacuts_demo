const express = require("express");
const app = express();
app.use(express.json())
const bodyParser = require("body-parser")
const PORT = 8000;
const router = require('./router/index');
app.use('/',router)
app.use(bodyParser.json({limit:"50mb"}))
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}))
app.listen(PORT, (() => console.log("server is connceted on: ", PORT)));


// const arrobj = [
//     { id: 1, str: "A" },
//     { id: 1, str: "b" },
//     { id: 2, str: "c" },
//     { id: 1, str: "v" },
//     { id: 2, str: "e" },
//     { id: 3, str: "q" },
//     { id: 4, str: "z" },
//     { id: 4, str: "y" },
//     { id: 4, str: "x" },
// ]


// var newArray = [];
// var newArray = [];

// for (obj of arrobj) {

//     var empty = true;
//     for (newobj of newArray) {
//        if (obj.id == newobj.id) { empty = false; }
//     }
//     if (empty) {
//         let arr1 = [];
//         arr1.push(obj.str)
//         newArray.push({id: obj.id, str: arr1});
//     } else {
//         for (newobj of newArray) {
//            if (newobj.id == obj.id) {
//             newobj.str.push(obj.str)
//            }
//         }
//     }
// }
// console.log(newArray);




// let newarr = [];
// let newobj = [];

// for (let i = 0; i < arrobj.length; i++) {
    
//     let obj = {
//         id: arrobj[i].id,
//         str: [arrobj[i].str]
//     }
    
//     for (let j = i; j < arrobj.length; j++) {
        
//         if (arrobj[i].id == arrobj[j].id && i != j) {
//             obj.str.push(arrobj[j].str);

//         }
//     }
//     if (!newobj.includes(arrobj[i].id)) {

//         newarr.push(obj);
//     }
//     newobj.push(arrobj[i].id);


// }
// console.log(newarr);







// let newarr = []
//  for(let obj of arrobj){
//     let box = {
//         id:obj.id,
//         str:Object.values(obj.str)
//     }
//     console.log(box)
//  }

// for(let i = 0; i<arrobj.length;i++){
//     if(arrobj.id == arrobj.id){
//         newarr.push(obj.str)
//     }
// }
// console.log(newarr)


// let a = [1,2,3,4,5]

