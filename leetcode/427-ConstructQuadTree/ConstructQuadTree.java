// 427. Construct Quad Tree
//
// We want to use quad trees to store an N x N boolean grid. Each cell in the grid can only be true or false. The root node represents the whole grid. For each node, it will be subdivided into four children nodes until the values in the region it represents are all the same.
//
// Each node has another two boolean attributes : isLeaf and val. isLeaf is true if and only if the node is a leaf node. The val attribute for a leaf node contains the value of the region it represents.
//
// The corresponding quad tree should be as following, where each node is represented as a (isLeaf, val) pair.
//
// For the non-leaf nodes, val can be arbitrary, so it is represented as *.
//
// Note:
//
// N is less than 1000 and guaranteened to be a power of 2.
// If you want to know more about the quad tree, you can refer to its wiki.



/*
// Definition for a QuadTree node.
class Node {
    public boolean val;
    public boolean isLeaf;
    public Node topLeft;
    public Node topRight;
    public Node bottomLeft;
    public Node bottomRight;

    public Node() {}

    public Node(boolean _val,boolean _isLeaf,Node _topLeft,Node _topRight,Node _bottomLeft,Node _bottomRight) {
        val = _val;
        isLeaf = _isLeaf;
        topLeft = _topLeft;
        topRight = _topRight;
        bottomLeft = _bottomLeft;
        bottomRight = _bottomRight;
    }
};
*/
class Solution {
    public Node construct(int[][] grid) {
        return build(0, 0, grid.length - 1, grid.length - 1, grid);
    }
    public Node build(int r1, int c1, int r2, int c2, int[][] g){
        if(r1 > r2 || c1 > c2){
            return null;
        }
        int val = g[r1][c1];
        boolean isLeaf = true;
        for(int i = r1; i <= r2; i++){
            for(int j = c1; j <= c2; j++){
                if(g[i][j] != val){
                    isLeaf = false;
                    break;
                }
            }
        }
        if(isLeaf){
            return new Node(val == 1, true, null, null, null, null);
        }
        int rmid = (r1 + r2)/2;
        int cmid = (c1 + c2)/2;
        return new Node(false, false,
                       build(r1, c1, rmid, cmid, g),
                       build(r1, cmid+1, rmid, c2, g),
                       build(rmid+1, c1, r2, cmid, g),
                       build(rmid+1, cmid+1, r2, c2, g));
    }
}

// Reference:
// https://leetcode.com/problems/construct-quad-tree/discuss/151684/Recursive-Java-Solution
