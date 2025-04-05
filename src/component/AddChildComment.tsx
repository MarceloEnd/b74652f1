import React, {useEffect, useState} from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { addChildComment } from "../store/reducer/CommentReducer";
import { CommentType } from "../model/CommentPost";
import { addChildCommentToIndexedDB, createCommentsIndexedDB } from "../hooks/db";


export const AddChildComment: React.FC<CommentType> = (props: CommentType) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [description, setDescription] = useState<string>('');
    
    // used for IndexedDB 
    const [db, setDb] = useState<IDBDatabase | null>(null);
    
    useEffect(() => {
      async function initializeDB() {
        const database = await createCommentsIndexedDB('commentsDB', 'commentsStore');
        setDb(database);
      }
      initializeDB();
    }, []);

    const handleAddComment = async (): Promise<void> => {
      const newComment: CommentType = {
        description,
        id: Date.now()
      };
      const newChild = {
        parentId: id || 0,
        childComment: newComment
      }
      if(db){
        try {
          await addChildCommentToIndexedDB(db, 'commentsStore', id, newComment);
          dispatch(addChildComment(newChild));
      setDescription('');
        }
        catch (error) {
          console.error("Error setting child to IndexedDB:", error);
        }
      }
    };

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        <TextField
          variant="outlined"
          label="Description2"
          data-testid="child-textfield"
          onChange={(event) => {
            const newDescription = event.target.value;
            setDescription(newDescription);
          }}
          value={description}
        />
        <Button variant="contained" data-testid="child-button"  onClick={() => handleAddComment()}>Save</Button>
    </Box>
  );
};

