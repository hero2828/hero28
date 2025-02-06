/**
 * 定义一个泛型函数类型Listener，它接受一个泛型数组参数T，并返回void。
 */
type Listener<T extends Array<unknown>> = (...args: T) => void

/**
 * 订阅/发布
 */
export class EventEmitter<
  E extends Record<string, Array<unknown>> = Record<never, []>,
> {
  /**
   * 私有属性listenerMap，用于存储每个事件名称对应的监听器集合。
   */
  private listenerMap: { [K in keyof E]?: Set<Listener<E[K]>> } = {}

  /**
   * on方法用于添加事件监听器。它接受事件名称key和监听器函数listener，返回一个函数，用于移除监听器。
   * @param key 事件名称
   * @param listener 监听器函数
   * @returns 一个函数，用于移除监听器
   */
  on<K extends keyof E>(key: K, listener: Listener<E[K]>) {
    return this.addListener(key, listener)
  }

  /**
   * addListener方法用于添加事件监听器。它接受事件名称key和监听器函数listener，将监听器添加到对应的集合中，并返回一个函数，用于移除监听器。
   * @param key 事件名称
   * @param listener 监听器函数
   * @returns 一个函数，用于移除监听器
   */
  addListener<K extends keyof E>(key: K, listener: Listener<E[K]>) {
    const { listenerMap } = this
    // 如果listenerMap中没有当前事件的监听器集合，则创建一个新的集合。
    const listeners = listenerMap[key] ?? (listenerMap[key] = new Set())
    listeners.add(listener)
    // 返回一个函数，用于移除监听器。
    return () => {
      listeners.delete(listener)
    }
  }

  /**
   * once方法用于添加一个只执行一次的事件监听器。它接受事件名称key和监听器函数listener。
   * @param key 事件名称
   * @param listener 监听器函数
   */
  once<K extends keyof E>(key: K, listener: Listener<E[K]>) {
    const remove = this.addListener(key, (...args) => {
      remove()
      listener(...args)
    })
  }

  /**
   * off方法用于移除事件监听器。它接受事件名称key和监听器函数listener。
   * @param key 事件名称
   * @param listener 监听器函数
   */
  off<K extends keyof E>(key: K, listener: Listener<E[K]>) {
    this.removeListener(key, listener)
  }

  /**
   * removeListener方法用于移除事件监听器。它接受事件名称key和监听器函数listener，从对应的集合中移除监听器。
   * @param key 事件名称
   * @param listener 监听器函数
   */
  removeListener<K extends keyof E>(key: K, listener: Listener<E[K]>) {
    const listeners = this.listenerMap[key]
    if (listeners) {
      listeners.delete(listener)
    }
  }

  /**
   * emit方法用于触发事件。它接受事件名称key和事件参数args，调用所有对应的监听器函数。
   * @param key 事件名称
   * @param args 事件参数
   */
  emit<K extends keyof E>(key: K, ...args: E[K]) {
    const listeners: Set<Listener<E[K]>> | undefined = this.listenerMap[key]
    if (listeners) {
      for (const listener of listeners) {
        listener(...args)
      }
    }
  }
}
