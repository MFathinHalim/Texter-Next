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
      state.isFollowing = !state.isFollowing;
    },
  },
});

export const { toggleFollowing } = followingSlice.actions;
export default followingSlice.reducer;
