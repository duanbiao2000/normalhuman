import type { EmailHeader, EmailMessage, SyncResponse, SyncUpdatedResponse } from '@/lib/types';
import { db } from '@/server/db';
import axios from 'axios';
import { syncEmailsToDatabase } from './sync-to-db';

const API_BASE_URL = 'https://api.aurinko.io/v1';

class Account {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    // 开始同步
    private async startSync(daysWithin: number): Promise<SyncResponse> {
        const response = await axios.post<SyncResponse>(
            `${API_BASE_URL}/email/sync`,
            {},
            {
                headers: { Authorization: `Bearer ${this.token}` }, params: {
                    daysWithin,
                    bodyType: 'html'
                }
            }
        );
        return response.data;
    }

    // 创建订阅
    // 创建订阅
    async createSubscription() {
        // 根据环境变量设置webhookUrl
        const webhookUrl = process.env.NODE_ENV === 'development' ? 'https://potatoes-calculator-reports-crisis.trycloudflare.com' : process.env.NEXT_PUBLIC_URL
        // 发送post请求，创建订阅
        const res = await axios.post('https://api.aurinko.io/v1/subscriptions',
            {
                resource: '/email/messages',
                notificationUrl: webhookUrl + '/api/aurinko/webhook'
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        // 返回订阅数据
        return res.data
    }

    // 同步邮件
    // 异步同步邮件
async syncEmails() {
        // 根据token查找账户
        const account = await db.account.findUnique({
            where: {
                token: this.token
            },
        })
        // 如果没有找到账户，抛出错误
        if (!account) throw new Error("Invalid token")
        // 如果没有delta token，抛出错误
        if (!account.nextDeltaToken) throw new Error("No delta token")
        // 获取更新的邮件
        let response = await this.getUpdatedEmails({ deltaToken: account.nextDeltaToken })
        // 将获取到的邮件存储到allEmails数组中
        let allEmails: EmailMessage[] = response.records
        // 将账户的nextDeltaToken存储到storedDeltaToken中
        let storedDeltaToken = account.nextDeltaToken
        // 如果response中有nextDeltaToken，则将其存储到storedDeltaToken中
        if (response.nextDeltaToken) {
            storedDeltaToken = response.nextDeltaToken
        }
        // 如果response中有nextPageToken，则继续获取更新的邮件
        while (response.nextPageToken) {
            response = await this.getUpdatedEmails({ pageToken: response.nextPageToken });
            // 将获取到的邮件添加到allEmails数组中
            allEmails = allEmails.concat(response.records);
            // 如果response中有nextDeltaToken，则将其存储到storedDeltaToken中
            if (response.nextDeltaToken) {
                storedDeltaToken = response.nextDeltaToken
            }
        }

        // 如果response为空，则抛出错误
        if (!response) throw new Error("Failed to sync emails")


        // 将获取到的邮件同步到数据库中
        try {
            await syncEmailsToDatabase(allEmails, account.id)
        } catch (error) {
            console.log('error', error)
        }

        // console.log('syncEmails', response)
        // 更新账户的nextDeltaToken
        await db.account.update({
            where: {
                id: account.id,
            },
            data: {
                nextDeltaToken: storedDeltaToken,
            }
        })
    }

    // 获取更新的邮件
    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }): Promise<SyncUpdatedResponse> {
        // console.log('getUpdatedEmails', { deltaToken, pageToken });
        let params: Record<string, string> = {};
        if (deltaToken) {
            params.deltaToken = deltaToken;
        }
        if (pageToken) {
            params.pageToken = pageToken;
        }
        const response = await axios.get<SyncUpdatedResponse>(
            `${API_BASE_URL}/email/sync/updated`,
            {
                params,
                headers: { Authorization: `Bearer ${this.token}` }
            }
        );
        return response.data;
    }

    // 执行初始同步
    async performInitialSync() {
        try {
            // 开始同步过程
            const daysWithin = 3
            let syncResponse = await this.startSync(daysWithin); // 同步最近7天的邮件

            // 等待同步完成
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
                syncResponse = await this.startSync(daysWithin);
            }

            // console.log('Sync is ready. Tokens:', syncResponse);

            // 执行初始同步更新的邮件
            let storedDeltaToken: string = syncResponse.syncUpdatedToken
            let updatedResponse = await this.getUpdatedEmails({ deltaToken: syncResponse.syncUpdatedToken });
            // console.log('updatedResponse', updatedResponse)
            if (updatedResponse.nextDeltaToken) {
                storedDeltaToken = updatedResponse.nextDeltaToken
            }
            let allEmails: EmailMessage[] = updatedResponse.records;

            // 如果有更多页面，则获取所有页面
            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
                allEmails = allEmails.concat(updatedResponse.records);
                if (updatedResponse.nextDeltaToken) {
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }

            // console.log('Initial sync complete. Total emails:', allEmails.length);

            // 存储下一个deltaToken以供未来的增量同步使用


            // 示例：使用存储的deltaToken进行增量同步
            // await this.performIncrementalSync(storedDeltaToken);
            return {
                emails: allEmails,
                deltaToken: storedDeltaToken,
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error during sync:', JSON.stringify(error.response?.data, null, 2));
            } else {
                console.error('Error during sync:', error);
            }
        }
    }


    // 发送邮件
    async sendEmail({
        from,
        subject,
        body,
        inReplyTo,
        references,
        threadId,
        to,
        cc,
        bcc,
        replyTo,
    }: {
        from: EmailAddress;
        subject: string;
        body: string;
        inReplyTo?: string;
        references?: string;
        threadId?: string;
        to: EmailAddress[];
        cc?: EmailAddress[];
        bcc?: EmailAddress[];
        replyTo?: EmailAddress;
    }) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/email/messages`,
                {
                    from,
                    subject,
                    body,
                    inReplyTo,
                    references,
                    threadId,
                    to,
                    cc,
                    bcc,
                    replyTo: [replyTo],
                },
                {
                    params: {
                        returnIds: true
                    },
                    headers: { Authorization: `Bearer ${this.token}` }
                }
            );

            console.log('sendmail', response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error sending email:', JSON.stringify(error.response?.data, null, 2));
            } else {
                console.error('Error sending email:', error);
            }
            throw error;
        }
    }


    // 获取webhooks
    async getWebhooks() {
        type Response = {
            records: {
                id: number;
                resource: string;
                notificationUrl: string;
                active: boolean;
                failSince: string;
                failDescription: string;
            }[];
            totalSize: number;
            offset: number;
            done: boolean;
        }
        const res = await axios.get<Response>(`${API_BASE_URL}/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }

    // 创建webhook
    async createWebhook(resource: string, notificationUrl: string) {
        const res = await axios.post(`${API_BASE_URL}/subscriptions`, {
            resource,
            notificationUrl
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }

    // 删除webhook
    async deleteWebhook(subscriptionId: string) {
        const res = await axios.delete(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }
}
type EmailAddress = {
    name: string;
    address: string;
}

export default Account;