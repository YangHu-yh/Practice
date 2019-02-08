// 141. Linked List Cycle

// Given a linked list, determine if it has a cycle in it.
//
// To represent a cycle in the given linked list, we use an integer pos which represents the position (0-indexed) in the linked list where tail connects to. If pos is -1, then there is no cycle in the linked list.
//
// Follow up:
//
// Can you solve it using O(1) (i.e. constant) memory?


// Definition for singly-linked list.
class ListNode {
     int val;
     ListNode next;
     ListNode(int x) { this.val = x; }
}

class LinkedListCycle {
  public static boolean hasCycle(ListNode head){
        if (head == null || head.next == null){
            return false;
        }
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow != fast){
            if (fast == null || fast.next == null){
                return false;
            }
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }

    public static void main(String[] args){
        int[] MainArray = new int[]{1,2,3,4,5,2};
        ListNode now = new ListNode(MainArray[0]);
        ListNode head = now;
        System.out.print("Input: " + head.val);
        for (int i = 1; i < MainArray.length; i++){
          ListNode Temp = new ListNode(MainArray[i]);
          now.next = Temp;
          now = Temp;
          System.out.print(" -> " + now.val);
        }
        System.out.println(" -> Null");
        System.out.print("Output: ");
        if (hasCycle(head)) {
          System.out.println("There is a cycle in this linked list.");
        }
        System.out.println("There is no cycle in this linked list.");
    }
}
