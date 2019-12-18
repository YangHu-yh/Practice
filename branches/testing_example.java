static int inc(int x){
    ...
}

static boolean oracle_inc(int in, int out){
    return in + 1 = out;
}
// will be the same or similar complexity
// use a weaker check (simpler methods) to check
// such as:
static boolean oracle_inc(int in, int out){
    return in < out;
}

// another example
static sort(int[] x){
    ...
}

@Test void t0() {
    int[] in = {0, -1};
    int[] copy = Array.copyOf(in...);
    sort(in);
    AssertTrue(oracle_sort(copy, in));
}

static void oracle_sort(int[] in, int[] out){
    // size equal
    if (in.length != out.length) return false;
    //ascending order
    for (int i = 0; i < out.length-1; i++){
        if(out[i] > out[i+1]){
            return false;
        }
    }
    // check out is permutation of in
        // loop through int[] in and have a helper function that count the occurance of each element, check that count is the same as the count for that element in out.
        // performance wise is not as sufficient as it maybe, but conceptually simpler so less possible to be buggy
}
