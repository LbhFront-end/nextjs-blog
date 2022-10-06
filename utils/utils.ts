import * as cheerio from 'cheerio';

export type TreeData = {
    id: number;
    level: number;
    content: number;
    children?: TreeData[]
}

const formatHtmlHeaders = ($: cheerio.CheerioAPI) => {
    const headings = $('h1, h2, h3, h4, h5, h6');
    headings.each(function (this, index) {
        const $title = $(this);
        const title = $title.text();
        $title.attr('id', title);
        $title.children('a').remove();
        $title.html(`<a href="#${title}" class="headerlink" title="${title}" id="${index + 1}"></a>${title}`);
    });
}

const formatHtmlImages = ($: cheerio.CheerioAPI) => {
    const images = $('img');
    images.each(function (this) {
        const $image = $(this);
        const src = $image.attr('src');
        $image.replaceWith(`<a href="${src}" data-fancybox="gallery"><img src="${src}"></a>`);
    });
}

// const formatHtmlCode = ($: cheerio.CheerioAPI) => {
//     const pres = $('pre');
//     pres.each(function (this) {
//         const $pre = $(this);
//         const $code = $pre.children('code')
//         const txts = $code.text().split('\n');
//         const language = $code.attr('class').split('language-')[1] || 'shell';
//         $pre.children('code').remove();
//         txts.forEach(txt => $(`<span class="line">${txt}</span><br>`).appendTo($pre))
//         $pre.replaceWith(
//             `<figure class="highlight ${language}"><table><td class="gutter"></td><td class="code">${$pre}</td></table></figure>`
//         );
//     });
// }

export const formatHtml = (html = '') => {
    const $ = cheerio.load(html, { decodeEntities: false });
    formatHtmlHeaders($);
    formatHtmlImages($);
    return $.html();
}

export const handleTOC2Tree = (dataSource = '') => {

    const handleHtml2DataSource = (html = '') => {
        const $ = cheerio.load(html, { decodeEntities: false });
        let dataSource = [], preLevel, id = 1;
        $('h1, h2, h3, h4, h5, h6').each(function () {
            $(this).attr('id', String(id))
            let level = $(this).get(0).tagName.substring(1);
            if (!preLevel) preLevel = Number(level)
            const content = $(this).html();
            dataSource.push({
                id,
                level: Number(level) - preLevel + 1,
                content,
            })
            id++;
        })
        return dataSource;
    }

    const handleTOCSplit = (data, indexs) => {
        const newArr = [];
        let tempIndex = 0;
        indexs.forEach((index) => {
            newArr.push(data.slice(tempIndex, index))
            tempIndex = index;
        })
        return newArr;
    }

    const data = handleHtml2DataSource(dataSource);
    const splitIndexs = [];
    let tempArr;

    const tree = (arr, next) => {
        const obj = arr && arr.length !== 0 && arr[arr.length - 1];
        if (obj.level < next.level) {
            if (!obj.children) obj.children = [];
            if (obj.children[obj.children.length - 1]) {
                tree(obj.children, next)
            } else {
                obj.children.push({ ...next, parentId: tempArr.id || null })
            }
        } else {
            arr.push({ ...next, parentId: obj.level > tempArr.level ? tempArr.id : null })
        }
        return arr;
    }

    const treeData = (data) => data.reduce((prev, next, currentIndex) => {
        const obj = prev && prev.length !== 0 && prev[prev.length - 1];
        tempArr = obj;
        if (obj.level > next.level) {
            tempArr = next;
            splitIndexs.push(currentIndex);
        }
        if (obj) {
            tree(prev, next)
        } else {
            prev.push({ ...next, parentId: null })
        }
        return prev;
    }, [])


    splitIndexs.push(data.length);
    return handleTOCSplit(data, splitIndexs).map(arr => treeData(arr))[0] as TreeData[]
}

export const getTreeIds = (tree, nodeId, config) => {
    const { children = 'children', id = 'id' } = config || {}
    const toFlatArray = (tree, parentId) => {
        return tree.reduce((t, _) => {
            const child = _[children]
            return [
                ...t,
                parentId ? { ..._, parentId } : _,
                ...(child && child.length ? toFlatArray(child, _[id]) : [])]
        }, [])
    }
    const getIds = flatArray => {
        let ids = [nodeId]
        let child = flatArray.find(_ => _[id] === nodeId)
        while (child && child.parentId) {
            ids = [child.parentId, ...ids]
            child = flatArray.find(_ => _[id] === child.parentId)
        }
        return ids
    }
    return getIds(toFlatArray(tree, null))
}

export const pageCount = (total: number, size: number) => Math.ceil(total / size);