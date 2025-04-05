import React, {useEffect, useState} from "react";
import { FormControl, FormLabel, TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { addComment } from "../store/reducer/CommentReducer";
import { CommentType } from "../model/CommentPost";
import { addCommentToIndexedDB, createCommentsIndexedDB } from "../hooks/db";


export const AddComment = () => {
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
    
    // used for the localstorage
    const dispatch = useDispatch();
    
    const handleAddComment = async (): Promise<void> => {
        const newComment: CommentType = {
          description,
          id: Date.now()
        };
        dispatch(addComment(newComment));
        if (db) {
          await addCommentToIndexedDB(db, 'commentsStore', newComment);
          setDescription('');
        }
    };
    
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <FormControl component="fieldset">
        <FormLabel component="legend">New Comment</FormLabel><br/>
        <TextField
          variant="outlined"
          label="Description"
          multiline
          rows={4}
          onChange={(event) => {
            const newDescription = event.target.value;
            setDescription(newDescription);
          }}
          value={description}
        />
        <br/>
        <Button variant="contained"  onClick={handleAddComment}>Save</Button>
        <br/>

      </FormControl>
    </Box>
  );
};

