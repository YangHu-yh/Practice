/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        if (l1 == null) return l2;
        if (l2 == null) return l1;
        ListNode dummyHead = new ListNode(-2);
        ListNode node = dummyHead;
        int carry = 0;
        while(l1 != null || l2 != null){
            int val1 = (l1 != null)? l1.val: 0;
            int val2 = (l2 != null)? l2.val: 0;
            int s = val1 + val2 + carry;
            ListNode next = new ListNode(s%10);
            carry = s/10;
            node.next = next;
            node = node.next;
            if (l1 != null) {
                l1 = l1.next;
            }
            if (l2 != null){
                l2 = l2.next;
            }

        }
        if (carry != 0){
            ListNode next = new ListNode(carry);
            node.next = next;
        }
        return dummyHead.next;
    }
}
