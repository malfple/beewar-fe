/**
 * This is a min heap priority queue.
 * It is implemented specifically with dijkstra in mind.
 * It is also a copy from backend, so it has no comments. See the backend code to see explanation.
 */
class PriorityQueue {
  constructor() {
    this.heap = []
    this.size = 0
  }

  /**
   * Returns the top of the heap, in the form of an array of 2 values: [distance, position data].
   * The array is reference type, so please don't edit it lol.
   * @returns {[number, Object]}
   */
  top() {
    if(this.size === 0) {
      return [-1, -1]
    }
    return this.heap[0]
  }

  /**
   * Adds data
   * @param {number} d
   * @param {Object} p
   */
  push(d, p) {
    this.heap.push([d, p])
    this.size++
    let now = this.size-1
    while(now > 0) {
      const parent = Math.floor((now - 1) / 2)
      if(this.heap[now][0] < this.heap[parent][0]) {
        const t = this.heap[now]
        this.heap[now] = this.heap[parent]
        this.heap[parent] = t
      }else{
        break
      }
      now = parent
    }
  }

  /**
   * Pop haha
   */
  pop() {
    if(this.size === 0) {
      return
    }
    this.heap[0] = this.heap[this.size-1]
    this.heap.pop()
    this.size--
    let now = 0
    while(now*2+1 < this.size) {
      let smallChild = now*2+1
      if(smallChild+1 < this.size && this.heap[smallChild+1][0] < this.heap[smallChild][0]) {
        smallChild++
      }
      if(this.heap[smallChild][0] < this.heap[now][0]) {
        const t = this.heap[smallChild]
        this.heap[smallChild] = this.heap[now]
        this.heap[now] = t
      }else{
        break
      }
      now = smallChild
    }
  }

  /**
   * Checks if the priority queue is empty
   * @returns {boolean}
   */
  empty() {
    return this.size === 0
  }
}

export default PriorityQueue
