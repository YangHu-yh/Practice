// 206. Reverse Linked List
// Reverse a singly linked list.
//
// Example:
//
// Input: 1->2->3->4->5->NULL
// Output: 5->4->3->2->1->NULL
// Follow up:
//
// A linked list can be reversed either iteratively or recursively. Could you implement both?


// Definition for singly-linked list.
class ListNode {
     int val;
     ListNode next;
     ListNode(int x) { this.val = x; }
}

class ReverseLinkedList{
    public static ListNode reverseList(ListNode head) {
        // Return special case if empty
        if (head == null){
            return null;
        }
        // Set NodeNow to represent the Node we are going to process in the original linked list;
        // Set NodeAfter to represent the Node after we process it.
        ListNode NodeAfter = null;
        ListNode NodeNow = head;
        while (NodeNow != null){
            // store the next Node we need to process in Temp
            ListNode Temp = NodeNow.next;
            // Build the new linked list by reset the pointers' direction
            NodeNow.next = NodeAfter;
            NodeAfter = NodeNow;
            // prepare the Node we will process in the next loop
            NodeNow = Temp;
        }
        return NodeAfter;
    }
    public static void main(String[] args){
        int[] MainArray = new int[]{1,2,3,4,5};
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
        ListNode newNode = reverseList(head);
        for (int i = 0; i < MainArray.length; i++){
          System.out.print(newNode.val);
          if (newNode.next == null){
            System.out.println(" -> Null");
            break;
          }
          System.out.print(" -> ");
          newNode = newNode.next;
        }
    }
}

// Complexity analysis
// Time complexity : O(n)O(n). Assume that nn is the list's length, the time complexity is O(n)O(n).
// Space complexity : O(1)O(1).
