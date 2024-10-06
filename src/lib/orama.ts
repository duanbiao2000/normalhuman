import { create, insert, search, save, load, type AnyOrama } from "@orama/orama";
import { persist, restore } from "@orama/plugin-data-persistence";
import { db } from "@/server/db";
import { getEmbeddings } from "@/lib/embeddings";

// 定义OramaManager类
export class OramaManager {
    // @ts-ignore
    private orama: AnyOrama; // 定义Orama实例
    private accountId: string; // 定义账户ID

    constructor(accountId: string) {
        this.accountId = accountId;
    }

    // 初始化Orama实例
    // 异步初始化函数
    async initialize() {
        // 从数据库中查找指定id的账户，并选择binaryIndex字段
        const account = await db.account.findUnique({
            where: { id: this.accountId },
            select: { binaryIndex: true }
        });

        // 如果账户不存在，抛出错误
        if (!account) throw new Error('Account not found');

        // 如果账户的binaryIndex字段存在，则恢复索引
        if (account.binaryIndex) {
            this.orama = await restore('json', account.binaryIndex as any);
        } else {
            // 否则，创建新的索引
            this.orama = await create({
                schema: {
                    title: "string",
                    body: "string",
                    rawBody: "string",
                    from: 'string',
                    to: 'string[]',
                    sentAt: 'string',
                    embeddings: 'vector[1536]',
                    threadId: 'string'
                },
            });
            // 保存索引
            await this.saveIndex();
        }
    }

    // 插入文档
    async insert(document: any) {
        await insert(this.orama, document);
        await this.saveIndex();
    }

    // 向量搜索
    // 异步向量搜索
    async vectorSearch({ prompt, numResults = 10 }: { prompt: string, numResults?: number }) {
        // 获取prompt的嵌入向量
        const embeddings = await getEmbeddings(prompt)
        // 在orama中进行搜索，返回结果
        const results = await search(this.orama, {
            mode: 'hybrid',
            term: prompt,
            vector: {
                value: embeddings,
                property: 'embeddings'
            },
            similarity: 0.80,
            limit: numResults,
            // hybridWeights: {
            //     text: 0.8,
            //     vector: 0.2,
            // }
        })
        // 打印搜索结果
        // console.log(results.hits.map(hit => hit.document))
        // 返回搜索结果
        return results
    }
    // 搜索
    // 异步搜索函数，接收一个参数term，类型为字符串
    async search({ term }: { term: string }) {
        // 返回异步搜索函数的执行结果，参数为this.orama和term
        return await search(this.orama, {
            term: term,
        });
    }

    // 保存索引
    // 异步保存索引
async saveIndex() {
        // 调用persist方法，将orama对象保存为json格式
        const index = await persist(this.orama, 'json');
        // 更新数据库中对应accountId的binaryIndex字段，将index保存为Buffer类型
        await db.account.update({
            where: { id: this.accountId },
            data: { binaryIndex: index as Buffer }
        });
    }
}

// 使用示例
async function main() {
    const oramaManager = new OramaManager('67358');
    await oramaManager.initialize();

    // 插入文档
    // const emails = await db.email.findMany({
    //     where: {
    //         thread: { accountId: '67358' }
    //     },
    //     select: {
    //         subject: true,
    //         bodySnippet: true,
    //         from: { select: { address: true, name: true } },
    //         to: { select: { address: true, name: true } },
    //         sentAt: true,
    //     },
    //     take: 100
    // })
    // await Promise.all(emails.map(async email => {
    //     // const bodyEmbedding = await getEmbeddings(email.bodySnippet || '');
    //     // console.log(bodyEmbedding)
    //     await oramaManager.insert({
    //         title: email.subject,
    //         body: email.bodySnippet,
    //         from: `${email.from.name} <${email.from.address}>`,
    //         to: email.to.map(t => `${t.name} <${t.address}>`),
    //         sentAt: email.sentAt.getTime(),
    //         // bodyEmbedding: bodyEmbedding,
    //     })
    // }))

    // 搜索
    // 使用oramaManager.search方法进行搜索，搜索关键字为"cascading"
const searchResults = await oramaManager.search({
        term: "cascading",
    });

    console.log(searchResults.hits.map((hit) => hit.document));
}

// main().catch(console.error);