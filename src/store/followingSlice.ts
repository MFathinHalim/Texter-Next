// store/followingSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface FollowingState {
  isFollowing: boolean;
}

const initialState: FollowingState = {
  isFollowing: false,
};

const followingSlice = createSlice({
  name: 'following',
  initialState,
  reducers: {
    toggleFollowing(state) {
      if(state.isFollowing) state.isFollowing = false;
      else state.isFollowing = true
    },
  },
});

export const { toggleFollowing } = followingSlice.actions;
export default followingSlice.reducer;
