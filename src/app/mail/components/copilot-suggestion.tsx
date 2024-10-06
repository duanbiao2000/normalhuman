import Quill from 'quill';

// 导入Quill的embed模块
const Embed = Quill.import('blots/embed');

// 定义CopilotSuggestion类，继承自Embed类
export class CopilotSuggestion extends Embed {
    // 定义blotName和tagName
    static blotName = 'copilot-suggestion';
    static tagName = 'span';

    // 创建CopilotSuggestion实例
    static create(value: string) {
        const node = super.create(value);
        // 设置data-copilot-suggestion属性
        node.setAttribute('data-copilot-suggestion', value);
        // 添加copilot-suggestion类
        node.classList.add('copilot-suggestion');
        return node;
    }

    // 获取CopilotSuggestion实例的值
    static value(node: HTMLElement) {
        return node.getAttribute('data-copilot-suggestion');
    }
}

// 注册CopilotSuggestion类
Quill.register(CopilotSuggestion);

// 定义QuillCopilot类
export default class QuillCopilot {
    quill: Quill;
    options: any;
    suggestFn: (text: string) => Promise<string>;

    // 构造函数
    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.options = options;
        // 设置suggestFn函数，默认为空函数
        this.suggestFn = options.suggestFn || ((text: string) => Promise.resolve(''));
        // 添加文本变化处理函数
        this.attachTextChangeHandler();
    }

    // 添加文本变化处理函数
    attachTextChangeHandler() {
        this.quill.on('text-change', async (delta, oldDelta, source) => {
            // 如果变化来源是用户
            if (source === 'user') {
                // 获取文本
                const text = this.quill.getText();
                // 调用suggestFn函数获取建议
                const suggestion = await this.suggestFn(text);
                // 如果有建议
                if (suggestion) {
                    // 显示建议
                    this.showSuggestion(text.length, suggestion);
                }
            }
        });

        // 添加键盘按下事件处理函数
        this.quill.root.addEventListener('keydown', (event: KeyboardEvent) => {
            // 如果按下的是Tab键
            if (event.key === 'Tab') {
                // 获取选中的范围
                const range = this.quill.getSelection();
                // 如果有选中的范围
                if (range) {
                    // 获取选中的行
                    const [line] = this.quill.getLine(range.index);
                    // 获取选中的格式
                    const formats = this.quill.getFormat(range);
                    // 如果选中的格式中有copilot-suggestion
                    if (formats['copilot-suggestion']) {
                        // 阻止默认行为
                        event.preventDefault();
                        // 接受建议
                        this.acceptSuggestion(range.index);
                    }
                }
            }
        });
    }

    // 显示建议
    showSuggestion(index: number, suggestion: string) {
        // 删除选中的文本
        this.quill.deleteText(index, this.quill.getText().length - index);
        // 插入建议
        this.quill.insertEmbed(index, 'copilot-suggestion', suggestion, 'user');
    }

    // 接受建议
    acceptSuggestion(index: number) {
        // 获取建议节点
        const suggestionNode = this.quill.root.querySelector('.copilot-suggestion');
        // 如果有建议节点
        if (suggestionNode) {
            // 获取建议
            const suggestion = suggestionNode.getAttribute('data-copilot-suggestion');
            // 删除建议节点
            this.quill.deleteText(index, suggestionNode.textContent!.length);
            // 插入建议
            this.quill.insertText(index, suggestion!, 'user');
            // 设置光标位置
            this.quill.setSelection(index + suggestion!.length);
        }
    }
}