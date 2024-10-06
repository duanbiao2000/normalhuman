import { z } from "zod";

// 定义同步响应接口
export interface SyncResponse {
    syncUpdatedToken: string;
    syncDeletedToken: string;
    ready: boolean;
}
// 定义同步更新响应接口
export interface SyncUpdatedResponse {
    nextPageToken?: string;
    nextDeltaToken: string;
    records: EmailMessage[];
}

// 定义电子邮件地址模式
export const emailAddressSchema = z.object({
    name: z.string(),
    address: z.string(),
})

// 定义电子邮件消息接口
/**
 * 电子邮件消息接口定义
 * 该接口描述了一封电子邮件的各种属性和内容，包括元数据、分类、敏感度、收件人信息以及附件等
 */
export interface EmailMessage {
    id: string; // 邮件唯一标识符
    threadId: string; // 邮件线程ID，用于关联回复和转发的邮件
    createdTime: string; // 邮件创建时间
    lastModifiedTime: string; // 邮件最后一次修改时间
    sentAt: string; // 邮件发送时间
    receivedAt: string; // 邮件接收时间
    internetMessageId: string; // 邮件的网络消息ID，通常用于唯一标识一封邮件
    subject: string; // 邮件主题
    sysLabels: Array<"junk" | "trash" | "sent" | "inbox" | "unread" | "flagged" | "important" | "draft">; // 系统标签，用于分类邮件，如垃圾邮件、已删除、已发送等
    keywords: string[]; // 邮件的关键字，用于搜索和过滤
    sysClassifications: Array<"personal" | "social" | "promotions" | "updates" | "forums">; // 系统分类，用于区分邮件的类型，如个人、社交、促销等
    sensitivity: "normal" | "private" | "personal" | "confidential"; // 邮件的敏感度，表明邮件的重要性或隐私级别
    meetingMessageMethod?: "request" | "reply" | "cancel" | "counter" | "other"; // 会议消息方法，用于描述会议邀请、回复、取消等操作
    from: EmailAddress; // 发件人地址
    to: EmailAddress[]; // 收件人地址列表
    cc: EmailAddress[]; // 抄送地址列表
    bcc: EmailAddress[]; // 密送地址列表
    replyTo: EmailAddress[]; // 回复地址列表，指定回复邮件应发送到的地址
    hasAttachments: boolean; // 标识邮件是否包含附件
    body?: string; // 邮件正文内容
    bodySnippet?: string; // 邮件正文的片段，通常用于预览
    attachments: EmailAttachment[]; // 邮件附件列表
    inReplyTo?: string; // 该邮件是回复哪封邮件的ID
    references?: string; // 该邮件引用的邮件ID列表，用于追踪邮件对话历史
    threadIndex?: string; // 邮件在线程中的索引，用于排序和组织邮件线程
    internetHeaders: EmailHeader[]; // 邮件的网络头信息，包含邮件传输中的各种元数据
    nativeProperties: Record<string, string>; // 邮件的原生属性，用于存储邮件的原始数据或其他特定于邮件系统的属性
    folderId?: string; // 邮件文件夹ID，用于标识邮件所在的文件夹
    omitted: Array<"threadId" | "body" | "attachments" | "recipients" | "internetHeaders">; // 被省略的字段列表，用于指示哪些字段在特定情况下被省略或未加载
}

// 定义电子邮件地址接口
export interface EmailAddress {
    name?: string;
    address: string;
    raw?: string;
}

// 定义电子邮件附件接口
/**
 * 电子邮件附件接口
 * 
 * 定义了电子邮件附件的一系列属性，用于描述附件的基本信息和内容
 */
export interface EmailAttachment {
    id: string; // 附件的唯一标识符
    name: string; // 附件的文件名
    mimeType: string; // 附件的MIME类型，用于描述文件的格式
    size: number; // 附件的大小，以字节为单位
    inline: boolean; // 表示附件是否内嵌在邮件正文中
    contentId?: string; // 附件的内容ID，通常用于关联内嵌的附件
    content?: string; // 附件的内容，通常用于直接存储附件的数据
    contentLocation?: string; // 附件的内容位置，用于指定附件数据的网络位置
}

// 定义电子邮件头接口
export interface EmailHeader {
    name: string;
    value: string;
}


