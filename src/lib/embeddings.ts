// 导入OpenAI相关的库和配置
import { OpenAIApi, Configuration } from "openai-edge";

// 创建Configuration对象并配置API密钥
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// 初始化OpenAIApi对象
const openai = new OpenAIApi(config);

/**
 * 异步函数getEmbeddings，用于获取文本的嵌入向量
 * @param {string} text - 输入的文本字符串
 * @returns {Promise<number[]>} 返回一个Promise，包含文本的嵌入向量
 */
export async function getEmbeddings(text: string) {
    try {
        // 调用OpenAI API生成文本嵌入
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: text.replace(/\n/g, " "), 
            //这一行代码的作用是将输入文本中的所有换行符（\n）替换为空格。这样可以确保输入文本在传递给 OpenAI API 时格式正确，避免因换行符导致的问题。

        });
        // 解析API响应的JSON数据
        const result = await response.json();
        // 返回第一个数据项的嵌入向量
        return result.data[0].embedding as number[];
    } catch (error) {
        // 捕获并打印API调用错误
        console.log("error calling openai embeddings api", error);
        throw error;
    }
}