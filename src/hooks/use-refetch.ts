import { useQueryClient } from '@tanstack/react-query'

/**
 * 定义一个 useRefetch 函数，用于重新获取所有活动的 TRPC 查询数据
 * 
 * @returns {function} 返回一个异步函数，该函数执行时会重新获取所有活动的查询数据
 */
const useRefetch = () => {
    // 使用 useQueryClient 钩子获取查询客户端实例
    const queryClient = useQueryClient()
    
    // 返回一个异步函数，该函数的作用是重新获取所有类型为 'active' 的查询数据
    return async () => {
        await queryClient.refetchQueries({ type: 'active' })
    }
}

export default useRefetch