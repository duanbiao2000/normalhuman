import TurndownService from 'turndown';

// 创建一个TurndownService实例，并设置一些参数
export const turndown = new TurndownService({
    headingStyle: 'atx', // 设置标题样式为atx
    codeBlockStyle: 'fenced', // 设置代码块样式为fenced
    emDelimiter: '*', // 设置斜体标记为*
    strongDelimiter: '**', // 设置粗体标记为**
    bulletListMarker: '-', // 设置无序列表标记为-
    linkStyle: 'inlined', // 设置链接样式为inlined
});

// 添加一个规则，用于移除链接标签
turndown.addRule('linkRemover', {
    filter: 'a', // 过滤器，匹配a标签
    replacement: (content) => content, // 替换内容为原内容
});

// 添加一个规则，用于移除style标签
turndown.addRule('styleRemover', {
    filter: 'style', // 过滤器，匹配style标签
    replacement: () => '', // 替换内容为空字符串
});

// 添加一个规则，用于移除script标签
turndown.addRule('scriptRemover', {
    filter: 'script', // 过滤器，匹配script标签
    replacement: () => '', // 替换内容为空字符串
});

// 添加一个规则，用于移除img标签
turndown.addRule('imageRemover', {
    filter: 'img', // 过滤器，匹配img标签
    replacement: (content) => content, // 替换内容为原内容
});