import java.util.Map;
import java.util.HashMap;
class LRUCache {

    DLinkedNode head;
    DLinkedNode tail;
    int capacity;
    int size;
    Map<Integer, DLinkedNode> storage;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        size = 0;
        storage = new HashMap<>();
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (storage.containsKey(key)){
            moveToHead(storage.get(key));
            return storage.get(key).val;
        }
        return -1;
    }

    public void put(int key, int value) {
        DLinkedNode newNode = new DLinkedNode(key, value);
        DLinkedNode node = storage.get(key);
        if(node != null){
            node.val = value;
            moveToHead(node);
        } else{
            addNode(newNode);
            storage.put(key, newNode);
            size++;
            if (size > capacity){
                DLinkedNode popped = popTail();
                storage.remove(popped.key);
                size--;
            }

        }

    }


    class DLinkedNode{
        int key;
        int val;
        DLinkedNode next;
        DLinkedNode prev;

        public DLinkedNode(){
        }

        public DLinkedNode(int key_in, int val_in){
            key = key_in;
            val = val_in;
        }
    }

    private void addNode(DLinkedNode node){
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(DLinkedNode node){
        DLinkedNode next = node.next;
        DLinkedNode prev = node.prev;
        next.prev = prev;
        prev.next = next;

    }

    private void moveToHead(DLinkedNode node){
        removeNode(node);
        addNode(node);

    }

    private DLinkedNode popTail(){
        DLinkedNode popped = tail.prev;
        removeNode(popped);
        return popped;
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
