import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommentType } from '../../model/CommentPost';

export interface CommentState {
    comments: CommentType[];
}
  
const initialState: CommentState = {
    comments: [],
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
      addComment: (state, action: PayloadAction<CommentType>) => {
        state.comments.push(action.payload);
      },
      addChildComment: (state,action: PayloadAction<{ parentId: number; childComment: CommentType }> ) => {
        const { parentId, childComment } = action.payload;
        const findParent = (comments: CommentType[]): CommentType | undefined => {
          for (const comment of comments) {
            if (comment.id === parentId) {
              if (!comment.children) {
                comment.children = [];
              }
              return comment;
            }
            if (comment.children) {
              const foundChild = findParent(comment.children);
              if (foundChild) {
                return foundChild;
              }
            }
          }
          return undefined;
        };
  
        const parent = findParent(state.comments);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(childComment);
        }
      },
      removeComment: (state, action: PayloadAction<number>) => {
        const removeCommentRecursive = (comments: CommentType[], commentId: number): CommentType[] => {
          return comments.filter((comment) => {
            if (comment.id === commentId) {
              return false; 
            }
            if (comment.children) {
              comment.children = removeCommentRecursive(comment.children, commentId);
            }
            return true; 
          });
        };
  
        state.comments = removeCommentRecursive(state.comments, action.payload);
      },
    },
  });
  
  // Export actions and reducer
  export const { addComment, removeComment, addChildComment } = commentSlice.actions;
  export const CommentReducer = commentSlice.reducer;