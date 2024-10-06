import { KBarResults, useMatches } from "kbar";
import ResultItem from "./ResultItem";

/**
 * 渲染KBar搜索结果的组件
 * 
 * 该组件使用useMatches钩子获取搜索结果和根动作ID，并通过KBarResults组件渲染这些结果
 * 对于每个搜索结果项，根据其类型决定渲染成文本标签或ResultItem组件
 */
export default function RenderResults() {
    // 从useMatches钩子获取搜索结果和根动作ID
    const { results, rootActionId } = useMatches();

    // 渲染搜索结果
    return (
        <KBarResults
            items={results} // 搜索结果项
            onRender={({ item, active }) =>
                typeof item === "string" ? ( // 如果项是字符串类型
                    <div className="px-4 py-2 text-sm uppercase opacity-50 text-gray-600 dark:text-gray-400">{item}</div>
                ) : ( 
                    <ResultItem
                        action={item} // 动作对象
                        active={active} // 当前项是否激活
                        currentRootActionId={rootActionId ?? ""} // 当前根动作ID
                    />
                )
            }
        />
    );
}