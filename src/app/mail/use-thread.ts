// 导入jotai中的atom和useAtom函数
import { atom, useAtom } from "jotai"

// 定义一个名为configAtom的atom，初始值为null
const configAtom = atom<string | null>(null)

// 定义一个名为useThread的函数，用于返回configAtom的值
export function useThread() {
  return useAtom(configAtom)
}
