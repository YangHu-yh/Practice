class NumberofIsland {

    boolean[][] visited;

    public int numIslands(char[][] grid) {
        if(grid.length < 1) return 0;
        int len = grid.length;
        int width = grid[0].length;
        visited = new boolean[len][width];
        int numIsland = 0;
        for(int i = 0; i < len; i++){
            for(int j = 0; j < width; j++){
                // System.out.println("start at "+i+" "+j+" "+ Arrays.deepToString(visited));
                if (visited[i][j]){
                    continue;
                }
                if (grid[i][j] == '1'){
                    visited[i][j] = true;
                    markIsland(grid, i, j);
                    // System.out.println("mark at "+i+" "+j+" "+ Arrays.deepToString(visited));
                    numIsland++;
                }else if (grid[i][j] == '0'){
                    visited[i][j] = true;
                }
            }
        }
        return numIsland;
    }
    public void markIsland(char[][] grid, int i, int j){
        if(grid[i][j] == '0') return;
        // if (visited[i][j]){
        //     return;
        // }

        if(i-1 >= 0 && grid[i-1][j] == '1' && !visited[i-1][j]){
            visited[i-1][j] = true;
            markIsland(grid, i-1, j);
        }
        if(j-1 >= 0 && grid[i][j-1] == '1' && !visited[i][j-1]){
            visited[i][j-1] = true;
            markIsland(grid, i, j-1);
        }
        if(i+1 < grid.length && grid[i+1][j] == '1' && !visited[i+1][j]){
            visited[i+1][j] = true;
            markIsland(grid, i+1, j);
        }
        if(j+1 < grid[0].length && grid[i][j+1] == '1' && !visited[i][j+1]){
            visited[i][j+1] = true;
            markIsland(grid, i, j+1);
        }
        return;
    }
}
