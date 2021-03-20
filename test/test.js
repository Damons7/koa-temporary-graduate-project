let a = [1, 2, 5, 5, "a", "a"]
let obj = {}
let res = []
a.forEach(item => {
    obj[item] ? obj[item].push(item) : (obj[item] = [item])
})
Object.keys(obj).forEach(item => {

    res.push(obj[item])
})
console.log(res);