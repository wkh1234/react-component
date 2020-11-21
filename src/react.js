/** 
* 创建元素的方法
* @params {} tag 元素的类型 div span p
* @params {*} config 配置对象 属性 key ref
* @params {..any} childrens 所有的子类，一般是一个数组
*/


function createElement (tag, attrs, ...childrens) {
    // 删除不必要的属性
    delete attrs.__self;
    delete attrs.__source; 
    // 将 创建的react元素返回
    return {tag, attrs, childrens}
}

const React = {
    createElement
}

export default React
