
/** 
* 初始渲染
* @params {} vnode 虚拟dom对象
* @params {} container 根元素的容器
*/

function render (vnode, container) {
    return container.appendChild(renderVnode(vnode))
}

function renderVnode (vnode) {
    console.log(vnode)
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return
    // 如果vnode的tag属性是函数
    if (typeof vnode.tag === 'function') {
        if(vnode.tag && vnode.tag.prototype && vnode.tag.prototype.render) {
            const { tag, attrs} = vnode
            // 创建组件实例
            const cnode = new tag(attrs)
            // 设置组件属性
            cnode.props = attrs
            // 组件渲染的节点对象, 调用render方法 返回jsx对象
            const render = cnode.render()
            return renderVnode(render)
        } else {
            return FunctionComponent(vnode)
        }
    } 

    // 如果vnode是字符串
    if (typeof vnode === 'string') {
        // 创建文本节点，将文本内容加入
        const textNode = document.createTextNode(vnode)
        return textNode
    }
    // 虚拟node对象；（原生标签节点）
    const {tag, attrs} = vnode;
    // 创建节点对象
    const dom = document.createElement(tag);
    // 设置属性
    if(attrs) {
        // 有属性时， 给dom设置对应的属性
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value)
        })
    }
    // 递归渲染子节点
    vnode.childrens.forEach(child => {
        render(child, dom)
    })

    return dom
}

function FunctionComponent (vnode) {
    const {tag, attrs} = vnode
    const fnVnode = tag(attrs) // 执行函数得到子节点
    // 生成真实dom节点
    const node = renderVnode(fnVnode)
    return node
}

/** 
* 设置属性
* @params {} dom dom元素
* @params {} key 属性名称
* @params {} value 属性值
*/

function setAttribute (dom, key, value) {
    // 将属性名className转化为class
    if (key === 'className') {
        key = 'class'
    }
    // 如果是事件 onClick, onBlur
    if (/on\w+/.test(key)) {
        // 转小写
        key = key.toLowerCase()
        dom[key] = value || ''
    } else if ( key === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || ''
        } else if (value && typeof value === 'object') {
            // {width: 20}
            for (let k in value) {
                if (typeof value[k] === 'number' ) {
                    dom.style[key] = value[k] + 'px'
                } else {
                    dom.style[k] = value[k]
                }
            }
        }
    } else {
        // 其他属性
        if (key in dom) {
            dom[key] = value || ''
        }
        if (value) {
            // 更新值
            dom.setAttribute(key, value)
        } else {
            // 删除
            dom.removeAttribute(key)
        }
    }
    
}

const ReactDom = {
    render
}

export default ReactDom