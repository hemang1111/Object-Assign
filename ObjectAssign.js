// this is for practice of Object.assign and Object.entries of Java Script

let a = {
    name : "shruit",
    age : 18
}

const c = [
    {
        name : "hemang",
        age : 22,
        address : "205, hari om appartment ,surat",
        education : "B.E(CSE)",
        Hobbies : {
            f1 : "Hamilton",
            rap : "KR$NA"
        },
        chess : "carlsane"
    },
    {
        name : "alpa",
        age : 40,
        address : "205, hari om appartment ,surat",
        education : "Nursing(B.P.N)"
    },
    {

    }
   
]

let temp = function(c,target){
    let temparray = []
    
        c.map((object,index) => {
            if(Object.keys(object).length > 0){
                temparray.push(Object.assign({},{}))
                for(const [key,value] of Object.entries(object)){
                    if(typeof(value) === 'object'){
                        for(const [_key,_value] of Object.entries(object[key])){
                        
                            if(target.find(element => element === _key) ){
                                temparray[index][_key] = _value
                            }
                        }
                    }
                    else{
                        if(target.find(element => element === key) ){
                            temparray[index][key] = value
                        }
                    }
                    
            }
            }
            
        })
        
        // console.log(temparray)
    return temparray
}


console.log(temp(c,["age","name","Hobbies","f1","rap","chess"]))