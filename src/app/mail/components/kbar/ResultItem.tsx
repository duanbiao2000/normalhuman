// ResultItem.tsx
// 导入framer-motion库用于动画效果
import { motion } from 'framer-motion'
// 导入React库
import * as React from "react";
// 导入类型ActionImpl和ActionId，用于类型注解
import type { ActionImpl, ActionId } from "kbar";

// 定义ResultItem组件，使用forwardRef来传递ref
const ResultItem = React.forwardRef(
    (
        {
            action,
            active,
            currentRootActionId,
        }: {
            action: ActionImpl;
            active: boolean;
            currentRootActionId: ActionId;
        },
        ref: React.Ref<HTMLDivElement>
    ) => {
        // 使用useMemo钩子计算祖先动作列表，基于currentRootActionId
        const ancestors = React.useMemo(() => {
            if (!currentRootActionId) return action.ancestors;
            const index = action.ancestors.findIndex(
                (ancestor) => ancestor.id === currentRootActionId
            );
            return action.ancestors.slice(index + 1);
        }, [action.ancestors, currentRootActionId]);

        // 返回一个div，包含动作的图标、名称、子标题和快捷键
        return (
            <div
                ref={ref}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer relative z-10`}
            >
                // 如果项目处于激活状态，显示一个背景动画
                {active && (
                    <motion.div layoutId='kbar-result-item' className='bg-gray-200 dark:bg-gray-700 border-l-4 border-black dark:border-white absolute inset-0 !z-[-1]' transition={{
                        duration: 0.14,
                        type: 'spring',
                        ease: 'easeInOut',
                    }}>

                    </motion.div>
                )}
                <div className="flex gap-2 items-center relative z-10">
                    // 如果动作有图标，显示图标
                    {action.icon && action.icon}
                    <div className="flex flex-col">
                        <div>
                            // 如果有祖先动作，显示祖先动作的名称和"»"符号
                            {ancestors.length > 0 &&
                                ancestors.map((ancestor) => (
                                    <React.Fragment key={ancestor.id}>
                                        <span className="opacity-50 mr-2">{ancestor.name}</span>
                                        <span className="mr-2">&rsaquo;</span>
                                    </React.Fragment>
                                ))}
                            <span>{action.name}</span>
                        </div>
                        // 如果动作有子标题，显示子标题
                        {action.subtitle && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">{action.subtitle}</span>
                        )}
                    </div>
                </div>
                // 如果动作有快捷键，显示快捷键
                {action.shortcut?.length ? (
                    <div className="grid grid-flow-col gap-1 relative z-10">
                        {action.shortcut.map((sc) => (
                            <kbd
                                key={sc}
                                className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-1 border border-gray-200 dark:border-gray-700 shadow font-medium rounded-md text-xs flex items-center gap-1"
                            >
                                {sc}
                            </kbd>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
);

// 导出ResultItem组件
export default ResultItem;