const array = [
    {id:222,title : 'title1'},
    {id:226,title : 'title2'},
    {id:228,title : 'title3'},
    {id:227,title : 'title4'},
    {id:225,title : 'title5'},
    {id:224,title : 'title6'},
    {id:223,title : 'title7'},
    {id:220,title : 'title8'},
    {id:229,title : 'title9'},
    {id:221,title : 'title10'},
]



function pagination(data,docsInOnePage,pageNo){
    let starting = pageNo===1?0:(pageNo*1+(docsInOnePage-1))
        return data.slice(starting,pageNo*docsInOnePage)
}
// console.log(array.slice(0,3));
console.log(pagination(array,3,2)); // data array,documents in one page,page number